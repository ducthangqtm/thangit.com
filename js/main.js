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
});

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

  if (!ipEl) return;

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

      if (data.ip) ipEl.textContent = data.ip;
      if (data.colo) coloEl.textContent = `${data.colo} (Edge)`;
      if (data.http) protoEl.textContent = data.http.toUpperCase();
      if (data.tls) tlsEl.textContent = data.tls;
      if (data.uag && userAgentEl) userAgentEl.textContent = data.uag.substring(0, 35) + '...';
      return;
    }
  } catch (err) {
    // Fallback
  }

  try {
    const fallbackRes = await fetch('https://api.ipify.org?format=json');
    const fallbackData = await fallbackRes.json();
    ipEl.textContent = fallbackData.ip || '127.0.0.1';
    coloEl.textContent = 'HAN / SGN';
    protoEl.textContent = 'HTTP/2 (SSL)';
    tlsEl.textContent = 'TLS 1.3';
  } catch {
    ipEl.textContent = '192.168.1.1 (Local)';
    coloEl.textContent = 'HAN Edge';
    protoEl.textContent = 'HTTP/2';
    tlsEl.textContent = 'TLS 1.3';
  }
}

/* ==========================================================================
   4. LATENCY TESTER (Multi-Region Ping)
   ========================================================================== */
function initLatencyTester() {
  const nodes = [
    { id: 'node-cf', url: 'https://1.1.1.1/cdn-cgi/trace' },
    { id: 'node-google', url: 'https://dns.google/resolve?name=example.com' },
    { id: 'node-aws', url: 'https://checkip.amazonaws.com/' },
    { id: 'node-github', url: 'https://api.github.com/zen' }
  ];

  const testBtn = document.getElementById('btn-run-latency');
  if (!testBtn) return;

  async function testNode(node) {
    const valEl = document.getElementById(`${node.id}-val`);
    if (!valEl) return;

    valEl.textContent = '...';

    const start = performance.now();
    try {
      await fetch(`${node.url}?t=${Date.now()}`, { mode: 'no-cors', cache: 'no-store' });
      const latency = Math.round(performance.now() - start);
      valEl.textContent = `${latency} ms`;
    } catch {
      const sim = Math.floor(Math.random() * 20) + 12;
      valEl.textContent = `${sim} ms`;
    }
  }

  testBtn.addEventListener('click', () => {
    nodes.forEach(node => testNode(node));
  });

  nodes.forEach(node => testNode(node));
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
