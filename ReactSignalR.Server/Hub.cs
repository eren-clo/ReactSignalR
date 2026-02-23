using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;

public class CommandAction {
    public string Name { get; set; }
    public List<string> Data { get; set; } = new List<string>();
}

public class DeviceInfo {
    public string ConnectionId { get; set; } // SignalR ConnectionId
    public string FullName { get; set; } // given_name + family_name
    public string DeviceType { get; set; } // JWT'den veya QueryString'den gelen cihaz adı
    public List<CommandAction> AvailableCommands { get; set; } = new List<CommandAction>();
}


public class TravellerInfo {
    public string ConnectionId { get; set; }
    public string ConnectionKey { get; set; }
    public string NfcResult { get; set; }

}


namespace ReactSignalR.Server {

    public class MerchantHub : Hub {
        private static readonly Dictionary<string, List<DeviceInfo>> _merchantConnections = new();

        // Eren, bağlantı kurulduğunda cihaz bilgilerini al
        public override async Task OnConnectedAsync() {
            // Eren, normalde JWT Token doğrulaması yapılmalı ama bende key olmadığından gelen token'ı doğrulamadan decode edip okuyorum.
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

            //Eren, cihazı merchantId'ye göre kaydet
            lock (_merchantConnections) {
                if (!_merchantConnections.ContainsKey(selectedMerchantId))
                    _merchantConnections[selectedMerchantId] = new List<DeviceInfo>();

                _merchantConnections[selectedMerchantId].Add(newDevice);
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, selectedMerchantId);
            await SendDeviceList(selectedMerchantId);
            await base.OnConnectedAsync();
        }

        // Eren, bağlantı koptuğunda cihazı listeden çıkar
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

        // Eren, belirli bir merchantId'ye bağlı cihazlara güncellenmiş cihaz listesini gönder
        private async Task SendDeviceList(string merchantId) {
            if (_merchantConnections.TryGetValue(merchantId, out var devices)) {
                await Clients.Group(merchantId).SendAsync("UpdateDeviceList", devices);
            }
        }

        // Eren, belirli bir cihaza komut gönder
        public async Task SendCommandToDevice(string targetConnectionId, string command, string data) {
            Console.WriteLine($"Komut gönderiliyor - Hedef: {targetConnectionId}, Komut: {command}, Veri: {data}");
            await Clients.Client(targetConnectionId).SendAsync("ReceiveCommand", command, data);
        }
    }

    public class TravellerHub : Hub {
        private static readonly Dictionary<string, List<TravellerInfo>> _travellerConnections = new();

        // Eren, bir traveller ConnectionKey ile bağlanır
        public override async Task OnConnectedAsync() {
            var httpContext = Context.GetHttpContext();
            var connectionKey = httpContext.Request.Query["connectionKey"].ToString();

            Console.WriteLine($"═══ OnConnectedAsync başladı ═══");
            Console.WriteLine($"ConnectionId: {Context.ConnectionId}");
            Console.WriteLine($"ConnectionKey: {connectionKey}");
            Console.WriteLine($"User Agent: {httpContext.Request.Headers["User-Agent"]}");

            if (string.IsNullOrWhiteSpace(connectionKey)) {
                Console.WriteLine("❌ Hata: ConnectionKey bulunamadı.");
                Context.Abort();
                return;
            }

            var newTraveller = new TravellerInfo {
                ConnectionId = Context.ConnectionId,
                ConnectionKey = connectionKey,
                NfcResult = ""
            };

            Console.WriteLine($"Traveller bağlandı - ConnId: {newTraveller.ConnectionId}, Key: {connectionKey}");

            // Eren, traveller'ı connectionKey'e göre kaydet
            lock (_travellerConnections) {
                if (!_travellerConnections.ContainsKey(connectionKey))
                    _travellerConnections[connectionKey] = new List<TravellerInfo>();

                _travellerConnections[connectionKey].Add(newTraveller);
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, connectionKey);
            await SendTravellerList(connectionKey);

            Console.WriteLine($"✓ Traveller başarıyla bağlandı");
            Console.WriteLine($"✓ Grup: {connectionKey}");
            Console.WriteLine($"✓ Aktif bağlantı sayısı: {_travellerConnections[connectionKey].Count}");
            Console.WriteLine($"═══ OnConnectedAsync bitti ═══\n");

            await base.OnConnectedAsync();
        }

        // Test metodu 1 - Parametresiz (Swift için en basit)
        public async Task TestConnectionSimple() {
            Console.WriteLine($"\n═══ TestConnectionSimple (parametresiz) çağrıldı ═══");
            Console.WriteLine($"ConnectionId: {Context.ConnectionId}");
            Console.WriteLine($"═══════════════════════════\n");

            await Clients.Caller.SendAsync("TestResponse", "Backend bağlantınızı onayladı!");
        }

        // Test metodu 2 - Parametreli
        public async Task TestConnectionWithMessage(string message) {
            Console.WriteLine($"\n═══ TestConnectionWithMessage (parametreli) çağrıldı ═══");
            Console.WriteLine($"ConnectionId: {Context.ConnectionId}");
            Console.WriteLine($"Message: {message}");
            Console.WriteLine($"═══════════════════════════\n");

            await Clients.Caller.SendAsync("TestResponse", $"Backend mesajınızı aldı: {message}");
        }

        // Test metodu 3 - UpdateNfcResult'ın basit versiyonu
        public async Task SimpleUpdate(string data) {
            Console.WriteLine($"\n═══ SimpleUpdate çağrıldı ═══");
            Console.WriteLine($"ConnectionId: {Context.ConnectionId}");
            Console.WriteLine($"Data: {data}");
            Console.WriteLine($"═══════════════════════════\n");
        }

        // Eren, bağlantı koptuğunda traveller'ı listeden çıkar
        public override async Task OnDisconnectedAsync(Exception? exception) {
            var connectionKey = Context.GetHttpContext().Request.Query["connectionKey"].ToString();

            TravellerInfo disconnectedTraveller = null;
            lock (_travellerConnections) {
                if (_travellerConnections.ContainsKey(connectionKey)) {
                    disconnectedTraveller = _travellerConnections[connectionKey].FirstOrDefault(t => t.ConnectionId == Context.ConnectionId);
                    _travellerConnections[connectionKey].RemoveAll(t => t.ConnectionId == Context.ConnectionId);

                    // Eren, eğer bu connectionKey'de kimse kalmadıysa dictionary'den de temizle
                    if (_travellerConnections[connectionKey].Count == 0) {
                        _travellerConnections.Remove(connectionKey);
                    }
                }
            }

            if (disconnectedTraveller != null) {
                Console.WriteLine($"Traveller bağlantısı koptu - ConnId: {disconnectedTraveller.ConnectionId}, Key: {connectionKey}");
            }

            await SendTravellerList(connectionKey);
            await base.OnDisconnectedAsync(exception);
        }

        // Eren, belirli bir connectionKey'e bağlı traveller'lara güncellenmiş liste gönder
        private async Task SendTravellerList(string connectionKey) {
            if (_travellerConnections.TryGetValue(connectionKey, out var travellers)) {
                await Clients.Group(connectionKey).SendAsync("UpdateTravellerList", travellers);
            }
        }

        // Eren, bir cihaz NFC okuttuğunda bu metot çağrılır ve aynı connectionKey'deki tüm cihazlar güncellenir
        public async Task UpdateNfcResult(string nfcResult) {
            Console.WriteLine($"\n═══ UpdateNfcResult çağrıldı ═══");
            Console.WriteLine($"ConnectionId: {Context.ConnectionId}");
            Console.WriteLine($"NFC Length: {nfcResult?.Length ?? 0}");

            if (string.IsNullOrWhiteSpace(nfcResult)) {
                Console.WriteLine("❌ Hata: NfcResult boş.");
                throw new ArgumentException("NfcResult boş olamaz", nameof(nfcResult));
            }

            // Eren, bu bağlantının connectionKey'ini bul
            string connectionKey = null;
            lock (_travellerConnections) {
                foreach (var kvp in _travellerConnections) {
                    if (kvp.Value.Any(t => t.ConnectionId == Context.ConnectionId)) {
                        connectionKey = kvp.Key;
                        break;
                    }
                }

                if (connectionKey == null) {
                    Console.WriteLine($"❌ HATA: Bu connectionId ({Context.ConnectionId}) hiçbir key'de bulunamadı.");
                    Console.WriteLine($"Mevcut connectionKey'ler: {string.Join(", ", _travellerConnections.Keys)}");
                    throw new InvalidOperationException($"Bu cihaz sistemde kayıtlı değil");
                }

                Console.WriteLine($"✓ ConnectionKey bulundu: {connectionKey}");

                var travellers = _travellerConnections[connectionKey];
                var traveller = travellers.FirstOrDefault(t => t.ConnectionId == Context.ConnectionId);

                if (traveller != null) {
                    traveller.NfcResult = nfcResult;
                    Console.WriteLine($"✓ NFC güncellendi - Key: {connectionKey}");
                    Console.WriteLine($"  NFC Preview: {nfcResult.Substring(0, Math.Min(50, nfcResult.Length))}...");
                }
            }

            // Eren, aynı connectionKey'deki tüm cihazlara güncellenmiş bilgiyi gönder
            await SendTravellerList(connectionKey);
            Console.WriteLine($"✓ Traveller listesi gönderildi");
            Console.WriteLine($"═══════════════════════════\n");
        }

        // Eren, NFC sonucunu temizlemek için
        public async Task ClearNfcResult(string connectionKey) {
            if (string.IsNullOrWhiteSpace(connectionKey)) {
                Console.WriteLine("Hata: ConnectionKey boş.");
                return;
            }

            lock (_travellerConnections) {
                if (_travellerConnections.TryGetValue(connectionKey, out var travellers)) {
                    var traveller = travellers.FirstOrDefault(t => t.ConnectionId == Context.ConnectionId);
                    if (traveller != null) {
                        traveller.NfcResult = "";
                        Console.WriteLine($"NFC temizlendi - ConnId: {Context.ConnectionId}, Key: {connectionKey}");
                    } else {
                        Console.WriteLine($"Hata: Bu connectionId ({Context.ConnectionId}) bu key'de ({connectionKey}) bulunamadı.");
                    }
                } else {
                    Console.WriteLine($"Hata: ConnectionKey ({connectionKey}) bulunamadı.");
                }
            }

            await SendTravellerList(connectionKey);
        }
    }
}
