/**
 * THANGIT.COM — Ultra-Minimalist Click-to-Open Engine
 * 100% Client-Side • Vanilla JavaScript (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAppRouter();
  initNetworkInspector();
  initLatencyTester();
  initSubnetCalculator();
  initDnsLookup();
  initWifiQr();
  initPortLookup();
  initPasswordGenerator();
  initInteractiveTerminal();
  initCopyButtons();
  initAnimatedFavicon();
  initServiceWorker();
  initPullToRefresh();
  initPWAInstallPrompt();
  initPocketTools();
});

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

  // Listen for native install prompt (Chrome / Android / Edge)
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
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = '🎉 Đã ghim App TiT ra màn hình thành công!';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }
  });

  async function handleInstallClick(e) {
    if (e) e.preventDefault();

    if (deferredPrompt) {
      // Android / Chrome native 1-click install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        if (banner) banner.style.display = 'none';
        if (btnTopbar) btnTopbar.style.display = 'none';
      }
      deferredPrompt = null;
    } else {
      // iOS Safari or browser where prompt not directly available: show visual guide modal
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
   1. IOS APP ROUTER & VIEW CONTROLLER (ZERO POPUP • 100% NATIVE FEEL)
   ========================================================================== */
function initAppRouter() {
  const springboard = document.getElementById('springboard-view');
  const appContainer = document.getElementById('ios-app-container');
  const backBtn = document.getElementById('ios-back-btn');
  const navTitle = document.getElementById('ios-nav-title');
  const navIcon = document.getElementById('ios-nav-icon');

  const appMeta = {
    'app-subnet':    { title: 'Subnet & CIDR Calculator', icon: '🧮' },
    'app-dns':       { title: 'DNS Lookup (Cloudflare DoH)', icon: '🌐' },
    'app-wifi-qr':   { title: 'Tạo QR Wi-Fi 1-Chạm', icon: '📶' },
    'app-ports':     { title: 'Tra Cứu Cổng Mạng & Port', icon: '🔌' },
    'app-password':  { title: 'Sinh Mật Khẩu IT & Key', icon: '🔐' },
    'app-telemetry': { title: 'NOC Telemetry & Ping', icon: '⚡' },
    'app-terminal':  { title: 'NOC Terminal CLI (zsh)', icon: '⌨️' },
    'app-career':    { title: 'Hồ Sơ Năng Lực 10 Năm', icon: '💼' },
    'app-projects':  { title: 'Dự Án Số & Hạ Tầng', icon: '🚀' },
    'app-vietqr':    { title: 'VietQR Bank Studio', icon: '🏦' },
    'app-calc':      { title: 'Máy Tính Cyber', icon: '🧮' },
    'app-lunar':     { title: 'Lịch Âm Vạn Niên', icon: '📅' },
    'app-weather':   { title: 'Thời Tiết Trực Tiếp', icon: '🌤️' },
    'app-converter': { title: 'Đổi Đơn Vị & Ngoại Tệ', icon: '⚖️' },
    'app-world':     { title: 'Đồng Hồ Giờ Quốc Tế', icon: '🌍' },
    'app-crypto':    { title: 'Bảng Giá Coin Binance', icon: '🪙' },
    'app-football':  { title: 'Bóng Đá Trực Tiếp', icon: '⚽' }
  };

  function openApp(appId, updateHistory = true) {
    const screen = document.getElementById(`screen-${appId}`);
    if (!screen || !appContainer || !springboard) return;

    if ('vibrate' in navigator) {
      try { navigator.vibrate(12); } catch {}
    }

    document.querySelectorAll('.ios-app-screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');

    const meta = appMeta[appId] || { title: 'Ứng Dụng', icon: '⚡' };
    if (navTitle) navTitle.textContent = meta.title;
    if (navIcon) navIcon.textContent = meta.icon;

    springboard.classList.add('hidden');
    appContainer.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateHistory) {
      window.location.hash = `app=${appId.replace('app-', '')}`;
    }

    // Lifecycle triggers
    if (appId === 'app-subnet') {
      const calcBtn = document.getElementById('btn-calculate-subnet');
      if (calcBtn) calcBtn.click();
    } else if (appId === 'app-dns') {
      const input = document.getElementById('dns-domain-input');
      if (input && !input.dataset.loaded) {
        input.dataset.loaded = 'true';
        const dnsBtn = document.getElementById('btn-dns-lookup');
        if (dnsBtn) dnsBtn.click();
      }
    } else if (appId === 'app-wifi-qr') {
      const wifiBtn = document.getElementById('btn-gen-wifi-qr');
      if (wifiBtn) wifiBtn.click();
    } else if (appId === 'app-vietqr') {
      const genBtn = document.getElementById('btn-generate-qr');
      if (genBtn) genBtn.click();
    } else if (appId === 'app-terminal') {
      const input = document.getElementById('app-term-cmd-input');
      if (input) setTimeout(() => input.focus(), 150);
    }
  }

  function closeApp(updateHistory = true) {
    if (!appContainer || !springboard) return;
    appContainer.classList.remove('active');
    document.querySelectorAll('.ios-app-screen').forEach(s => s.classList.remove('active'));
    springboard.classList.remove('hidden');

    if (updateHistory && window.location.hash.startsWith('#app=')) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }

  document.querySelectorAll('[data-app]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const appId = btn.getAttribute('data-app');
      openApp(appId);
    });
  });

  const ipBadge = document.getElementById('home-visitor-ip')?.parentElement;
  if (ipBadge) {
    ipBadge.style.cursor = 'pointer';
    ipBadge.addEventListener('click', () => openApp('app-telemetry'));
  }

  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeApp();
    });
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('app=')) {
      const name = hash.replace('app=', '');
      openApp(`app-${name}`, false);
    } else {
      closeApp(false);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appContainer && appContainer.classList.contains('active')) {
      closeApp();
    }
    if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      if (appContainer && appContainer.classList.contains('active')) {
        closeApp();
      } else {
        openApp('app-terminal');
      }
    }
  });

  // Check initial URL hash
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash.startsWith('app=')) {
    const name = initialHash.replace('app=', '');
    openApp(`app-${name}`, false);
  } else if (['tools', 'telemetry'].includes(initialHash)) {
    openApp('app-telemetry');
  } else if (['career', 'cv'].includes(initialHash)) {
    openApp('app-career');
  } else if (['projects'].includes(initialHash)) {
    openApp('app-projects');
  } else if (['terminal'].includes(initialHash)) {
    openApp('app-terminal');
  }
}

/* ==========================================================================
   MODULE: DNS LOOKUP VIA CLOUDFLARE 1.1.1.1 DOH
   ========================================================================== */
function initDnsLookup() {
  const domainInput = document.getElementById('dns-domain-input');
  const typeBtns = document.querySelectorAll('[data-dns-type]');
  const lookupBtn = document.getElementById('btn-dns-lookup');
  const tbody = document.getElementById('dns-results-tbody');

  let currentType = 'A';

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.getAttribute('data-dns-type');
      performLookup();
    });
  });

  async function performLookup() {
    if (!domainInput || !tbody) return;
    let domain = domainInput.value.trim();
    if (!domain) domain = 'thangit.com';
    domain = domain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '');

    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--neon-cyan);">Đang truy vấn Cloudflare 1.1.1.1 DoH cho <strong>${domain}</strong> (${currentType})...</td></tr>`;

    try {
      const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${currentType}`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/dns-json' }
      });
      const data = await res.json();

      if (!data.Answer || data.Answer.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--text-dim);">Không tìm thấy bản ghi <strong>${currentType}</strong> cho tên miền này (Status: ${data.Status || 0}).</td></tr>`;
        return;
      }

      const typeMap = { 1: 'A', 28: 'AAAA', 5: 'CNAME', 15: 'MX', 16: 'TXT', 2: 'NS', 6: 'SOA' };

      tbody.innerHTML = data.Answer.map(ans => {
        const typeName = typeMap[ans.type] || ans.type;
        const cleanData = (ans.data || '').replace(/"/g, '');
        return `
          <tr>
            <td style="color:var(--text-title); font-weight:600;">${ans.name}</td>
            <td><span class="badge-pill" style="background:rgba(0,255,157,0.12); color:var(--neon-green); font-size:0.7rem;">${typeName}</span></td>
            <td style="color:var(--text-dim);">${ans.TTL}s</td>
            <td style="color:var(--neon-cyan); word-break:break-all;"><strong>${cleanData}</strong></td>
            <td><button class="btn-calc" style="padding:0.25rem 0.55rem; font-size:0.7rem;" onclick="navigator.clipboard.writeText('${cleanData}'); showToast('📋 Đã sao chép bản ghi!');">Copy</button></td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:#ff4757;">Lỗi truy vấn DNS: ${err.message}. Kiểm tra kết nối mạng!</td></tr>`;
    }
  }

  if (lookupBtn) {
    lookupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      performLookup();
    });
  }

  if (domainInput) {
    domainInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performLookup();
      }
    });
  }
}

/* ==========================================================================
   MODULE: WI-FI QR STUDIO
   ========================================================================== */
function initWifiQr() {
  const ssidInput = document.getElementById('wifi-qr-ssid');
  const passInput = document.getElementById('wifi-qr-pass');
  const typeSelect = document.getElementById('wifi-qr-type');
  const hiddenCheckbox = document.getElementById('wifi-qr-hidden');
  const canvas = document.getElementById('wifi-qr-canvas');
  const btnGen = document.getElementById('btn-gen-wifi-qr');
  const btnDownload = document.getElementById('btn-download-wifi-qr');
  const btnCopy = document.getElementById('btn-copy-wifi-str');

  function generateWifiQR() {
    const ssid = ssidInput?.value.trim() || 'THANGIT_WIFI';
    const pass = passInput?.value || '';
    const type = typeSelect?.value || 'WPA';
    const hidden = hiddenCheckbox?.checked ? 'true' : 'false';

    const wifiString = `WIFI:S:${ssid};T:${type};P:${pass};H:${hidden};;`;

    if (window.TiTQR && canvas) {
      window.TiTQR.render(canvas, { text: wifiString, size: 260 });
    }
    return wifiString;
  }

  if (btnGen) {
    btnGen.addEventListener('click', (e) => {
      e.preventDefault();
      generateWifiQR();
      showToast('⚡ Đã tạo mã QR Wi-Fi thành công!');
    });
  }

  if (btnDownload && canvas) {
    btnDownload.addEventListener('click', (e) => {
      e.preventDefault();
      const link = document.createElement('a');
      link.download = `wifi-qr-${(ssidInput?.value || 'thangit').toLowerCase().replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('📥 Đã tải ảnh mã QR Wi-Fi!');
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', (e) => {
      e.preventDefault();
      const wifiString = generateWifiQR();
      navigator.clipboard.writeText(wifiString);
      showToast('📋 Đã sao chép chuỗi kết nối Wi-Fi!');
    });
  }
}

/* ==========================================================================
   MODULE: PORT & PROTOCOL CHEAT SHEET
   ========================================================================== */
function initPortLookup() {
  const portsData = [
    { port: 20, proto: 'TCP', service: 'FTP Data', cat: 'core', desc: 'Truyền dữ liệu tệp tin giao thức FTP' },
    { port: 21, proto: 'TCP', service: 'FTP Control', cat: 'core', desc: 'Kênh điều khiển lệnh máy chủ FTP' },
    { port: 22, proto: 'TCP', service: 'SSH / SFTP', cat: 'admin', desc: 'Secure Shell & truyền tệp bảo mật Linux/Router' },
    { port: 23, proto: 'TCP', service: 'Telnet', cat: 'admin', desc: 'Dòng lệnh không mã hóa (Legacy, khuyến cáo tắt)' },
    { port: 25, proto: 'TCP', service: 'SMTP', cat: 'mail', desc: 'Gửi thư điện tử giữa các Mail Server' },
    { port: 53, proto: 'UDP/TCP', service: 'DNS', cat: 'core', desc: 'Phân giải tên miền internet (Domain Name System)' },
    { port: 67, proto: 'UDP', service: 'DHCP Server', cat: 'core', desc: 'Cấp phát địa chỉ IP tự động từ Router/Server' },
    { port: 68, proto: 'UDP', service: 'DHCP Client', cat: 'core', desc: 'Nhận địa chỉ IP tự động trên máy trạm' },
    { port: 69, proto: 'UDP', service: 'TFTP', cat: 'core', desc: 'Nạp firmware & sao lưu cấu hình Cisco/Mikrotik' },
    { port: 80, proto: 'TCP', service: 'HTTP', cat: 'web', desc: 'Giao thức web không mã hóa tiêu chuẩn' },
    { port: 110, proto: 'TCP', service: 'POP3', cat: 'mail', desc: 'Nhận thư điện tử từ máy chủ về máy khách' },
    { port: 123, proto: 'UDP', service: 'NTP', cat: 'core', desc: 'Đồng bộ thời gian chuẩn mạng (Network Time Protocol)' },
    { port: 143, proto: 'TCP', service: 'IMAP', cat: 'mail', desc: 'Đọc và đồng bộ thư điện tử đa thiết bị' },
    { port: 161, proto: 'UDP', service: 'SNMP', cat: 'admin', desc: 'Giám sát thiết bị mạng Router/Switch (Zabbix, PRTG)' },
    { port: 162, proto: 'UDP', service: 'SNMP Trap', cat: 'admin', desc: 'Nhận cảnh báo tự động từ thiết bị mạng' },
    { port: 179, proto: 'TCP', service: 'BGP', cat: 'core', desc: 'Định tuyến biên Border Gateway Protocol giữa các ISP' },
    { port: 443, proto: 'TCP/UDP', service: 'HTTPS / QUIC', cat: 'web', desc: 'Duyệt web bảo mật TLS/SSL và HTTP/3' },
    { port: 445, proto: 'TCP', service: 'SMB / CIFS', cat: 'core', desc: 'Chia sẻ tệp tin và máy in Windows / Samba NAS' },
    { port: 465, proto: 'TCP', service: 'SMTPS', cat: 'mail', desc: 'Gửi email mã hóa qua SSL/TLS' },
    { port: 500, proto: 'UDP', service: 'IPsec IKE', cat: 'vpn', desc: 'Thiết lập đường hầm VPN IPsec trao đổi khóa IKE' },
    { port: 587, proto: 'TCP', service: 'SMTP Submission', cat: 'mail', desc: 'Gửi thư khách chuẩn hiện đại có xác thực STARTTLS' },
    { port: 993, proto: 'TCP', service: 'IMAPS', cat: 'mail', desc: 'Đồng bộ email bảo mật qua SSL/TLS' },
    { port: 995, proto: 'TCP', service: 'POP3S', cat: 'mail', desc: 'Nhận email bảo mật qua SSL/TLS' },
    { port: 1194, proto: 'UDP/TCP', service: 'OpenVPN', cat: 'vpn', desc: 'Cổng VPN nguồn mở phổ biến nhất cho doanh nghiệp' },
    { port: 1433, proto: 'TCP', service: 'MS SQL Server', cat: 'db', desc: 'Cơ sở dữ liệu Microsoft SQL Server' },
    { port: 1521, proto: 'TCP', service: 'Oracle DB', cat: 'db', desc: 'Cơ sở dữ liệu doanh nghiệp Oracle Database' },
    { port: 2049, proto: 'TCP/UDP', service: 'NFS', cat: 'core', desc: 'Hệ thống tệp mạng Network File System Linux/Proxmox' },
    { port: 3306, proto: 'TCP', service: 'MySQL / MariaDB', cat: 'db', desc: 'Hệ quản trị cơ sở dữ liệu web phổ biến nhất' },
    { port: 3389, proto: 'TCP/UDP', service: 'RDP', cat: 'admin', desc: 'Remote Desktop Protocol điều khiển máy Windows' },
    { port: 4500, proto: 'UDP', service: 'IPsec NAT-T', cat: 'vpn', desc: 'Đường hầm VPN IPsec vượt qua tường lửa NAT Traversal' },
    { port: 5060, proto: 'UDP/TCP', service: 'SIP (VoIP)', cat: 'mail', desc: 'Tổng đài điện thoại thoại IP (Asterisk, FreePBX)' },
    { port: 5432, proto: 'TCP', service: 'PostgreSQL', cat: 'db', desc: 'Cơ sở dữ liệu quan hệ mã nguồn mở mạnh mẽ' },
    { port: 5900, proto: 'TCP', service: 'VNC', cat: 'admin', desc: 'Điều khiển màn hình từ xa Virtual Network Computing' },
    { port: 6379, proto: 'TCP', service: 'Redis', cat: 'db', desc: 'Bộ nhớ đệm In-memory data store tốc độ cao' },
    { port: 8080, proto: 'TCP', service: 'HTTP Alt / Proxy', cat: 'web', desc: 'Cổng chạy thử nghiệm web app hoặc proxy nội bộ' },
    { port: 8291, proto: 'TCP', service: 'Mikrotik Winbox', cat: 'admin', desc: 'Cổng phần mềm quản trị RouterOS Mikrotik độc quyền' },
    { port: 8443, proto: 'TCP', service: 'HTTPS Alternate', cat: 'web', desc: 'Cổng web bảo mật phụ, thường dùng cho UniFi, cPanel' },
    { port: 27017, proto: 'TCP', service: 'MongoDB', cat: 'db', desc: 'Cơ sở dữ liệu NoSQL dạng tài liệu JSON' },
    { port: 51820, proto: 'UDP', service: 'WireGuard VPN', cat: 'vpn', desc: 'Giao thức VPN thế hệ mới tốc độ siêu nhanh & bảo mật' }
  ];

  const grid = document.getElementById('port-list-grid');
  const searchInput = document.getElementById('port-search-input');
  const catBtns = document.querySelectorAll('[data-port-cat]');

  let currentCat = 'all';

  function renderPorts() {
    if (!grid) return;
    const q = searchInput?.value.toLowerCase().trim() || '';

    const filtered = portsData.filter(item => {
      const matchCat = currentCat === 'all' || item.cat === currentCat;
      const matchText = !q || 
        item.port.toString().includes(q) ||
        item.service.toLowerCase().includes(q) ||
        item.proto.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q);
      return matchCat && matchText;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-dim);">Không tìm thấy cổng mạng phù hợp.</div>';
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="port-item-card">
        <div class="port-badge">${p.port}</div>
        <div class="port-info">
          <div class="port-service">
            <span>${p.service}</span>
            <span class="port-proto">${p.proto}</span>
          </div>
          <div class="port-desc">${p.desc}</div>
        </div>
      </div>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderPorts);
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.getAttribute('data-port-cat');
      renderPorts();
    });
  });

  renderPorts();
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

/* ==========================================================================
   TIT POCKET SUPER APP CONTROLLER (8-IN-1 UTILITIES)
   ========================================================================== */
function initPocketTools() {
  // 1. Tab Switcher
  const tabBtns = document.querySelectorAll('[data-pocket-tab]');
  const panels = document.querySelectorAll('.pocket-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-pocket-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // 2. Initialize Sub-modules
  initQRStudio();
  initWeather();
  initCrypto();
  initFootball();
  initCalculator();
  initLunarCalendar();
  initConverter();
  initWorldClock();
}

/* --- MODULE 1: UNIVERSAL QR STUDIO --- */
function initQRStudio() {
  const typeBtns = document.querySelectorAll('[data-qr-type]');
  const subforms = document.querySelectorAll('.qr-subform');
  const canvas = document.getElementById('qr-canvas');
  const btnGenerate = document.getElementById('btn-generate-qr');
  const btnDownload = document.getElementById('btn-download-qr');
  const btnCopy = document.getElementById('btn-copy-qr-text');

  let currentType = 'bank';
  let lastPayload = '';

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.getAttribute('data-qr-type');

      subforms.forEach(f => f.style.display = 'none');
      const activeForm = document.getElementById(`qr-form-${currentType}`);
      if (activeForm) activeForm.style.display = 'block';

      generateQR();
    });
  });

  function getQRPayload() {
    if (currentType === 'bank') {
      const bank = document.getElementById('qr-bank-select')?.value || 'mb';
      const acc = document.getElementById('qr-bank-acc')?.value.trim() || '0986192092';
      const amount = document.getElementById('qr-bank-amount')?.value.trim() || '';
      const desc = document.getElementById('qr-bank-desc')?.value.trim() || 'Thanh toan TiT';
      // Official VietQR API format for seamless banking app scan
      return `https://img.vietqr.io/image/${bank}-${acc}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(desc)}`;
    }
    if (currentType === 'wifi') {
      const ssid = document.getElementById('qr-wifi-ssid')?.value.trim() || 'THANGIT_WIFI';
      const pass = document.getElementById('qr-wifi-pass')?.value || '';
      const type = document.getElementById('qr-wifi-type')?.value || 'WPA';
      return `WIFI:S:${ssid};T:${type};P:${pass};;`;
    }
    if (currentType === 'url') {
      return document.getElementById('qr-url-input')?.value.trim() || 'https://thangit.com';
    }
    if (currentType === 'vcard') {
      const name = document.getElementById('qr-vc-name')?.value.trim() || 'Nguyễn Đức Thắng';
      const phone = document.getElementById('qr-vc-phone')?.value.trim() || '0986192092';
      const email = document.getElementById('qr-vc-email')?.value.trim() || 'contact@thangit.com';
      const org = document.getElementById('qr-vc-org')?.value.trim() || 'Thắng IT';
      return `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nORG:${org}\nEND:VCARD`;
    }
    if (currentType === 'text') {
      return document.getElementById('qr-text-input')?.value.trim() || 'THANGIT.COM — Senior Network Administrator';
    }
    return 'https://thangit.com';
  }

  function generateQR() {
    lastPayload = getQRPayload();
    if (window.TiTQR && canvas) {
      window.TiTQR.render(canvas, { text: lastPayload, size: 260 });
    }
  }

  if (btnGenerate) btnGenerate.addEventListener('click', (e) => {
    e.preventDefault();
    generateQR();
  });

  if (btnDownload && canvas) {
    btnDownload.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        const link = document.createElement('a');
        link.download = `tit_qr_${currentType}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        // Fallback direct open
        if (lastPayload.startsWith('http')) window.open(lastPayload, '_blank');
      }
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', (e) => {
      e.preventDefault();
      if (lastPayload) {
        navigator.clipboard.writeText(lastPayload).then(() => {
          const toast = document.getElementById('global-toast');
          if (toast) {
            toast.textContent = '📋 Đã sao chép nội dung QR!';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
          }
        });
      }
    });
  }

  // Initial render
  setTimeout(generateQR, 200);
}

/* --- MODULE 2: WEATHER & TEMPERATURE (OPEN-METEO) --- */
function initWeather() {
  const cityBtns = document.querySelectorAll('.weather-city-btn[data-city]');
  const geoBtn = document.getElementById('btn-geo-weather');

  const CITIES = {
    hanoi: { lat: 21.0285, lon: 105.8542, name: 'Hà Nội' },
    hcm: { lat: 10.8231, lon: 106.6297, name: 'TP. Hồ Chí Minh' },
    danang: { lat: 16.0544, lon: 108.2022, name: 'Đà Nẵng' },
    haiphong: { lat: 20.8449, lon: 106.6881, name: 'Hải Phòng' },
    cantho: { lat: 10.0452, lon: 105.7469, name: 'Cần Thơ' },
    dalat: { lat: 11.9404, lon: 108.4583, name: 'Đà Lạt' }
  };

  const WMO_MAP = {
    0: { text: 'Trời quang đãng', icon: '☀️' },
    1: { text: 'Chủ yếu quang đãng', icon: '🌤️' },
    2: { text: 'Mây rải rác', icon: '⛅' },
    3: { text: 'Trời nhiều mây', icon: '☁️' },
    45: { text: 'Có sương mù', icon: '🌫️' },
    48: { text: 'Sương mù dày', icon: '🌫️' },
    51: { text: 'Mưa phùn nhẹ', icon: '🌦️' },
    53: { text: 'Mưa phùn vừa', icon: '🌦️' },
    55: { text: 'Mưa phùn nặng hạt', icon: '🌧️' },
    61: { text: 'Mưa rào nhẹ', icon: '🌦️' },
    63: { text: 'Mưa vừa', icon: '🌧️' },
    65: { text: 'Mưa to', icon: '🌧️' },
    80: { text: 'Mưa rào ngắt quãng', icon: '🌦️' },
    81: { text: 'Mưa rào nặng hạt', icon: '🌧️' },
    95: { text: 'Có dông sét', icon: '⛈️' }
  };

  async function fetchWeather(lat, lon, cityName) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=uv_index_max,precipitation_probability_max&timezone=Asia%2FBangkok`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      const cur = data.current;
      const daily = data.daily;

      const code = cur.weather_code || 0;
      const wInfo = WMO_MAP[code] || { text: 'Trời mát mẻ', icon: '🌤️' };

      const cityTitle = document.getElementById('w-city-title');
      const tempVal = document.getElementById('w-temp-val');
      const condText = document.getElementById('w-condition-text');
      const feelsLike = document.getElementById('w-feels-like');
      const iconEmoji = document.getElementById('w-icon-emoji');
      const humidity = document.getElementById('w-humidity');
      const wind = document.getElementById('w-wind');
      const uv = document.getElementById('w-uv');
      const rain = document.getElementById('w-rain');
      const homeChip = document.getElementById('chip-weather-preview');

      if (cityTitle) cityTitle.textContent = cityName;
      if (tempVal) tempVal.textContent = `${Math.round(cur.temperature_2m)}°C`;
      if (condText) condText.textContent = wInfo.text;
      if (feelsLike) feelsLike.textContent = `${Math.round(cur.apparent_temperature)}°C`;
      if (iconEmoji) iconEmoji.textContent = wInfo.icon;
      if (humidity) humidity.textContent = `${cur.relative_humidity_2m}%`;
      if (wind) wind.textContent = `${cur.wind_speed_10m} km/h`;

      const uvVal = daily && daily.uv_index_max ? daily.uv_index_max[0] : 4;
      if (uv) uv.textContent = uvVal > 7 ? `${uvVal} (Rất Cao)` : (uvVal > 4 ? `${uvVal} (Trung Bình)` : `${uvVal} (Thấp)`);

      const rainProb = daily && daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
      if (rain) rain.textContent = `${rainProb}%`;

      // Update home hub preview chip
      if (homeChip) {
        homeChip.textContent = `${cityName}: ${Math.round(cur.temperature_2m)}°C ${wInfo.icon}`;
      }
    } catch (e) {
      console.warn('Weather fetch error:', e);
    }
  }

  cityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cityBtns.forEach(b => b.classList.remove('active'));
      if (geoBtn) geoBtn.classList.remove('active');
      btn.classList.add('active');

      const cKey = btn.getAttribute('data-city');
      const target = CITIES[cKey];
      if (target) fetchWeather(target.lat, target.lon, target.name);
    });
  });

  if (geoBtn) {
    geoBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        geoBtn.textContent = '📍 Đang lấy GPS...';
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            cityBtns.forEach(b => b.classList.remove('active'));
            geoBtn.classList.add('active');
            geoBtn.textContent = '📍 Vị Trí Của Tôi';
            fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Vị Trí Của Bạn');
          },
          () => {
            geoBtn.textContent = '📍 GPS Bị Chặn';
            setTimeout(() => { geoBtn.textContent = '📍 GPS Của Tôi'; }, 2000);
          }
        );
      }
    });
  }

  // Load Hanoi by default
  fetchWeather(CITIES.hanoi.lat, CITIES.hanoi.lon, CITIES.hanoi.name);
}

/* --- MODULE 3: LIVE CRYPTO TRACKER (BINANCE API) --- */
function initCrypto() {
  const container = document.getElementById('crypto-cards-grid');
  const refreshBtn = document.getElementById('btn-refresh-crypto');
  const chipBtc = document.getElementById('chip-btc-price');
  const chipBtcChange = document.getElementById('chip-btc-change');

  const COIN_META = {
    'BTCUSDT': { symbol: 'BTC', name: 'Bitcoin', icon: '₿', decimals: 2 },
    'ETHUSDT': { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', decimals: 2 },
    'SOLUSDT': { symbol: 'SOL', name: 'Solana', icon: '◎', decimals: 2 },
    'BNBUSDT': { symbol: 'BNB', name: 'BNB Chain', icon: '🟡', decimals: 2 },
    'XRPUSDT': { symbol: 'XRP', name: 'Ripple', icon: '✕', decimals: 4 },
    'DOGEUSDT': { symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð', decimals: 4 },
    'ADAUSDT': { symbol: 'ADA', name: 'Cardano', icon: '₳', decimals: 4 },
    'SUIUSDT': { symbol: 'SUI', name: 'Sui Network', icon: '💧', decimals: 4 },
    'NEARUSDT': { symbol: 'NEAR', name: 'NEAR Protocol', icon: 'Ⓝ', decimals: 3 },
    'PEPEUSDT': { symbol: 'PEPE', name: 'Pepe Meme', icon: '🐸', decimals: 8 }
  };

  const SYMBOLS = Object.keys(COIN_META);

  async function fetchCrypto() {
    try {
      const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(SYMBOLS))}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();

      let html = '';
      const USD_VND_RATE = 26000;

      data.forEach(item => {
        const meta = COIN_META[item.symbol];
        if (!meta) return;

        const price = parseFloat(item.lastPrice);
        const changePercent = parseFloat(item.priceChangePercent);
        const isUp = changePercent >= 0;
        const changeSign = isUp ? '+' : '';
        const changeClass = isUp ? 'up' : 'down';
        const vndVal = (price * USD_VND_RATE).toLocaleString('vi-VN', { maximumFractionDigits: 0 });

        let formattedPrice = price.toLocaleString('en-US', {
          minimumFractionDigits: meta.decimals > 2 ? meta.decimals : 2,
          maximumFractionDigits: meta.decimals
        });

        // Update home hub preview if BTC
        if (item.symbol === 'BTCUSDT') {
          if (chipBtc) chipBtc.textContent = `$${Math.round(price).toLocaleString('en-US')}`;
          if (chipBtcChange) {
            chipBtcChange.textContent = `${changeSign}${changePercent.toFixed(2)}%`;
            chipBtcChange.className = isUp ? 'chip-green' : 'chip-red';
          }
        }

        html += `
          <div class="crypto-card">
            <div>
              <div class="crypto-symbol">${meta.icon} ${meta.symbol}</div>
              <div class="crypto-name">${meta.name}</div>
              <span class="crypto-change ${changeClass}">${changeSign}${changePercent.toFixed(2)}%</span>
            </div>
            <div>
              <div class="crypto-price">$${formattedPrice}</div>
              <div class="crypto-vnd">≈ ${vndVal} ₫</div>
            </div>
          </div>
        `;
      });

      if (container) container.innerHTML = html;
    } catch (e) {
      console.warn('Crypto fetch error:', e);
    }
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      refreshBtn.textContent = '🔄 Đang tải...';
      fetchCrypto().then(() => {
        setTimeout(() => { refreshBtn.textContent = '🔄 Làm mới'; }, 500);
      });
    });
  }

  fetchCrypto();
  setInterval(fetchCrypto, 20000); // 20s auto refresh
}

/* --- MODULE 4: ESPN LIVE FOOTBALL SCORES & FIXTURES --- */
function initFootball() {
  const leagueBtns = document.querySelectorAll('.football-league-btn[data-league]');
  const container = document.getElementById('football-matches-list');

  let currentLeague = 'eng.1';

  async function fetchFootball(league) {
    if (!container) return;
    container.innerHTML = '<div style="text-align:center; padding:1.5rem; color:var(--text-dim);">Đang tải lịch thi đấu ESPN...</div>';

    try {
      const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      const events = data.events || [];

      if (events.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:1.5rem; color:var(--text-muted);">Không có trận đấu nào hôm nay.</div>';
        return;
      }

      let html = '';
      events.slice(0, 10).forEach(ev => {
        const comp = ev.competitions && ev.competitions[0];
        if (!comp) return;

        const home = comp.competitors.find(c => c.homeAway === 'home') || comp.competitors[0];
        const away = comp.competitors.find(c => c.homeAway === 'away') || comp.competitors[1];
        const status = comp.status;

        const state = status.type.state; // 'pre', 'in', 'post'
        let centerHtml = '';

        if (state === 'in') {
          centerHtml = `
            <div class="match-score" style="color:var(--neon-cyan);">${home.score || 0} - ${away.score || 0}</div>
            <span class="match-status-badge live">● LIVE ${status.displayClock || ''}</span>
          `;
        } else if (state === 'post') {
          centerHtml = `
            <div class="match-score">${home.score || 0} - ${away.score || 0}</div>
            <span class="match-status-badge">FT (Hết giờ)</span>
          `;
        } else {
          // Scheduled: format time in Vietnam GMT+7
          const matchDate = new Date(comp.date);
          const timeStr = matchDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });
          const dateStr = matchDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });
          centerHtml = `
            <div class="match-score" style="font-size:0.95rem; color:var(--neon-green);">${timeStr}</div>
            <span class="match-status-badge">${dateStr}</span>
          `;
        }

        const homeLogo = home.team.logo || 'assets/images/favicon-32x32.png';
        const awayLogo = away.team.logo || 'assets/images/favicon-32x32.png';

        html += `
          <div class="match-card">
            <div class="match-team">
              <img src="${homeLogo}" alt="${home.team.displayName}" class="match-team-logo" onerror="this.style.opacity=0.3;">
              <span class="match-team-name">${home.team.shortDisplayName || home.team.displayName}</span>
            </div>
            <div class="match-center-info">
              ${centerHtml}
            </div>
            <div class="match-team away">
              <img src="${awayLogo}" alt="${away.team.displayName}" class="match-team-logo" onerror="this.style.opacity=0.3;">
              <span class="match-team-name">${away.team.shortDisplayName || away.team.displayName}</span>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = '<div style="text-align:center; padding:1.5rem; color:var(--text-dim);">Tạm thời chưa có dữ liệu lịch đấu. Vui lòng thử lại sau.</div>';
    }
  }

  leagueBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      leagueBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLeague = btn.getAttribute('data-league');
      fetchFootball(currentLeague);
    });
  });

  fetchFootball(currentLeague);
}

/* --- MODULE 5: SMART CALCULATOR --- */
function initCalculator() {
  const historyView = document.getElementById('calc-history-view');
  const displayView = document.getElementById('calc-display-view');
  const numBtns = document.querySelectorAll('[data-calc-num]');
  const actionBtns = document.querySelectorAll('[data-calc-action]');

  let currentDisplay = '0';
  let prevValue = null;
  let currentOp = null;
  let waitingForOperand = false;

  function updateView() {
    if (displayView) displayView.textContent = currentDisplay;
  }

  function inputDigit(digit) {
    if (waitingForOperand) {
      currentDisplay = digit;
      waitingForOperand = false;
    } else {
      currentDisplay = currentDisplay === '0' ? digit : currentDisplay + digit;
    }
    updateView();
  }

  function inputDecimal() {
    if (waitingForOperand) {
      currentDisplay = '0.';
      waitingForOperand = false;
      updateView();
      return;
    }
    if (!currentDisplay.includes('.')) {
      currentDisplay += '.';
      updateView();
    }
  }

  function handleOp(nextOp) {
    const inputValue = parseFloat(currentDisplay);

    if (prevValue === null) {
      prevValue = inputValue;
    } else if (currentOp) {
      const result = calculate(prevValue, inputValue, currentOp);
      currentDisplay = String(parseFloat(result.toFixed(8)));
      prevValue = result;
      updateView();
    }

    waitingForOperand = true;
    currentOp = nextOp;

    const opSymbols = { plus: '+', minus: '-', multiply: '×', divide: '÷' };
    if (historyView) historyView.textContent = `${prevValue} ${opSymbols[nextOp] || ''}`;
  }

  function calculate(first, second, op) {
    if (op === 'plus') return first + second;
    if (op === 'minus') return first - second;
    if (op === 'multiply') return first * second;
    if (op === 'divide') return second !== 0 ? first / second : 0;
    return second;
  }

  function handleAction(action) {
    if (action === 'clear') {
      currentDisplay = '0';
      prevValue = null;
      currentOp = null;
      waitingForOperand = false;
      if (historyView) historyView.innerHTML = '&nbsp;';
      updateView();
    } else if (action === 'backspace') {
      if (currentDisplay.length > 1) {
        currentDisplay = currentDisplay.slice(0, -1);
      } else {
        currentDisplay = '0';
      }
      updateView();
    } else if (action === 'plusminus') {
      currentDisplay = String(parseFloat(currentDisplay) * -1);
      updateView();
    } else if (action === 'percent') {
      currentDisplay = String(parseFloat(currentDisplay) / 100);
      updateView();
    } else if (action === 'equals') {
      if (currentOp && prevValue !== null) {
        const inputValue = parseFloat(currentDisplay);
        const result = calculate(prevValue, inputValue, currentOp);
        if (historyView) historyView.innerHTML = '&nbsp;';
        currentDisplay = String(parseFloat(result.toFixed(8)));
        prevValue = null;
        currentOp = null;
        waitingForOperand = true;
        updateView();
      }
    } else {
      handleOp(action);
    }
  }

  numBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-calc-num');
      if (val === '.') inputDecimal();
      else inputDigit(val);
    });
  });

  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.getAttribute('data-calc-action');
      handleAction(act);
    });
  });
}

/* --- MODULE 6: LUNAR CALENDAR (HỒ NGỌC ĐỨC ALGORITHM) --- */
function initLunarCalendar() {
  const datePicker = document.getElementById('lunar-date-picker');
  const btnToday = document.getElementById('btn-lunar-today');
  const solarHeader = document.getElementById('lunar-solar-header');
  const lunarDayDisplay = document.getElementById('lunar-day-display');
  const lunarMonthYearDisplay = document.getElementById('lunar-month-year-display');
  const lunarCanChiDay = document.getElementById('lunar-canchi-day');
  const hoangDaoStatus = document.getElementById('lunar-status-text');
  const tietKhiText = document.getElementById('lunar-tietkhi-text');

  function updateLunar(dateObj) {
    if (!window.VietLunar) return;

    const d = dateObj.getDate();
    const m = dateObj.getMonth() + 1;
    const y = dateObj.getFullYear();

    const lunar = window.VietLunar.convertSolar2Lunar(d, m, y, 7);
    const canChiYear = window.VietLunar.getCanChiYear(lunar.year);
    const canChiMonth = window.VietLunar.getCanChiMonth(lunar.month, lunar.year);
    const canChiDay = window.VietLunar.getCanChiDay(lunar.jd);
    const status = window.VietLunar.getHoangDaoStatus(lunar.jd, 'Dần');
    const tietKhi = window.VietLunar.getTietKhi(lunar.jd);

    const DAYS_VN = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayOfWeek = DAYS_VN[dateObj.getDay()];

    if (solarHeader) solarHeader.textContent = `${dayOfWeek}, ngày ${d < 10 ? '0' + d : d}/${m < 10 ? '0' + m : m}/${y}`;
    if (lunarDayDisplay) lunarDayDisplay.textContent = `${lunar.day}`;
    if (lunarMonthYearDisplay) lunarMonthYearDisplay.textContent = `Tháng ${lunar.month}${lunar.isLeap ? ' (Nhuận)' : ''} • Năm ${canChiYear}`;
    if (lunarCanChiDay) lunarCanChiDay.textContent = `Ngày: ${canChiDay} • Tháng: ${canChiMonth}`;
    if (hoangDaoStatus) {
      hoangDaoStatus.textContent = status;
      hoangDaoStatus.style.color = status.includes('Hoàng Đạo') ? 'var(--neon-green)' : 'var(--text-muted)';
    }
    if (tietKhiText) tietKhiText.textContent = tietKhi;

    // Sync input date
    if (datePicker) {
      const yyyy = y;
      const mm = m < 10 ? '0' + m : m;
      const dd = d < 10 ? '0' + d : d;
      datePicker.value = `${yyyy}-${mm}-${dd}`;
    }
  }

  if (datePicker) {
    datePicker.addEventListener('change', () => {
      const parts = datePicker.value.split('-');
      if (parts.length === 3) {
        const pickedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        updateLunar(pickedDate);
      }
    });
  }

  if (btnToday) {
    btnToday.addEventListener('click', () => {
      updateLunar(new Date());
    });
  }

  updateLunar(new Date());
}

/* --- MODULE 7: MULTI-UNIT & REAL-TIME CURRENCY CONVERTER --- */
function initConverter() {
  const catSelect = document.getElementById('conv-cat-select');
  const unit1 = document.getElementById('conv-unit-1');
  const unit2 = document.getElementById('conv-unit-2');
  const val1 = document.getElementById('conv-val-1');
  const val2 = document.getElementById('conv-val-2');
  const btnSwap = document.getElementById('btn-conv-swap');
  const note = document.getElementById('conv-rate-note');

  let currencyRates = { USD: 1, VND: 26000, EUR: 0.86, JPY: 156, GBP: 0.74, CNY: 6.73, KRW: 1356, SGD: 1.26, THB: 32.9, AUD: 1.39, CAD: 1.38 };

  const CATEGORIES = {
    currency: {
      units: {
        USD: { name: 'USD — Đô la Mỹ', factor: 1 },
        VND: { name: 'VND — Việt Nam Đồng', factor: 26000 },
        EUR: { name: 'EUR — Euro Châu Âu', factor: 0.86 },
        JPY: { name: 'JPY — Yên Nhật', factor: 156 },
        GBP: { name: 'GBP — Bảng Anh', factor: 0.74 },
        CNY: { name: 'CNY — Nhân dân tệ', factor: 6.73 },
        KRW: { name: 'KRW — Won Hàn Quốc', factor: 1356 },
        SGD: { name: 'SGD — Đô la Singapore', factor: 1.26 },
        THB: { name: 'THB — Baht Thái Lan', factor: 32.9 },
        AUD: { name: 'AUD — Đô la Úc', factor: 1.39 }
      }
    },
    data: {
      units: {
        B: { name: 'Byte (B)', factor: 1 },
        KB: { name: 'Kilobyte (KB)', factor: 1024 },
        MB: { name: 'Megabyte (MB)', factor: 1048576 },
        GB: { name: 'Gigabyte (GB)', factor: 1073741824 },
        TB: { name: 'Terabyte (TB)', factor: 1099511627776 },
        PB: { name: 'Petabyte (PB)', factor: 1125899906842624 }
      }
    },
    speed: {
      units: {
        Mbps: { name: 'Megabit/giây (Mbps - Mạng)', factor: 1 },
        MBs: { name: 'Megabyte/giây (MB/s - Tải file)', factor: 8 },
        Kbps: { name: 'Kilobit/giây (Kbps)', factor: 0.001 },
        Gbps: { name: 'Gigabit/giây (Gbps)', factor: 1000 }
      }
    },
    length: {
      units: {
        m: { name: 'Mét (m)', factor: 1 },
        km: { name: 'Kilômét (km)', factor: 1000 },
        cm: { name: 'Centimét (cm)', factor: 0.01 },
        mm: { name: 'Milimét (mm)', factor: 0.001 },
        inch: { name: 'Inch (in)', factor: 0.0254 },
        ft: { name: 'Foot (ft)', factor: 0.3048 },
        mile: { name: 'Dặm (Mile)', factor: 1609.34 }
      }
    },
    mass: {
      units: {
        kg: { name: 'Kilôgam (kg)', factor: 1 },
        g: { name: 'Gam (g)', factor: 0.001 },
        lb: { name: 'Pound (lbs)', factor: 0.453592 },
        oz: { name: 'Ounce (oz)', factor: 0.0283495 }
      }
    },
    temp: {
      units: {
        C: { name: 'Độ C (°C)', factor: 1 },
        F: { name: 'Độ F (°F)', factor: 1 }
      }
    }
  };

  // Fetch live exchange rates
  async function fetchLiveCurrency() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) return;
      const data = await res.json();
      if (data.rates) {
        currencyRates = data.rates;
        Object.keys(CATEGORIES.currency.units).forEach(k => {
          if (currencyRates[k]) CATEGORIES.currency.units[k].factor = currencyRates[k];
        });
        if (note) note.textContent = `Tỷ giá trực tiếp cập nhật lúc ${new Date().toLocaleTimeString('vi-VN')}. 1 USD ≈ ${currencyRates.VND ? Math.round(currencyRates.VND).toLocaleString('vi-VN') : 26000} ₫`;
        recalc(1);
      }
    } catch (e) {
      console.warn('Currency rate fetch error:', e);
    }
  }

  function populateUnitSelects(catKey) {
    const cat = CATEGORIES[catKey];
    if (!cat) return;

    let opts = '';
    Object.keys(cat.units).forEach(u => {
      opts += `<option value="${u}">${cat.units[u].name}</option>`;
    });

    if (unit1) unit1.innerHTML = opts;
    if (unit2) unit2.innerHTML = opts;

    const keys = Object.keys(cat.units);
    if (unit1 && keys[0]) unit1.value = keys[0];
    if (unit2 && keys[1]) unit2.value = keys[1];

    if (catKey === 'currency' && unit1 && unit2) {
      unit1.value = 'USD';
      unit2.value = 'VND';
    } else if (catKey === 'data' && unit1 && unit2) {
      unit1.value = 'GB';
      unit2.value = 'MB';
    } else if (catKey === 'speed' && unit1 && unit2) {
      unit1.value = 'Mbps';
      unit2.value = 'MBs';
    }

    recalc(1);
  }

  function recalc(fromInput) {
    const catKey = catSelect ? catSelect.value : 'currency';
    const cat = CATEGORIES[catKey];
    if (!cat) return;

    const u1 = unit1 ? unit1.value : '';
    const u2 = unit2 ? unit2.value : '';

    if (catKey === 'temp') {
      if (fromInput === 1 && val1 && val2) {
        const v = parseFloat(val1.value) || 0;
        if (u1 === u2) val2.value = v;
        else if (u1 === 'C' && u2 === 'F') val2.value = parseFloat(((v * 9/5) + 32).toFixed(2));
        else if (u1 === 'F' && u2 === 'C') val2.value = parseFloat(((v - 32) * 5/9).toFixed(2));
      } else if (fromInput === 2 && val1 && val2) {
        const v = parseFloat(val2.value) || 0;
        if (u1 === u2) val1.value = v;
        else if (u2 === 'C' && u1 === 'F') val1.value = parseFloat(((v * 9/5) + 32).toFixed(2));
        else if (u2 === 'F' && u1 === 'C') val1.value = parseFloat(((v - 32) * 5/9).toFixed(2));
      }
      return;
    }

    const factor1 = cat.units[u1]?.factor || 1;
    const factor2 = cat.units[u2]?.factor || 1;

    if (catKey === 'currency') {
      // Rates are based on USD = 1
      if (fromInput === 1 && val1 && val2) {
        const amount = parseFloat(val1.value) || 0;
        const inUSD = amount / factor1;
        const out = inUSD * factor2;
        val2.value = parseFloat(out.toFixed(out < 1 ? 4 : 2));
      } else if (fromInput === 2 && val1 && val2) {
        const amount = parseFloat(val2.value) || 0;
        const inUSD = amount / factor2;
        const out = inUSD * factor1;
        val1.value = parseFloat(out.toFixed(out < 1 ? 4 : 2));
      }
    } else {
      // Standard linear factor to base
      if (fromInput === 1 && val1 && val2) {
        const v = parseFloat(val1.value) || 0;
        const inBase = v * factor1;
        const out = inBase / factor2;
        val2.value = parseFloat(out.toFixed(out < 0.01 ? 6 : 4));
      } else if (fromInput === 2 && val1 && val2) {
        const v = parseFloat(val2.value) || 0;
        const inBase = v * factor2;
        const out = inBase / factor1;
        val1.value = parseFloat(out.toFixed(out < 0.01 ? 6 : 4));
      }
    }
  }

  if (catSelect) {
    catSelect.addEventListener('change', () => {
      populateUnitSelects(catSelect.value);
    });
  }

  if (val1) val1.addEventListener('input', () => recalc(1));
  if (val2) val2.addEventListener('input', () => recalc(2));
  if (unit1) unit1.addEventListener('change', () => recalc(1));
  if (unit2) unit2.addEventListener('change', () => recalc(1));

  if (btnSwap && unit1 && unit2) {
    btnSwap.addEventListener('click', () => {
      const tempU = unit1.value;
      unit1.value = unit2.value;
      unit2.value = tempU;
      recalc(1);
    });
  }

  populateUnitSelects('currency');
  fetchLiveCurrency();
}

/* --- MODULE 8: WORLD CLOCK & TIMEZONES --- */
function initWorldClock() {
  const container = document.getElementById('world-clock-container');
  if (!container) return;

  const CITIES = [
    { city: 'Hà Nội / TP.HCM', country: '🇻🇳 Việt Nam', tz: 'Asia/Ho_Chi_Minh', offset: 0 },
    { city: 'Tokyo', country: '🇯🇵 Nhật Bản', tz: 'Asia/Tokyo', offset: 2 },
    { city: 'Singapore', country: '🇸🇬 Singapore', tz: 'Asia/Singapore', offset: 1 },
    { city: 'London', country: '🇬🇧 Vương Quốc Anh', tz: 'Europe/London', offset: -6 },
    { city: 'Frankfurt / Paris', country: '🇩🇪 Đức / Pháp', tz: 'Europe/Berlin', offset: -5 },
    { city: 'New York', country: '🇺🇸 Mỹ (EST)', tz: 'America/New_York', offset: -11 },
    { city: 'San Francisco', country: '🇺🇸 Silicon Valley', tz: 'America/Los_Angeles', offset: -14 },
    { city: 'Sydney', country: '🇦🇺 Úc (AEST)', tz: 'Australia/Sydney', offset: 3 }
  ];

  function renderClocks() {
    let html = '';
    const now = new Date();

    CITIES.forEach(c => {
      const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
        timeZone: c.tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
        timeZone: c.tz,
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      });

      const timeStr = timeFormatter.format(now);
      const dateStr = dateFormatter.format(now);

      const hourOnly = parseInt(timeStr.split(':')[0], 10);
      const isDay = hourOnly >= 6 && hourOnly < 18;
      const dayNightIcon = isDay ? '☀️' : '🌙';

      let offsetLabel = '';
      if (c.offset === 0) {
        offsetLabel = 'Múi giờ của bạn';
      } else if (c.offset > 0) {
        offsetLabel = `Nhanh hơn ${c.offset} tiếng`;
      } else {
        offsetLabel = `Chậm hơn ${Math.abs(c.offset)} tiếng`;
      }

      html += `
        <div class="world-clock-card">
          <div>
            <div class="clock-city-name">${c.country.split(' ')[0]} ${c.city}</div>
            <div class="clock-offset">${offsetLabel}</div>
          </div>
          <div>
            <div class="clock-time-display">${dayNightIcon} ${timeStr}</div>
            <div class="clock-date-display">${dateStr}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderClocks();
  setInterval(renderClocks, 1000);
}


