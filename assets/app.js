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

ticketCards.forEach((card) => {
  card.addEventListener("click", () => {
    ticketCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
  });
});

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
