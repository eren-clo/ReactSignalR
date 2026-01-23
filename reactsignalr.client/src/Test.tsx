import React, { useEffect, useState } from "react";

import * as signalR from "@microsoft/signalr";

const myMerchantId = "a19e3743-f1b2-4d94-c411-3a1dccb3196c";
const access_token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjkxQkJEMkNFQkVDRkZGRDgzN0ZBNUZDNjgxQjM2ODA0QzlEMjY4RTMiLCJ4NXQiOiJrYnZTenI3UF85ZzMtbF9HZ2JOb0JNblNhT00iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2Rldi1hdXRoLnVuaXJlZnVuZC5jb20vIiwiZXhwIjoxNzY4OTE3NzI3LCJpYXQiOjE3Njg5MTQxMjcsImF1ZCI6WyJBY2NvdW50U2VydmljZSIsIklkZW50aXR5U2VydmljZSIsIkFkbWluaXN0cmF0aW9uU2VydmljZSIsIlNhYXNTZXJ2aWNlIiwiU2V0dGluZ1NlcnZpY2UiLCJUcmF2ZWxsZXJTZXJ2aWNlIiwiTG9jYXRpb25TZXJ2aWNlIiwiQ29udHJhY3RTZXJ2aWNlIiwiQ1JNU2VydmljZSIsIlRhZ1NlcnZpY2UiLCJFeHBvcnRWYWxpZGF0aW9uU2VydmljZSIsIlJlZnVuZFNlcnZpY2UiLCJGaW5hbmNlU2VydmljZSIsIlJlcG9ydFNlcnZpY2UiLCJGaWxlU2VydmljZSJdLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyBlbWFpbCBwcm9maWxlIHBob25lIHJvbGVzIGFkZHJlc3MgQWRtaW5pc3RyYXRpb25TZXJ2aWNlIEFjY291bnRTZXJ2aWNlIElkZW50aXR5U2VydmljZSBTYWFzU2VydmljZSBTZXR0aW5nU2VydmljZSBUcmF2ZWxsZXJTZXJ2aWNlIExvY2F0aW9uU2VydmljZSBDb250cmFjdFNlcnZpY2UgQ1JNU2VydmljZSBUYWdTZXJ2aWNlIFJlZnVuZFNlcnZpY2UgRXhwb3J0VmFsaWRhdGlvblNlcnZpY2UgRmluYW5jZVNlcnZpY2UgUmVwb3J0U2VydmljZSBGaWxlU2VydmljZSIsImp0aSI6ImRkZTliNjUzLTdjMTYtNGYxOC04YjY1LTk0ZTI0ZDA4NTMyNyIsInN1YiI6IjAyZTg0ODY4LWM4MzEtMjA4Yi0wNGQyLTNhMWMyNWE2ZjJjZCIsInRlbmFudGlkIjoiZGY2NDE1MmItOWY3Ni1lMDZiLWQ0M2YtM2ExYmQ5NjQ0ZWE5Iiwic2Vzc2lvbl9pZCI6ImIxOGJmOGVlLTIwOTktNGIyNy1iMWRlLTAxNjNlOTJhMWNlNiIsInVuaXF1ZV9uYW1lIjoiaGlrbWV0eWlsbWF6IiwiTWVyY2hhbnRJZCI6WyI1NTk4ZTY4ZS0zOWM2LTE5MTItOTQ3ZC0zYTFiZGU2ZTBjYjQiLCJjYzJmNWFkMS0xM2QyLTZhYTctNGRjNi0zYTFjNDYwNzE4NDUiLCJlM2I3ZTlkOC1hOTEzLTlkMjMtOWIwMy0zYTFjNGYxM2NkZWMiLCJhMTllMzc0My1mMWIyLTRkOTQtYzQxMS0zYTFkY2NiMzE5NmMiXSwiUGFydHlMZXZlbCI6IkhFQURRVUFSVEVSIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiaGlrbWV0eWlsbWF6IiwiZ2l2ZW5fbmFtZSI6Ikhpa21ldCIsImZhbWlseV9uYW1lIjoiWcSxbG1heiIsInJvbGUiOiJNZXJjaGFudCBBZG1pbiIsImVtYWlsIjoiaGlrbWV0eWlsbWF6QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJGYWxzZSIsIm9pX3Byc3QiOiJBbmd1bGFyIiwib2lfYXVfaWQiOiI5NzQwMjY5OC04ZDllLTEwNGQtOGY3Yi0zYTFlZWRhYzYzOGYiLCJjbGllbnRfaWQiOiJBbmd1bGFyIiwib2lfdGtuX2lkIjoiMTcxZGE3YjktYzY4ZC02ZDA4LTAxNjItM2ExZWVkYWM2Mzk3In0.PBmWdVT_-Arj9Pv8CiaPxtP85q1McrY8DJzYEZ493cjVa-V7plQmDaiqbcBswWD-kXRToLy3mV8QgEVIN2GnpipeSLVGgEal5nCOXkq4XqUbS_DR8pY6DhaAzLtieZXRwNpchJIvTRnqJmAWtt0kYgNIq46Hkd4ubVX0Xt8gwgSQzOSm9qql5xl0Zto06mW_BxbL3m0NmEvuBiaJ-ZnmR6LE1ycsT8eTsKq_-peEt1EEp-KS0lrWEcJewhFKhN5_KRqy8rT15Zd_rXMqwJ91x_w43WZ2utz7VckzaMMnudOz3LsSYT5pOnWrsEAWu_iuhl7QOFr7iFDmBdV1_wQMhw";

interface CommandAction {
  name: string;
  data: string[];
}

interface Device {
  fullName: string;
  deviceType: string;
  connectionId: string;
  availableCommands: CommandAction[];
}

function Test() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Modal state
  const [showCommandPanel, setShowCommandPanel] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<CommandAction | null>(
    null,
  );
  const [commandInputs, setCommandInputs] = useState<Record<string, string>>(
    {},
  );
  const [isExecuting, setIsExecuting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const availableCommands: CommandAction[] = [];

  useEffect(() => {
    const commandsJson = encodeURIComponent(JSON.stringify(availableCommands));
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `/merchantHub?merchantId=${myMerchantId}&deviceName=Browser-Device&availableCommands=${commandsJson}`,
        {
          accessTokenFactory: () => access_token,
        },
      )
      .withAutomaticReconnect()
      .build();

    const handleUpdateDeviceList = (deviceList: Device[]) => {
      console.log("Cihaz listesi güncellendi:", deviceList);
      setDevices(deviceList);
    };

    const handleReconnecting = () => {
      console.log("Yeniden bağlanılıyor...");
      setIsConnected(false);
    };

    const handleReconnected = () => {
      console.log("Yeniden bağlandı");
      setIsConnected(true);
    };

    const handleClose = () => {
      console.log("Bağlantı kapandı");
      setIsConnected(false);
    };

    const handleReceiveCommand = (command: string, data: string) => {
      console.log(`Komut alındı: ${command}, Veri: ${data}`);
      showToast(`Komut alındı: ${command}`, "success");
    };

    async function start() {
      try {
        await newConnection.start();
        setIsConnected(true);
        setConnection(newConnection);
        console.log("SignalR bağlantısı kuruldu");
      } catch (err) {
        console.error("Bağlantı hatası:", err);
        setIsConnected(false);
      }
    }

    newConnection.on("UpdateDeviceList", handleUpdateDeviceList);
    newConnection.on("ReceiveCommand", handleReceiveCommand);
    newConnection.onreconnecting(handleReconnecting);
    newConnection.onreconnected(handleReconnected);
    newConnection.onclose(handleClose);

    start();

    return () => {
      newConnection.off("UpdateDeviceList", handleUpdateDeviceList);
      newConnection.off("ReceiveCommand", handleReceiveCommand);

      newConnection.stop().catch((err) => console.error("Stop hatası:", err));
    };
  }, []);

  const getDeviceIcon = (deviceType: string) => {
    const type = deviceType.toLowerCase();
    if (type.includes("browser")) return "💻";
    if (type.includes("mobile") || type.includes("phone")) return "📱";
    if (type.includes("tablet")) return "📲";
    if (type.includes("desktop")) return "🖥️";
    return "🔌";
  };

  const sendCommandToDevice = async (
    targetConnectionId: string,
    command: CommandAction,
  ) => {
    if (!connection) {
      showToast("Bağlantı kurulmamış", "error");
      return;
    }

    // Eğer komutun parametresi varsa panel aç
    if (command.data && command.data.length > 0) {
      setCurrentCommand(command);
      setCommandInputs({});
      setShowCommandPanel(true);
      return;
    }

    // Parametresiz komut - direkt gönder
    await executeCommand(targetConnectionId, command.name, "");
  };

  const executeCommand = async (
    targetConnectionId: string,
    commandName: string,
    commandData: string,
  ) => {
    setIsExecuting(true);
    try {
      await connection!.invoke(
        "SendCommandToDevice",
        targetConnectionId,
        commandName,
        commandData,
      );
      showToast(`"${commandName}" komutu başarıyla gönderildi`, "success");
      setShowCommandPanel(false);
      setCurrentCommand(null);
      console.log(`Komut gönderildi: ${commandName} -> ${targetConnectionId}`);
    } catch (err) {
      console.error("Komut gönderme hatası:", err);
      showToast("Komut gönderilemedi!", "error");
    } finally {
      setIsExecuting(false);
    }
  };

  const handlePanelSubmit = () => {
    if (!selectedDevice || !currentCommand) return;

    // Tüm parametreler dolu mu kontrol et
    const missingParams = currentCommand.data.filter(
      (param) => !commandInputs[param]?.trim(),
    );
    if (missingParams.length > 0) {
      showToast(`Lütfen tüm parametreleri doldurun`, "error");
      return;
    }

    const commandData = JSON.stringify(commandInputs);
    executeCommand(
      selectedDevice.connectionId,
      currentCommand.name,
      commandData,
    );
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtreleme ve arama
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || device.deviceType === filterType;
    return matchesSearch && matchesFilter;
  });

  const deviceTypes = Array.from(new Set(devices.map((d) => d.deviceType)));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: "1 1 auto",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
            }}
          >
            Cihaz Yönetimi
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              background: isConnected ? "#dcfce7" : "#fee2e2",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "500",
              color: isConnected ? "#166534" : "#991b1b",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: isConnected ? "#16a34a" : "#dc2626",
              }}
            />
            {isConnected ? "Bağlı" : "Kesik"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              padding: "6px 12px",
              background: "#f1f5f9",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            {filteredDevices.length} / {devices.length}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Left Panel - Device List */}
        <div
          style={{
            width: selectedDevice ? "400px" : "100%",
            borderRight: selectedDevice ? "1px solid #e2e8f0" : "none",
            display: selectedDevice ? "none" : "flex",
            flexDirection: "column",
            background: "white",
            transition: "width 0.3s ease",
          }}
          className="device-list-panel"
        >
          {/* Search and Filter Bar */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e2e8f0",
              background: "#fafafa",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Cihaz ara... (isim, tip)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setFilterType("all")}
                style={{
                  padding: "6px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: filterType === "all" ? "#667eea" : "white",
                  color: filterType === "all" ? "white" : "#64748b",
                  transition: "all 0.2s",
                }}
              >
                Tümü ({devices.length})
              </button>
              {deviceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: "6px 14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    background: filterType === type ? "#667eea" : "white",
                    color: filterType === type ? "white" : "#64748b",
                    transition: "all 0.2s",
                  }}
                >
                  {type} ({devices.filter((d) => d.deviceType === type).length})
                </button>
              ))}
            </div>
          </div>

          {/* Device List */}
          <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
            {filteredDevices.length === 0 ? (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                <div style={{ fontSize: "15px", fontWeight: "500" }}>
                  {devices.length === 0
                    ? "Bağlı cihaz yok"
                    : "Cihaz bulunamadı"}
                </div>
              </div>
            ) : (
              filteredDevices.map((device) => (
                <div
                  key={device.connectionId}
                  onClick={() => setSelectedDevice(device)}
                  style={{
                    padding: "14px",
                    margin: "4px 0",
                    borderRadius: "10px",
                    cursor: "pointer",
                    background:
                      selectedDevice?.connectionId === device.connectionId
                        ? "#f0f4ff"
                        : "transparent",
                    border:
                      selectedDevice?.connectionId === device.connectionId
                        ? "2px solid #667eea"
                        : "2px solid transparent",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedDevice?.connectionId !== device.connectionId) {
                      e.currentTarget.style.background = "#f8fafc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDevice?.connectionId !== device.connectionId) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div style={{ fontSize: "32px" }}>
                      {getDeviceIcon(device.deviceType)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#1e293b",
                          marginBottom: "4px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {device.fullName}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            padding: "2px 8px",
                            background: "#e0e7ff",
                            color: "#4338ca",
                            borderRadius: "4px",
                            fontWeight: "500",
                          }}
                        >
                          {device.deviceType}
                        </span>
                        {device.availableCommands &&
                          device.availableCommands.length > 0 && (
                            <span
                              style={{ fontSize: "12px", color: "#64748b" }}
                            >
                              {device.availableCommands.length} komut
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Device Details */}
        {selectedDevice && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#fafafa",
              overflow: "auto",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
            className="device-detail-panel"
          >
            {/* Device Header */}
            <div
              style={{
                padding: "16px",
                background: "white",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div style={{ fontSize: "40px", flexShrink: 0 }}>
                    {getDeviceIcon(selectedDevice.deviceType)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#1e293b",
                        wordBreak: "break-word",
                      }}
                    >
                      {selectedDevice.fullName}
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          padding: "3px 10px",
                          background: "#e0e7ff",
                          color: "#4338ca",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          display: "inline-block",
                          width: "fit-content",
                        }}
                      >
                        {selectedDevice.deviceType}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          wordBreak: "break-all",
                        }}
                      >
                        {selectedDevice.connectionId.slice(0, 12)}...
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDevice(null)}
                  style={{
                    padding: "8px",
                    border: "none",
                    background: "#f1f5f9",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#64748b",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e2e8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Commands Section */}
            <div style={{ padding: "16px" }}>
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                Kullanılabilir Komutlar
              </h3>

              {selectedDevice.availableCommands &&
              selectedDevice.availableCommands.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {selectedDevice.availableCommands.map((command, index) => (
                    <div
                      key={`${command.name}-${index}`}
                      style={{
                        padding: "14px",
                        background: "white",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0, 0, 0, 0.08)";
                        e.currentTarget.style.borderColor = "#cbd5e1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1e293b",
                              marginBottom: "4px",
                            }}
                          >
                            {command.name}
                          </div>
                          {command.data && command.data.length > 0 && (
                            <div style={{ fontSize: "12px", color: "#64748b" }}>
                              Parametreler: {command.data.join(", ")}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            sendCommandToDevice(
                              selectedDevice.connectionId,
                              command,
                            )
                          }
                          style={{
                            padding: "10px 16px",
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#059669";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#10b981";
                          }}
                        >
                          Çalıştır →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    background: "white",
                    borderRadius: "10px",
                    color: "#94a3b8",
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                    ⚡
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    Bu cihaz için komut tanımlı değil
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Command Input Panel */}
        {showCommandPanel && currentCommand && selectedDevice && (
          <div
            style={{
              width: "350px",
              borderLeft: "1px solid #e2e8f0",
              background: "white",
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 20,
              boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.1)",
            }}
            className="command-input-panel"
          >
            {/* Panel Header */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e2e8f0",
                background: "#fafafa",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1e293b",
                  }}
                >
                  {currentCommand.name}
                </h3>
                <button
                  onClick={() => {
                    if (!isExecuting) {
                      setShowCommandPanel(false);
                      setCurrentCommand(null);
                    }
                  }}
                  disabled={isExecuting}
                  style={{
                    padding: "4px",
                    border: "none",
                    background: "transparent",
                    cursor: isExecuting ? "not-allowed" : "pointer",
                    fontSize: "18px",
                    color: "#64748b",
                    opacity: isExecuting ? 0.5 : 1,
                  }}
                >
                  ✕
                </button>
              </div>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                {selectedDevice?.fullName} - {selectedDevice?.deviceType}
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                Parametreleri doldurup komutu çalıştırın
              </p>
            </div>

            {/* Panel Content */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {currentCommand.data.map((param) => (
                  <div key={param}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#475569",
                      }}
                    >
                      {param}
                    </label>
                    <input
                      type="text"
                      value={commandInputs[param] || ""}
                      onChange={(e) =>
                        setCommandInputs({
                          ...commandInputs,
                          [param]: e.target.value,
                        })
                      }
                      placeholder={`${param} girin`}
                      disabled={isExecuting}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.2s",
                        opacity: isExecuting ? 0.6 : 1,
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#667eea")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#e2e8f0")
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Footer */}
            <div
              style={{
                padding: "16px",
                borderTop: "1px solid #e2e8f0",
                background: "#fafafa",
              }}
            >
              <button
                onClick={handlePanelSubmit}
                disabled={isExecuting}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  background: isExecuting ? "#94a3b8" : "#10b981",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "white",
                  cursor: isExecuting ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!isExecuting) {
                    e.currentTarget.style.background = "#059669";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExecuting) {
                    e.currentTarget.style.background = "#10b981";
                  }
                }}
              >
                {isExecuting ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "14px",
                        height: "14px",
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    ></span>
                    Gönderiliyor...
                  </>
                ) : (
                  "Komutu Çalıştır"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            padding: "16px 24px",
            background: toast.type === "success" ? "#10b981" : "#ef4444",
            color: "white",
            borderRadius: "10px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            fontSize: "14px",
            fontWeight: "500",
            zIndex: 2000,
            animation: "slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "400px",
          }}
        >
          <span style={{ fontSize: "20px" }}>
            {toast.type === "success" ? "✓" : "✕"}
          </span>
          {toast.message}
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          
          /* Responsive Design */
          @media (min-width: 769px) {
            .device-list-panel {
              display: flex !important;
              position: relative !important;
            }
            
            .device-detail-panel {
              position: relative !important;
              left: auto !important;
            }
            
            .command-input-panel {
              position: relative !important;
              width: 350px !important;
              right: 0 !important;
            }
          }
          
          @media (max-width: 768px) {
            .device-list-panel {
              width: 100% !important;
            }
            
            .command-input-panel {
              width: 100% !important;
              left: 0 !important;
              right: 0 !important;
            }
          }

          
          input::-webkit-search-cancel-button {
            -webkit-appearance: none;
          }
          
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
}

export default Test;
