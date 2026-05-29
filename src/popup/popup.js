// popup.js - TabHavoc Cat user threshold settings controls

/*
document.addEventListener("DOMContentLoaded", async () => {
  const thresholdInput = document.getElementById("threshold");
  const saveBtn = document.getElementById("save");

  // Load current configuration value
  try {
    const data = await chrome.storage.local.get("inactivityThresholdMinutes");
    if (data.inactivityThresholdMinutes) {
      thresholdInput.value = data.inactivityThresholdMinutes;
    }
  } catch (error) {
    console.error("Error loading configuration:", error);
  }

  // Save new configuration value
  saveBtn.addEventListener("click", async () => {
    const val = parseInt(thresholdInput.value, 10);
    if (!isNaN(val) && val > 0) {
      try {
        await chrome.storage.local.set({ inactivityThresholdMinutes: val });
        // Request background worker to update its tracking timers immediately
        const bg = await chrome.runtime.getBackgroundPage?.();
        if (bg && bg.refreshCatTrackingAlarm) {
          bg.refreshCatTrackingAlarm();
        } else {
          // Alternatively send a runtime message to notify background script
          chrome.runtime.sendMessage({ action: "REFRESH_ALARM" });
        }
        alert("Configuration saved!");
      } catch (error) {
        console.error("Error saving configuration:", error);
      }
    }
  });
});
*/

/*
document.addEventListener("DOMContentLoaded", async () => {
  const intervalSelect = document.getElementById("havoc-interval-select");
  const feedBtn = document.getElementById("feed-element-btn");

  // Load configured thresholds
  const data = await chrome.storage.local.get("inactivityThresholdMinutes");
  if (data.inactivityThresholdMinutes) {
    intervalSelect.value = data.inactivityThresholdMinutes;
  }

  // Update background controls on threshold change
  intervalSelect.addEventListener("change", async () => {
    const selectedValue = parseInt(intervalSelect.value, 10);
    await chrome.storage.local.set({ inactivityThresholdMinutes: selectedValue });
    
    // Message background worker directly to enforce immediate update checks
    chrome.runtime.sendMessage({ action: "REFRESH_ALARM" });
  });

  // Wire action button to notify active webpage layout context
  feedBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: "TRIGGER_FEEDING_SELECTION" });
      window.close(); // Close popup context to let user select element
    }
  });
});
*/

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