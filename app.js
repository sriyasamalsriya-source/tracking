const trackingForm = document.querySelector("#tracking-form");
const trackingInput = document.querySelector("#tracking-number");
const trackingResult = document.querySelector("#tracking-result");

function addResultText(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function showTrackingMessage(title, badge, message) {
  trackingResult.replaceChildren();
  trackingResult.hidden = false;

  const titleElement = addResultText(trackingResult, "div", "result-title", title);
  addResultText(titleElement, "span", "", badge);
  addResultText(trackingResult, "p", "result-route", message);
}

async function showTrackingResult(value) {
  const trackingNumber = value.trim().toUpperCase();
  trackingResult.hidden = false;
  trackingResult.setAttribute("aria-busy", "true");
  showTrackingMessage("Looking up shipment", "PLEASE WAIT", "Checking the latest available updates.");

  try {
    const response = await fetch("./shipments.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Shipment data request failed with status ${response.status}.`);
    }

    const shipments = await response.json();
    if (!Array.isArray(shipments)) {
      throw new Error("Shipment data must be a JSON array.");
    }

    const shipment = shipments.find((item) =>
      item && typeof item.trackingNumber === "string" &&
      item.trackingNumber.trim().toUpperCase() === trackingNumber
    );

    if (!shipment) {
      showTrackingMessage("Shipment not found", "CHECK NUMBER", "Check the tracking number or contact our team for help.");
      return;
    }
    if (!Array.isArray(shipment.events)) {
      throw new Error("The shipment record has an invalid events list.");
    }

    trackingResult.replaceChildren();
    const latestStatus = shipment.events.at(-1)?.status || "No updates yet";
    const titleElement = addResultText(trackingResult, "div", "result-title", latestStatus);
    addResultText(titleElement, "span", "", "TRACKING UPDATES");
    addResultText(trackingResult, "div", "result-route", trackingNumber);

    if (shipment.events.length === 0) {
      addResultText(trackingResult, "p", "result-route", "No shipment updates have been posted yet.");
      return;
    }

    const timeline = document.createElement("div");
    timeline.className = "result-timeline";
    for (const update of shipment.events) {
      if (
        !update ||
        typeof update.status !== "string" ||
        typeof update.timestamp !== "string" ||
        (update.location !== undefined && typeof update.location !== "string")
      ) {
        throw new Error("A shipment update is missing valid status or timestamp information.");
      }

      const step = document.createElement("div");
      step.className = "result-step done";
      step.append(document.createTextNode(update.status));
      addResultText(
        step,
        "small",
        "",
        [update.location, update.timestamp].filter(Boolean).join(" · ")
      );
      timeline.append(step);
    }
    trackingResult.append(timeline);
  } catch (error) {
    console.error("Unable to load shipment updates.", error);
    showTrackingMessage("Tracking unavailable", "TRY AGAIN LATER", "We couldn't load shipment updates. Please try again later.");
  } finally {
    trackingResult.removeAttribute("aria-busy");
  }
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
