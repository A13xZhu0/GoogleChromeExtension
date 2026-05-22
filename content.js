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
