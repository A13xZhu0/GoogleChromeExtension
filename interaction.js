/**
 * Initializes a self-contained pointer long-press listener.
 * @param {Function} callback - Function called with the target element when a long-press is triggered.
 * @param {number} [duration=500] - Duration in milliseconds to trigger the long-press.
 */
function initLongPress(callback, duration = 500) {
  let timer = null;
  let startX = 0;
  let startY = 0;
  const moveThreshold = 10; // Maximum allowed pointer movement in pixels

  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return; // Only trigger for primary pointer button

    const target = e.target;
    startX = e.clientX;
    startY = e.clientY;

    timer = setTimeout(() => {
      callback(target);
      timer = null;
    }, duration);
  });

  document.addEventListener("pointermove", (e) => {
    if (!timer) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.hypot(dx, dy) > moveThreshold) {
      clearTimeout(timer);
      timer = null;
    }
  });

  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  document.addEventListener("pointerup", cancel);
  document.addEventListener("pointercancel", cancel);
}
