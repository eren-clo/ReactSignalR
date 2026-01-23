import React from "react";

interface Credentials {
  device: string;
  user: string;
  pass: string;
}

function Result({
  croppedImage,
  setCroppedImage,
  credentials,
  onBack,
  isConnected,
}: {
  croppedImage: string;
  setCroppedImage: (image: string | null) => void;
  credentials: Credentials;
  onBack: () => void;
  isConnected: boolean;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleConfirm() {
    setIsLoading(true);

    try {
      console.log("Gönderiliyor:", {
        url: "/ImageUpload/upload-base64",
        device: credentials.device,
        user: credentials.user,
        pass: credentials.pass,
        imageLength: croppedImage.length,
      });

      const response = await fetch("/ImageUpload/upload-base64", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64Data: croppedImage,
          device: credentials.device,
          user: credentials.user,
          pass: credentials.pass,
        }),
      });

      console.log("Response:", response.status, response.statusText);

      if (response.ok) {
        console.log("Base64 resim başarıyla iletildi!");
        alert("Resim başarıyla gönderildi!");
        setCroppedImage(null);
      } else {
        const errorText = await response.text();
        console.error("Sunucu hatası:", errorText);
        alert("Gönderim başarısız: " + response.status + " - " + errorText);
      }
    } catch (error) {
      console.error("Detaylı hata:", error);
      if (error instanceof TypeError) {
        alert(
          "Bağlantı hatası: Sunucuya erişilemiyor. CORS veya ağ problemi olabilir.",
        );
      } else {
        alert("Bağlantı hatası: " + error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex-shrink-0">
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
            <div>
              <h2 className="text-xl font-bold text-white">Alan Seçildi</h2>
              <p className="text-xs text-blue-50">
                Sonucu kontrol edin ve onaylayın
              </p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-blue-300 animate-pulse" : "bg-red-300"
                }`}
              ></div>
              <span className="text-xs text-white">
                {isConnected ? "Bağlı" : "Bağlantı Bekleniyor"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Görüntü Alanı */}
      <div className="flex-1 min-h-0 p-3 overflow-auto">
        <div className="h-full flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={croppedImage}
                alt="Cropped Result"
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Seçilen alan yukarıda gösterilmektedir
            </p>
          </div>
        </div>
      </div>

      {/* Alt Butonlar */}
      <div className="bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
        <div className="p-3 space-y-2">
          <button
            type="button"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleConfirm}
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Gönderiliyor...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Onayla ve Gönder
                </>
              )}
            </span>
          </button>

          <button
            type="button"
            className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300"
            onClick={() => setCroppedImage(null)}
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Tekrar Seç
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
