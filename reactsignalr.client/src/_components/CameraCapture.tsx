import React, { useRef, useState, useEffect } from "react";

interface CameraCaptureProps {
  setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
  onBack: () => void;
  isConnected: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  setPhoto,
  onBack,
  isConnected,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const getDevices = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoInputs);

      // Mobilde arka kamerayı varsayılan yap
      const backCameras = videoInputs.filter(
        (d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("arka") ||
          d.label.toLowerCase().includes("rear")
      );

      if (backCameras.length > 0) {
        // Birden fazla arka kamera varsa, "0" içeren ana kamerayı tercih et
        const mainCamera = backCameras.find(
          (d) => d.label.includes("0") || d.label.toLowerCase().includes("wide")
        );
        setSelectedDeviceId(
          mainCamera ? mainCamera.deviceId : backCameras[0].deviceId
        );
      } else if (videoInputs.length > 0) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Kamera erişimi reddedildi:", err);
      setIsLoading(false);
    }
  };

  const startStream = async () => {
    if (!selectedDeviceId) return;

    // Eski stream'i durdur
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedDeviceId },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Kamera başlatılamadı:", err);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 1);

      // Stream'i durdur
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      setPhoto(dataUrl);
    }
  };

  useEffect(() => {
    getDevices();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      startStream();
    }
  }, [selectedDeviceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kamera hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col overflow-hidden">
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Pasaport / Kimlik Tarama
              </h2>
              <p className="text-xs text-blue-50">
                Belgenizi çekmek için hazırlanın
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

      {/* Kamera Seçimi */}
      {devices.length > 1 && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 flex-shrink-0">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Kamera Seçimi
          </label>
          <div className="relative">
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-sm"
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || "Bilinmeyen Kamera"}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Video Önizleme */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 flex-1 min-h-0 p-3 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
        />
      </div>

      {/* Alt Kısım - Buton ve Bilgi */}
      <div className="p-3 bg-gradient-to-br from-gray-50 to-blue-50 flex-shrink-0">
        <div className="mb-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
          <svg
            className="w-4 h-4 flex-shrink-0"
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
          <span>Kimliğinizi çerçeve içinde konumlandırın</span>
        </div>

        <button
          type="button"
          onClick={takePhoto}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
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

      {/* Görünmez Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
