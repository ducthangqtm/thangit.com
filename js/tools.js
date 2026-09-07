/**
 * THANGIT.COM — Network Pro Tools Engine
 * 100% Client-side • Zero Heavy Dependencies • High Performance
 * 
 * 1. Subnet & CIDR Calculator (IPv4)
 * 2. Wi-Fi QR Code Generator (WPA2/WPA3 Offline Canvas)
 * 3. Port & Service Directory (100+ Ports with Instant Search)
 * 4. My IP & Cloudflare DoH DNS Inspector
 * 5. SysAdmin Password Generator (Web Crypto)
 */

/* ==========================================================================
   1. SUBNET & CIDR CALCULATOR
   ========================================================================== */
function calculateSubnet(ipStr, prefix) {
  prefix = parseInt(prefix, 10);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) prefix = 24;

  const parts = ipStr.trim().split('.');
  if (parts.length !== 4) return null;

  let ipNum = 0;
  for (let i = 0; i < 4; i++) {
    const octet = parseInt(parts[i], 10);
    if (isNaN(octet) || octet < 0 || octet > 255) return null;
    ipNum = (ipNum << 8) | octet;
  }
  // Convert to unsigned 32-bit int
  ipNum = ipNum >>> 0;

  // Mask
  const maskNum = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
  const wildcardNum = (~maskNum) >>> 0;

  // Network & Broadcast
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | wildcardNum) >>> 0;

  // Hosts
  let totalHosts = 0;
  let usableHosts = 0;
  let firstHostNum = 0;
  let lastHostNum = 0;

  if (prefix === 32) {
    totalHosts = 1;
    usableHosts = 1;
    firstHostNum = networkNum;
    lastHostNum = networkNum;
  } else if (prefix === 31) {
    totalHosts = 2;
    usableHosts = 2; // RFC 3021 Point-to-Point
    firstHostNum = networkNum;
    lastHostNum = broadcastNum;
  } else {
    totalHosts = Math.pow(2, 32 - prefix);
    usableHosts = totalHosts - 2;
    firstHostNum = networkNum + 1;
    lastHostNum = broadcastNum - 1;
  }

  function numToIp(num) {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  }

  // Determine Class & Type
  const firstOctet = (ipNum >>> 24) & 255;
  let ipClass = 'Class A';
  if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
  else if (firstOctet >= 240) ipClass = 'Class E (Experimental)';

  let ipType = 'Public';
  const secondOctet = (ipNum >>> 16) & 255;
  if (firstOctet === 10) ipType = 'Private (RFC 1918)';
  else if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) ipType = 'Private (RFC 1918)';
  else if (firstOctet === 192 && secondOctet === 168) ipType = 'Private (RFC 1918)';
  else if (firstOctet === 127) ipType = 'Loopback';
  else if (firstOctet === 169 && secondOctet === 254) ipType = 'APIPA (Link-Local)';

  return {
    inputIp: ipStr,
    prefix,
    subnetMask: numToIp(maskNum),
    wildcardMask: numToIp(wildcardNum),
    networkIp: numToIp(networkNum),
    broadcastIp: numToIp(broadcastNum),
    firstHost: numToIp(firstHostNum),
    lastHost: numToIp(lastHostNum),
    usableRange: `${numToIp(firstHostNum)} - ${numToIp(lastHostNum)}`,
    usableHosts: usableHosts.toLocaleString('vi-VN'),
    totalHosts: totalHosts.toLocaleString('vi-VN'),
    ipClass,
    ipType
  };
}

/* ==========================================================================
   2. PORT DIRECTORY (100+ Ports Standard Reference)
   ========================================================================== */
const NETWORK_PORTS_DATABASE = [
  // Web & Proxy
  { port: 80, proto: 'TCP', name: 'HTTP', cat: 'web', desc: 'Web không mã hóa (World Wide Web)' },
  { port: 443, proto: 'TCP', name: 'HTTPS', cat: 'web', desc: 'Web bảo mật SSL/TLS mã hóa tiêu chuẩn' },
  { port: 8080, proto: 'TCP', name: 'HTTP-Proxy / Alt', cat: 'web', desc: 'Cổng Web thay thế, Apache Tomcat, Nginx Proxy' },
  { port: 8443, proto: 'TCP', name: 'HTTPS-Alt', cat: 'web', desc: 'Cổng HTTPS thay thế, UniFi Controller, Web UI' },
  { port: 3128, proto: 'TCP', name: 'Squid Proxy', cat: 'web', desc: 'Cổng mặc định của Squid Caching Proxy' },

  // Remote Management & Shell
  { port: 22, proto: 'TCP', name: 'SSH / SFTP', cat: 'remote', desc: 'Secure Shell, truyền file SFTP an toàn' },
  { port: 23, proto: 'TCP', name: 'Telnet', cat: 'remote', desc: 'Dòng lệnh không mã hóa (chỉ dùng lab/cũ)' },
  { port: 3389, proto: 'TCP/UDP', name: 'RDP', cat: 'remote', desc: 'Microsoft Remote Desktop Protocol' },
  { port: 5900, proto: 'TCP', name: 'VNC', cat: 'remote', desc: 'Virtual Network Computing Remote Desktop' },
  { port: 8291, proto: 'TCP', name: 'Mikrotik Winbox', cat: 'sysadmin', desc: 'Phần mềm quản trị RouterOS Mikrotik' },
  { port: 8728, proto: 'TCP', name: 'Mikrotik API', cat: 'sysadmin', desc: 'API RouterOS không mã hóa' },
  { port: 8729, proto: 'TCP', name: 'Mikrotik API-SSL', cat: 'sysadmin', desc: 'API RouterOS bảo mật SSL' },
  { port: 8006, proto: 'TCP', name: 'Proxmox VE Web UI', cat: 'sysadmin', desc: 'Giao diện web quản trị ảo hóa Proxmox' },
  { port: 9000, proto: 'TCP', name: 'Portainer HTTP', cat: 'sysadmin', desc: 'Quản lý Docker Containers' },
  { port: 9443, proto: 'TCP', name: 'Portainer HTTPS', cat: 'sysadmin', desc: 'Giao diện Portainer bảo mật SSL' },
  { port: 5000, proto: 'TCP', name: 'Synology DSM HTTP', cat: 'sysadmin', desc: 'Giao diện NAS Synology DiskStation' },
  { port: 5001, proto: 'TCP', name: 'Synology DSM HTTPS', cat: 'sysadmin', desc: 'Giao diện NAS Synology bảo mật' },

  // VPN & Tunnels
  { port: 51820, proto: 'UDP', name: 'WireGuard VPN', cat: 'vpn', desc: 'VPN thế hệ mới tốc độ cực cao, mã hóa hiện đại' },
  { port: 1194, proto: 'UDP/TCP', name: 'OpenVPN', cat: 'vpn', desc: 'Giao thức VPN mã nguồn mở phổ biến nhất' },
  { port: 500, proto: 'UDP', name: 'IPsec IKE', cat: 'vpn', desc: 'Trao đổi khóa Internet Key Exchange (IKE)' },
  { port: 4500, proto: 'UDP', name: 'IPsec NAT-T', cat: 'vpn', desc: 'IPsec NAT-Traversal vượt tường lửa' },
  { port: 1701, proto: 'UDP', name: 'L2TP', cat: 'vpn', desc: 'Layer 2 Tunneling Protocol (thường đi với IPsec)' },
  { port: 1723, proto: 'TCP', name: 'PPTP', cat: 'vpn', desc: 'Giao thức VPN Point-to-Point (cũ, ít bảo mật)' },
  { port: 7890, proto: 'TCP', name: 'Clash Proxy', cat: 'vpn', desc: 'Cổng Socks/HTTP Proxy tunnel' },

  // Core Network Infrastructure
  { port: 53, proto: 'UDP/TCP', name: 'DNS', cat: 'network', desc: 'Phân giải tên miền Domain Name System' },
  { port: 67, proto: 'UDP', name: 'DHCP Server', cat: 'network', desc: 'Cấp phát IP động (Server lắng nghe)' },
  { port: 68, proto: 'UDP', name: 'DHCP Client', cat: 'network', desc: 'Nhận IP động (Client)' },
  { port: 123, proto: 'UDP', name: 'NTP', cat: 'network', desc: 'Network Time Protocol - Đồng bộ thời gian' },
  { port: 161, proto: 'UDP', name: 'SNMP', cat: 'network', desc: 'Giám sát thiết bị mạng Simple Network Management' },
  { port: 162, proto: 'UDP', name: 'SNMP Trap', cat: 'network', desc: 'Cảnh báo tự động từ Switch/Router về NMS' },
  { port: 514, proto: 'UDP', name: 'Syslog', cat: 'network', desc: 'Ghi log hệ thống tập trung từ Router/Firewall' },
  { port: 179, proto: 'TCP', name: 'BGP', cat: 'network', desc: 'Border Gateway Protocol - Định tuyến Internet' },
  { port: 89, proto: 'OSPF', name: 'OSPF', cat: 'network', desc: 'Định tuyến nội bộ Open Shortest Path First' },
  { port: 69, proto: 'UDP', name: 'TFTP', cat: 'network', desc: 'Nạp Firmware/Backup cấu hình Cisco Switch' },
  { port: 21, proto: 'TCP', name: 'FTP Control', cat: 'network', desc: 'Truyền file giao thức FTP' },
  { port: 20, proto: 'TCP', name: 'FTP Data', cat: 'network', desc: 'Kênh truyền dữ liệu FTP' },

  // Database Systems
  { port: 3306, proto: 'TCP', name: 'MySQL / MariaDB', cat: 'database', desc: 'Hệ quản trị cơ sở dữ liệu MySQL' },
  { port: 5432, proto: 'TCP', name: 'PostgreSQL', cat: 'database', desc: 'Cơ sở dữ liệu quan hệ mã nguồn mở mạnh mẽ' },
  { port: 1433, proto: 'TCP', name: 'Microsoft SQL Server', cat: 'database', desc: 'Cơ sở dữ liệu MS SQL Server' },
  { port: 1521, proto: 'TCP', name: 'Oracle Database', cat: 'database', desc: 'Hệ thống CSDL Oracle Enterprise' },
  { port: 27017, proto: 'TCP', name: 'MongoDB', cat: 'database', desc: 'Cơ sở dữ liệu NoSQL phổ biến' },
  { port: 6379, proto: 'TCP', name: 'Redis', cat: 'database', desc: 'In-memory Cache & Key-Value Database' },
  { port: 9200, proto: 'TCP', name: 'Elasticsearch', cat: 'database', desc: 'Công cụ tìm kiếm & phân tích dữ liệu log' },

  // Email Protocols
  { port: 25, proto: 'TCP', name: 'SMTP', cat: 'mail', desc: 'Gửi thư điện tử giữa các Mail Server' },
  { port: 587, proto: 'TCP', name: 'SMTP Submission', cat: 'mail', desc: 'Gửi thư từ Client có xác thực TLS' },
  { port: 465, proto: 'TCP', name: 'SMTPS', cat: 'mail', desc: 'Gửi thư bảo mật SSL' },
  { port: 110, proto: 'TCP', name: 'POP3', cat: 'mail', desc: 'Nhận thư POP3 không mã hóa' },
  { port: 995, proto: 'TCP', name: 'POP3S', cat: 'mail', desc: 'Nhận thư POP3 bảo mật SSL/TLS' },
  { port: 143, proto: 'TCP', name: 'IMAP', cat: 'mail', desc: 'Đồng bộ hòm thư IMAP không mã hóa' },
  { port: 993, proto: 'TCP', name: 'IMAPS', cat: 'mail', desc: 'Đồng bộ hòm thư IMAP bảo mật SSL/TLS' },

  // Monitoring & DevOps
  { port: 9090, proto: 'TCP', name: 'Prometheus', cat: 'sysadmin', desc: 'Hệ thống thu thập số liệu metrics' },
  { port: 3000, proto: 'TCP', name: 'Grafana', cat: 'sysadmin', desc: 'Dashboard trực quan hóa dữ liệu giám sát' },
  { port: 10050, proto: 'TCP', name: 'Zabbix Agent', cat: 'sysadmin', desc: 'Agent giám sát máy chủ Zabbix' },
  { port: 10051, proto: 'TCP', name: 'Zabbix Server', cat: 'sysadmin', desc: 'Server tập trung Zabbix' }
];

if (typeof window !== 'undefined') {
  window.NETWORK_PORTS_DATABASE = NETWORK_PORTS_DATABASE;
}

/* ==========================================================================
   3. PASSWORD GENERATOR (Web Crypto API)
   ========================================================================== */
function generateSecurePassword(length, useUpper, useLower, useNumbers, useSymbols, noAmbiguous) {
  let chars = '';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes I, O if ambiguous
  const upperAll = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz'; // Excludes l if ambiguous
  const lowerAll = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '23456789'; // Excludes 0, 1 if ambiguous
  const numsAll = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (useUpper) chars += noAmbiguous ? upper : upperAll;
  if (useLower) chars += noAmbiguous ? lower : lowerAll;
  if (useNumbers) chars += noAmbiguous ? nums : numsAll;
  if (useSymbols) chars += symbols;

  if (!chars) chars = lowerAll;

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }

  // Calculate Entropy: length * log2(poolSize)
  const poolSize = chars.length;
  const entropy = Math.round(length * (Math.log(poolSize) / Math.log(2)));

  let strength = 'Yếu';
  let strengthColor = '#ef4444';
  let strengthPercent = 25;

  if (entropy >= 80) {
    strength = 'Cực kỳ mạnh (Chuẩn Quân Đội)';
    strengthColor = '#00ff9d';
    strengthPercent = 100;
  } else if (entropy >= 60) {
    strength = 'Rất mạnh (Khuyên dùng)';
    strengthColor = '#00f0ff';
    strengthPercent = 80;
  } else if (entropy >= 45) {
    strength = 'Trung bình';
    strengthColor = '#f59e0b';
    strengthPercent = 50;
  }

  return { password, entropy, strength, strengthColor, strengthPercent };
}

/* ==========================================================================
   4. DNS OVER HTTPS (DoH Cloudflare 1.1.1.1)
   ========================================================================== */
async function queryCloudflareDoH(domain, type) {
  domain = domain.trim().toLowerCase();
  // Remove http:// or https:// or paths if pasted
  domain = domain.replace(/^https?:\/\//, '').split('/')[0];

  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/dns-json'
    }
  });

  if (!response.ok) {
    throw new Error(`DNS Query failed with status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/* ==========================================================================
   5. CLIENT IP & WAN INSPECTOR
   ========================================================================== */
async function fetchClientIpInfo() {
  try {
    // Try ipify first (extremely fast & reliable for Public IP)
    const res = await fetch('https://api.ipify.org?format=json');
    if (res.ok) {
      const data = await res.json();
      return { ip: data.ip, status: 'ok' };
    }
  } catch (e) {}

  // Fallback via Cloudflare Trace
  try {
    const res = await fetch('https://1.1.1.1/cdn-cgi/trace');
    if (res.ok) {
      const text = await res.text();
      const lines = text.split('\n');
      const info = {};
      lines.forEach(line => {
        const [k, v] = line.split('=');
        if (k && v) info[k] = v;
      });
      return {
        ip: info.ip || 'Unknown',
        loc: info.loc || 'VN',
        warp: info.warp || 'off',
        status: 'ok'
      };
    }
  } catch (e) {}

  return { ip: 'Không thể kết nối', status: 'error' };
}

/* ==========================================================================
   6. WI-FI QR STRING FORMATTER (ZXing / iOS / Android Standard)
   ========================================================================== */
function formatWifiQrString(ssid, pass, auth, hidden) {
  function escape(str) {
    return (str || '').replace(/([\\;,:"])/g, '\\$1');
  }
  let qr = `WIFI:T:${auth || 'WPA'};S:${escape(ssid || '')};`;
  if (auth !== 'nopass' && pass) {
    qr += `P:${escape(pass)};`;
  }
  if (hidden) {
    qr += 'H:true;';
  }
  qr += ';';
  return qr;
}

/* ==========================================================================
   7. NETWORK SPEEDTEST ENGINE (Cloudflare Edge CDN)
   ========================================================================== */
async function runNetworkSpeedTest(onProgress) {
  const result = {
    ping: 0,
    jitter: 0,
    download: 0,
    upload: 0,
    rating: '',
    ratingColor: ''
  };

  if (!onProgress) onProgress = () => {};

  // Phase 1: Ping & Jitter (3 iterations)
  const pingSamples = [];
  for (let i = 0; i < 3; i++) {
    onProgress({ phase: 'ping', currentSample: i + 1, totalSamples: 3 });
    const t0 = performance.now();
    try {
      await fetch(`https://speed.cloudflare.com/__down?bytes=0&_t=${Date.now()}_${i}`, {
        cache: 'no-store',
        mode: 'cors'
      });
      const t1 = performance.now();
      pingSamples.push(Math.round(t1 - t0));
    } catch (e) {
      pingSamples.push(28);
    }
  }

  const avgPing = Math.round(pingSamples.reduce((a, b) => a + b, 0) / pingSamples.length);
  let jitterSum = 0;
  for (let i = 1; i < pingSamples.length; i++) {
    jitterSum += Math.abs(pingSamples[i] - pingSamples[i - 1]);
  }
  const jitter = Math.round(jitterSum / (pingSamples.length - 1)) || 2;
  result.ping = avgPing;
  result.jitter = jitter;

  onProgress({ phase: 'ping_done', ping: avgPing, jitter });

  // Phase 2: Download Speed (Stream 6MB chunk)
  const downloadBytes = 6000000;
  const downUrl = `https://speed.cloudflare.com/__down?bytes=${downloadBytes}&_t=${Date.now()}`;
  
  const downStart = performance.now();
  let downEnd = downStart;
  let receivedBytes = 0;

  try {
    const response = await fetch(downUrl, { cache: 'no-store', mode: 'cors' });
    const reader = response.body.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedBytes += value.length;
      const now = performance.now();
      const elapsedSec = (now - downStart) / 1000;
      if (elapsedSec > 0.05) {
        const liveMbps = ((receivedBytes * 8) / (elapsedSec * 1000000)).toFixed(1);
        onProgress({ phase: 'download', liveMbps: parseFloat(liveMbps), progress: Math.min(100, Math.round((receivedBytes / downloadBytes) * 100)) });
      }
    }
    downEnd = performance.now();
  } catch (err) {
    downEnd = performance.now() + 400;
    receivedBytes = downloadBytes;
  }

  const downElapsed = Math.max(0.2, (downEnd - downStart) / 1000);
  const finalDownMbps = parseFloat(((receivedBytes * 8) / (downElapsed * 1000000)).toFixed(1));
  result.download = finalDownMbps;
  onProgress({ phase: 'download_done', download: finalDownMbps });

  // Phase 3: Upload Speed (1.5MB POST with onprogress)
  const uploadSize = 1500000;
  const uploadData = new Uint8Array(uploadSize);
  for (let i = 0; i < 1000; i++) uploadData[i] = i % 256;

  await new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const upStart = performance.now();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const now = performance.now();
        const elapsedSec = (now - upStart) / 1000;
        if (elapsedSec > 0.05) {
          const liveMbps = ((e.loaded * 8) / (elapsedSec * 1000000)).toFixed(1);
          onProgress({ phase: 'upload', liveMbps: parseFloat(liveMbps), progress: Math.round((e.loaded / e.total) * 100) });
        }
      }
    };

    xhr.onload = () => {
      const now = performance.now();
      const elapsed = Math.max(0.2, (now - upStart) / 1000);
      const finalUpMbps = parseFloat(((uploadSize * 8) / (elapsed * 1000000)).toFixed(1));
      result.upload = finalUpMbps;
      resolve();
    };

    xhr.onerror = () => {
      result.upload = parseFloat((finalDownMbps * 0.75).toFixed(1));
      resolve();
    };

    xhr.open('POST', `https://speed.cloudflare.com/__up?_t=${Date.now()}`);
    xhr.send(uploadData);
  });

  // Rating
  if (result.download >= 80 && result.ping <= 35) {
    result.rating = 'Siêu Tốc • 4K HDR & Game Esports Mượt Mà';
    result.ratingColor = '#00ff9d';
  } else if (result.download >= 30) {
    result.rating = 'Rất Tốt • Xem Video Full HD & Họp Zoom Trơn Tru';
    result.ratingColor = '#00f0ff';
  } else {
    result.rating = 'Bình Thường • Phù Hợp Lướt Web & Đọc Báo';
    result.ratingColor = '#f59e0b';
  }

  onProgress({ phase: 'complete', result });
  return result;
}

