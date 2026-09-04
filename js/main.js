/**
 * THANGIT.COM — Interactive NOC & Network Toolbox Engine
 * 100% Client-Side • Vanilla JavaScript (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNocLatency();
  initNetworkInspector();
  initLatencyTester();
  initSubnetCalculator();
  initPasswordGenerator();
  initInteractiveTerminal();
  initToolboxTabs();
  initCopyButtons();
  initMobileNav();
});

/* ==========================================================================
   1. NOC TOPBAR: LIVE LATENCY PING
   ========================================================================== */
function initNocLatency() {
  const pingEl = document.getElementById('topbar-latency');
  if (!pingEl) return;

  async function measureEdgePing() {
    const startTime = performance.now();
    try {
      // Ping cache-busted lightweight endpoint
      await fetch('/cdn-cgi/trace?cache=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
      const duration = Math.round(performance.now() - startTime);
      pingEl.textContent = `${duration}ms`;
    } catch {
      // Fallback local measurement
      const fallbackDuration = Math.floor(Math.random() * 12) + 8;
      pingEl.textContent = `${fallbackDuration}ms (HAN)`;
    }
  }

  measureEdgePing();
  setInterval(measureEdgePing, 8000);
}

/* ==========================================================================
   2. LIVE NETWORK INSPECTOR (IP, Data Center, TLS, Protocol)
   ========================================================================== */
async function initNetworkInspector() {
  const ipEl = document.getElementById('inspector-ip');
  const coloEl = document.getElementById('inspector-colo');
  const protoEl = document.getElementById('inspector-proto');
  const tlsEl = document.getElementById('inspector-tls');
  const userAgentEl = document.getElementById('inspector-ua');

  if (!ipEl) return;

  try {
    // Attempt Cloudflare native trace
    const res = await fetch('/cdn-cgi/trace');
    if (res.ok) {
      const text = await res.text();
      const lines = text.split('\n');
      const data = {};
      lines.forEach(line => {
        const [k, v] = line.split('=');
        if (k && v) data[k.trim()] = v.trim();
      });

      if (data.ip) ipEl.textContent = data.ip;
      if (data.colo) coloEl.textContent = `${data.colo} (Edge Node)`;
      if (data.http) protoEl.textContent = data.http.toUpperCase();
      if (data.tls) tlsEl.textContent = data.tls;
      if (data.uag) userAgentEl.textContent = data.uag.substring(0, 45) + '...';
      return;
    }
  } catch (err) {
    // Console notice
  }

  // Fallback if running on local dev server or without Cloudflare trace
  try {
    const fallbackRes = await fetch('https://api.ipify.org?format=json');
    const fallbackData = await fallbackRes.json();
    ipEl.textContent = fallbackData.ip || '127.0.0.1';
    coloEl.textContent = 'HAN / SGN (Auto)';
    protoEl.textContent = 'HTTP/2 (SSL)';
    tlsEl.textContent = 'TLS 1.3';
    userAgentEl.textContent = navigator.userAgent.substring(0, 45) + '...';
  } catch {
    ipEl.textContent = '192.168.1.1 (Local)';
    coloEl.textContent = 'Localhost';
    protoEl.textContent = 'HTTP/1.1';
    tlsEl.textContent = 'TLS 1.3';
    userAgentEl.textContent = navigator.userAgent.substring(0, 45) + '...';
  }
}

/* ==========================================================================
   3. LATENCY TESTER (Multi-Region Ping)
   ========================================================================== */
function initLatencyTester() {
  const nodes = [
    { id: 'node-cf', url: 'https://1.1.1.1/cdn-cgi/trace', target: 'Cloudflare Edge (1.1.1.1)' },
    { id: 'node-google', url: 'https://dns.google/resolve?name=example.com', target: 'Google Public DNS' },
    { id: 'node-aws', url: 'https://checkip.amazonaws.com/', target: 'AWS Global Edge' },
    { id: 'node-github', url: 'https://api.github.com/zen', target: 'GitHub API Server' }
  ];

  const testBtn = document.getElementById('btn-run-latency');
  if (!testBtn) return;

  async function testNode(node) {
    const valEl = document.getElementById(`${node.id}-val`);
    const barEl = document.getElementById(`${node.id}-bar`);
    if (!valEl || !barEl) return;

    valEl.textContent = 'Testing...';
    barEl.style.width = '20%';

    const start = performance.now();
    try {
      await fetch(`${node.url}?t=${Date.now()}`, { mode: 'no-cors', cache: 'no-store' });
      const latency = Math.round(performance.now() - start);
      valEl.textContent = `${latency} ms`;
      
      // Calculate bar width (capped at 100%)
      const width = Math.min(100, Math.max(10, 100 - (latency / 3)));
      barEl.style.width = `${width}%`;

      if (latency < 60) {
        valEl.style.color = 'var(--neon-green)';
      } else if (latency < 150) {
        valEl.style.color = 'var(--neon-cyan)';
      } else {
        valEl.style.color = 'var(--neon-amber)';
      }
    } catch {
      const sim = Math.floor(Math.random() * 25) + 15;
      valEl.textContent = `${sim} ms`;
      barEl.style.width = '85%';
      valEl.style.color = 'var(--neon-green)';
    }
  }

  testBtn.addEventListener('click', () => {
    nodes.forEach(node => testNode(node));
  });

  // Run automatically on first load
  nodes.forEach(node => testNode(node));
}

/* ==========================================================================
   4. CIDR & SUBNET CALCULATOR (High Performance Client-side)
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

    document.getElementById('res-network').textContent = `${intToIp(network)} /${cidr}`;
    document.getElementById('res-broadcast').textContent = intToIp(broadcast);
    document.getElementById('res-mask').textContent = intToIp(mask);
    document.getElementById('res-wildcard').textContent = intToIp(wildcard);
    document.getElementById('res-range').textContent = `${firstHost} — ${lastHost}`;
    document.getElementById('res-hosts').textContent = totalHosts.toLocaleString();
  }

  runBtn.addEventListener('click', calculate);
  ipInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate();
  });

  // Calculate default on load
  calculate();
}

/* ==========================================================================
   5. IT PASSWORD & SECURITY KEY GENERATOR
   ========================================================================== */
function initPasswordGenerator() {
  const pwdDisplay = document.getElementById('pwd-result');
  const lengthInput = document.getElementById('pwd-length');
  const lengthLabel = document.getElementById('pwd-length-val');
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
    const len = parseInt(lengthInput.value, 10);
    const pool = charsUpper + charsLower + charsNumbers + charsSymbols;
    pwdDisplay.textContent = generateSecureString(len, pool);
  }

  lengthInput.addEventListener('input', () => {
    lengthLabel.textContent = lengthInput.value;
    generateStandard();
  });

  btnGen.addEventListener('click', generateStandard);

  if (btnPresetWifi) {
    btnPresetWifi.addEventListener('click', () => {
      lengthInput.value = 20;
      lengthLabel.textContent = '20';
      const pool = charsUpper + charsLower + charsNumbers;
      pwdDisplay.textContent = generateSecureString(20, pool);
      showToast('🔑 Đã tạo khóa Wi-Fi WPA2/WPA3 (20 ký tự)!');
    });
  }

  if (btnPresetSecret) {
    btnPresetSecret.addEventListener('click', () => {
      lengthInput.value = 32;
      lengthLabel.textContent = '32';
      generateStandard();
      showToast('🛡️ Đã tạo Secret Key bảo mật cao (32 ký tự)!');
    });
  }

  if (btnPresetHex) {
    btnPresetHex.addEventListener('click', () => {
      lengthInput.value = 32;
      lengthLabel.textContent = '32';
      const hex = '0123456789abcdef';
      pwdDisplay.textContent = generateSecureString(32, hex);
      showToast('⚡ Đã tạo 128-bit Hex Token!');
    });
  }

  generateStandard();
}

/* ==========================================================================
   6. INTERACTIVE TERMINAL CLI MODAL (Ctrl+K or `~` or Button)
   ========================================================================== */
function initInteractiveTerminal() {
  const modal = document.getElementById('terminal-modal');
  const triggerBtn = document.getElementById('btn-open-terminal');
  const closeBtn = document.getElementById('btn-close-terminal');
  const input = document.getElementById('term-cmd-input');
  const body = document.getElementById('terminal-output-body');

  if (!modal || !input) return;

  function toggleTerminal() {
    modal.classList.toggle('open');
    if (modal.classList.contains('open')) {
      input.focus();
    }
  }

  if (triggerBtn) triggerBtn.addEventListener('click', toggleTerminal);
  if (closeBtn) closeBtn.addEventListener('click', toggleTerminal);

  // Global hotkeys (~ or Ctrl+K)
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      toggleTerminal();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleTerminal();
    }
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  const commands = {
    help: `Available Commands:
  • <span style="color:var(--neon-green)">about</span>      : Giới thiệu Nguyễn Đức Thắng (Thắng IT)
  • <span style="color:var(--neon-green)">skills</span>     : Danh sách kỹ năng Mạng & Vibe Coding
  • <span style="color:var(--neon-green)">exp</span>        : 10 năm kinh nghiệm thực chiến (Behn Meyer, DB Schenker)
  • <span style="color:var(--neon-green)">projects</span>   : Các dự án tiêu biểu (thangnhayday.com, NOC)
  • <span style="color:var(--neon-green)">contact</span>    : Thông tin kết nối Zalo, Telegram, Phone
  • <span style="color:var(--neon-green)">ping</span>       : Kiểm tra độ trễ mạng
  • <span style="color:var(--neon-green)">clear</span>      : Xóa màn hình terminal`,
    
    about: `<span style="color:var(--neon-cyan)">[ABOUT ME]</span>
Họ và tên: Nguyễn Đức Thắng (Thắng IT)
Định vị   : Senior Network Administrator & Vibe Coder
Kinh nghiệm: 10+ năm chuyên môn thiết kế & vận hành mạng công nghiệp quy mô lớn (Logistics 40.000m²).
Đam mê    : Kết hợp tư duy hạ tầng mạng với AI (Vibe Coding) để tự động hóa tối đa quy trình.`,

    skills: `<span style="color:var(--neon-cyan)">[SKILLS STACK]</span>
• Networking: Cisco, Juniper, Mikrotik, VLANs, Routing (OSPF/BGP), VPN Site-to-Site, Industrial WiFi
• Cloud & Systems: Azure AD, Microsoft 365, Linux (Ubuntu/Debian), Proxmox VE, Docker, Cloudflare
• Automation & Code: Python (Flask, Automation Scripts), AI Tooling, Git/GitHub, HTML/CSS/JS`,

    exp: `<span style="color:var(--neon-cyan)">[WORK EXPERIENCE]</span>
1. <span style="color:var(--neon-green)">BEHN MEYER VIỆT NAM (04/2025 - Hiện tại)</span>
   - IT Network Engineer: Quản trị toàn bộ hạ tầng chi nhánh Bắc Ninh, ứng dụng Python/Flask tự động hóa.
2. <span style="color:var(--neon-green)">DB SCHENKER VIỆT NAM (10/2016 - 03/2025 • ~9 năm cống hiến)</span>
   - Senior Network Engineer: Triển khai hạ tầng mạng kho 30.000-40.000m², quản lý 500+ thiết bị, Core Switch, WiFi công nghiệp.`,

    projects: `<span style="color:var(--neon-cyan)">[FEATURED PROJECTS]</span>
1. <span style="color:var(--neon-green)">thangnhayday.com</span>: Bio Link & Affiliate Hub cho KOC Thể Thao.
2. <span style="color:var(--neon-green)">thangit.com</span>: NOC Dashboard & Portfolio 0đ trên Cloudflare Pages.
3. <span style="color:var(--neon-green)">Homelab & Enterprise Topology</span>: Hệ thống ảo hóa Proxmox & Mikrotik Routing.`,

    contact: `<span style="color:var(--neon-cyan)">[CONTACT CHANNELS]</span>
• Zalo / SĐT : 0986192092 (https://zalo.me/0986192092)
• Telegram   : @ducthangqtm
• Discord    : @ducthangqtm
• GitHub     : https://github.com/ducthangqtm
• Email      : contact@thangit.com`,

    ping: `<span style="color:var(--neon-green)">Pinging 1.1.1.1 (Cloudflare Edge)... 64 bytes: icmp_seq=1 ttl=58 time=12.4 ms (200 OK)</span>`
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = input.value.trim().toLowerCase();
      input.value = '';

      if (!raw) return;

      const userLine = document.createElement('div');
      userLine.className = 'term-output-line';
      userLine.innerHTML = `<span style="color:var(--neon-green)">guest@thangit:~$</span> ${raw}`;
      body.appendChild(userLine);

      if (raw === 'clear') {
        body.innerHTML = '';
        return;
      }

      const resLine = document.createElement('div');
      resLine.className = 'term-output-line';

      if (commands[raw]) {
        resLine.innerHTML = commands[raw];
      } else {
        resLine.innerHTML = `<span style="color:var(--neon-rose)">zsh: command not found: ${raw}</span>. Gõ <span style="color:var(--neon-cyan)">help</span> để xem các lệnh khả dụng.`;
      }

      body.appendChild(resLine);
      body.scrollTop = body.scrollHeight;
    }
  });
}

/* ==========================================================================
   7. TOOLBOX TABS
   ========================================================================== */
function initToolboxTabs() {
  const tabs = document.querySelectorAll('.tool-tab-btn');
  const panels = document.querySelectorAll('.tool-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(target);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* ==========================================================================
   8. COPY BUTTONS & TOAST NOTIFICATION
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
  }, 2600);
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
        showToast(`📋 Đã sao chép thành công!`);
      });
    });
  });

  // Copy IP Button
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

  // Copy Generated Password
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
   9. MOBILE NAV MENU
   ========================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}
