const trackingForm = document.querySelector("#tracking-form");
const trackingInput = document.querySelector("#tracking-number");
const trackingResult = document.querySelector("#tracking-result");

function showTrackingResult(value) {
  const trackingNumber = value.trim();
  trackingResult.hidden = false;

  trackingResult.innerHTML = `
    <div class="result-title">Tracking preview unavailable <span>LIVE SERVICE</span></div>
    <p class="result-route">${trackingNumber ? `Tracking number ${trackingNumber.toUpperCase()} is not connected to a live shipment service yet.` : "Connect a shipment tracking service to look up live parcels."}</p>
  `;
}

trackingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!trackingInput.value.trim()) {
    trackingInput.focus();
    return;
  }
  showTrackingResult(trackingInput.value);
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
