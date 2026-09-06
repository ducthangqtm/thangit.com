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
   MOBILE PULL TO REFRESH
   ========================================================================== */
function initPullToRefresh() {
  let startY = 0;
  let isPulling = false;
  const indicator = document.getElementById('pwa-pull-indicator');

  window.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].clientY;
      isPulling = true;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isPulling || !indicator) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 50) {
      indicator.style.display = 'flex';
      indicator.style.transform = `translateX(-50%) translateY(${Math.min(diff - 50, 40)}px)`;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!isPulling) return;
    isPulling = false;
    if (indicator) {
      indicator.style.display = 'none';
      indicator.style.transform = 'translateX(-50%) translateY(0)';
    }
  });
}
