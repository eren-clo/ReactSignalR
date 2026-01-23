import React, { useState, useRef } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CropperComponentProps {
  photo: string;
  setCroppedImage: React.Dispatch<React.SetStateAction<string | null>>;
  setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
  onBack: () => void;
  isConnected: boolean;
}

function CropImage({
  photo,
  setCroppedImage,
  setPhoto,
  onBack,
  isConnected,
}: CropperComponentProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Canvas boyutunu orijinal görüntü boyutlarına göre ayarla
    const pixelCropWidth = completedCrop.width * scaleX;
    const pixelCropHeight = completedCrop.height * scaleY;

    canvas.width = pixelCropWidth;
    canvas.height = pixelCropHeight;

    // Kalite kaybını önlemek için imageSmoothingEnabled'ı false yap
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      pixelCropWidth,
      pixelCropHeight,
      0,
      0,
      pixelCropWidth,
      pixelCropHeight
    );

    const base64Image = canvas.toDataURL("image/jpeg", 1);
    setCroppedImage(base64Image);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
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
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Alan Seçimi</h2>
              <p className="text-xs text-blue-50">
                MRZ alanını seçmek için çerçeveyi ayarlayın
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

      <div className="flex-1 min-h-0 flex flex-col p-3 overflow-hidden">
        <div className="mb-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg flex-shrink-0">
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
          <span>Sürükleyerek alan seçin</span>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={undefined}
          >
            <img
              ref={imgRef}
              src={photo}
              alt="Crop"
              style={{
                maxWidth: "90vw",
                maxHeight: "60vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          </ReactCrop>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto p-3 space-y-2">
          <button
            type="button"
            disabled={!completedCrop}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={getCroppedImg}
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
              Devam Et
            </span>
          </button>

          <button
            type="button"
            className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300"
            onClick={() => setPhoto(null)}
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Resmi Yeniden Çek
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CropImage;
