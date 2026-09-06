# THANGIT.COM (TiT) — PROJECT MEMORY

> **Cập nhật lần cuối:** 06/09/2026  
> **Chủ sở hữu:** Nguyễn Đức Thắng (Thắng IT) — Senior Network Administrator & Vibe Coder  
> **Tên Ứng Dụng (PWA):** **TiT** (Thắng IT — Super Tool Hub & Portfolio)  
> **Domain Trực Tiếp:** [thangit.com](https://thangit.com)  
> **Cổng Định Danh Trung Tâm:** [thangnd.io.vn](https://thangnd.io.vn) (Thắng ND)  
> **Cổng Thể Thao KOC:** [thangnhayday.com](https://thangnhayday.com) (Thắng Nhảy Dây)  
> **GitHub Repository:** [ducthangqtm/thangit.com](https://github.com/ducthangqtm/thangit.com) (Branch: `main`)  
> **Môi Trường Vận Hành:** Cloudflare Pages (Deploy tự động sau mỗi lần `git push origin main`, chi phí 0đ/tháng, 100% Client-side).

---

## 1. Kiến Trúc & Triết Lý Phát Triển (Phiên Bản Tối Giản Hiện Đại 06/09/2026)

1. **Chuẩn Thiết Kế & Nhận Diện (Đồng Bộ Thangnhayday.com):**
   - **Typography:** 100% Google Fonts `Roboto` hoàn chỉnh, loại bỏ tiền tố `@thangit`, tên hiển thị chuẩn: **Nguyễn Đức Thắng** kèm tick xanh verified.
   - **Bố cục Mobile-First:** Container `480px` căn giữa với hiệu ứng nền Cyber Glow, Glassmorphism cao cấp.
   - **Thanh 4 Nút Mạng Xã Hội Squircle Chuẩn:**
     1. **Zalo:** Số điện thoại `0986192092` (`https://zalo.me/0986192092`), logo chữ Zalo đậm nét màu xanh thương hiệu.
     2. **Telegram:** `@ducthangqtm` (`https://t.me/ducthangqtm`).
     3. **Discord:** `ducthangqtm` (sao chép username 1-chạm vào clipboard & mở Discord).
     4. **GitHub:** `ducthangqtm` (`https://github.com/ducthangqtm`).

2. **Cấu Trúc Tinh Gọn 2 File Tổng Hợp (Gom 15 Thư Mục Cũ Thành 2 File):**
   - Thay vì hàng chục thư mục/file HTML phân tán khó bảo trì, toàn bộ công cụ được gom thành 2 file ứng dụng đơn nhất:
     - `it.html`: Chứa toàn bộ 8 công cụ IT & bản CV đầy đủ kèm bộ điều hướng Header Tab & Accordion.
     - `tienich.html`: Chứa toàn bộ 6 tiện ích bỏ túi thường nhật.
   - Mỗi công cụ được đánh dấu theo anchor hash (`#subnet`, `#dns`, `#vietqr`, `#calc`...), khi bấm từ trang chủ sẽ cuộn mở thẳng đến công cụ đó.

3. **Thanh 4 Tab Danh Mục Trên Trang Chủ (`index.html`):**
   - **Tab 1: 💼 Hồ Sơ CV (Vị Trí Đầu Tiên & Mặc Định Khi Tải Trang):**
     - Thẻ tóm tắt năng lực Senior Network Administrator & Vibe Coder.
     - 4 chỉ số thống kê ấn tượng: `10+ Năm KN` | `40.000m² Logistics` | `500+ Thiết Bị` | `99.9% Uptime`.
     - Năng lực cốt lõi (Cisco, Mikrotik, Fortinet, IPsec VPN, Linux, Python Automation).
     - Nút CTA chuyển hướng đến Portfolio chính thức [thangnd.io.vn](https://thangnd.io.vn) và bản CV chi tiết trên [it.html#cv](file:///it.html#cv).
   - **Tab 2: 🛠️ IT Tools (Lưới 2 Cột Đối Xứng — 8 Công Cụ):**
     1. Subnet CIDR (`/it.html#subnet`)
     2. DNS Lookup DoH Cloudflare (`/it.html#dns`)
     3. Wi-Fi QR Studio (`/it.html#wifi`)
     4. Tra Cứu 39 Cổng Mạng (`/it.html#ports`)
     5. Sinh Mật Khẩu Web Crypto (`/it.html#password`)
     6. NOC Ping & Trace CDN (`/it.html#telemetry`)
     7. Web Terminal CLI (`/it.html#terminal`)
     8. Dự Án Số Tiêu Biểu (`/it.html#projects`)
   - **Tab 3: ☕ Tiện Ích (Lưới 2 Cột Đối Xứng — 6 Tiện Ích):**
     1. VietQR Studio 40+ Ngân Hàng (`/tienich.html#vietqr`)
     2. Máy Tính Cyber Calculator (`/tienich.html#calc`)
     3. Lịch Vạn Niên & Can Chi Offline (`/tienich.html#lunar`)
     4. Dự Báo Thời Tiết Open-Meteo (`/tienich.html#weather`)
     5. Đổi Tỷ Giá & Đơn Vị IT (`/tienich.html#converter`)
     6. Giờ Thế Giới 8 Múi Giờ (`/tienich.html#world`)
   - **Tab 4: ⚡ Đồ Công Nghệ (Affiliate Products Hub):**
     - Đọc dữ liệu động từ `data/products.json`.
     - Đi kèm trang quản lý liên kết [admin.html](file:///admin.html) giúp thêm/sửa/xoá/xuất link affiliate nhanh chóng (tương tự thangnhayday.com).

4. **Dọn Sạch Toàn Diện Mã Nguồn (Purged Legacy Code):**
   - `css/style.css`: Đã lược bỏ hơn 2.900 dòng CSS chết từ các phiên bản Bento/Springboard/Modal cũ, tinh giản từ gần 4.000 dòng xuống chỉ còn **~1.100 dòng** sạch sẽ, tối ưu tốc độ render.
   - `js/core.js`: Rút gọn từ 482 dòng xuống **118 dòng**, chỉ giữ lại logic cốt lõi (Toast, copy 1-chạm, PWA Service Worker, favicon động...).

---

## 2. Cấu Trúc Thư Mục Hiện Tại

```text
thangit.com/
├── index.html            # Trang chủ: Profile, Social dock, 4 tab (Hồ sơ CV mặc định, IT Tools, Tiện ích, Đồ công nghệ)
├── it.html               # Trang tổng hợp toàn bộ công cụ IT & SysAdmin
├── tienich.html          # Trang tổng hợp toàn bộ tiện ích bỏ túi
├── admin.html            # Trang quản trị quản lý link Affiliate Đồ Công Nghệ
├── data/
│   └── products.json     # Danh sách sản phẩm đồ công nghệ gắn link affiliate
├── css/
│   └── style.css         # Hệ thống CSS duy nhất (~1.100 dòng), chuẩn Roboto, Cyber Dark UI
├── js/
│   ├── core.js           # Utilities dùng chung: Toast, Copy 1-chạm, Favicon radar, PWA init
│   ├── lunar.js          # Thuật toán thiên văn Hồ Ngọc Đức tính Lịch Âm & Can Chi
│   └── qrcode.min.js     # Thư viện vẽ QR Code client-side
├── assets/images/        # Logo, avata.jpg, icon PWA
├── manifest.json         # Cấu hình PWA
├── sw.js                 # Service Worker (Cache version: tit-hub-v16)
├── favicon.svg           # Vector radar favicon
├── _headers              # Cấu hình Cache Control & Security Headers cho Cloudflare Pages
├── robots.txt            # Chỉ mục Search Engine
├── sitemap.xml           # Sơ đồ trang web
└── MEMORY.md             # Bộ nhớ dự án (tài liệu này)
```

---

## 3. Các Quy Tắc Vận Hành & Bảo Trì

1. **Quy tắc PWA & Cache:**
   - Mỗi khi cập nhật giao diện, CSS hoặc JS quan trọng, luôn tăng `CACHE_NAME` trong `sw.js` (hiện tại là `tit-hub-v16`) và tăng query version `?v=...` tại các file HTML để trình duyệt người dùng xóa cache cũ ngay lập tức.
2. **Quy tắc Deploy:**
   - Đẩy trực tiếp vào nhánh `main`:
     ```powershell
     git add .
     git commit -m "feat/fix: mô tả"
     git push origin main
     ```
   - Cloudflare Pages tự động build và đồng bộ CDN toàn cầu trong vòng 15-30 giây.
3. **Quy tắc SEO & Thực Thể (Entity Graph):**
   - Mọi trang đều duy trì liên kết xác thực thực thể `rel="me"` và `sameAs` tới **thangnd.io.vn**, **thangnhayday.com** và **github.com/ducthangqtm**.
