// popup.js - TabHavoc Cat user threshold settings controls

document.addEventListener("DOMContentLoaded", async () => {
  const intervalSelect = document.getElementById("havoc-interval-select");
  const feedBtn = document.getElementById("feed-element-btn");

  // Load configured thresholds safely
  try {
    const data = await chrome.storage.local.get("inactivityThresholdMinutes");
    if (data.inactivityThresholdMinutes && intervalSelect) {
      intervalSelect.value = data.inactivityThresholdMinutes;
    }
  } catch (err) {
    console.error("Error fetching storage:", err);
  }

  // Update background controls on dropdown threshold change
  if (intervalSelect) {
    intervalSelect.addEventListener("change", async () => {
      const selectedValue = parseInt(intervalSelect.value, 10);
      await chrome.storage.local.set({ inactivityThresholdMinutes: selectedValue });
      
      // Notify background worker safely
      chrome.runtime.sendMessage({ action: "REFRESH_ALARM" }).catch(() => {
        // Suppress errors if background is briefly sleeping
      });
    });
  }

  // Wire action button with spec-compliant error boundaries
  if (feedBtn) {
    feedBtn.addEventListener("click", async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.id) return;

        // Check if we are on a restricted system url before messaging
        const url = tab.url || "";
        if (url.startsWith("chrome://") || url.startsWith("about:") || url.includes("chromewebstore.google.com")) {
          alert("The cat cannot eat elements on system-protected pages! Please try a live public webpage.");
          return;
        }

        // Fire message to content script and gracefully catch if it's missing
        chrome.tabs.sendMessage(tab.id, { action: "TRIGGER_FEEDING_SELECTION" })
          .then(() => window.close())
          .catch((error) => {
            console.warn("Receiver missing:", error);
            alert("Please refresh the current webpage before trying to feed the cat!");
          });

      } catch (err) {
        console.error("Popup interaction error:", err);
      }
    });
  }
});