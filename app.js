const form = document.querySelector("#ride-form");
const pickup = document.querySelector("#pickup");
const dropoff = document.querySelector("#dropoff");
const message = document.querySelector("#form-message");
const toast = document.querySelector("#toast");
const rideCards = [...document.querySelectorAll(".ride-card")];
const emptyState = document.querySelector("#empty-state");
let toastTimer;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3500);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const destination = dropoff.value.trim();
  if (!destination) {
    message.textContent = "Add a drop-off to find rides going your way.";
    dropoff.focus();
    return;
  }

  message.textContent = "";
  const pickupLocation = pickup.value.trim().toLowerCase();
  const dropoffLocation = destination.toLowerCase();
  let visibleCount = 0;
  rideCards.forEach((card) => {
    const stops = [...card.querySelectorAll(".ride-route > span:not(.route-line)")]
      .map((stop) => stop.textContent.trim().toLowerCase());
    const matchesPickup = stops[0] && (
      pickupLocation.includes(stops[0]) || stops[0].includes(pickupLocation)
    );
    const matchesDropoff = stops.at(-1) && (
      dropoffLocation.includes(stops.at(-1)) || stops.at(-1).includes(dropoffLocation)
    );
    const matches = matchesPickup && matchesDropoff;
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  emptyState.hidden = visibleCount > 0;
  document.querySelector("#matches-title").textContent = visibleCount
    ? `Rides near ${destination}`
    : "No rides found";
  document.querySelector(".matches-section").scrollIntoView({ behavior: "smooth", block: "start" });
});

dropoff.addEventListener("input", () => {
  message.textContent = "";
});

document.querySelector("#locate-button").addEventListener("click", () => {
  showToast("Location access can be enabled when you connect your device.");
});

document.querySelectorAll(".join-button").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.driver}'s ride selected. Sign in to request your seat.`);
  });
});

document.querySelector(".text-link").addEventListener("click", (event) => {
  event.preventDefault();
  rideCards.forEach((card) => { card.hidden = false; });
  emptyState.hidden = true;
  document.querySelector("#matches-title").textContent = "Going your way";
});
