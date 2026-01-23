using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;

public class CommandAction {
    public string Name { get; set; }
    public List<string> Data { get; set; } = new List<string>();
}

public class DeviceInfo {
    public string ConnectionId { get; set; }
    public string FullName { get; set; } // given_name + family_name
    public string DeviceType { get; set; } // JWT'den veya QueryString'den gelen cihaz adı
    public List<CommandAction> AvailableCommands { get; set; } = new List<CommandAction>();
}

namespace ReactSignalR.Server {

    public class MerchantHub : Hub {
        private static readonly Dictionary<string, List<DeviceInfo>> _merchantConnections = new();

        public override async Task OnConnectedAsync() {
            var httpContext = Context.GetHttpContext();
            var selectedMerchantId = httpContext.Request.Query["merchantId"].ToString();
            string authHeader = httpContext.Request.Headers["Authorization"].ToString();
            string token = "";

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ")) {
                token = authHeader.Substring("Bearer ".Length).Trim();
            } else {
                token = httpContext.Request.Query["access_token"].ToString();
            }
            if (string.IsNullOrWhiteSpace(token)) {
                Console.WriteLine("Hata: Yetkilendirme başlığı (Authorization) bulunamadı.");
                Context.Abort();
                return;
            }

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var firstName = jwtToken.Claims.FirstOrDefault(c => c.Type == "given_name")?.Value ?? "Bilinmeyen";
            var lastName = jwtToken.Claims.FirstOrDefault(c => c.Type == "family_name")?.Value ?? "Cihaz";
            var deviceName = httpContext.Request.Query["deviceName"].FirstOrDefault() ?? "Tanımsız Cihaz";
            var availableCommandsString = httpContext.Request.Query["availableCommands"].FirstOrDefault() ?? "";

            var availableCommands = new List<CommandAction>();
            if (!string.IsNullOrEmpty(availableCommandsString)) {
                try {
                    var options = new JsonSerializerOptions {
                        PropertyNameCaseInsensitive = true
                    };
                    availableCommands = JsonSerializer.Deserialize<List<CommandAction>>(availableCommandsString, options) ?? new List<CommandAction>();
                } catch (Exception ex) {
                    Console.WriteLine($"availableCommands parse hatası: {ex.Message}");
                }
            }

            var newDevice = new DeviceInfo {
                ConnectionId = Context.ConnectionId,
                FullName = $"{firstName} {lastName}",
                DeviceType = deviceName,
                AvailableCommands = availableCommands
            };
            Console.WriteLine($"Bağlanan Cihaz: {newDevice.FullName} - Tür: {newDevice.DeviceType} - ConnId: {newDevice.ConnectionId}");
            lock (_merchantConnections) {
                if (!_merchantConnections.ContainsKey(selectedMerchantId))
                    _merchantConnections[selectedMerchantId] = new List<DeviceInfo>();

                _merchantConnections[selectedMerchantId].Add(newDevice);
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, selectedMerchantId);
            await SendDeviceList(selectedMerchantId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception) {
            var merchantId = Context.GetHttpContext().Request.Query["merchantId"].ToString();

            DeviceInfo disconnectedDevice = null;
            lock (_merchantConnections) {
                if (_merchantConnections.ContainsKey(merchantId)) {
                    disconnectedDevice = _merchantConnections[merchantId].FirstOrDefault(d => d.ConnectionId == Context.ConnectionId);
                    _merchantConnections[merchantId].RemoveAll(d => d.ConnectionId == Context.ConnectionId);
                }
            }

            if (disconnectedDevice != null) {
                Console.WriteLine($"Bağlantı Koptu: {disconnectedDevice.FullName} - Tür: {disconnectedDevice.DeviceType} - ConnId: {disconnectedDevice.ConnectionId}");
            }

            await SendDeviceList(merchantId);
            await base.OnDisconnectedAsync(exception);
        }

        private async Task SendDeviceList(string merchantId) {
            if (_merchantConnections.TryGetValue(merchantId, out var devices)) {
                await Clients.Group(merchantId).SendAsync("UpdateDeviceList", devices);
            }
        }

        public async Task SendCommandToDevice(string targetConnectionId, string command, string data) {
            Console.WriteLine($"Komut gönderiliyor - Hedef: {targetConnectionId}, Komut: {command}, Veri: {data}");
            await Clients.Client(targetConnectionId).SendAsync("ReceiveCommand", command, data);
        }
    }


    public static class UserHandler {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
    }
    public class ImageHub : Hub {
        public override Task OnConnectedAsync() {
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            Console.WriteLine($"ImageHub Yeni bağlantı: {Context.ConnectionId} - Toplam bağlantılar: {UserHandler.ConnectedIds.Count}");
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception) {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            Console.WriteLine($"ImageHub Bağlantı kesildi: {Context.ConnectionId} - Kalan bağlantılar: {UserHandler.ConnectedIds.Count}");
            return base.OnDisconnectedAsync(exception);
        }
    }
    public class PosHub : Hub {
        public override Task OnConnectedAsync() {
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            Console.WriteLine($"PosHub Yeni bağlantı: {Context.ConnectionId} - Toplam bağlantılar: {UserHandler.ConnectedIds.Count}");
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception) {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            Console.WriteLine($"PosHub Bağlantı kesildi: {Context.ConnectionId} - Kalan bağlantılar: {UserHandler.ConnectedIds.Count}");
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendCommand(string command, string data) {
            Console.WriteLine($"Komut alındı: {command} - Veri: {data}");
            await Clients.All.SendAsync("PosCommand", command, data);

        }
    }
}
