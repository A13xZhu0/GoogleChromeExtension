/*
function ensureOverlay() {
  if (!document.getElementById("nekobyte-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "nekobyte-overlay";
    document.body.appendChild(overlay);
  }
}

ensureOverlay();
*/



function getElementBounds(el) {
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    color: style.color,
    background: style.background,
    html: el.innerHTML,
    text: el.textContent
  };
}

function createGhostNode(bounds) {
  const ghost = document.createElement("div");
  
  if (bounds.html) {
    ghost.innerHTML = bounds.html;
  } else if (bounds.text) {
    ghost.textContent = bounds.text;
  }
  
  ghost.style.position = "absolute";
  ghost.style.top = `${bounds.top}px`;
  ghost.style.left = `${bounds.left}px`;
  ghost.style.width = `${bounds.width}px`;
  ghost.style.height = `${bounds.height}px`;
  ghost.style.color = bounds.color;
  ghost.style.background = bounds.background;
  ghost.style.boxSizing = "border-box";
  
  return ghost;
}

function checkCollision(rect1, rect2) {
  const r1Left = rect1.left;
  const r1Right = rect1.left + rect1.width;
  const r1Top = rect1.top;
  const r1Bottom = rect1.top + rect1.height;

  const r2Left = rect2.left;
  const r2Right = rect2.left + rect2.width;
  const r2Top = rect2.top;
  const r2Bottom = rect2.top + rect2.height;

  return !(
    r1Right < r2Left ||
    r1Left > r2Right ||
    r1Bottom < r2Top ||
    r1Top > r2Bottom
  );
}
/*
function hideElement(el, useOpacity = false) {
  if (useOpacity) {
    el.style.setProperty("opacity", "0", "important");
    el.style.setProperty("pointer-events", "none", "important");
  } else {
    el.style.setProperty("visibility", "hidden", "important");
  }
}
*/

/**
 * ============================================================================
 * SECTION B: MANDATORY SPECIFICATION COMPLIANCE CODE (FIXES)
 * ============================================================================
 */

// Member 1 Requirement: Immutable Lookup Object structure mapped to exactly 4 frames 
const AssetSpriteMap = {
  IDLE: [
    'assets/sprites/idle/frame_1.png', 'assets/sprites/idle/frame_2.png',
    'assets/sprites/idle/frame_3.png', 'assets/sprites/idle/frame_4.png'
  ],
  EATING: [
    'assets/sprites/eating/frame_1.png', 'assets/sprites/eating/frame_2.png',
    'assets/sprites/eating/frame_3.png', 'assets/sprites/eating/frame_4.png'
  ],
  HAVOC: [
    'assets/sprites/havoc/frame_1.png', 'assets/sprites/havoc/frame_2.png',
    'assets/sprites/havoc/frame_3.png', 'assets/sprites/havoc/frame_4.png'
  ]
};

let petAvatarImg = null;
let catAnimator = null;

// Member 3 Requirement: Safe Shadow DOM injection to isolate website CSS pollution [cite: 141-143, 147]
function injectPetCanvas() {
  if (document.getElementById("tabhavoc-pet-container")) return; // [cite: 142]

  const container = document.createElement("div");
  container.id = "tabhavoc-pet-container"; // [cite: 142]
  
  // Attach shadow root to enforce visual isolation boundaries 
  const shadow = container.attachShadow({ mode: "open" });

  // Baseline styling configurations inside the shadow context [cite: 145]
  const style = document.createElement("style");
  style.textContent = `
    #tabhavoc-avatar-wrapper {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      pointer-events: auto;
    }
    img { width: 100px; height: 100px; image-rendering: pixelated; }
  `;
  shadow.appendChild(style);

  const wrapper = document.createElement("div");
  wrapper.id = "tabhavoc-avatar-wrapper";

  petAvatarImg = document.createElement("img");
  petAvatarImg.id = "tabhavoc-avatar"; // [cite: 144]
  petAvatarImg.src = chrome.runtime.getURL(AssetSpriteMap.IDLE[0]); // Fallback to first frame [cite: 82, 190]

  wrapper.appendChild(petAvatarImg);
  shadow.appendChild(wrapper);
  document.documentElement.appendChild(container);

  // Initialize Member 4's frame ticker engine on instance [cite: 186]
  catAnimator = new SpriteAnimator(AssetSpriteMap);
  catAnimator.transitionToState("IDLE");
}

// Member 3 Requirement: Webpage Target Focus and Mouseover outline engine [cite: 153-158]
function activateFeedingTargetMode() {
  let activeTarget = null;

  const onMouseOver = (e) => {
    // Rule: Exclude your own custom cat avatar container from calculations 
    if (e.target.closest("#tabhavoc-pet-container")) return;

    if (activeTarget && activeTarget !== e.target) {
      activeTarget.style.outline = "";
    }
    activeTarget = e.target;
    // Apply temporary focus layout border 
    activeTarget.style.outline = "2px dashed red";
  };

  const onClickSelection = (e) => {
    if (e.target.closest("#tabhavoc-pet-container")) return;
    
    // Prevent standard routing/hyperlink redirections [cite: 157]
    e.preventDefault();
    e.stopPropagation();

    if (activeTarget) {
      activeTarget.style.outline = "";
      executeCatIngestion(activeTarget); // Route element to consumption sequence [cite: 158]
    }
    
    // Cleanup event hooks immediately following resolution [cite: 158, 160]
    document.removeEventListener("mouseover", onMouseOver, true);
    document.removeEventListener("click", onClickSelection, true);
  };

  // Enforce event capturing to cleanly intercept web structures [cite: 160]
  document.addEventListener("mouseover", onMouseOver, true);
  document.addEventListener("click", onClickSelection, true);
}

// Member 3 Requirement: Smooth hardware-accelerated target consumption pipeline [cite: 166-174]
function executeCatIngestion(targetElement) {
  // 1. Alert background script to switch tracking variables to eating state [cite: 168]
  chrome.runtime.sendMessage({ action: "REGISTER_INTERACTION", state: "EATING" });

  if (catAnimator) {
    catAnimator.transitionToState("EATING");
  }

  // 2. Hardware-accelerated smooth scale transition over exactly 800ms [cite: 169, 174]
  targetElement.style.transition = "transform 800ms ease, opacity 800ms ease";
  targetElement.style.transform = "scale(0)";
  targetElement.style.opacity = "0";

  setTimeout(() => {
    // 3. Drop node completely from structural visibility limits [cite: 170, 171]
    targetElement.style.setProperty("display", "none", "important");
    
    // 4. Reset tracker context back down to baseline vector position [cite: 172]
    if (catAnimator && catAnimator.currentState === "EATING") {
      catAnimator.transitionToState("IDLE");
    }
  }, 800); // 800ms window [cite: 169]
}

// Member 4 Requirement: Optimized framework ticking clock driver [cite: 184-193]
class SpriteAnimator {
  constructor(spriteMap) {
    this.spriteMap = spriteMap; // [cite: 187]
    this.currentState = null;
    this.currentFrameIndex = 0;
    this.clockIntervalId = null;
  }

  transitionToState(newState) { // [cite: 188]
    if (this.currentState === newState) return;

    // Garbage-collect/clear preceding intervals before running new state loops [cite: 193]
    if (this.clockIntervalId) {
      clearInterval(this.clockIntervalId);
    }

    this.currentState = newState;
    this.currentFrameIndex = 0;

    // Trigger immediate render of first frame on switch
    this.renderFrame();

    // Setup structured 200ms tick interval engine loop [cite: 189]
    this.clockIntervalId = setInterval(() => {
      this.currentFrameIndex++;
      
      const frameArray = this.spriteMap[this.currentState];
      
      if (this.currentFrameIndex >= frameArray.length) {
        // Continuous loop mechanics for IDLE and HAVOC vectors [cite: 191]
        if (this.currentState === "IDLE" || this.currentState === "HAVOC") {
          this.currentFrameIndex = 0;
        } 
        // Finite "play-once" constraint for the EATING sequence [cite: 191]
        else if (this.currentState === "EATING") {
          clearInterval(this.clockIntervalId);
          this.currentState = "IDLE";
          this.currentFrameIndex = 0;
          this.transitionToState("IDLE");
          return;
        }
      }
      this.renderFrame();
    }, 200); // 200ms per frame [cite: 189]
  }

  renderFrame() {
    if (!petAvatarImg) return;
    const path = this.spriteMap[this.currentState][this.currentFrameIndex];
    // Alter target image node src attribute to map paths dynamically [cite: 190]
    petAvatarImg.src = chrome.runtime.getURL(path);
  }
}

/**
 * ============================================================================
 * SECTION C: CONTEXT ROUTING MESSAGE INTERCEPTORS
 * ============================================================================
 */

// Route external actions (Popup clicks or Havoc alerts) across contexts [cite: 127, 128, 206, 207]
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "TRIGGER_FEEDING_SELECTION") {
    activateFeedingTargetMode(); // [cite: 207]
  } else if (request.action === "EXECUTE_HAVOC_ANIMATION") {
    if (catAnimator) catAnimator.transitionToState("HAVOC"); // [cite: 128]
  }
});

// Run UI initialization layout on Document Load [cite: 141]
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectPetCanvas);
} else {
  injectPetCanvas();
}
