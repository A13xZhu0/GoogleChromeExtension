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
    background: style.background
  };
}
