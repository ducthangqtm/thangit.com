# THANGIT.COM (TiT) — PROJECT MEMORY

> **Cập nhật lần cuối:** 06/09/2026  
> **Chủ sở hữu:** Nguyễn Đức Thắng (Thắng IT) — Senior Network Administrator & Vibe Coder  
> **Tên Ứng Dụng (PWA):** **TiT** (TiT Pocket Super App & NOC Portfolio)  
> **Domain Trực Tiếp:** [thangit.com](https://thangit.com)  
> **Cổng Định Danh Trung Tâm:** [thangnd.io.vn](https://thangnd.io.vn) (Thắng ND)  
> **Cổng Thể Thao KOC:** [thangnhayday.com](https://thangnhayday.com) (Thắng Nhảy Dây)  
> **GitHub Repository:** [ducthangqtm/thangit.com](https://github.com/ducthangqtm/thangit.com) (Branch: `main`)  
> **Môi Trường Vận Hành:** Cloudflare Pages (Deploy tự động sau mỗi lần `git push origin main`, chi phí 0đ/tháng, 100% Client-side).

---

## 1. Kiến Trúc & Triết Lý Phát Triển
1. **100% Static & Zero Server Cost:**
   - Không cơ sở dữ liệu (No Database), không backend server phụ thuộc, bảo mật tuyệt đối, kháng DDoS qua Cloudflare CDN toàn cầu.
2. **Kiến Trúc Multi-Page Architecture (MPA) — Clean URLs:**
   - **Tách biệt hoàn toàn từng tiện ích:** Thay vì nhét toàn bộ 15 công cụ vào một file HTML khổng lồ, hệ thống được cấu trúc thành từng thư mục con độc lập (`/subnet/`, `/dns/`, `/wifi-qr/`, `/calc/`, `/lunar/`...).
   - **Đường dẫn đẹp & Chuẩn SEO:** Cloudflare Pages tự động phục vụ file `index.html` trong mỗi thư mục con mà không cần đuôi `.html` (URL sạch: `thangit.com/subnet/`). Mỗi trang có thẻ `<title>`, `<meta name="description">` riêng biệt và có trong `sitemap.xml`.
   - **Trang chủ Springboard (`/`):** Hiển thị màn hình chính dạng icon iOS squircle, badge IP mạng edge, và điều hướng trực tiếp bằng thẻ `<a href="/subnet/">`.
   - **Thanh Header Topbar Đồng Nhất:** Mỗi trang con có nút `<a href="/" class="ios-back-btn"> Trang chủ</a>` ở góc trên cùng bên trái để quay lại trang chủ tức thì.
   - **Tối ưu tốc độ tải:** Người dùng chỉ tải mã JS của đúng công cụ đang sử dụng, tiết kiệm băng thông và tăng tốc độ tương tác.
3. **Phân Định 2 Danh Mục Rõ Ràng:**
   - 🛠️ **Hạ Tầng & Công Cụ IT (Network Suite):** Bộ công cụ chuyên sâu cho SysAdmin/Network Engineer.
   - ☕ **Tiện Ích Bỏ Túi Thường Ngày (Pocket Tools):** Bộ tiện ích thiết thực cho cuộc sống hàng ngày.
4. **PWA Multi-Page Engine (Cache v11):**
   - Hoạt động mượt mà cả offline lẫn online qua Service Worker `tit-hub-v11`.
   - Lưu cache toàn bộ 15 trang công cụ con và tài nguyên dùng chung trong `js/core.js`.
5. **Hệ Sinh Thái Định Danh Thực Thể & Entity SEO (Cross-Domain Knowledge Graph):**
   - Đồng bộ 3 domain độc lập: **thangnd.io.vn** (Root Identity) ↔ **thangit.com** (Tech / IT Hub) ↔ **thangnhayday.com** (Fitness / KOC Hub).
   - Xác thực quyền sở hữu đồng nhất bằng chuẩn `rel="me"` và liên kết thực thể đa chiều trong Schema.org (`Person`, `WebSite`, `sameAs`).

---

## 2. Hệ Thống 15 Ứng Dụng (Standalone Multi-Page URLs)

### A. 🛠️ Hạ Tầng & Công Cụ IT (Network Suite - 9 Apps)
| STT | Ứng Dụng | URL / Thư mục | Công Nghệ / Nguồn | Tính Năng & Điểm Nhấn |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Subnet CIDR** | `/subnet/` | Client-side Bitwise Math | Tính toán Subnet /1 đến /32, Subnet Mask, Wildcard, Network/Broadcast IP, Dải Host khả dụng, Binary Mask, Phân lớp IP & Copy báo cáo cấu hình 1-chạm. |
| 2 | **DNS Lookup DoH** | `/dns/` | Cloudflare DoH REST API (`1.1.1.1`) | Tra cứu bản ghi DNS trực tiếp qua HTTPS: A, AAAA, CNAME, MX, TXT, NS với TTL, Answer, và Copy nhanh. |
| 3 | **Wi-Fi QR** | `/wifi-qr/` | `qrcode.min.js` | Tạo mã QR kết nối Wi-Fi 1-chạm chuẩn WPA/WPA2/WPA3 (hỗ trợ mạng ẩn). Nút Tải PNG & Copy cấu hình text. |
| 4 | **Tra Cứu Port** | `/ports/` | Local Enterprise Port Registry | Bảng tra cứu & lọc 39 cổng dịch vụ mạng phổ biến (Web, Mail, Remote, Database, VPN, Monitoring) kèm protocol TCP/UDP. |
| 5 | **Mật Khẩu IT** | `/password/` | Web Crypto API (Entropy cao) | Sinh mật khẩu mạnh cho Root/Switch/DB/Wi-Fi với thanh trượt độ dài và phân loại ký tự. |
| 6 | **NOC Ping** | `/telemetry/` | Cloudflare CDN Trace (`/cdn-cgi/trace`) | Giám sát độ trễ Ping thực tế tới Edge CDN, bóc tách IP công cộng, Node POP, Giao thức HTTP, TLS cipher, SNI. |
| 7 | **Terminal CLI** | `/terminal/` | In-browser Linux Emulator | Bàn gõ CLI phong cách zsh, hỗ trợ phím nóng `~`, các lệnh `help`, `whoami`, `skills`, `projects`, `ping`, `clear`. |
| 8 | **Hồ Sơ CV** | `/cv/` | Timeline Component | Trình bày 10 năm kinh nghiệm quản trị hệ thống, hạ tầng logistics 40,000m², 500+ nodes, nút In / Xuất PDF. |
| 9 | **Dự Án Số** | `/projects/` | Showcase Grid | Danh mục các dự án số tiêu biểu, hệ thống đã triển khai thực tế. |

### B. ☕ Tiện Ích Bỏ Túi Thường Ngày (Pocket Tools - 6 Apps)
| STT | Ứng Dụng | URL / Thư mục | Công Nghệ / Nguồn | Tính Năng Chính |
| :--- | :--- | :--- | :--- | :--- |
| 10 | **VietQR Bank** | `/vietqr/` | VietQR API + QR Engine | Tạo QR thanh toán nhanh cho 40+ ngân hàng VN kèm số tiền & nội dung. Tải ảnh & copy link. |
| 11 | **Máy Tính** | `/calc/` | In-browser Math Engine | Bàn phím Cyber Neon với phép tính nhanh, mượt trên mobile kèm lịch sử tính. |
| 12 | **Lịch Âm** | `/lunar/` | Thuật toán Hồ Ngọc Đức | 100% Offline: Lịch vạn niên, Can Chi, Hoàng Đạo, Tiết Khí GMT+7, chọn ngày tùy ý. |
| 13 | **Thời Tiết** | `/weather/` | Open-Meteo REST API | Dự báo 6 tỉnh thành + GPS tự động, nhiệt độ, độ ẩm, gió, UV, mưa. |
| 14 | **Đổi Đơn Vị** | `/converter/` | ExchangeRate API + Math | Tỷ giá ngoại tệ, Dung lượng IT (Bytes ↔ TB), Tốc độ mạng (Mbps ↔ MB/s). |
| 15 | **Giờ Quốc Tế** | `/world/` | Javascript `Intl` | 8 múi giờ toàn cầu cập nhật từng giây, biểu tượng Ngày/Đêm. |

---

## 3. Cấu Trúc Thư Mục & Tài Nguyên Mã Nguồn
```text
thangit.com/
├── index.html            # Trang chủ Springboard dạng icon app iOS, Profile, Social Dock
├── css/
│   └── style.css         # Hệ thống CSS Cyber Dark, Glassmorphism, animations, responsive
├── js/
│   ├── core.js           # Bộ tiện ích dùng chung: Toast, Clipboard Copy, Radar Favicon, PWA, Visitor Badge
│   ├── lunar.js          # Thuật toán thiên văn Hồ Ngọc Đức tính Lịch Âm & Can Chi
│   └── qrcode.min.js     # Engine vẽ mã QR Client-side & xuất Canvas
├── subnet/index.html     # Subnet & CIDR Calculator (/subnet/)
├── dns/index.html        # DNS Lookup DoH Cloudflare (/dns/)
├── wifi-qr/index.html    # Trình tạo mã QR Wi-Fi (/wifi-qr/)
├── ports/index.html      # Tra cứu cổng mạng IT (/ports/)
├── password/index.html   # Trình tạo mật khẩu an toàn Web Crypto (/password/)
├── telemetry/index.html  # NOC Edge Latency & Network Telemetry (/telemetry/)
├── terminal/index.html   # Linux Web Terminal Emulator (/terminal/)
├── cv/index.html         # Hồ sơ năng lực 10 năm kinh nghiệm (/cv/)
├── projects/index.html   # Dự án công nghệ tiêu biểu (/projects/)
├── vietqr/index.html     # Tạo mã VietQR 40+ ngân hàng (/vietqr/)
├── calc/index.html       # Máy tính Cyber Calculator (/calc/)
├── lunar/index.html      # Lịch Âm Vạn Niên & Can Chi (/lunar/)
├── weather/index.html    # Thời tiết thời gian thực (/weather/)
├── converter/index.html  # Chuyển đổi ngoại tệ & đơn vị IT (/converter/)
├── world/index.html      # Đồng hồ 8 múi giờ quốc tế (/world/)
├── assets/images/        # Icon PWA, avatar, apple-touch-icon
├── manifest.json         # Cấu hình PWA (Name: "Nguyễn Đức Thắng (Thắng IT)", Short: "TiT")
├── sw.js                 # Service Worker (Cache v10: tit-hub-v10)
├── favicon.svg           # Vector favicon thương hiệu TiT
├── _headers              # Cấu hình header Cloudflare Pages
├── robots.txt            # Chỉ mục Search Engine
├── sitemap.xml           # Sơ đồ trang web (gồm 15 trang công cụ)
└── MEMORY.md             # File ghi nhớ dự án (tài liệu này)
```

---

## 4. Các Quy Tắc Kỹ Thuật Quan Trọng (Dành Cho Lần Làm Việc Tiếp Theo)
1. **Quy tắc API:**
   - Chỉ sử dụng các API công khai **100% miễn phí, không yêu cầu API Key bí mật, hỗ trợ CORS mở** để người dùng truy cập trực tiếp từ trình duyệt mà không cần backend proxy.
2. **Quy tắc PWA & Cache:**
   - Khi chỉnh sửa file JS hoặc CSS, nếu muốn người dùng nhận bản cập nhật ngay lập tức:
     - Tăng query version trong `index.html` (ví dụ `?v=20260905_11`).
     - Tăng `CACHE_NAME` trong `sw.js` (ví dụ `tit-hub-v10`).
3. **Quy tắc Deploy:**
   - Mọi thay đổi sau khi kiểm tra xong (`node -c js/file.js`) được commit và push vào nhánh `main`:
     ```bash
     git add .
     git commit -m "feat/fix: mô tả nội dung"
     git push origin main
     ```
   - Cloudflare Pages sẽ tự động hoàn tất build và cập nhật live trên `thangit.com` sau ~15 giây.

---

## 5. Cấu Trúc Hero, Profile & Springboard Mới Nhất (Cập nhật 05/09/2026)
1. **Tiêu đề & Tên:** Hiển thị **Nguyễn Đức Thắng**.
2. **Avatar tương tác & Nút Hồ Sơ CV (Interactive Profile Card):**
   - Click vào Avatar sẽ trượt Avatar sang trái (phóng to) và mở card kính mờ bên phải:
     - Cột trái: Avatar phóng to, nút **📄 Hồ Sơ CV** (chuyển hướng trực tiếp sang `/cv/`), nút **✕ Thu gọn**.
     - Cột phải: Họ & Tên, Ngày sinh, Địa chỉ, SĐT (copy + tel), Email (copy + mailto), Bio tóm tắt 10+ năm kinh nghiệm (đã bỏ tình trạng hôn nhân).
3. **Bộ Lọc Phân Loại Springboard (Filter Tabs):**
   - ⚡ **Tất cả (15)**
   - 🛠️ **Hạ Tầng IT (9)**
   - ☕ **Tiện Ích (6)**
4. **Hàng 3 Chip Số Liệu (Metric Chips Row):**
   - Hiển thị cân đối, đối xứng 1 hàng: `10+ Năm Thực Chiến` • `40K m² Logistics` • `500+ Nodes Quản Trị` (đã bỏ chip lẻ 99.9% Uptime).
5. **Thanh Dock Mạng Xã Hội (Unified Social Action Bar):**
   - 4 icon chuẩn thương hiệu: **Zalo**, **Telegram**, **Discord**, **GitHub**.
6. **PWA Cache:** Service Worker hiện tại là `tit-hub-v10`, script/style version `?v=20260905_11`.

---

## 6. Ý Tưởng & Hướng Phát Triển Tiếp Theo (Roadmap)
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

