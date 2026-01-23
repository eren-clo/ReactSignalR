import React, { useRef } from "react";
import { WebCamera, type WebCameraHandler } from "@shivantra/react-web-camera";

function SelectImage({
  setPhoto,
}: {
  setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const cameraHandler = useRef<WebCameraHandler>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleCapture = async () => {
    const file = await cameraHandler.current?.capture();
    if (file) {
      const base64 = await fileToBase64(file);
      setPhoto(base64);
    }
  };

  const handleSwitch = () => {
    cameraHandler.current?.switch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kimlik Doğrulama
          </h1>
          <p className="text-gray-600">Kimliğinizin fotoğrafını çekin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative">
            <WebCamera
              style={{ width: "100%", height: "auto" }}
              videoStyle={{ width: "100%", height: "auto", borderRadius: 0 }}
              captureMode="front"
              captureQuality={1}
              ref={cameraHandler}
              captureType="webp"
            />

            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={handleSwitch}
                className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110"
                title="Kamerayı değiştir"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="mb-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Kimliğinizi kamera önünde net bir şekilde konumlandırın
              </span>
            </div>

            <button
              type="button"
              onClick={handleCapture}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Fotoğraf Çek
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectImage;
