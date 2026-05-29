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
