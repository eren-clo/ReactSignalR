import React from "react";

const InvalidAccess: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Hata İkonu */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Başlık */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Geçersiz Giriş
        </h2>

        {/* Açıklama */}
        <p className="text-gray-600 mb-6">
          Bu sayfaya erişim için geçerli kimlik bilgileri gereklidir. Lütfen
          geçerli bir QR kod tarayın veya yetkili biriyle iletişime geçin.
        </p>

        {/* Yenile Butonu */}
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>
  );
};

export default InvalidAccess;
