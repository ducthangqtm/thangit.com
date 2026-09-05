/**
 * THANGIT.COM — Shared Core Utilities
 * 100% Client-Side • Vanilla JavaScript (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initAnimatedFavicon();
  initServiceWorker();
  initPullToRefresh();
  initPWAInstallPrompt();
  initAvatarProfileToggle();
  initSpringboardFilter();
});

/* ==========================================================================
   INTERACTIVE AVATAR & PERSONAL INFO TOGGLE
   ========================================================================== */
function initAvatarProfileToggle() {
  const defaultView = document.getElementById('profile-hero-default');
  const expandedView = document.getElementById('profile-hero-expanded');
  const btnExpand = document.getElementById('btn-avatar-expand');
  const btnClose = document.getElementById('btn-close-expanded');
  const btnCollapse = document.getElementById('btn-avatar-collapse');
  const btnCollapseHint = document.getElementById('btn-avatar-collapse-hint');

  if (!btnExpand || !expandedView || !defaultView) return;

  function openProfile() {
    defaultView.style.display = 'none';
    expandedView.style.display = 'block';
  }

  function closeProfile() {
    expandedView.style.display = 'none';
    defaultView.style.display = 'block';
  }

  btnExpand.addEventListener('click', (e) => {
    e.stopPropagation();
    openProfile();
  });

  btnExpand.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProfile();
    }
  });

  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeProfile();
    });
  }

  if (btnCollapse) {
    btnCollapse.addEventListener('click', (e) => {
      e.stopPropagation();
      closeProfile();
    });
    btnCollapse.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeProfile();
      }
    });
  }

  if (btnCollapseHint) {
    btnCollapseHint.addEventListener('click', (e) => {
      e.stopPropagation();
      closeProfile();
    });
    btnCollapseHint.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeProfile();
      }
    });
  }
}

/* ==========================================================================
   SPRINGBOARD CATEGORY FILTER TABS
   ========================================================================== */
function initSpringboardFilter() {
  const tabContainer = document.getElementById('springboard-filter-tabs');
  if (!tabContainer) return;

  const buttons = tabContainer.querySelectorAll('.filter-tab-btn');
  const categoryGroups = document.querySelectorAll('.ios-category-group');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-category');

      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      categoryGroups.forEach((group) => {
        const groupCategory = group.getAttribute('data-category-group');
        if (selectedCategory === 'all' || groupCategory === selectedCategory) {
          group.classList.remove('hidden-category');
        } else {
          group.classList.add('hidden-category');
        }
      });
    });
  });
}

/* ==========================================================================
   VISITOR EDGE & IP BADGE (HOMEPAGE)
   ========================================================================== */
async function initVisitorBadge() {
  const homeIp = document.getElementById('home-visitor-ip');
  const homeNode = document.getElementById('home-visitor-node');
  const homeProto = document.getElementById('home-visitor-proto');

  if (!homeIp) return;

  function applyNetworkData(ip, colo, http) {
    if (homeIp) homeIp.textContent = ip;
    if (homeNode) homeNode.textContent = colo ? `${colo} Edge` : 'HAN Edge';
    const displayHttp = (http || 'HTTP/3').toUpperCase();
    if (homeProto) homeProto.textContent = displayHttp;
  }

  try {
    const res = await fetch('/cdn-cgi/trace');
    if (res.ok) {
      const text = await res.text();
      const lines = text.split('\n');
      const data = {};
      lines.forEach(line => {
        const [k, v] = line.split('=');
        if (k && v) data[k.trim()] = v.trim();
      });

      if (data.ip) {
        applyNetworkData(data.ip, data.colo, data.http);
        return;
      }
    }
  } catch (err) {}

  try {
    const fallbackRes = await fetch('https://api.ipify.org?format=json');
    const fallbackData = await fallbackRes.json();
    applyNetworkData(fallbackData.ip || '127.0.0.1', 'HAN', 'HTTP/3');
  } catch {
    applyNetworkData('192.168.1.1', 'HAN', 'HTTP/3');
  }
}

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

  const btnCopyIp = document.getElementById('btn-copy-ip-val');
  if (btnCopyIp) {
    btnCopyIp.addEventListener('click', () => {
      const ip = document.getElementById('inspector-ip')?.textContent;
      if (ip) {
        navigator.clipboard.writeText(ip).then(() => {
          showToast(`📋 Đã sao chép IP: <strong>${ip}</strong>`);
        });
      }
    });
  }

  const btnCopyHomeIp = document.getElementById('btn-copy-home-ip');
  if (btnCopyHomeIp) {
    btnCopyHomeIp.addEventListener('click', (e) => {
      e.stopPropagation();
      const ip = document.getElementById('home-visitor-ip')?.textContent;
      if (ip && !ip.includes('Đang phân tích')) {
        navigator.clipboard.writeText(ip).then(() => {
          showToast(`📋 Đã sao chép IP của bạn: <strong>${ip}</strong>`);
        }).catch(() => {
          showToast(`📋 Đã sao chép IP: ${ip}`);
        });
      }
    });
  }

  const btnCopyPwd = document.getElementById('btn-copy-pwd');
  if (btnCopyPwd) {
    btnCopyPwd.addEventListener('click', () => {
      const pwd = document.getElementById('pwd-result')?.textContent;
      if (pwd) {
        navigator.clipboard.writeText(pwd).then(() => {
          showToast(`🔐 Đã sao chép mật khẩu an toàn!`);
        });
      }
    });
  }

  const btnDiscord = document.getElementById('btn-discord-link');
  if (btnDiscord) {
    btnDiscord.addEventListener('click', () => {
      navigator.clipboard.writeText('ducthangqtm').catch(() => {});
      showToast('🚀 Đang mở Discord & đã sao chép username: <strong>ducthangqtm</strong>');
    });
  }
}

/* ==========================================================================
   PWA & SERVICE WORKER
   ========================================================================== */
function initPWAInstallPrompt() {
  let deferredPrompt = null;
  const btnTopbar = document.getElementById('btn-topbar-install');
  const btnBanner = document.getElementById('btn-banner-install');
  const banner = document.getElementById('pwa-install-banner');

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (isStandalone) {
    if (banner) banner.style.display = 'none';
    if (btnTopbar) btnTopbar.style.display = 'none';
    return;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (banner) banner.style.display = 'flex';
    if (btnTopbar) btnTopbar.style.display = 'inline-flex';
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (banner) banner.style.display = 'none';
    if (btnTopbar) btnTopbar.style.display = 'none';
    showToast('🎉 Đã ghim App TiT ra màn hình thành công!');
  });

  async function handleInstallClick(e) {
    if (e) e.preventDefault();

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        if (banner) banner.style.display = 'none';
        if (btnTopbar) btnTopbar.style.display = 'none';
      }
      deferredPrompt = null;
    } else {
      const modal = document.getElementById('modal-ios-install');
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }
  }

  if (btnTopbar) btnTopbar.addEventListener('click', handleInstallClick);
  if (btnBanner) btnBanner.addEventListener('click', handleInstallClick);

  const installModal = document.getElementById('modal-ios-install');
  if (installModal) {
    installModal.querySelectorAll('[data-close="modal-ios-install"], .modal-backdrop').forEach(el => {
      el.addEventListener('click', () => {
        installModal.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const updateToast = document.getElementById('pwa-update-toast');
  const updateBtn = document.getElementById('btn-pwa-update');
  let newWorker = null;

  navigator.serviceWorker.register('/sw.js').then((reg) => {
    reg.addEventListener('updatefound', () => {
      newWorker = reg.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            if (updateToast) updateToast.classList.add('show');
          }
        });
      }
    });
  }).catch(() => {});

  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      if (newWorker) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
      }
      setTimeout(() => {
        window.location.reload();
      }, 200);
    });
  }

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

function initPullToRefresh() {
  const indicator = document.getElementById('pwa-pull-indicator');
  const refreshBtn = document.getElementById('btn-pwa-refresh');
  const brandLink = document.getElementById('brand-link');

  function triggerReload() {
    if (indicator) {
      indicator.classList.add('refreshing');
      indicator.style.transform = 'translateX(-50%) translateY(20px)';
      indicator.classList.add('visible');
    }
    if (refreshBtn) {
      refreshBtn.classList.add('spinning');
    }
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerReload();
    });
  }

  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        e.preventDefault();
        if (window.scrollY < 20) {
          triggerReload();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }
}

/* ==========================================================================
   FAVICON RADAR ANIMATION
   ========================================================================== */
function initAnimatedFavicon() {
  let faviconLink = document.querySelector('link[rel="icon"]');
  if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    document.head.appendChild(faviconLink);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let waveRadius = 2.0;
  let animTimer = null;

  function drawFaviconFrame() {
    ctx.clearRect(0, 0, 32, 32);

    // Frame
    ctx.fillStyle = '#0b1320';
    ctx.beginPath();
    ctx.roundRect(1, 1, 30, 30, 7);
    ctx.fill();

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(1, 1, 30, 30, 7);
    ctx.stroke();

    // Radar Wave
    waveRadius += 0.35;
    if (waveRadius > 10.5) waveRadius = 2.0;
    const alpha = Math.max(0, 1 - (waveRadius - 2.0) / 8.5);

    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha.toFixed(2)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(16, 9.5, waveRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Beacon Core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(16, 9.5, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Letters T i T
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(5.5, 14.5); ctx.lineTo(12.5, 14.5);
    ctx.moveTo(9, 14.5);    ctx.lineTo(9, 24);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(16, 17);    ctx.lineTo(16, 24);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(19.5, 14.5); ctx.lineTo(26.5, 14.5);
    ctx.moveTo(23, 14.5);   ctx.lineTo(23, 24);
    ctx.stroke();

    faviconLink.href = canvas.toDataURL('image/png');
  }

  function startFaviconLoop() {
    if (!animTimer) {
      animTimer = setInterval(drawFaviconFrame, 120);
    }
  }

  function stopFaviconLoop() {
    if (animTimer) {
      clearInterval(animTimer);
      animTimer = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopFaviconLoop();
    else startFaviconLoop();
  });

  startFaviconLoop();
}
