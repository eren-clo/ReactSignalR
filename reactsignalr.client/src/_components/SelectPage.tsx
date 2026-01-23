import React from "react";

interface SelectPageProps {
  onSelectPage: (page: "passport" | "pos") => void;
  hasPassportData?: boolean;
  onResetPassport?: () => void;
  hasPosData?: boolean;
  onResetPos?: () => void;
}

const SelectPage: React.FC<SelectPageProps> = ({
  onSelectPage,
  hasPassportData,
  onResetPassport,
  hasPosData,
  onResetPos,
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Hoş Geldiniz</h2>
              <p className="text-xs text-blue-50">Bir seçenek seçin</p>
            </div>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="flex-1 min-h-0 p-6 overflow-auto">
        <div className="max-w-md mx-auto flex flex-col gap-4">
          {/* Pasaport/Kimlik Kartı */}
          <button
            onClick={() => onSelectPage("passport")}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Pasaport / Kimlik Tarama
                </h3>
                <p className="text-sm text-gray-600">
                  Belge fotoğrafı çekin ve gönderin
                </p>
                {hasPassportData && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600 font-medium">
                      Devam edilebilir işlem var
                    </span>
                  </div>
                )}
              </div>
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          {/* POS Yönetimi Kartı */}
          <button
            onClick={() => onSelectPage("pos")}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  POS Yönetimi
                </h3>
                <p className="text-sm text-gray-600">
                  POS cihazına komut gönderin
                </p>
                {hasPosData && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">
                      Devam edilebilir işlem var
                    </span>
                  </div>
                )}
              </div>
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Pasaport verisi varsa temizleme butonu */}
        {hasPassportData && onResetPassport && (
          <div className="max-w-md mx-auto mt-4">
            <button
              onClick={() => {
                if (
                  confirm(
                    "Pasaport işlem verilerini temizlemek istediğinize emin misiniz?"
                  )
                ) {
                  onResetPassport();
                }
              }}
              className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-red-200"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Pasaport Verilerini Temizle
            </button>
          </div>
        )}

        {/* POS verisi varsa temizleme butonu */}
        {hasPosData && onResetPos && (
          <div className="max-w-md mx-auto mt-2">
            <button
              onClick={() => {
                if (
                  confirm(
                    "POS işlem verilerini temizlemek istediğinize emin misiniz?"
                  )
                ) {
                  onResetPos();
                }
              }}
              className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-red-200"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              POS Verilerini Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectPage;
