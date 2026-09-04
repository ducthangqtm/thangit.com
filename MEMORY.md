# THANGIT.COM (TiT) — PROJECT MEMORY

> **Cập nhật lần cuối:** 04/09/2026  
> **Chủ sở hữu:** Nguyễn Đức Thắng (Thắng IT) — Senior Network Administrator & Vibe Coder  
> **Tên Ứng Dụng (PWA):** **TiT** (TiT Pocket Super App & NOC Portfolio)  
> **Domain Trực Tiếp:** [thangit.com](https://thangit.com)  
> **GitHub Repository:** [ducthangqtm/thangit.com](https://github.com/ducthangqtm/thangit.com) (Branch: `main`)  
> **Môi Trường Vận Hành:** Cloudflare Pages (Deploy tự động sau mỗi lần `git push origin main`, chi phí 0đ/tháng, 100% Client-side).

---

## 1. Kiến Trúc & Triết Lý Phát Triển
1. **100% Static & Zero Server Cost:**
   - Không cơ sở dữ liệu (No Database), không backend server phụ thuộc, bảo mật tuyệt đối, kháng DDoS qua Cloudflare CDN toàn cầu.
2. **Ngôn Ngữ & Thư Viện:**
   - **HTML5 Semantic:** Đầy đủ thẻ SEO, OpenGraph, Twitter Cards, PWA Manifest.
   - **Vanilla CSS (No Tailwind):** Thiết kế giao diện Obsidian Dark Cyber, Glassmorphism, Neon Glow, Grid Bento và Flexbox đáp ứng hoàn hảo trên cả Mobile & Desktop.
   - **Modern Vanilla ES6+ JS:** Không dùng framework nặng nề (React/Vue), code dạng Module hàm gọn gàng, tải trang dưới 0.3s.
3. **PWA Standalone Engine:**
   - Hoạt động như Native App khi được ghim ra Màn hình chính (Home Screen) trên iOS & Android.
   - Mở app trong cửa sổ độc lập (không có thanh địa chỉ trình duyệt).
   - Tích hợp modal hướng dẫn cài đặt 1-chạm thông minh (`#modal-pwa-guide`).
   - Service Worker (`sw.js`) cache toàn bộ tài nguyên cốt lõi với Network-First strategy, hỗ trợ offline cho các công cụ tính toán/lịch âm/QR.

---

## 2. Hệ Thống Tính Năng Đã Triển Khai

### A. Trang Chủ & Dashboard NOC
- **Header NOC Bar:**
  - Logo TiT hoạt họa viền Neon mềm mại, kích thước cân đối với text brand.
  - Đèn LED trạng thái `SYSTEM STATUS: ONLINE (200 OK)` nhấp nháy xanh lá.
  - Đo độ trễ thời gian thực (**Live Latency Ping**) tới Edge Cloudflare.
  - Visitor IP Badge: Tự động phát hiện IP công cộng và POP Cloudflare (HAN - Hanoi).
  - Nút **"Cài App TiT"**: Tự động mở hướng dẫn ghim ra màn hình chính theo từng hệ điều hành (Safari iOS / Chrome Android).
- **Hero Profile:**
  - Nhận diện Thắng IT, Avatar bo tròn ánh kim cyber.
  - Trình bày định vị: Senior Network Administrator & Vibe Coder.
- **Bento Grid 5 Cards:**
  - **Card 1 (Mạng & Hạ tầng):** Mikrotik, Cisco, VLAN, VPN, Firewall, Homelab.
  - **Card 2 (Hệ thống & Cloud):** Linux, Windows Server, Docker, Proxmox, Cloudflare.
  - **Card 3 (Vibe Coding):** AI Workflow, Tự động hóa sản phẩm số thực chiến.
  - **Card 4 (Network Toolbox):** IP Inspector, Latency Tester, Bộ tạo mật khẩu IT ngẫu nhiên độ an toàn cao.
  - **Card 5 (TiT Pocket Super App):** Kho Tiện Ích Đa Năng Bỏ Túi với chip preview thời tiết & giá Bitcoin cập nhật liên tục.

### B. Kho 8 Tiện Ích Bỏ Túi (`#modal-pocket-tools`)
| STT | Tên Tiện Ích | ID Tab | Nguồn API / Thuật Toán | Tính Năng Chính |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Tạo QR Đa Năng** | `tab-p-qr` | VietQR (`img.vietqr.io`) + Client Engine (`qrcode.min.js`) | Tạo QR VietQR cho 40+ ngân hàng VN (kèm số tiền & nội dung chuyển khoản); QR Wi-Fi 1-chạm; URL; vCard danh bạ cá nhân; Text tùy biến. Có nút Tải ảnh PNG & Copy vào Clipboard. |
| 2 | **Thời Tiết & Nhiệt Độ** | `tab-p-weather` | Open-Meteo REST API (Free, CORS ok) | Thời tiết 6 thành phố lớn (Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng, Cần Thơ, Đà Lạt) + Nút định vị GPS tự động. Hiển thị nhiệt độ, độ ẩm, gió, mây, biểu tượng thời tiết. |
| 3 | **Giá Coin Trực Tiếp** | `tab-p-crypto` | Binance Public API v3 (`api.binance.com`) | Bảng giá Top 10 coin: BTC, ETH, SOL, BNB, XRP, DOGE, ADA, SUI, NEAR, PEPE. Giá USD, quy đổi ước tính VNĐ, % biến động 24h, High/Low. |
| 4 | **Bóng Đá Trực Tiếp** | `tab-p-football` | ESPN Scoreboard API (`site.api.espn.com`) | Lịch thi đấu, tỉ số trực tiếp và logo CLB theo giờ Việt Nam (GMT+7) cho 5 giải: Ngoại Hạng Anh (EPL), Cúp C1 (UCL), La Liga, Serie A, Bundesliga. |
| 5 | **Máy Tính Cyber** | `tab-p-calc` | In-browser Engine (JS) | Bàn phím Cyber Neon với đầy đủ phép tính: `+ - × ÷ % ± ⌫ =`. Tính toán tức thì, thao tác mượt mà trên mobile. |
| 6 | **Lịch Âm Vạn Niên** | `tab-p-lunar` | Thuật toán Hồ Ngọc Đức (`js/lunar.js`) | 100% Offline: Tính chuẩn xác ngày Âm lịch theo kinh tuyến GMT+7, Can Chi Năm - Tháng - Ngày, Giờ Hoàng Đạo/Hắc Đạo trong ngày và 24 Tiết Khí. |
| 7 | **Đổi Đơn Vị & Ngoại Tệ** | `tab-p-converter` | ExchangeRate API (`open.er-api.com`) + Static Table | Tỷ giá hối đoái ngoại tệ (USD, VND, EUR, JPY, GBP, CNY...) + Dung lượng IT (Bytes ↔ PB) + Tốc độ mạng (Mbps ↔ MB/s) + Chiều dài, Khối lượng, Nhiệt độ. |
| 8 | **Đồng Hồ Giờ Quốc Tế** | `tab-p-world` | Javascript `Intl.DateTimeFormat` | Hiển thị 8 múi giờ toàn cầu (Hà Nội, Tokyo, London, New York, San Francisco, Paris, Sydney, Dubai) kèm ticking từng giây, icon Ngày/Đêm (☀️/🌙) và độ lệch giờ so với Việt Nam. |

---

## 3. Cấu Trúc Thư Mục & Tài Nguyên Mã Nguồn
```text
thangit.com/
├── index.html            # Trang chủ, semantic markup, 5 Bento cards, 2 modal chính
├── css/
│   └── style.css         # Hệ thống CSS Cyber Dark, Glassmorphism, animations, responsive
├── js/
│   ├── main.js           # Bộ điều khiển chính: NOC, PWA, Network Tools, 8 Pocket Tools
│   ├── lunar.js          # Thuật toán thiên văn Hồ Ngọc Đức tính Lịch Âm & Can Chi
│   └── qrcode.min.js     # Engine vẽ mã QR Client-side & xuất Canvas
├── assets/
│   └── images/
│       ├── avata.jpg             # Ảnh đại diện Thắng IT
│       ├── apple-touch-icon.png  # Icon 180x180 cho iOS
│       ├── icon-192.png          # Icon PWA 192x192 cho Android
│       └── icon-512.png          # Icon PWA 512x512 cho Android Splash
├── manifest.json         # Cấu hình PWA (Name: "Nguyễn Đức Thắng (Thắng IT)", Short: "TiT")
├── sw.js                 # Service Worker (Cache v2: tit-hub-v2)
├── favicon.svg           # Vector favicon thương hiệu TiT
├── _headers              # Cấu hình header Cloudflare Pages (Cache control, Security)
├── robots.txt            # Chỉ mục Search Engine
├── sitemap.xml           # Sơ đồ trang web
├── MEMORY.md             # File ghi nhớ dự án (tài liệu này)
└── PLAN.md               # Kế hoạch ban đầu
```

---

## 4. Các Quy Tắc Kỹ Thuật Quan Trọng (Dành Cho Lần Làm Việc Tiếp Theo)
1. **Quy tắc API:**
   - Chỉ sử dụng các API công khai **100% miễn phí, không yêu cầu API Key bí mật, hỗ trợ CORS mở** để người dùng truy cập trực tiếp từ trình duyệt mà không cần backend proxy.
2. **Quy tắc PWA & Cache:**
   - Khi chỉnh sửa file JS hoặc CSS, nếu muốn người dùng nhận bản cập nhật ngay lập tức:
     - Tăng query version trong `index.html` (ví dụ `?v=20260904_7`).
     - Tăng `CACHE_NAME` trong `sw.js` (ví dụ `tit-hub-v3`).
3. **Quy tắc Deploy:**
   - Mọi thay đổi sau khi kiểm tra xong (`node -c js/file.js`) được commit và push vào nhánh `main`:
     ```bash
     git add .
     git commit -m "feat/fix: mô tả nội dung"
     git push origin main
     ```
   - Cloudflare Pages sẽ tự động hoàn tất build và cập nhật live trên `thangit.com` sau ~15 giây.

---

## 5. Ý Tưởng & Hướng Phát Triển Tiếp Theo (Roadmap)
- [ ] **Giá Vàng & Nhiên Liệu:**
  - Tích hợp thêm tab xem Giá Vàng (SJC, PNJ, Vàng 9999) và Giá Xăng Dầu (RON 95, E5, Dầu DO) nếu tìm thấy nguồn API hoặc RSS feed mở ổn định.
- [ ] **Âm Thanh Tương Tác (Haptic & Cyber SFX):**
  - Tùy chọn bật/tắt hiệu ứng âm thanh click phím cyber nhẹ khi bấm phím máy tính hoặc chuyển tab.
- [ ] **Lưu Trữ Cấu Hình Cá Nhân (LocalStorage):**
  - Tự động ghi nhớ STK ngân hàng hay dùng trong QR Studio để lần sau mở ra có sẵn không cần nhập lại.
- [ ] **Kết Quả Xổ Số (KQXS 3 Miền):**
  - Xem kết quả xổ số Miền Bắc, Miền Trung, Miền Nam theo ngày.
- [ ] **Thêm Widget Đếm Ngược Sự Kiện (Event Countdown):**
  - Đếm ngược đến Tết Nguyên Đán, World Cup, các ngày lễ lớn.
