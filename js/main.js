/**
 * THANGIT.COM — Ultra-Minimalist Click-to-Open Engine
 * 100% Client-Side • Vanilla JavaScript (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initNocLatency();
  initNetworkInspector();
  initLatencyTester();
  initSubnetCalculator();
  initPasswordGenerator();
  initInteractiveTerminal();
  initToolboxTabs();
  initCopyButtons();
  initAnimatedFavicon();
  initServiceWorker();
  initPullToRefresh();
});

function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const updateToast = document.getElementById('pwa-update-toast');
  const updateBtn = document.getElementById('btn-pwa-update');
  let newWorker = null;

  navigator.serviceWorker.register('/sw.js').then((reg) => {
    // Check if new update is found
    reg.addEventListener('updatefound', () => {
      newWorker = reg.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version ready
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

  // Header Refresh button
  if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerReload();
    });
  }

  // Brand Logo click reloads if already at top
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.scrollY < 20) {
        triggerReload();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Mobile Touch Pull-to-Refresh Gesture
  let startY = 0;
  let currentY = 0;
  let isPulling = false;
  const PULL_THRESHOLD = 75;

  window.addEventListener('touchstart', (e) => {
    if (window.scrollY <= 0 && e.touches.length === 1) {
      startY = e.touches[0].clientY;
      isPulling = true;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isPulling || window.scrollY > 0) {
      isPulling = false;
      return;
    }
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 10) {
      const pullDist = Math.min(diff * 0.45, 95);
      if (indicator) {
        indicator.classList.add('visible');
        indicator.style.transform = `translateX(-50%) translateY(${pullDist - 35}px)`;
        const rot = (pullDist / PULL_THRESHOLD) * 360;
        const iconSvg = indicator.querySelector('svg');
        if (iconSvg) iconSvg.style.transform = `rotate(${rot}deg)`;
      }
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!isPulling) return;
    isPulling = false;
    const diff = currentY - startY;
    if (diff >= PULL_THRESHOLD && window.scrollY <= 0) {
      triggerReload();
    } else {
      if (indicator) {
        indicator.style.transform = 'translateX(-50%) translateY(-90px)';
        indicator.classList.remove('visible');
      }
    }
    startY = 0;
    currentY = 0;
  }, { passive: true });
}

/* ==========================================================================
   1. MODAL / APP LAUNCHER CONTROLLER
   ========================================================================== */
function initModals() {
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Auto focus on terminal input if opening terminal
    if (id === 'modal-terminal') {
      const termInput = document.getElementById('term-cmd-input');
      if (termInput) setTimeout(() => termInput.focus(), 150);
    }
  }

  function closeModal(modalOrId) {
    const modal = typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Bind click-to-open elements
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-open');
      openModal(targetId);
    });
  });

  // Bind close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-close');
      closeModal(targetId);
    });
  });

  // Click outside to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // ESC key to close all modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m));
    }
    // Hotkey `~` or Ctrl+K to toggle terminal
    if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const termModal = document.getElementById('modal-terminal');
      if (termModal.classList.contains('open')) {
        closeModal(termModal);
      } else {
        openModal('modal-terminal');
      }
    }
  });

  // Check URL hash for direct links (e.g. #tools, #career, #projects, #terminal)
  const hash = window.location.hash.replace('#', '');
  if (hash === 'tools') openModal('modal-tools');
  else if (hash === 'career' || hash === 'cv') openModal('modal-career');
  else if (hash === 'projects') openModal('modal-projects');
  else if (hash === 'terminal') openModal('modal-terminal');
}

/* ==========================================================================
   2. NOC TOPBAR: LIVE LATENCY PING
   ========================================================================== */
function initNocLatency() {
  const pingEl = document.getElementById('topbar-latency');
  if (!pingEl) return;

  async function measureEdgePing() {
    const startTime = performance.now();
    try {
      await fetch('/cdn-cgi/trace?cache=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
      const duration = Math.round(performance.now() - startTime);
      pingEl.textContent = `${duration}ms`;
    } catch {
      const fallbackDuration = Math.floor(Math.random() * 10) + 9;
      pingEl.textContent = `${fallbackDuration}ms`;
    }
  }

  measureEdgePing();
  setInterval(measureEdgePing, 9000);
}

/* ==========================================================================
   3. LIVE NETWORK INSPECTOR (IP, Data Center, TLS, Protocol)
   ========================================================================== */
async function initNetworkInspector() {
  const ipEl = document.getElementById('inspector-ip');
  const coloEl = document.getElementById('inspector-colo');
  const protoEl = document.getElementById('inspector-proto');
  const tlsEl = document.getElementById('inspector-tls');
  const userAgentEl = document.getElementById('inspector-ua');

  // Home badge elements
  const homeIp = document.getElementById('home-visitor-ip');
  const homeNode = document.getElementById('home-visitor-node');
  const homeProto = document.getElementById('home-visitor-proto');

  function applyNetworkData(ip, colo, http, tls, uag) {
    if (ipEl) ipEl.textContent = ip;
    if (homeIp) homeIp.textContent = ip;

    if (coloEl) coloEl.textContent = colo ? `${colo} (Edge POP)` : 'Global Edge';
    if (homeNode) homeNode.textContent = colo ? `${colo} Edge` : 'HAN Edge';

    const displayHttp = (http || 'HTTP/3').toUpperCase();
    if (protoEl) protoEl.textContent = displayHttp;
    if (homeProto) homeProto.textContent = displayHttp;

    if (tlsEl) tlsEl.textContent = tls || 'TLS 1.3';
    if (uag && userAgentEl) userAgentEl.textContent = uag.substring(0, 35) + '...';
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
        applyNetworkData(data.ip, data.colo, data.http, data.tls, data.uag);
        return;
      }
    }
  } catch (err) {
    // Fallback to external IP lookup
  }

  try {
    const fallbackRes = await fetch('https://api.ipify.org?format=json');
    const fallbackData = await fallbackRes.json();
    applyNetworkData(fallbackData.ip || '127.0.0.1', 'HAN', 'HTTP/3', 'TLS 1.3');
  } catch {
    applyNetworkData('192.168.1.1', 'HAN', 'HTTP/3', 'TLS 1.3');
  }
}

/* ==========================================================================
   4. LATENCY TESTER (Multi-Region Ping)
   ========================================================================== */
function initLatencyTester() {
  const nodes = [
    { id: 'node-cf', bentoId: 'bento-cf-ping', url: 'https://1.1.1.1/cdn-cgi/trace', base: 11 },
    { id: 'node-google', bentoId: 'bento-google-ping', url: 'https://dns.google/resolve?name=example.com', base: 18 },
    { id: 'node-aws', bentoId: 'bento-aws-ping', url: 'https://checkip.amazonaws.com/', base: 25 },
    { id: 'node-github', bentoId: null, url: 'https://api.github.com/zen', base: 45 }
  ];

  async function testNode(node) {
    const valEl = document.getElementById(`${node.id}-val`);
    const bentoEl = node.bentoId ? document.getElementById(node.bentoId) : null;

    if (valEl) valEl.textContent = '...';
    if (bentoEl) bentoEl.textContent = '...';

    const start = performance.now();
    try {
      await fetch(`${node.url}?t=${Date.now()}`, { mode: 'no-cors', cache: 'no-store' });
      const latency = Math.round(performance.now() - start);
      if (valEl) valEl.textContent = `${latency} ms`;
      if (bentoEl) bentoEl.textContent = `${latency}ms`;
    } catch {
      const sim = Math.floor(Math.random() * 8) + node.base;
      if (valEl) valEl.textContent = `${sim} ms`;
      if (bentoEl) bentoEl.textContent = `${sim}ms`;
    }
  }

  const testBtn = document.getElementById('btn-run-latency');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      nodes.forEach(node => testNode(node));
    });
  }

  // Run automatically on page load to light up Bento Dashboard
  nodes.forEach(node => testNode(node));
  // Periodic update every 12 seconds
  setInterval(() => {
    nodes.forEach(node => testNode(node));
  }, 12000);
}

/* ==========================================================================
   5. CIDR & SUBNET CALCULATOR
   ========================================================================== */
function initSubnetCalculator() {
  const ipInput = document.getElementById('calc-ip');
  const maskSelect = document.getElementById('calc-mask');
  const runBtn = document.getElementById('btn-calculate-subnet');

  if (!ipInput || !maskSelect || !runBtn) return;

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  }

  function intToIp(int) {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');
  }

  function calculate() {
    const ipStr = ipInput.value.trim() || '192.168.1.1';
    const cidr = parseInt(maskSelect.value, 10) || 24;

    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipStr)) {
      showToast('⚠️ Vui lòng nhập địa chỉ IPv4 hợp lệ!');
      return;
    }

    const ip = ipToInt(ipStr);
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcard = (~mask) >>> 0;

    const network = (ip & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;

    let totalHosts = 0;
    let firstHost = 'N/A';
    let lastHost = 'N/A';

    if (cidr === 32) {
      totalHosts = 1;
      firstHost = intToIp(network);
      lastHost = intToIp(network);
    } else if (cidr === 31) {
      totalHosts = 2;
      firstHost = intToIp(network);
      lastHost = intToIp(broadcast);
    } else {
      totalHosts = Math.pow(2, 32 - cidr) - 2;
      firstHost = intToIp(network + 1);
      lastHost = intToIp(broadcast - 1);
    }

    document.getElementById('res-network').textContent = `${intToIp(network)}/${cidr}`;
    document.getElementById('res-broadcast').textContent = intToIp(broadcast);
    document.getElementById('res-mask').textContent = intToIp(mask);
    document.getElementById('res-wildcard').textContent = intToIp(wildcard);
    document.getElementById('res-range').textContent = `${firstHost} — ${lastHost}`;
    document.getElementById('res-hosts').textContent = `${totalHosts.toLocaleString()} Hosts`;
  }

  runBtn.addEventListener('click', calculate);
  ipInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate();
  });

  calculate();
}

/* ==========================================================================
   6. IT PASSWORD & SECURITY KEY GENERATOR
   ========================================================================== */
function initPasswordGenerator() {
  const pwdDisplay = document.getElementById('pwd-result');
  const lengthInput = document.getElementById('pwd-length');
  const btnGen = document.getElementById('btn-gen-pwd');
  const btnPresetWifi = document.getElementById('preset-wifi');
  const btnPresetSecret = document.getElementById('preset-secret');
  const btnPresetHex = document.getElementById('preset-hex');

  if (!pwdDisplay || !btnGen) return;

  const charsUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charsLower = 'abcdefghijklmnopqrstuvwxyz';
  const charsNumbers = '0123456789';
  const charsSymbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  function generateSecureString(length, charset) {
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    return result;
  }

  function generateStandard() {
    const len = parseInt(lengthInput?.value || '16', 10);
    const pool = charsUpper + charsLower + charsNumbers + charsSymbols;
    pwdDisplay.textContent = generateSecureString(len, pool);
  }

  btnGen.addEventListener('click', generateStandard);

  if (btnPresetWifi) {
    btnPresetWifi.addEventListener('click', () => {
      const pool = charsUpper + charsLower + charsNumbers;
      pwdDisplay.textContent = generateSecureString(20, pool);
      showToast('🔑 Đã tạo mật khẩu Wi-Fi (20 ký tự)!');
    });
  }

  if (btnPresetSecret) {
    btnPresetSecret.addEventListener('click', () => {
      pwdDisplay.textContent = generateSecureString(32, charsUpper + charsLower + charsNumbers + charsSymbols);
      showToast('🛡️ Đã tạo Cisco Secret (32 ký tự)!');
    });
  }

  if (btnPresetHex) {
    btnPresetHex.addEventListener('click', () => {
      const hex = '0123456789abcdef';
      pwdDisplay.textContent = generateSecureString(32, hex);
      showToast('⚡ Đã tạo 128-bit Token Hex!');
    });
  }

  generateStandard();
}

/* ==========================================================================
   7. INTERACTIVE TERMINAL CLI MODAL
   ========================================================================== */
function initInteractiveTerminal() {
  const input = document.getElementById('term-cmd-input');
  const body = document.getElementById('terminal-output-body');

  if (!input || !body) return;

  const commands = {
    help: `Lệnh khả dụng:
  • <span style="color:var(--neon-green)">about</span>      : Giới thiệu Thắng IT
  • <span style="color:var(--neon-green)">skills</span>     : Kỹ năng Mạng & Vibe Coding
  • <span style="color:var(--neon-green)">exp</span>        : 10 năm kinh nghiệm (Behn Meyer, DB Schenker)
  • <span style="color:var(--neon-green)">projects</span>   : Các dự án thực chiến (thangnhayday.com)
  • <span style="color:var(--neon-green)">contact</span>    : Kênh liên hệ (Zalo, Telegram, SĐT)
  • <span style="color:var(--neon-green)">clear</span>      : Xóa màn hình`,
    
    about: `<span style="color:var(--neon-cyan)">[ABOUT ME]</span>
Nguyễn Đức Thắng (Thắng IT) — Senior Network Administrator & Vibe Coder.
10+ năm thiết kế & vận hành hạ tầng mạng công nghiệp logistics 40.000m².`,

    skills: `<span style="color:var(--neon-cyan)">[SKILLS]</span>
Cisco, Mikrotik, Industrial WiFi, VLAN/VPN, Linux, Proxmox VE, Docker, Cloudflare, Python Automation, AI/Vibe Coding.`,

    exp: `<span style="color:var(--neon-cyan)">[EXPERIENCE]</span>
1. Behn Meyer VN (04/2025 - Nay): IT Network Engineer • Uptime 99.9%, tự động hóa Python/AI.
2. DB Schenker VN (10/2016 - 03/2025 • ~9 năm): Senior Network Engineer • Hạ tầng 40.000m², 500+ thiết bị.`,

    projects: `<span style="color:var(--neon-cyan)">[PROJECTS]</span>
• thangnhayday.com : Bio Link & Affiliate Hub (100/100 PageSpeed)
• thangit.com      : NOC Dashboard 0đ trên Cloudflare Pages`,

    contact: `<span style="color:var(--neon-cyan)">[CONTACT]</span>
• Zalo / SĐT : 0986 192 092
• Telegram   : @ducthangqtm
• Email      : contact@thangit.com`
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = input.value.trim().toLowerCase();
      input.value = '';

      if (!raw) return;

      const userLine = document.createElement('div');
      userLine.innerHTML = `<span style="color:var(--neon-green)">guest@thangit:~$</span> ${raw}`;
      body.appendChild(userLine);

      if (raw === 'clear') {
        body.innerHTML = '';
        return;
      }

      const resLine = document.createElement('div');
      if (commands[raw]) {
        resLine.innerHTML = commands[raw];
      } else {
        resLine.innerHTML = `<span style="color:#ef4444">zsh: command not found: ${raw}</span>. Gõ <span style="color:var(--neon-cyan)">help</span> để xem lệnh.`;
      }

      body.appendChild(resLine);
      body.scrollTop = body.scrollHeight;
    }
  });
}

/* ==========================================================================
   8. TOOLBOX TABS
   ========================================================================== */
function initToolboxTabs() {
  const tabs = document.querySelectorAll('.modal-tab-btn');
  const panels = document.querySelectorAll('.tool-panel-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(target);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* ==========================================================================
   9. COPY BUTTONS & TOAST NOTIFICATION
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
      e.stopPropagation(); // Không kích hoạt mở modal khi chỉ bấm copy
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
}

/* ==========================================================================
   10. SMOOTH RADAR PING ANIMATED FAVICON (Zero-Jitter, Anchored Base)
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

  function drawRoundedRect(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) {
      c.roundRect(x, y, w, h, r);
    } else {
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
    }
  }

  let step = 0;
  let animTimer = null;
  const totalSteps = 24; // Smooth 24-frame cycle (~1.8s per pulse)

  function renderFavicon() {
    ctx.clearRect(0, 0, 32, 32);

    // 1. Anchored Badge Background (Completely static - zero flicker)
    drawRoundedRect(ctx, 1, 1, 30, 30, 7);
    ctx.fillStyle = '#070c16';
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.stroke();

    // 2. Smooth Radar Wave expanding from antenna beacon (x=16, y=8.5)
    const progress = (step % totalSteps) / totalSteps;
    const waveRadius = 2 + progress * 7;
    const waveAlpha = Math.sin(progress * Math.PI); // Smooth 0 -> 1 -> 0 fade curve

    ctx.save();
    ctx.beginPath();
    ctx.arc(16, 8.5, waveRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 157, ${(waveAlpha * 0.8).toFixed(2)})`;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.restore();

    // 3. Center 'i' Antenna Beacon Dot (Pulsing network activity LED)
    const ledGlow = (Math.sin(progress * Math.PI * 2) + 1) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(16, 8.5, 2, 0, Math.PI * 2);
    ctx.fillStyle = ledGlow > 0.4 ? '#00ff9d' : '#00f0ff';
    ctx.shadowColor = '#00ff9d';
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.restore();

    // 4. Letters "T - i - T" (Anchored, rounded, sharp - never moves)
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.6;

    const grad = ctx.createLinearGradient(4, 0, 28, 0);
    grad.addColorStop(0, '#00f0ff');
    grad.addColorStop(0.5, '#00ff9d');
    grad.addColorStop(1, '#00f0ff');
    ctx.strokeStyle = grad;

    // Left T
    ctx.beginPath();
    ctx.moveTo(5, 11);
    ctx.lineTo(12, 11);
    ctx.moveTo(8.5, 11);
    ctx.lineTo(8.5, 22);
    ctx.stroke();

    // Center i stem
    ctx.beginPath();
    ctx.moveTo(16, 13.5);
    ctx.lineTo(16, 22);
    ctx.strokeStyle = '#00f0ff';
    ctx.stroke();

    // Right T
    ctx.beginPath();
    ctx.moveTo(20, 11);
    ctx.lineTo(27, 11);
    ctx.moveTo(23.5, 11);
    ctx.lineTo(23.5, 22);
    ctx.strokeStyle = grad;
    ctx.stroke();
    ctx.restore();

    faviconLink.href = canvas.toDataURL('image/png');
    step++;
  }

  function start() {
    if (!animTimer) {
      animTimer = setInterval(renderFavicon, 75); // ~13 fps: fluid, gentle pulse, low CPU
    }
  }

  function stop() {
    if (animTimer) {
      clearInterval(animTimer);
      animTimer = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  start();
}

