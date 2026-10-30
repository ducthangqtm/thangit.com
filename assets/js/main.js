/**
 * thangit.com
 * Vanilla JavaScript: Starfield Neon Space Animation
 */

/* ==========================================================================
   STARFIELD CANVAS ANIMATION (CYBERPUNK NEON SPACE)
   ========================================================================== */
(function initStars() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0;
  let height = 0;
  let animationFrameId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.min(Math.floor((width * height) / 12000), 75);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.3,
        color: Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(168, 85, 247, ',
        alpha: Math.random() * 0.7 + 0.15,
        speed: Math.random() * 0.18 + 0.04,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += s.speed * 0.015 * s.direction;
      if (s.alpha > 0.85) { s.alpha = 0.85; s.direction = -1; }
      if (s.alpha < 0.15) { s.alpha = 0.15; s.direction = 1; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color + s.alpha + ')';
      ctx.shadowBlur = 4;
      ctx.shadowColor = s.color + '0.5)';
      ctx.fill();
    }
    animationFrameId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  render();

  // Pause when tab is hidden to conserve battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      render();
    }
  });
})();
