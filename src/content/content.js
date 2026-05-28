function ensureOverlay() {
  if (!document.getElementById("nekobyte-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "nekobyte-overlay";
    document.body.appendChild(overlay);
  }
}

ensureOverlay();

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

function hideElement(el, useOpacity = false) {
  if (useOpacity) {
    el.style.setProperty("opacity", "0", "important");
    el.style.setProperty("pointer-events", "none", "important");
  } else {
    el.style.setProperty("visibility", "hidden", "important");
  }
}
