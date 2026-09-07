/**
 * THANGIT.COM — Shared Core Utilities
 * 100% Client-Side • Vanilla JavaScript (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initAnimatedFavicon();
  initServiceWorker();
  initPullToRefresh();
  initNetworkTools();
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

  document.querySelectorAll('[data-copy-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-copy-id');
      const el = document.getElementById(id);
      if (!el) return;
      const val = el.textContent.trim();
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

/* ==========================================================================
   NETWORK PRO TOOLS CONTROLLER (5-in-1 Interactive In-Place Experience)
   ========================================================================== */
function initNetworkTools() {
  const toolsContainer = document.getElementById('tab-tools');
  if (!toolsContainer) return;

  // 1. Tool Sub-Switcher
  initToolSwitcher();

  // 2. Subnet Calculator
  initSubnetUI();

  // 3. Wi-Fi QR Code Generator
  initWifiQrUI();

  // 4. Port & Service Directory
  initPortUI();

  // 5. My IP & Cloudflare DoH DNS
  initIpDnsUI();

  // 6. SysAdmin Password Generator
  initPasswordUI();
}

/* 1. Tool Sub-Switcher */
function initToolSwitcher() {
  const btns = document.querySelectorAll('#tools-subnav .tool-switcher-btn');
  const panels = document.querySelectorAll('#tab-tools .tool-panel');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const toolId = btn.getAttribute('data-tool');
      if (!toolId) return;

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach(p => {
        if (p.id === toolId) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      // Special triggers on tab activation
      if (toolId === 'tool-wifi') {
        const canvas = document.getElementById('wifi-qr-canvas');
        if (canvas && (!canvas.width || canvas.width < 100)) {
          triggerWifiQrRender();
        }
      } else if (toolId === 'tool-ipdns') {
        const ipVal = document.getElementById('wan-ip-val');
        if (ipVal && (ipVal.textContent.includes('Đang kiểm tra') || ipVal.textContent === '...')) {
          loadWanIp();
        }
      }
    });
  });
}

/* 2. Subnet Calculator UI */
function initSubnetUI() {
  const ipInput = document.getElementById('subnet-ip');
  const prefixSelect = document.getElementById('subnet-prefix');
  if (!ipInput || !prefixSelect) return;

  // Populate prefixes from /32 to /1 if empty
  if (prefixSelect.options.length === 0) {
    for (let p = 32; p >= 1; p--) {
      const opt = document.createElement('option');
      opt.value = p;
      let note = '';
      if (p === 24) note = ' - 254 Hosts (Mạng LAN)';
      else if (p === 16) note = ' - 65,534 Hosts (Doanh Nghiệp)';
      else if (p === 26) note = ' - 62 Hosts (Phòng ban)';
      else if (p === 27) note = ' - 30 Hosts (Phân đoạn)';
      else if (p === 28) note = ' - 14 Hosts (Server / DMZ)';
      else if (p === 29) note = ' - 6 Hosts (Cụm thiết bị)';
      else if (p === 30) note = ' - 2 Hosts (Point-to-Point / VPN)';
      else if (p === 32) note = ' - Single Host IP';
      else {
        const hosts = p === 31 ? 2 : Math.max(0, Math.pow(2, 32 - p) - 2);
        note = ` - ${hosts.toLocaleString('vi-VN')} Hosts`;
      }
      opt.textContent = `/${p}${note}`;
      if (p === 24) opt.selected = true;
      prefixSelect.appendChild(opt);
    }
  }

  function updateSubnet() {
    if (typeof calculateSubnet !== 'function') return;
    const ipStr = ipInput.value.trim();
    const prefix = prefixSelect.value;
    const res = calculateSubnet(ipStr, prefix);

    const netEl = document.getElementById('res-network');
    if (!res) {
      if (netEl) netEl.textContent = 'IP không hợp lệ';
      return;
    }

    const maskEl = document.getElementById('res-mask');
    const wildEl = document.getElementById('res-wildcard');
    const bcastEl = document.getElementById('res-broadcast');
    const rangeEl = document.getElementById('res-range');
    const hostsEl = document.getElementById('res-hosts');
    const typeEl = document.getElementById('res-type');

    if (maskEl) maskEl.textContent = res.subnetMask;
    if (wildEl) wildEl.textContent = res.wildcardMask;
    if (netEl) netEl.textContent = `${res.networkIp}/${res.prefix}`;
    if (bcastEl) bcastEl.textContent = res.broadcastIp;
    if (rangeEl) rangeEl.textContent = res.usableRange;
    if (hostsEl) hostsEl.textContent = `${res.usableHosts} (Tổng: ${res.totalHosts})`;
    if (typeEl) typeEl.textContent = `${res.ipClass} • ${res.ipType}`;
  }

  ipInput.addEventListener('input', updateSubnet);
  prefixSelect.addEventListener('change', updateSubnet);

  // Preset chips
  document.querySelectorAll('#tool-subnet .tool-chip[data-prefix]').forEach(chip => {
    chip.addEventListener('click', () => {
      const p = chip.getAttribute('data-prefix');
      if (p && prefixSelect) {
        prefixSelect.value = p;
        updateSubnet();
      }
    });
  });

  // Summary copy button
  const btnSummary = document.getElementById('btn-copy-subnet-summary');
  if (btnSummary) {
    btnSummary.addEventListener('click', () => {
      const ip = ipInput.value.trim();
      const prefix = prefixSelect.value;
      const mask = document.getElementById('res-mask')?.textContent || '';
      const wildcard = document.getElementById('res-wildcard')?.textContent || '';
      const net = document.getElementById('res-network')?.textContent || '';
      const bcast = document.getElementById('res-broadcast')?.textContent || '';
      const range = document.getElementById('res-range')?.textContent || '';
      const hosts = document.getElementById('res-hosts')?.textContent || '';
      const type = document.getElementById('res-type')?.textContent || '';

      const summary = [
        `=== BẢNG TỔNG HỢP SUBNET & CIDR ===`,
        `Địa chỉ IP: ${ip}/${prefix}`,
        `Subnet Mask: ${mask}`,
        `Wildcard Mask: ${wildcard}`,
        `Network ID: ${net}`,
        `Broadcast IP: ${bcast}`,
        `Dải IP khả dụng: ${range}`,
        `Số lượng Host: ${hosts}`,
        `Phân loại: ${type}`,
        `Công cụ tính toán: https://thangit.com`
      ].join('\n');

      navigator.clipboard.writeText(summary).then(() => {
        showToast('📋 Đã sao chép toàn bộ bảng Subnet!');
      }).catch(() => {
        showToast('📋 Đã sao chép!');
      });
    });
  }

  // Initial calculation
  updateSubnet();
}

/* 3. Wi-Fi QR Code Generator UI */
function triggerWifiQrRender() {
  const canvas = document.getElementById('wifi-qr-canvas');
  if (!canvas) return;

  const ssid = document.getElementById('wifi-ssid')?.value.trim() || 'ThangIT_Office_5G';
  const pass = document.getElementById('wifi-pass')?.value || 'thangit@2026';
  const auth = document.getElementById('wifi-auth')?.value || 'WPA';
  const hidden = document.getElementById('wifi-hidden')?.checked || false;

  const qrStr = typeof formatWifiQrString === 'function'
    ? formatWifiQrString(ssid, pass, auth, hidden)
    : `WIFI:T:${auth};S:${ssid};P:${pass};;`;

  if (window.TiTQR && window.TiTQR.render) {
    window.TiTQR.render(canvas, {
      text: qrStr,
      size: 220,
      colorDark: '#06080d',
      colorLight: '#ffffff'
    });
  }
}

function initWifiQrUI() {
  const ssidInput = document.getElementById('wifi-ssid');
  const passInput = document.getElementById('wifi-pass');
  const authSelect = document.getElementById('wifi-auth');
  const hiddenCheck = document.getElementById('wifi-hidden');

  if (!ssidInput || !passInput) return;

  // Default seed values if empty
  if (!ssidInput.value) ssidInput.value = 'ThangIT_Office_5G';
  if (!passInput.value) passInput.value = 'thangit@2026';

  let debounceTimer = null;
  function scheduleRender() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(triggerWifiQrRender, 200);
  }

  ssidInput.addEventListener('input', scheduleRender);
  passInput.addEventListener('input', scheduleRender);
  if (authSelect) authSelect.addEventListener('change', scheduleRender);
  if (hiddenCheck) hiddenCheck.addEventListener('change', scheduleRender);

  // Download PNG Button
  const btnDownload = document.getElementById('btn-download-wifi-qr');
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const canvas = document.getElementById('wifi-qr-canvas');
      if (!canvas) return;
      const ssid = (ssidInput.value.trim() || 'wifi').replace(/[^a-zA-Z0-9_-]/g, '_');
      const link = document.createElement('a');
      link.download = `wifi-qr-${ssid}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('📥 Đã tải ảnh mã QR Wi-Fi!');
    });
  }

  // Print Poster Button
  const btnPrint = document.getElementById('btn-print-wifi-qr');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      const canvas = document.getElementById('wifi-qr-canvas');
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const ssid = ssidInput.value.trim() || 'Mạng Wi-Fi';
      const pass = passInput.value || '(Không có mật khẩu)';
      const auth = authSelect ? authSelect.options[authSelect.selectedIndex].text : 'WPA2/WPA3';

      const printWin = window.open('', '_blank', 'width=600,height=720');
      if (!printWin) {
        showToast('⚠️ Vui lòng mở quyền Pop-up trình duyệt để in!');
        return;
      }
      printWin.document.write(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <title>Mã QR Wi-Fi - ${ssid}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 40px 20px; color: #111; background: #fff; }
            .card { max-width: 380px; margin: 0 auto; border: 2px dashed #333; border-radius: 16px; padding: 30px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            h2 { margin: 0 0 8px; font-size: 22px; color: #000; letter-spacing: 0.5px; }
            p { margin: 6px 0 16px; font-size: 14px; color: #666; }
            .qr-img { width: 220px; height: 220px; margin: 0 auto 16px; display: block; border-radius: 8px; border: 1px solid #e5e7eb; }
            .info-box { background: #f8fafc; border-radius: 10px; padding: 14px 16px; text-align: left; font-size: 14px; border: 1px solid #e2e8f0; }
            .info-item { margin: 6px 0; }
            .info-item strong { color: #0f172a; font-family: monospace; font-size: 15px; }
            .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>📶 QUÉT ĐỂ KẾT NỐI WI-FI</h2>
            <p>Mở ứng dụng Camera điện thoại để quét và kết nối tự động</p>
            <img src="${dataUrl}" class="qr-img" alt="Wi-Fi QR">
            <div class="info-box">
              <div class="info-item">Tên Wi-Fi (SSID): <strong>${ssid}</strong></div>
              <div class="info-item">Mật khẩu: <strong>${pass}</strong></div>
              <div class="info-item">Bảo mật: <span>${auth}</span></div>
            </div>
            <div class="footer">Hạ Tầng Mạng Thắng IT • thangit.com</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWin.document.close();
    });
  }

  // Initial QR render
  triggerWifiQrRender();
}

/* 4. Port & Service Directory UI */
function initPortUI() {
  const container = document.getElementById('port-items-container');
  const searchInput = document.getElementById('port-search-input');
  const countBadge = document.getElementById('port-count-badge');
  const chipContainer = document.getElementById('port-filter-chips');

  if (!container || !searchInput) return;

  let activeCat = 'all';
  let searchVal = '';

  function renderPorts() {
    if (!window.NETWORK_PORTS_DATABASE) return;

    const q = searchVal.toLowerCase().trim();
    const list = window.NETWORK_PORTS_DATABASE.filter(item => {
      const matchCat = (activeCat === 'all') || (item.cat === activeCat);
      if (!matchCat) return false;
      if (!q) return true;
      return (
        item.port.toString().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.proto.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      );
    });

    if (countBadge) {
      countBadge.textContent = `${list.length} / ${window.NETWORK_PORTS_DATABASE.length} Ports`;
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 2rem 1rem; color:var(--text-dim); font-size:0.85rem;">
          Không tìm thấy cổng nào khớp với "<strong>${q}</strong>"
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => `
      <div class="port-item-card">
        <div class="port-num-badge">
          <span class="port-num">${item.port}</span>
          <span class="port-proto">${item.proto}</span>
        </div>
        <div class="port-info">
          <div class="port-name">${item.name}</div>
          <div class="port-desc">${item.desc}</div>
        </div>
        <button type="button" class="copy-mini-btn" data-copy="${item.port}" title="Sao chép cổng ${item.port}">
          <i class="far fa-copy"></i>
        </button>
      </div>
    `).join('');

    initCopyButtons();
  }

  searchInput.addEventListener('input', (e) => {
    searchVal = e.target.value;
    renderPorts();
  });

  if (chipContainer) {
    chipContainer.querySelectorAll('.tool-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chipContainer.querySelectorAll('.tool-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCat = chip.getAttribute('data-cat') || 'all';
        renderPorts();
      });
    });
  }

  renderPorts();
}

/* 5. My IP & Cloudflare DoH DNS UI */
async function loadWanIp() {
  const ipValEl = document.getElementById('wan-ip-val');
  if (!ipValEl) return;
  ipValEl.textContent = 'Đang kiểm tra...';
  ipValEl.style.opacity = '0.6';

  try {
    const res = typeof fetchClientIpInfo === 'function' 
      ? await fetchClientIpInfo() 
      : { ip: '127.0.0.1' };

    ipValEl.textContent = res.ip;
    ipValEl.style.opacity = '1';

    const btnCopy = document.getElementById('btn-copy-wan-ip');
    if (btnCopy) btnCopy.setAttribute('data-copy', res.ip);
  } catch {
    ipValEl.textContent = 'Không thể lấy IP';
    ipValEl.style.opacity = '1';
  }
}

function initIpDnsUI() {
  // WAN IP refresh button
  const btnRefresh = document.getElementById('btn-refresh-ip');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      const icon = btnRefresh.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
      loadWanIp().finally(() => {
        setTimeout(() => {
          if (icon) icon.classList.remove('fa-spin');
        }, 500);
      });
    });
  }

  // Cloudflare DoH Query
  const btnQuery = document.getElementById('btn-query-dns');
  const domainInput = document.getElementById('dns-domain');
  const typeSelect = document.getElementById('dns-type');
  const resultsBox = document.getElementById('dns-results-container');

  async function handleDnsQuery() {
    if (!domainInput || !typeSelect || !resultsBox) return;
    const domain = domainInput.value.trim();
    const type = typeSelect.value;
    if (!domain) {
      showToast('⚠️ Vui lòng nhập tên miền cần tra cứu!');
      domainInput.focus();
      return;
    }

    resultsBox.style.display = 'block';
    resultsBox.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; gap:8px; padding:1.2rem; color:var(--neon-cyan); font-size:0.85rem;">
        <i class="fas fa-spinner fa-spin"></i> Đang truy vấn Cloudflare 1.1.1.1 DoH...
      </div>
    `;

    try {
      const data = typeof queryCloudflareDoH === 'function'
        ? await queryCloudflareDoH(domain, type)
        : null;

      if (!data) throw new Error('Không có dữ liệu phản hồi');

      if (data.Status === 3) {
        resultsBox.innerHTML = `
          <div style="padding:1rem; text-align:center; color:var(--neon-rose); font-size:0.85rem;">
            ❌ Tên miền không tồn tại (NXDOMAIN).
          </div>
        `;
        return;
      }

      const answers = data.Answer || [];
      if (answers.length === 0) {
        resultsBox.innerHTML = `
          <div style="padding:1rem; text-align:center; color:var(--text-dim); font-size:0.85rem;">
            ℹ️ Không tìm thấy bản ghi <strong>${type}</strong> nào cho <strong>${domain}</strong>.
          </div>
        `;
        return;
      }

      resultsBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:0.75rem; color:var(--text-dim); border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px;">
          <span>Tìm thấy <strong>${answers.length}</strong> bản ghi (${type}):</span>
          <span style="color:#00ff9d; font-size:0.7rem;">✓ Cloudflare 1.1.1.1 DoH</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${answers.map(ans => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.35); padding:8px 10px; border-radius:6px; font-family:var(--font-mono); font-size:0.8rem; border:1px solid rgba(255,255,255,0.04);">
              <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-right:8px;">
                <span style="color:var(--neon-cyan);">${ans.data}</span>
                <span style="color:var(--text-dim); font-size:0.7rem; margin-left:6px;">(TTL: ${ans.TTL}s)</span>
              </div>
              <button type="button" class="copy-mini-btn" data-copy="${ans.data}" title="Sao chép kết quả">
                <i class="far fa-copy"></i>
              </button>
            </div>
          `).join('')}
        </div>
      `;
      initCopyButtons();
    } catch (err) {
      resultsBox.innerHTML = `
        <div style="padding:1rem; text-align:center; color:var(--neon-rose); font-size:0.85rem;">
          ❌ Lỗi truy vấn DoH: ${err.message || 'Không thể kết nối máy chủ Cloudflare'}
        </div>
      `;
    }
  }

  if (btnQuery) btnQuery.addEventListener('click', handleDnsQuery);
  if (domainInput) {
    domainInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleDnsQuery();
    });
  }
}

/* 6. SysAdmin Password Generator UI */
function initPasswordUI() {
  const slider = document.getElementById('pwd-length-slider');
  const lengthVal = document.getElementById('pwd-length-val');
  const output = document.getElementById('pwd-output');
  const strengthLbl = document.getElementById('pwd-strength-label');
  const strengthFill = document.getElementById('pwd-strength-fill');
  const btnGen = document.getElementById('btn-generate-pwd');
  const btnCopy = document.getElementById('btn-copy-pwd');

  function update() {
    if (!slider || !output || typeof generateSecurePassword !== 'function') return;
    const len = parseInt(slider.value, 10) || 16;
    if (lengthVal) lengthVal.textContent = `${len} ký tự`;

    const upper = document.getElementById('pwd-opt-upper')?.checked ?? true;
    const lower = document.getElementById('pwd-opt-lower')?.checked ?? true;
    const nums = document.getElementById('pwd-opt-nums')?.checked ?? true;
    const symbols = document.getElementById('pwd-opt-symbols')?.checked ?? true;
    const noAmbig = document.getElementById('pwd-opt-noambig')?.checked ?? true;

    const res = generateSecurePassword(len, upper, lower, nums, symbols, noAmbig);
    output.textContent = res.password;

    if (strengthLbl) {
      strengthLbl.textContent = `${res.strength} (${res.entropy} bits)`;
      strengthLbl.style.color = res.strengthColor;
    }
    if (strengthFill) {
      strengthFill.style.width = `${res.strengthPercent}%`;
      strengthFill.style.background = res.strengthColor;
    }
  }

  if (slider) slider.addEventListener('input', update);
  ['pwd-opt-upper', 'pwd-opt-lower', 'pwd-opt-nums', 'pwd-opt-symbols', 'pwd-opt-noambig'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', update);
  });

  if (btnGen) {
    btnGen.addEventListener('click', () => {
      const icon = btnGen.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
      update();
      setTimeout(() => {
        if (icon) icon.classList.remove('fa-spin');
      }, 300);
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      if (!output) return;
      const pwd = output.textContent.trim();
      navigator.clipboard.writeText(pwd).then(() => {
        showToast('🔑 Đã sao chép mật khẩu an toàn!');
      }).catch(() => {
        showToast('📋 Đã sao chép!');
      });
    });
  }

  // Generate default on page ready
  update();
}
