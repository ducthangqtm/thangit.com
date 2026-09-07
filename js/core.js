/**
 * THANGIT.COM — Shared Core Utilities
 * 100% Client-Side • Vanilla JavaScript (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initAnimatedFavicon();
  initServiceWorker();
  initPullToRefresh();
});

/* ==========================================================================
   TOAST NOTIFICATION & COPY HELPER
   ========================================================================== */
function showToast(msg) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-copy');
      if (!val) return;

      navigator.clipboard.writeText(val).then(() => {
        showToast(`📋 Đã sao chép: <strong>${val}</strong>`);
      }).catch(() => {
        showToast(`📋 Đã sao chép!`);
      });
    });
  });

  const btnDiscord = document.getElementById('btn-discord-action') || document.getElementById('btn-discord-link');
  if (btnDiscord) {
    btnDiscord.addEventListener('click', () => {
      navigator.clipboard.writeText('ducthangqtm').catch(() => {});
      showToast('🚀 Đang mở Discord & đã sao chép username: <strong>ducthangqtm</strong>');
    });
  }
}

/* ==========================================================================
   SERVICE WORKER REGISTRATION & UPDATE
   ========================================================================== */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showToast('⚡ Đã cập nhật phiên bản mới!');
              }
            });
          }
        });
      }).catch(() => {});
    });
  }
}

/* ==========================================================================
   ANIMATED DYNAMIC SVG FAVICON
   ========================================================================== */
function initAnimatedFavicon() {
  const favicon = document.querySelector("link[rel*='icon']");
  if (!favicon) return;

  let step = 0;
  setInterval(() => {
    step = (step + 1) % 360;
  }, 1000);
}

/* ==========================================================================
/* ==========================================================================
   MOBILE PULL TO REFRESH (PWA & STANDALONE SUPPORT)
   ========================================================================== */
function initPullToRefresh() {
  const ptr = document.getElementById('ptr-indicator');
  const appContainer = document.querySelector('.app-container');
  if (!ptr || !appContainer) return;

  const ptrText = ptr.querySelector('.ptr-text');
  let startY = 0;
  let startX = 0;
  let currentY = 0;
  let isDragging = false;
  let isRefreshing = false;
  let canPull = false;

  const THRESHOLD = 65; // Distance in px to trigger refresh
  const MAX_PULL = 95;  // Max visual travel distance

  function isPageAtTop() {
    return (window.scrollY || document.documentElement.scrollTop || 0) <= 0;
  }

  function handleTouchStart(e) {
    if (isRefreshing) return;
    if (isPageAtTop()) {
      canPull = true;
      const touch = e.touches[0];
      startY = touch.clientY;
      startX = touch.clientX;
      currentY = startY;
      isDragging = false;

      ptr.style.transition = 'none';
      appContainer.style.transition = 'none';
    } else {
      canPull = false;
    }
  }

  function handleTouchMove(e) {
    if (isRefreshing || !canPull) return;

    if (!isPageAtTop()) {
      if (isDragging) resetPTR();
      canPull = false;
      return;
    }

    const touch = e.touches[0];
    currentY = touch.clientY;
    const diffY = currentY - startY;
    const diffX = touch.clientX - startX;

    // Downward drag predominantly vertical
    if (diffY > 8 && Math.abs(diffY) > Math.abs(diffX) * 1.2) {
      isDragging = true;
      if (e.cancelable) {
        e.preventDefault(); // Prevent iOS rubber-banding
      }

      const pullDist = Math.min(diffY * 0.42, MAX_PULL);
      const indicatorOffset = pullDist - 65;

      ptr.style.transform = `translateX(-50%) translateY(${indicatorOffset}px)`;
      ptr.style.opacity = Math.min(1, pullDist / 35).toString();

      // Elastic content pull
      appContainer.style.transform = `translateY(${pullDist * 0.35}px)`;

      if (pullDist >= THRESHOLD) {
        if (!ptr.classList.contains('ptr-ready')) {
          ptr.classList.add('ptr-ready');
          if (ptrText) ptrText.textContent = 'Thả ra để làm mới';
          if (navigator.vibrate) {
            try { navigator.vibrate(12); } catch (_) {}
          }
        }
      } else {
        if (ptr.classList.contains('ptr-ready')) {
          ptr.classList.remove('ptr-ready');
          if (ptrText) ptrText.textContent = 'Kéo để làm mới';
        }
      }
    }
  }

  function handleTouchEnd() {
    if (!isDragging || isRefreshing) {
      canPull = false;
      return;
    }
    isDragging = false;
    canPull = false;

    const diffY = currentY - startY;
    const pullDist = Math.min(diffY * 0.42, MAX_PULL);

    if (pullDist >= THRESHOLD) {
      triggerRefresh();
    } else {
      resetPTR();
    }
  }

  function resetPTR() {
    ptr.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s ease';
    appContainer.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    ptr.style.transform = 'translateX(-50%) translateY(-80px)';
    ptr.style.opacity = '0';
    appContainer.style.transform = 'translateY(0)';
    ptr.classList.remove('ptr-ready');
    if (ptrText) ptrText.textContent = 'Kéo để làm mới';
  }

  async function triggerRefresh() {
    isRefreshing = true;
    ptr.classList.remove('ptr-ready');
    ptr.classList.add('ptr-refreshing');
    if (ptrText) ptrText.textContent = 'Đang làm mới...';

    ptr.style.transition = 'transform 0.25s ease';
    appContainer.style.transition = 'transform 0.25s ease';
    ptr.style.transform = 'translateX(-50%) translateY(14px)';
    ptr.style.opacity = '1';
    appContainer.style.transform = 'translateY(40px)';

    // Clear caches
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch (_) {}

    // Reload bypassing cache
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('_r', Date.now().toString());
      window.location.replace(url.toString());
    }, 450);
  }

  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
  window.addEventListener('touchcancel', resetPTR, { passive: true });
}
