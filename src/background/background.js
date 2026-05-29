/**
 * TabHavoc Cat - Background Alarm Scheduler Sequence
 */

// Helper to initialize cat tracking alarm
async function refreshCatTrackingAlarm() {
  try {
    const data = await chrome.storage.local.get("inactivityThresholdMinutes");
    chrome.alarms.create("HavocCheckAlarm", { periodInMinutes: 1 });
  } catch (error) {
    console.error("Failed to refresh cat tracking alarm:", error);
  }
}

// Handler for the HavocCheckAlarm trigger
async function handleHavocCheck() {
  try {
    const data = await chrome.storage.local.get([
      "lastInteractionTimestamp",
      "inactivityThresholdMinutes"
    ]);

    const lastInteraction = data.lastInteractionTimestamp || Date.now();
    const thresholdMinutes = data.inactivityThresholdMinutes || 5;

    const deltaMinutes = (Date.now() - lastInteraction) / (1000 * 60);

    if (deltaMinutes > thresholdMinutes) {
      await chrome.storage.local.set({ currentCatState: "HAVOC" });
      
      const existingAlarm = await chrome.alarms.get("ChaosTickerAlarm");
      if (!existingAlarm) {
        chrome.alarms.create("ChaosTickerAlarm", { periodInMinutes: 5 });
      }
    } else {
      await chrome.alarms.clear("ChaosTickerAlarm");
    }
  } catch (error) {
    console.error("Error running havoc check sequence:", error);
  }
}

// Helper to broadcast havoc animation action to all accessible tabs
async function broadcastHavocAnimation() {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id) {
        const url = tab.url || "";
        const isRestricted = url.startsWith("chrome://") || 
                            url.startsWith("chrome-extension://") || 
                            url.includes("chromewebstore.google.com") || 
                            url.includes("chrome.google.com/webstore");
        if (!isRestricted) {
          chrome.tabs.sendMessage(tab.id, { action: "EXECUTE_HAVOC_ANIMATION" }).catch(() => {});
        }
      }
    }
  } catch (error) {
    console.error("Error broadcasting havoc animation:", error);
  }
}

// Handler for the ChaosTickerAlarm trigger
async function handleChaosTicker() {
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (activeTab && activeTab.id) {
      const url = activeTab.url || "";
      const isSystemTab = url.startsWith("chrome://") || 
                          url.startsWith("chrome-extension://") || 
                          url.includes("chromewebstore.google.com") || 
                          url.includes("chrome.google.com/webstore");

      await broadcastHavocAnimation();

      if (!isSystemTab) {
        try {
          await chrome.tabs.remove(activeTab.id);
        } catch (removeError) {
          console.error(`Failed to remove active tab ${activeTab.id}:`, removeError);
        }
      }
    }
  } catch (error) {
    console.error("Error executing chaos ticker sequence:", error);
  }
}

// Register Alarm Event Listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "HavocCheckAlarm") {
    handleHavocCheck();
  } else if (alarm.name === "ChaosTickerAlarm") {
    handleChaosTicker();
  }
});

// Installation and Initialization listener
/*
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed successfully.");
  
  chrome.storage.local.get(["inactivityThresholdMinutes", "lastInteractionTimestamp"], (data) => {
    const defaults = {};
    if (data.inactivityThresholdMinutes === undefined) {
      defaults.inactivityThresholdMinutes = 5;
    }
    if (data.lastInteractionTimestamp === undefined) {
      defaults.lastInteractionTimestamp = Date.now();
    }
    if (Object.keys(defaults).length > 0) {
      chrome.storage.local.set(defaults);
    }
  });

  refreshCatTrackingAlarm();
});
*/

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed successfully.");
  
  chrome.storage.local.get(["inactivityThresholdMinutes", "lastInteractionTimestamp", "currentCatState"], (data) => {
    const defaults = {};
    if (data.inactivityThresholdMinutes === undefined) {
      defaults.inactivityThresholdMinutes = 30; // Updated to spec default of 30
    }
    if (data.lastInteractionTimestamp === undefined) {
      defaults.lastInteractionTimestamp = Date.now();
    }
    // FIX: Add the missing state required by the spec
    if (data.currentCatState === undefined) {
      defaults.currentCatState = "IDLE"; 
    }
    if (Object.keys(defaults).length > 0) {
      chrome.storage.local.set(defaults);
    }
  });

  refreshCatTrackingAlarm();
});