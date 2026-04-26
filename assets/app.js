const tabButtons = document.querySelectorAll(".tab");
const contentSections = {
  tickets: document.getElementById("tickets-content"),
  extras: document.getElementById("extras-content"),
};
const orderNumberLabel = document.getElementById("order-number");

function randomDigits(length) {
  let output = "";
  for (let i = 0; i < length; i += 1) {
    output += Math.floor(Math.random() * 10);
  }
  return output;
}

function randomLetters(length) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let output = "";
  for (let i = 0; i < length; i += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output;
}

function setRandomOrderNumber() {
  const storageKey = "ticketmasterMockOrderNumber";
  let orderNumber = localStorage.getItem(storageKey);
  if (!orderNumber) {
    orderNumber = `Order #${randomDigits(2)}-${randomDigits(6)}/${randomLetters(2)}`;
    localStorage.setItem(storageKey, orderNumber);
  }
  if (orderNumberLabel) {
    orderNumberLabel.textContent = orderNumber;
  }
}

setRandomOrderNumber();

tabButtons.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedTab = tab.dataset.tab;

    tabButtons.forEach((button) => button.classList.remove("active"));
    tab.classList.add("active");

    Object.entries(contentSections).forEach(([key, section]) => {
      section.classList.toggle("active", key === selectedTab);
    });
  });
});

const ticketCards = document.querySelectorAll(".ticket-card");
const modalSeats = document.getElementById("modal-seats");
const sCount = document.getElementById("s-count");
const transferOverlay = document.getElementById("transfer-overlay");
const transferBtn = document.getElementById("transfer-btn");
const transferToBtn = document.getElementById("transfer-to-btn");

ticketCards.forEach((card) => {
  card.addEventListener("click", () => {
    ticketCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
  });
});

function populateModalSeats() {
  if (!modalSeats) return;
  modalSeats.innerHTML = "";
  ticketCards.forEach((card) => {
    const seatValue = card.querySelector(".value:last-child").textContent;
    const seat = document.createElement("div");
    seat.className = "modal-seat";
    seat.dataset.seat = card.dataset.type;
    seat.innerHTML = `
      <div class="seat-label">SEAT</div>
      <div class="seat-number">${seatValue}</div>
      <div class="seat-check">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="24" height="24">
          <path fill="#fff" d="M20,38.5C9.8,38.5,1.5,30.2,1.5,20S9.8,1.5,20,1.5S38.5,9.8,38.5,20S30.2,38.5,20,38.5z"/>
          <path fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="3" d="M11.2,20.1l5.8,5.8l13.2-13.2"/>
        </svg>
      </div>
    `;
    seat.addEventListener("click", () => {
      seat.classList.toggle("selected");
      const selected = document.querySelectorAll(".modal-seat.selected");
      sCount.textContent = selected.length;
    });
    modalSeats.appendChild(seat);
  });
}

function clearModal() {
  if (transferOverlay) {
    transferOverlay.classList.remove("active");
    document.querySelectorAll(".modal-seat.selected").forEach((s) => s.classList.remove("selected"));
    sCount.textContent = "0";
  }
}

if (transferBtn) {
  transferBtn.addEventListener("click", () => {
    populateModalSeats();
    if (transferOverlay) {
      transferOverlay.classList.add("active");
    }
  });
}

if (transferOverlay) {
  transferOverlay.addEventListener("click", (e) => {
    if (e.target === transferOverlay) {
      clearModal();
    }
  });
}

if (transferToBtn) {
  transferToBtn.addEventListener("click", () => {
    clearModal();
  });
}

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

function isAppleDevice() {
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isMac = /Mac/i.test(platform);
  return isIOS || isMac;
}

function isChromeOS() {
  const ua = navigator.userAgent || "";
  return /CrOS/i.test(ua);
}

function configureMapEmbed() {
  const mapFrame = document.getElementById("concert-map");
  if (!mapFrame) {
    return;
  }

  const providerStorageKey = "ticketmasterMockMapProvider";
  const appleMapUrl =
    "https://maps.apple.com/?q=SoFi%20Stadium%2C%20Inglewood%2C%20California&z=14";
  const googleMapUrl =
    "https://maps.google.com/maps?q=SoFi%20Stadium%2C%20Inglewood%2C%20California&z=14&output=embed";

  const isCrOS = isChromeOS();
  if (isCrOS) {
    localStorage.removeItem(providerStorageKey);
  }
  const preferredProvider = isCrOS ? "google" : isAppleDevice() ? "apple" : "google";
  const storedProvider = localStorage.getItem(providerStorageKey);
  const safeStoredProvider = isCrOS ? null : storedProvider;
  const primaryProvider =
    safeStoredProvider === "apple" || safeStoredProvider === "google"
      ? safeStoredProvider
      : preferredProvider;
  const fallbackProvider = primaryProvider === "apple" ? "google" : "apple";
  const providerUrls = {
    apple: appleMapUrl,
    google: googleMapUrl,
  };

  let activeProvider = primaryProvider;
  let didFallback = false;
  let loadHandled = false;

  function switchToFallback() {
    if (didFallback) {
      return;
    }
    didFallback = true;
    activeProvider = fallbackProvider;
    mapFrame.src = providerUrls[fallbackProvider];
  }

  const fallbackTimeout = window.setTimeout(() => {
    if (!loadHandled) {
      switchToFallback();
    }
  }, 5000);

  mapFrame.addEventListener("load", () => {
    loadHandled = true;
    window.clearTimeout(fallbackTimeout);
    localStorage.setItem(providerStorageKey, activeProvider);
  });

  mapFrame.addEventListener("error", () => {
    window.clearTimeout(fallbackTimeout);
    switchToFallback();
  });

  mapFrame.src = providerUrls[primaryProvider];
}

configureMapEmbed();
