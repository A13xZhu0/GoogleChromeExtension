/**
 * ============================================================================
 * SECTION A: YOUR EXISTING POSITION & COLLISION UTILITIES
 * ============================================================================
 */

function ensureOverlay() {
  if (!document.getElementById("nekobyte-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "nekobyte-overlay";
    document.body.appendChild(overlay);
  }
}

function hideElement(el, useOpacity = false) {
  if (useOpacity) {
    el.style.opacity = "0 !important";
    el.style.pointerEvents = "none !important";
  } else {
    el.style.visibility = "hidden !important";
  }
}

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

  return !(r1Right < r2Left || r1Left > r2Right || r1Bottom < r2Top || r1Top > r2Bottom);
}


/**
 * ============================================================================
 * SECTION B: MANDATORY SPECIFICATION COMPLIANCE CODE
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

// Safe wrapper utility to insulate against runtime context errors
const getSafeExtensionUrl = (path) => {
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
    try {
      return chrome.runtime.getURL(path);
    } catch (e) {
      console.warn("Chrome runtime address fetching faulted:", e);
    }
  }
  return path;
};

let petAvatarImg = null;
let catAnimator = null;

// Member 3 Requirement: Safe Shadow DOM injection to isolate website CSS pollution
function injectPetCanvas() {
  if (document.getElementById("tabhavoc-pet-container")) return; 

  const container = document.createElement("div");
  container.id = "tabhavoc-pet-container";
  
  // Attach shadow root to enforce visual isolation boundaries
  const shadow = container.attachShadow({ mode: "open" });

  // Baseline styling configurations inside the shadow context
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
  petAvatarImg.id = "tabhavoc-avatar";
  petAvatarImg.src = getSafeExtensionUrl(AssetSpriteMap.IDLE[0]); 

  wrapper.appendChild(petAvatarImg);
  shadow.appendChild(wrapper);
  document.documentElement.appendChild(container);

  // Initialize Member 4's frame ticker engine on instance
  catAnimator = new SpriteAnimator(AssetSpriteMap);
  catAnimator.transitionToState("IDLE");
}

// Member 3 Requirement: Webpage Target Focus and Mouseover outline engine
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
    
    // Prevent standard routing/hyperlink redirections
    e.preventDefault();
    e.stopPropagation();

    if (activeTarget) {
      activeTarget.style.outline = "";
      executeCatIngestion(activeTarget); // Route element to consumption sequence
    }
    
    // Cleanup event hooks immediately following resolution
    document.removeEventListener("mouseover", onMouseOver, true);
    document.removeEventListener("click", onClickSelection, true);
  };

  // Enforce event capturing to cleanly intercept web structures
  document.addEventListener("mouseover", onMouseOver, true);
  document.addEventListener("click", onClickSelection, true);
}

// Member 3 Requirement: Smooth hardware-accelerated target consumption pipeline
function executeCatIngestion(targetElement) {
  // 1. Alert background script to switch tracking variables to eating state
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ action: "REGISTER_INTERACTION", state: "EATING" }).catch(() => {});
  }

  if (catAnimator) {
    catAnimator.transitionToState("EATING");
  }

  // 2. Hardware-accelerated smooth scale transition over exactly 800ms
  targetElement.style.transition = "transform 800ms ease, opacity 800ms ease";
  targetElement.style.transform = "scale(0)";
  targetElement.style.opacity = "0";

  setTimeout(() => {
    // 3. Drop node completely from structural visibility limits
    targetElement.style.setProperty("display", "none", "important");
    
    // 4. Reset tracker context back down to baseline vector position
    if (catAnimator && catAnimator.currentState === "EATING") {
      catAnimator.transitionToState("IDLE");
    }
  }, 800); 
}

// Member 4 Requirement: Optimized framework ticking clock driver
class SpriteAnimator {
  constructor(spriteMap) {
    this.spriteMap = spriteMap;
    this.currentState = null;
    this.currentFrameIndex = 0;
    this.clockIntervalId = null;
  }

  transitionToState(newState) { 
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
    }, 200); 
  }

  renderFrame() {
    if (!petAvatarImg) return;
    const path = this.spriteMap[this.currentState][this.currentFrameIndex];
    petAvatarImg.src = getSafeExtensionUrl(path);
  }
} // <-- This completely and cleanly closes the SpriteAnimator class!

/**
 * ============================================================================
 * SECTION C: CONTEXT ROUTING MESSAGE INTERCEPTORS
 * ============================================================================
 */

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "TRIGGER_FEEDING_SELECTION") {
      activateFeedingTargetMode(); 
    } else if (request.action === "EXECUTE_HAVOC_ANIMATION") {
      if (catAnimator) catAnimator.transitionToState("HAVOC"); 
    }
  });
}

// Run UI initialization layout on Document Load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectPetCanvas);
} else {
  injectPetCanvas();
}
