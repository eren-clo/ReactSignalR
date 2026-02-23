import { useEffect, useState } from "react";
import "./App.css";

import * as signalR from "@microsoft/signalr";
import type { CommandAction, Device, TravellerInfo } from "./_components/types";

const myMerchantId = "a19e3743-f1b2-4d94-c411-3a1dccb3196c";
const access_token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjkxQkJEMkNFQkVDRkZGRDgzN0ZBNUZDNjgxQjM2ODA0QzlEMjY4RTMiLCJ4NXQiOiJrYnZTenI3UF85ZzMtbF9HZ2JOb0JNblNhT00iLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL2Rldi1hdXRoLnVuaXJlZnVuZC5jb20vIiwiZXhwIjoxNzY4OTE3NzI3LCJpYXQiOjE3Njg5MTQxMjcsImF1ZCI6WyJBY2NvdW50U2VydmljZSIsIklkZW50aXR5U2VydmljZSIsIkFkbWluaXN0cmF0aW9uU2VydmljZSIsIlNhYXNTZXJ2aWNlIiwiU2V0dGluZ1NlcnZpY2UiLCJUcmF2ZWxsZXJTZXJ2aWNlIiwiTG9jYXRpb25TZXJ2aWNlIiwiQ29udHJhY3RTZXJ2aWNlIiwiQ1JNU2VydmljZSIsIlRhZ1NlcnZpY2UiLCJFeHBvcnRWYWxpZGF0aW9uU2VydmljZSIsIlJlZnVuZFNlcnZpY2UiLCJGaW5hbmNlU2VydmljZSIsIlJlcG9ydFNlcnZpY2UiLCJGaWxlU2VydmljZSJdLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyBlbWFpbCBwcm9maWxlIHBob25lIHJvbGVzIGFkZHJlc3MgQWRtaW5pc3RyYXRpb25TZXJ2aWNlIEFjY291bnRTZXJ2aWNlIElkZW50aXR5U2VydmljZSBTYWFzU2VydmljZSBTZXR0aW5nU2VydmljZSBUcmF2ZWxsZXJTZXJ2aWNlIExvY2F0aW9uU2VydmljZSBDb250cmFjdFNlcnZpY2UgQ1JNU2VydmljZSBUYWdTZXJ2aWNlIFJlZnVuZFNlcnZpY2UgRXhwb3J0VmFsaWRhdGlvblNlcnZpY2UgRmluYW5jZVNlcnZpY2UgUmVwb3J0U2VydmljZSBGaWxlU2VydmljZSIsImp0aSI6ImRkZTliNjUzLTdjMTYtNGYxOC04YjY1LTk0ZTI0ZDA4NTMyNyIsInN1YiI6IjAyZTg0ODY4LWM4MzEtMjA4Yi0wNGQyLTNhMWMyNWE2ZjJjZCIsInRlbmFudGlkIjoiZGY2NDE1MmItOWY3Ni1lMDZiLWQ0M2YtM2ExYmQ5NjQ0ZWE5Iiwic2Vzc2lvbl9pZCI6ImIxOGJmOGVlLTIwOTktNGIyNy1iMWRlLTAxNjNlOTJhMWNlNiIsInVuaXF1ZV9uYW1lIjoiaGlrbWV0eWlsbWF6IiwiTWVyY2hhbnRJZCI6WyI1NTk4ZTY4ZS0zOWM2LTE5MTItOTQ3ZC0zYTFiZGU2ZTBjYjQiLCJjYzJmNWFkMS0xM2QyLTZhYTctNGRjNi0zYTFjNDYwNzE4NDUiLCJlM2I3ZTlkOC1hOTEzLTlkMjMtOWIwMy0zYTFjNGYxM2NkZWMiLCJhMTllMzc0My1mMWIyLTRkOTQtYzQxMS0zYTFkY2NiMzE5NmMiXSwiUGFydHlMZXZlbCI6IkhFQURRVUFSVEVSIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiaGlrbWV0eWlsbWF6IiwiZ2l2ZW5fbmFtZSI6Ikhpa21ldCIsImZhbWlseV9uYW1lIjoiWcSxbG1heiIsInJvbGUiOiJNZXJjaGFudCBBZG1pbiIsImVtYWlsIjoiaGlrbWV0eWlsbWF6QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoiRmFsc2UiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJGYWxzZSIsIm9pX3Byc3QiOiJBbmd1bGFyIiwib2lfYXVfaWQiOiI5NzQwMjY5OC04ZDllLTEwNGQtOGY3Yi0zYTFlZWRhYzYzOGYiLCJjbGllbnRfaWQiOiJBbmd1bGFyIiwib2lfdGtuX2lkIjoiMTcxZGE3YjktYzY4ZC02ZDA4LTAxNjItM2ExZWVkYWM2Mzk3In0.PBmWdVT_-Arj9Pv8CiaPxtP85q1McrY8DJzYEZ493cjVa-V7plQmDaiqbcBswWD-kXRToLy3mV8QgEVIN2GnpipeSLVGgEal5nCOXkq4XqUbS_DR8pY6DhaAzLtieZXRwNpchJIvTRnqJmAWtt0kYgNIq46Hkd4ubVX0Xt8gwgSQzOSm9qql5xl0Zto06mW_BxbL3m0NmEvuBiaJ-ZnmR6LE1ycsT8eTsKq_-peEt1EEp-KS0lrWEcJewhFKhN5_KRqy8rT15Zd_rXMqwJ91x_w43WZ2utz7VckzaMMnudOz3LsSYT5pOnWrsEAWu_iuhl7QOFr7iFDmBdV1_wQMhw";

type ConnectionMode = "merchant" | "traveller" | null;

function App() {
  // Mode selection
  const [mode, setMode] = useState<ConnectionMode>(null);
  const [connectionKey, setConnectionKey] = useState("");

  // Merchant states
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCommandPanel, setShowCommandPanel] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<CommandAction | null>(
    null,
  );
  const [commandInputs, setCommandInputs] = useState<Record<string, string>>(
    {},
  );
  const [isExecuting, setIsExecuting] = useState(false);

  // Traveller states
  const [travellers, setTravellers] = useState<TravellerInfo[]>([]);
  const [nfcInput, setNfcInput] = useState("");

  // Common states
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const availableCommands: CommandAction[] = [];

  useEffect(() => {
    let isMounted = true;

    const initializeConnection = async () => {
      if (mode === "merchant" && isMounted) {
        await connectMerchant();
      } else if (mode === "traveller" && connectionKey && isMounted) {
        await connectTraveller();
      }
    };

    initializeConnection();

    return () => {
      isMounted = false;
      if (connection) {
        connection.stop().catch((err) => console.error("Stop hatası:", err));
      }
    };
  }, [mode, connectionKey]);

  const connectMerchant = async () => {
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

    newConnection.on("UpdateDeviceList", (deviceList: Device[]) => {
      console.log("Cihaz listesi güncellendi:", deviceList);
      setDevices(deviceList);
    });

    newConnection.on("ReceiveCommand", (command: string, data: string) => {
      console.log(`Komut alındı: ${command}, Veri: ${data}`);
      showToast(`Komut alındı: ${command}`, "success");
    });

    newConnection.onreconnecting(() => {
      console.log("Yeniden bağlanılıyor...");
      setIsConnected(false);
    });

    newConnection.onreconnected(() => {
      console.log("Yeniden bağlandı");
      setIsConnected(true);
    });

    newConnection.onclose(() => {
      console.log("Bağlantı kapandı");
      setIsConnected(false);
    });

    try {
      await newConnection.start();
      setIsConnected(true);
      setConnection(newConnection);
      console.log("SignalR Merchant bağlantısı kuruldu");
    } catch (err) {
      console.error("Bağlantı hatası:", err);
      setIsConnected(false);
      showToast("Bağlantı hatası!", "error");
    }
  };

  const connectTraveller = async () => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`/travellerHub?connectionKey=${connectionKey}`)
      .withAutomaticReconnect()
      .build();

    newConnection.on(
      "UpdateTravellerList",
      (travellerList: TravellerInfo[]) => {
        console.log("Traveller listesi güncellendi:", travellerList);
        setTravellers(travellerList);
      },
    );

    newConnection.onreconnecting(() => {
      console.log("Yeniden bağlanılıyor...");
      setIsConnected(false);
    });

    newConnection.onreconnected(() => {
      console.log("Yeniden bağlandı");
      setIsConnected(true);
    });

    newConnection.onclose(() => {
      console.log("Bağlantı kapandı");
      setIsConnected(false);
    });

    try {
      await newConnection.start();
      setIsConnected(true);
      setConnection(newConnection);
      console.log("SignalR Traveller bağlantısı kuruldu");
      showToast("Traveller bağlantısı başarılı!", "success");
    } catch (err) {
      console.error("Bağlantı hatası:", err);
      setIsConnected(false);
      showToast("Bağlantı hatası!", "error");
    }
  };

  const updateNfcResult = async () => {
    if (!connection || !nfcInput.trim()) {
      showToast("NFC verisi boş olamaz", "error");
      return;
    }

    try {
      await connection.invoke("UpdateNfcResult", nfcInput);
      showToast("NFC güncellendi", "success");
      setNfcInput("");
    } catch (err) {
      console.error("NFC güncelleme hatası:", err);
      showToast("NFC güncellenemedi!", "error");
    }
  };

  const clearNfcResult = async () => {
    if (!connection) {
      showToast("Bağlantı yok", "error");
      return;
    }

    try {
      await connection.invoke("ClearNfcResult", connectionKey);
      showToast("NFC temizlendi", "success");
    } catch (err) {
      console.error("NFC temizleme hatası:", err);
      showToast("NFC temizlenemedi!", "error");
    }
  };

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

    if (command.data && command.data.length > 0) {
      setCurrentCommand(command);
      setCommandInputs({});
      setShowCommandPanel(true);
      return;
    }

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

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || device.deviceType === filterType;
    return matchesSearch && matchesFilter;
  });

  const deviceTypes = Array.from(new Set(devices.map((d) => d.deviceType)));

  const resetConnection = async () => {
    if (connection) {
      await connection
        .stop()
        .catch((err) => console.error("Stop hatası:", err));
    }
    setConnection(null);
    setIsConnected(false);
    setMode(null);
    setConnectionKey("");
    setDevices([]);
    setTravellers([]);
    setSelectedDevice(null);
  };

  // Mode Selection Screen
  if (mode === null) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            padding: "48px",
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h1
            style={{
              margin: "0 0 12px 0",
              fontSize: "32px",
              fontWeight: "700",
              color: "#1e293b",
              textAlign: "center",
            }}
          >
            SignalR Connection
          </h1>
          <p
            style={{
              margin: "0 0 40px 0",
              fontSize: "16px",
              color: "#64748b",
              textAlign: "center",
            }}
          >
            Select connection type
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <button
              onClick={() => setMode("merchant")}
              style={{
                padding: "24px",
                border: "2px solid #e2e8f0",
                borderRadius: "16px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
                background: "white",
                color: "#1e293b",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#667eea";
                e.currentTarget.style.background = "#f0f4ff";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(102, 126, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "white";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "12px",
                  background: "#667eea",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                }}
              >
                🏪
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "4px",
                  }}
                >
                  Merchant Connection
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: "400",
                  }}
                >
                  Manage devices and send commands
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setConnectionKey("UNIQUE_KEY");
                setMode("traveller");
              }}
              style={{
                padding: "24px",
                border: "2px solid #e2e8f0",
                borderRadius: "16px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
                background: "white",
                color: "#1e293b",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#10b981";
                e.currentTarget.style.background = "#f0fdf4";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(16, 185, 129, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "white";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "12px",
                  background: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                }}
              >
                🧳
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "4px",
                  }}
                >
                  Traveller Connection
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: "400",
                  }}
                >
                  Share NFC results
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Traveller Mode
  if (mode === "traveller") {
    // Connection key'deki HERHANGI BIR cihazın NFC verisi var mı kontrol et
    const travellerWithNfc = travellers.find(
      (t) => t.nfcResult && t.nfcResult.length > 0,
    );
    const hasNfcData = !!travellerWithNfc;

    // Debug için
    console.log("Current travellers:", travellers);
    console.log("My connection ID:", connection?.connectionId);
    console.log("Traveller with NFC:", travellerWithNfc);
    console.log("Has NFC data:", hasNfcData);

    // camelCase'i Title Case'e çevir (documentType -> Document Type)
    const formatFieldName = (str: string): string => {
      return str
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
    };

    // Tarih formatını düzelt (321224 -> 24.12.2032)
    const formatDate = (dateStr: string): string => {
      if (dateStr.length === 6 && /^\d{6}$/.test(dateStr)) {
        const year = dateStr.substring(0, 2);
        const month = dateStr.substring(2, 4);
        const day = dateStr.substring(4, 6);

        // Yüzyılı belirle (00-50 arası 2000'ler, 51-99 arası 1900'ler)
        const fullYear = parseInt(year) <= 50 ? `20${year}` : `19${year}`;

        // Month names
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const monthName = monthNames[parseInt(month) - 1];
        return `${parseInt(day)} ${monthName} ${fullYear}`;
      }
      return dateStr;
    };

    // Document Type formatla (I -> Identity Card, P -> Passport)
    const formatDocumentType = (type: string): string => {
      const typeMap: Record<string, string> = {
        I: "Identity Card",
        P: "Passport",
        ID: "Identity Card",
      };
      return typeMap[type.toUpperCase()] || type;
    };

    // NFC verisini parse et ve formatla
    const parseNfcData = (nfcResult: string) => {
      try {
        const data = JSON.parse(nfcResult);
        return Object.entries(data).map(([key, value]) => {
          let formattedValue = String(value);

          // Document Type formatla
          const lowerKey = key.toLowerCase();
          if (lowerKey === "documenttype" || lowerKey === "doctype") {
            formattedValue = formatDocumentType(String(value));
          }
          // Tarih alanlarını formatla
          else if (
            (lowerKey.includes("date") ||
              lowerKey.includes("birth") ||
              lowerKey.includes("expiry")) &&
            typeof value === "string"
          ) {
            formattedValue = formatDate(value);
          }

          return {
            label: formatFieldName(key),
            value: formattedValue,
          };
        });
      } catch {
        // JSON değilse, düz metin olarak göster
        return null;
      }
    };

    const parsedNfcData = travellerWithNfc?.nfcResult
      ? parseNfcData(travellerWithNfc.nfcResult)
      : null;

    return (
      <div
        style={{
          height: "100vh",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Minimal Header */}
        <div
          style={{
            background: "white",
            borderBottom: "1px solid #e2e8f0",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={resetConnection}
            style={{
              padding: "8px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              background: "white",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              color: "#64748b",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8fafc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
            }}
          >
            ← Back
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "#f1f5f9",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: isConnected ? "#10b981" : "#ef4444",
                animation: isConnected
                  ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                  : "none",
              }}
            />
            {connectionKey}
          </div>
        </div>

        {/* Main Content - Centered */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {!hasNfcData ? (
              // Bekleme Durumu
              <div style={{ animation: "fadeIn 0.5s ease" }}>
                {/* Animated NFC Icon */}
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    margin: "0 auto 20px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "#f0f9ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {/* Pulse rings */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        border: "3px solid #3b82f6",
                        opacity: 0.3,
                        animation:
                          "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        border: "3px solid #3b82f6",
                        opacity: 0.3,
                        animation:
                          "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 1s",
                      }}
                    />

                    {/* NFC Icon */}
                    <div style={{ fontSize: "48px", zIndex: 1 }}>📡</div>
                  </div>
                </div>

                <h1
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  Waiting for NFC Data
                </h1>

                <p
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "14px",
                    color: "#64748b",
                    lineHeight: "1.5",
                  }}
                >
                  Please scan your NFC card from another device.
                  <br />
                  Data will be displayed here automatically.
                </p>

                {/* QR Code */}
                <div
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      background: "white",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      display: "inline-block",
                    }}
                  >
                    <img
                      src="/qr.png"
                      alt="QR Code"
                      style={{
                        width: "120px",
                        height: "120px",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        color: "#64748b",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      Scan with your mobile device
                    </div>
                  </div>
                </div>

                {/* Waiting Indicator */}
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#3b82f6",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "0s",
                    }}
                  />
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#3b82f6",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "0.16s",
                    }}
                  />
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#3b82f6",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "0.32s",
                    }}
                  />
                </div>
              </div>
            ) : (
              // Veri Alındı Durumu
              <div style={{ animation: "scaleIn 0.5s ease" }}>
                {/* Success Icon */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    margin: "0 auto 4px",
                    borderRadius: "50%",
                    background: "#f0fdf4",
                    border: "2px solid #10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    animation: "successPulse 0.6s ease",
                  }}
                >
                  ✓
                </div>

                <h1
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#10b981",
                  }}
                >
                  Data Received!
                </h1>

                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  NFC data received successfully
                </p>

                {/* NFC Data Display */}
                <div
                  style={{
                    padding: "20px",
                    background: "#f8fafc",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    maxWidth: "100%",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#64748b",
                      marginBottom: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    NFC Data
                  </div>

                  {parsedNfcData ? (
                    // JSON formatında göster
                    <div
                      style={{
                        padding: "20px",
                        background: "white",
                        border: "2px solid #10b981",
                        borderRadius: "12px",
                      }}
                    >
                      {parsedNfcData.map((field, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            padding: "8px 0",
                            borderBottom:
                              index < parsedNfcData.length - 1
                                ? "1px solid #e2e8f0"
                                : "none",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              flex: "0 0 40%",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#64748b",
                              textAlign: "right",
                            }}
                          >
                            {field.label}:
                          </div>
                          <div
                            style={{
                              flex: "1",
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1e293b",
                              wordBreak: "break-word",
                            }}
                          >
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Düz metin olarak göster
                    <div
                      style={{
                        padding: "20px",
                        background: "white",
                        border: "2px solid #10b981",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1e293b",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                        lineHeight: "1.6",
                      }}
                    >
                      {travellerWithNfc?.nfcResult}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "13px",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <span>📏</span>
                    {travellerWithNfc?.nfcResult.length} characters
                  </div>
                </div>

                {/* Clear Button */}
                <button
                  onClick={clearNfcResult}
                  style={{
                    padding: "10px 24px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    background: "white",
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fef2f2";
                    e.currentTarget.style.borderColor = "#ef4444";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#64748b";
                  }}
                >
                  Clear Data
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
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
              display: "flex",
              alignItems: "center",
              gap: "12px",
              animation: "slideInRight 0.3s ease",
            }}
          >
            <span style={{ fontSize: "20px" }}>
              {toast.type === "success" ? "✓" : "✕"}
            </span>
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  // Merchant Mode (Original)
  return (
    <div
      style={{
        height: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
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
          <button
            onClick={resetConnection}
            style={{
              padding: "6px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              background: "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              color: "#64748b",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            ← Back
          </button>
          <h1
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
            }}
          >
            Device Management
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
            {isConnected ? "Connected" : "Disconnected"}
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
          minHeight: 0,
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
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📱</div>
                <div style={{ fontSize: "16px", fontWeight: "500" }}>
                  Cihaz bulunamadı
                </div>
                <div style={{ fontSize: "14px", marginTop: "8px" }}>
                  Bağlı cihaz yok veya arama kriterlerinize uygun cihaz
                  bulunamadı
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
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDevice?.connectionId !== device.connectionId) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ fontSize: "28px" }}>
                      {getDeviceIcon(device.deviceType)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#1e293b",
                          marginBottom: "2px",
                        }}
                      >
                        {device.fullName}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                        }}
                      >
                        {device.deviceType}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "8px",
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontFamily: "monospace",
                      }}
                    >
                      {device.connectionId.substring(0, 12)}...
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#667eea",
                        fontWeight: "500",
                      }}
                    >
                      {device.availableCommands?.length || 0} komut
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
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ fontSize: "48px" }}>
                      {getDeviceIcon(selectedDevice.deviceType)}
                    </div>
                    <div>
                      <h2
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#1e293b",
                        }}
                      >
                        {selectedDevice.fullName}
                      </h2>
                      <div style={{ fontSize: "14px", color: "#64748b" }}>
                        {selectedDevice.deviceType}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 14px",
                      background: "#f1f5f9",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      color: "#64748b",
                    }}
                  >
                    {selectedDevice.connectionId}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDevice(null)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    background: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#64748b",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fee2e2";
                    e.currentTarget.style.borderColor = "#fecaca";
                    e.currentTarget.style.color = "#991b1b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#64748b";
                  }}
                >
                  ✕ Kapat
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
                <div style={{ display: "grid", gap: "10px" }}>
                  {selectedDevice.availableCommands.map((cmd, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "16px",
                        background: "white",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#667eea";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(102, 126, 234, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#1e293b",
                            marginBottom: "4px",
                          }}
                        >
                          {cmd.name}
                        </div>
                        {cmd.data && cmd.data.length > 0 && (
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            Parametreler: {cmd.data.join(", ")}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          sendCommandToDevice(selectedDevice.connectionId, cmd)
                        }
                        disabled={isExecuting}
                        style={{
                          padding: "8px 20px",
                          border: "none",
                          borderRadius: "8px",
                          background: isExecuting ? "#cbd5e1" : "#667eea",
                          color: "white",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: isExecuting ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isExecuting) {
                            e.currentTarget.style.background = "#5568d3";
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isExecuting) {
                            e.currentTarget.style.background = "#667eea";
                            e.currentTarget.style.transform = "translateY(0)";
                          }
                        }}
                      >
                        {isExecuting ? "Gönderiliyor..." : "Gönder"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "48px 24px",
                    background: "white",
                    borderRadius: "12px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    ⚡
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "500" }}>
                    Bu cihaz için kullanılabilir komut yok
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "8px" }}>
                    Cihaz henüz komut kaydetmemiş
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
                  marginBottom: "8px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  >
                    {currentCommand.name}
                  </h3>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Parametreleri girin
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCommandPanel(false);
                    setCurrentCommand(null);
                  }}
                  style={{
                    padding: "4px 10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    background: "white",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  background: "#f0f4ff",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#667eea",
                }}
              >
                Hedef: {selectedDevice.fullName}
              </div>
            </div>

            {/* Panel Content */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
              {currentCommand.data.map((param, index) => (
                <div key={index} style={{ marginBottom: "16px" }}>
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
                    placeholder={`${param} değerini girin`}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
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
                  borderRadius: "8px",
                  background: isExecuting ? "#cbd5e1" : "#667eea",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: isExecuting ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  marginBottom: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!isExecuting) {
                    e.currentTarget.style.background = "#5568d3";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExecuting) {
                    e.currentTarget.style.background = "#667eea";
                  }
                }}
              >
                {isExecuting ? "Gönderiliyor..." : "Komutu Gönder"}
              </button>
              <button
                onClick={() => {
                  setShowCommandPanel(false);
                  setCurrentCommand(null);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  background: "white",
                  color: "#64748b",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                İptal
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
           
           @keyframes ping {
             0% {
               transform: scale(1);
               opacity: 0.3;
             }
             75%, 100% {
               transform: scale(2);
               opacity: 0;
             }
           }
           
           @keyframes bounce {
             0%, 80%, 100% {
               transform: scale(0);
             }
             40% {
               transform: scale(1);
             }
           }
           
           @keyframes scaleIn {
             from {
               opacity: 0;
               transform: scale(0.9);
             }
             to {
               opacity: 1;
               transform: scale(1);
             }
           }
           
           @keyframes successPulse {
             0%, 100% {
               transform: scale(1);
             }
             50% {
               transform: scale(1.05);
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
export default App;
