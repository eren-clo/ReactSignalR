import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface Credentials {
  device: string;
  user: string;
  pass: string;
}

interface CommandsProps {
  credentials: Credentials;
  connection: signalR.HubConnection | null;
  onBack: () => void;
  templateJson: string;
  setTemplateJson: (value: string) => void;
}

const Commands: React.FC<CommandsProps> = ({
  credentials,
  connection,
  onBack,
  templateJson,
  setTemplateJson,
}) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (connection) {
      // Connection zaten App.tsx'te oluşturuldu, sadece start et
      if (connection.state === signalR.HubConnectionState.Disconnected) {
        connection
          .start()
          .then(() => {
            setIsConnected(true);
            console.log(
              "POS Hub bağlantısı kuruldu - Cihaz:",
              credentials.device
            );
            connection.on("PosCommand", (command, data) => {
              console.log("Komut alındı:", command, data);
            });
          })
          .catch((e) => {
            console.error("Bağlantı Hatası: ", e);
            setIsConnected(false);
          });
      } else if (connection.state === signalR.HubConnectionState.Connected) {
        // Zaten bağlı
        setIsConnected(true);
        connection.on("PosCommand", (command, data) => {
          console.log("Komut alındı:", command, data);
        });
      }

      return () => {
        // Connection'ı kapatma, App.tsx hallediyor
        setIsConnected(false);
      };
    }
  }, [connection, credentials]);

  function printTest() {
    if (connection && isConnected) {
      connection
        .invoke("SendCommand", "print-test", "asd")
        .catch((err) => console.error("Komut Gönderme Hatası: ", err));
    }
  }

  function printTag() {
    if (connection && isConnected) {
      connection
        .invoke(
          "SendCommand",
          "print-tag",
          "7b58ebcc-a5a0-e442-c157-3a1eaac503b7"
        )
        .catch((err) => console.error("Komut Gönderme Hatası: ", err));
    }
  }

  function printCustomTemplate() {
    if (connection && isConnected && templateJson.trim()) {
      try {
        // JSON validasyonu
        JSON.parse(templateJson);
        connection
          .invoke("SendCommand", "print-custom-template", templateJson)
          .catch((err) => console.error("Komut Gönderme Hatası: ", err));
      } catch (error) {
        alert("Geçersiz JSON formatı!");
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="bg-white/20 rounded-full p-2">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Komut Gönderin</h2>
              <p className="text-xs text-green-50">
                Pos cihazına komut gönderin.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-300 animate-pulse" : "bg-red-300"
                }`}
              ></div>
              <span className="text-xs text-white">
                {isConnected ? "Bağlı" : "Bağlantı Bekleniyor"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 p-4 overflow-auto">
        <div className="max-w-2xl mx-auto gap-3 flex flex-col">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              type="button"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={printTest}
              disabled={!isConnected}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                Test Print
              </span>
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              type="button"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={printTag}
              disabled={!isConnected}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                Test A Tag
              </span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Custom Template JSON
            </label>
            <textarea
              value={templateJson}
              onChange={(e) => setTemplateJson(e.target.value)}
              className="w-full h-120 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
              placeholder='{"template": "example", "data": {...}}'
            />
            <button
              type="button"
              className="w-full mt-3 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={printCustomTemplate}
              disabled={!isConnected || !templateJson.trim()}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Print Custom Template
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commands;
