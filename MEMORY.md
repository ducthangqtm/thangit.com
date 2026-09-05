# THANGIT.COM (TiT) — PROJECT MEMORY

> **Cập nhật lần cuối:** 05/09/2026  
> **Chủ sở hữu:** Nguyễn Đức Thắng (Thắng IT) — Senior Network Administrator & Vibe Coder  
> **Tên Ứng Dụng (PWA):** **TiT** (TiT Pocket Super App & NOC Portfolio)  
> **Domain Trực Tiếp:** [thangit.com](https://thangit.com)  
> **GitHub Repository:** [ducthangqtm/thangit.com](https://github.com/ducthangqtm/thangit.com) (Branch: `main`)  
> **Môi Trường Vận Hành:** Cloudflare Pages (Deploy tự động sau mỗi lần `git push origin main`, chi phí 0đ/tháng, 100% Client-side).

---

## 1. Kiến Trúc & Triết Lý Phát Triển
1. **100% Static & Zero Server Cost:**
   - Không cơ sở dữ liệu (No Database), không backend server phụ thuộc, bảo mật tuyệt đối, kháng DDoS qua Cloudflare CDN toàn cầu.
2. **Kiến Trúc Giao Diện: iOS Springboard App Grid (Zero Modal Popup):**
   - **Thay thế hoàn toàn Modal Popup nổi:** Thay vì bật modal chèn lên nhau gây cảm giác "tả phế lù", toàn bộ 17 ứng dụng được thiết kế dạng **Icon ứng dụng chuẩn iOS Squircle** (bo cong siêu mượt 22.5%, ánh gương phản chiếu, hiệu ứng chạm haptic).
   - **In-Page Full App Transition:** Chạm vào icon sẽ trượt mượt mà vào màn hình ứng dụng toàn trang (`#ios-app-container`), có thanh Header chuẩn iOS dính trên cùng với nút `< Quay lại`.
   - **URL Hash Routing:** Điều hướng qua hash (`#app=subnet`, `#app=dns`, `#app=wifi-qr`, `#app=ports`...) giúp hỗ trợ nút Back trình duyệt và thao tác vuốt cạnh trái trên điện thoại mà không cần tải lại trang.
3. **Phân Định 2 Danh Mục Rõ Ràng:**
   - 🛠️ **Hạ Tầng & Công Cụ IT (Network Suite):** Bộ công cụ chuyên sâu cho SysAdmin/Network Engineer.
   - ☕ **Tiện Ích Bỏ Túi Thường Ngày (Pocket Tools):** Bộ tiện ích thiết thực cho cuộc sống hàng ngày.
4. **PWA Standalone Engine (Cache v3):**
   - Hoạt động như Native App khi được ghim ra Màn hình chính (Home Screen) trên iOS & Android.
   - Mở app trong cửa sổ độc lập không có thanh URL. Service Worker (`tit-hub-v3`) cache offline.

---

## 2. Hệ Thống 17 Ứng Dụng (iOS App Launcher)

### A. 🛠️ Hạ Tầng & Công Cụ IT (Network Suite - 9 Apps)
| STT | Ứng Dụng | App ID | Công Nghệ / Nguồn | Tính Năng & Điểm Nhấn |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Subnet CIDR** | `app-subnet` | Client-side Bitwise Math | Tính toán Subnet /1 đến /32, Subnet Mask, Wildcard, Network/Broadcast IP, Dải Host khả dụng, Binary Mask, Phân lớp IP & Copy báo cáo cấu hình 1-chạm. |
| 2 | **DNS Lookup DoH** | `app-dns` | Cloudflare DoH REST API (`1.1.1.1`) | Tra cứu bản ghi DNS trực tiếp qua HTTPS: A, AAAA, CNAME, MX, TXT, NS với TTL, Answer, và Copy nhanh. |
| 3 | **Wi-Fi QR** | `app-wifi-qr` | `qrcode.min.js` | Tạo mã QR kết nối Wi-Fi 1-chạm chuẩn WPA/WPA2/WPA3 (hỗ trợ mạng ẩn). Nút Tải PNG & Copy cấu hình text. |
| 4 | **Tra Cứu Port** | `app-ports` | Local Enterprise Port Registry | Bảng tra cứu & lọc 39 cổng dịch vụ mạng phổ biến (Web, Mail, Remote, Database, VPN, Monitoring) kèm protocol TCP/UDP. |
| 5 | **Mật Khẩu IT** | `app-password` | Web Crypto API (Entropy cao) | Sinh mật khẩu mạnh cho Root/Switch/DB/Wi-Fi với thanh trượt độ dài và phân loại ký tự. |
| 6 | **NOC Ping** | `app-telemetry` | Cloudflare CDN Trace (`/cdn-cgi/trace`) | Giám sát độ trễ Ping thực tế tới Edge CDN, bóc tách IP công cộng, Node POP, Giao thức HTTP, TLS cipher, SNI. |
| 7 | **Terminal CLI** | `app-terminal` | In-browser Linux Emulator | Bàn gõ CLI phong cách zsh, hỗ trợ phím nóng `~`, các lệnh `help`, `whoami`, `skills`, `projects`, `ping`, `clear`. |
| 8 | **Hồ Sơ CV** | `app-career` | Timeline Component | Trình bày 10 năm kinh nghiệm quản trị hệ thống, hạ tầng logistics 40,000m², 500+ nodes. |
| 9 | **Dự Án Số** | `app-projects` | Showcase Grid | Danh mục các dự án số tiêu biểu, hệ thống đã triển khai thực tế. |

### B. ☕ Tiện Ích Bỏ Túi Thường Ngày (Pocket Tools - 8 Apps)
| STT | Ứng Dụng | App ID | Công Nghệ / Nguồn | Tính Năng Chính |
| :--- | :--- | :--- | :--- | :--- |
| 10 | **VietQR Bank** | `app-vietqr` | VietQR API + QR Engine | Tạo QR thanh toán nhanh cho 40+ ngân hàng VN kèm số tiền & nội dung. Tải ảnh & copy. |
| 11 | **Máy Tính** | `app-calc` | In-browser Math Engine | Bàn phím Cyber Neon với phép tính nhanh, mượt trên mobile. |
| 12 | **Lịch Âm** | `app-lunar` | Thuật toán Hồ Ngọc Đức | 100% Offline: Lịch vạn niên, Can Chi, Hoàng Đạo, Tiết Khí GMT+7. |
| 13 | **Thời Tiết** | `app-weather` | Open-Meteo REST API | Dự báo 6 tỉnh thành + GPS tự động, nhiệt độ, độ ẩm, gió, UV, mưa. |
| 14 | **Đổi Đơn Vị** | `app-converter` | ExchangeRate API + Math | Tỷ giá ngoại tệ, Dung lượng IT (Bytes ↔ PB), Tốc độ mạng (Mbps ↔ MB/s), Đơn vị đo. |
| 15 | **Giờ Quốc Tế** | `app-world` | Javascript `Intl` | 8 múi giờ toàn cầu cập nhật từng giây, biểu tượng Ngày/Đêm. |
| 16 | **Giá Coin** | `app-crypto` | Binance Public API v3 | Bảng giá Top 10 coin (BTC, ETH, SOL, BNB...), giá USD, biến động 24h. |
| 17 | **Bóng Đá** | `app-football` | ESPN Scoreboard API | Lịch thi đấu và tỉ số trực tiếp 5 giải hàng đầu (EPL, C1, La Liga, Serie A, Bundesliga). |

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
