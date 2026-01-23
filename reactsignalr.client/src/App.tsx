import { useEffect, useState } from "react";
import "./App.css";
import * as signalR from "@microsoft/signalr";

import CropImage from "./_components/CropImage";
import Result from "./_components/Result";
import CameraCapture from "./_components/CameraCapture";
import Commands from "./_components/Commands";
import SelectPage from "./_components/SelectPage";
import InvalidAccess from "./_components/InvalidAccess";
import Test from "./Test";

interface Credentials {
  device: string;
  user: string;
  pass: string;
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get("page"); // passport veya pos

  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [currentPage, setCurrentPage] = useState<"select" | "passport" | "pos">(
    "select",
  );

  // Passport state'leri
  const [passportState, setPassportState] = useState({
    photo: null as string | null,
    croppedImage: null as string | null,
    receivedImage: null as string | null,
  });

  // POS state'leri
  const [posState, setPosState] = useState({
    templateJson: "",
  });

  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [isPassportConnected, setIsPassportConnected] = useState(false);

  // Passport state güncelleyicileri
  const setPhoto = (photo: React.SetStateAction<string | null>) => {
    setPassportState((prev) => ({
      ...prev,
      photo: typeof photo === "function" ? photo(prev.photo) : photo,
    }));
  };

  const setCroppedImage = (
    croppedImage: React.SetStateAction<string | null>,
  ) => {
    setPassportState((prev) => ({
      ...prev,
      croppedImage:
        typeof croppedImage === "function"
          ? croppedImage(prev.croppedImage)
          : croppedImage,
    }));
  };

  const setReceivedImage = (
    receivedImage: React.SetStateAction<string | null>,
  ) => {
    setPassportState((prev) => ({
      ...prev,
      receivedImage:
        typeof receivedImage === "function"
          ? receivedImage(prev.receivedImage)
          : receivedImage,
    }));
  };

  // Geri dönme fonksiyonu - State'leri temizleme
  const goBackToMenu = () => {
    setCurrentPage("select");
    // URL'i temizle (page parametresini kaldır)
    window.history.pushState({}, "", window.location.pathname);
  };

  // Passport state'lerini tamamen temizle (yeni işlem için)
  const resetPassportState = () => {
    setPassportState({
      photo: null,
      croppedImage: null,
      receivedImage: null,
    });
  };

  // POS state güncelleyici
  const setPosTemplateJson = (templateJson: string) => {
    setPosState({ templateJson });
  };

  // POS state'lerini temizle
  const resetPosState = () => {
    setPosState({ templateJson: "" });
  };

  // Kimlik bilgilerini kontrol et ve yükle
  useEffect(() => {
    // 1. URL'den parametreleri kontrol et
    const deviceParam = urlParams.get("device");
    const userParam = urlParams.get("user");
    const passParam = urlParams.get("pass");

    if (deviceParam && userParam && passParam) {
      // URL'den geldi, kaydet
      const creds = { device: deviceParam, user: userParam, pass: passParam };
      setCredentials(creds);
      localStorage.setItem("signalr_credentials", JSON.stringify(creds));
      setIsValidating(false);

      // URL'i temizle (güvenlik için)
      if (window.history.replaceState) {
        const cleanUrl = pageParam
          ? `${window.location.pathname}?page=${pageParam}`
          : window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } else {
      // 2. localStorage'dan kontrol et
      const storedCreds = localStorage.getItem("signalr_credentials");
      if (storedCreds) {
        try {
          const creds = JSON.parse(storedCreds) as Credentials;
          if (creds.device && creds.user && creds.pass) {
            setCredentials(creds);
            setIsValidating(false);
          } else {
            setIsValidating(false);
          }
        } catch (e) {
          console.error("Credentials parse error:", e);
          setIsValidating(false);
        }
      } else {
        // 3. Hiçbir yerde yok
        setIsValidating(false);
      }
    }
  }, []);

  // Sayfa parametresine göre otomatik sayfa seçimi
  useEffect(() => {
    if (credentials && pageParam) {
      if (pageParam === "passport" || pageParam === "pos") {
        setCurrentPage(pageParam);
      }
    }
  }, [credentials, pageParam]);

  // currentPage değiştiğinde URL'i güncelle
  useEffect(() => {
    if (currentPage !== "select") {
      // Sayfa seçildiğinde URL'e page parametresi ekle
      window.history.pushState({}, "", `?page=${currentPage}`);
    }
  }, [currentPage]);

  // SignalR bağlantısını kur (sayfa seçildiğinde)
  useEffect(() => {
    // Önce mevcut bağlantıyı temizle
    if (connection) {
      console.log("Önceki bağlantı kapatılıyor...");
      connection
        .stop()
        .catch((err) => console.error("Connection stop error:", err));
      setConnection(null);
      setIsPassportConnected(false);
    }

    if (!credentials) return;
    if (currentPage === "select") {
      // Ana menüdeyken bağlantı olmamalı
      return;
    }

    const hubUrl = currentPage === "passport" ? "/imageHub" : "/posHub";
    const queryParams = new URLSearchParams({
      device: credentials.device,
      user: credentials.user,
      pass: credentials.pass,
    });

    console.log(`${currentPage} için yeni bağlantı oluşturuluyor...`);

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubUrl}?${queryParams.toString()}`)
      .withAutomaticReconnect()
      .build();

    // Passport için hemen başlat ve event listener ekle
    if (currentPage === "passport") {
      newConnection
        .start()
        .then(() => {
          setIsPassportConnected(true);
          console.log(
            "ImageHub bağlantısı kuruldu - Cihaz:",
            credentials.device,
          );
          newConnection.on("ReceiveImage", (base64Data) => {
            setReceivedImage(base64Data);
          });
        })
        .catch((e) => {
          console.error("Bağlantı Hatası: ", e);
          setIsPassportConnected(false);
        });
    }

    setConnection(newConnection);

    return () => {
      console.log(`${currentPage} bağlantısı cleanup ediliyor...`);
      if (newConnection) {
        newConnection
          .stop()
          .catch((err) => console.error("Cleanup error:", err));
      }
      setIsPassportConnected(false);
    };
  }, [credentials, currentPage]);

  // Tarayıcı geri butonunu dinle
  useEffect(() => {
    const handlePopState = () => {
      // URL'den page parametresini oku
      const urlParams = new URLSearchParams(window.location.search);
      const pageFromUrl = urlParams.get("page");

      if (pageFromUrl === "passport" || pageFromUrl === "pos") {
        setCurrentPage(pageFromUrl);
      } else {
        // page parametresi yoksa ana menüye dön
        setCurrentPage("select");
        // State'leri temizleme, sadece sayfayı değiştir
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Destructure passport state
  const { photo, croppedImage, receivedImage } = passportState;

  // Validasyon durumu
  if (isValidating) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <Test />;
  // Kimlik bilgileri yoksa
  if (!credentials) {
    return <InvalidAccess />;
  }

  // Sayfa seçimi
  if (currentPage === "select") {
    return (
      <SelectPage
        onSelectPage={(page) => setCurrentPage(page)}
        hasPassportData={
          !!(
            passportState.photo ||
            passportState.croppedImage ||
            passportState.receivedImage
          )
        }
        onResetPassport={resetPassportState}
        hasPosData={!!posState.templateJson}
        onResetPos={resetPosState}
      />
    );
  }

  // POS sayfası
  if (currentPage === "pos") {
    return (
      <Commands
        credentials={credentials}
        connection={connection}
        onBack={goBackToMenu}
        templateJson={posState.templateJson}
        setTemplateJson={setPosTemplateJson}
      />
    );
  }

  // Passport sayfası (mevcut akış)

  if (receivedImage) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex-shrink-0">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={goBackToMenu}
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
                <h2 className="text-xl font-bold text-white">
                  Başarıyla Gönderildi!
                </h2>
                <p className="text-xs text-blue-50">Görüntü sunucudan alındı</p>
              </div>
            </div>
          </div>
        </div>

        {/* Görüntü Alanı */}
        <div className="flex-1 min-h-0 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={receivedImage}
                alt="Received from Server"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Alt Buton */}
        <div className="bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
          <div className="p-3">
            <button
              type="button"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={(e) => {
                e.preventDefault();
                setReceivedImage(null);
                setPhoto(null);
                setCroppedImage(null);
              }}
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Yeni Fotoğraf Çek
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (croppedImage) {
    return (
      <Result
        croppedImage={croppedImage}
        setCroppedImage={setCroppedImage}
        credentials={credentials!}
        onBack={goBackToMenu}
        isConnected={isPassportConnected}
      />
    );
  }

  if (photo) {
    return (
      <CropImage
        photo={photo}
        setCroppedImage={setCroppedImage}
        setPhoto={setPhoto}
        onBack={goBackToMenu}
        isConnected={isPassportConnected}
      />
    );
  }

  return (
    <CameraCapture
      setPhoto={setPhoto}
      onBack={goBackToMenu}
      isConnected={isPassportConnected}
    />
  );
}

export default App;
