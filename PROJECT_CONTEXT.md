# thangit.com - Project Architecture & Technical Context

Tài liệu kỹ thuật tổng hợp toàn diện về kiến trúc, mã nguồn, luồng dữ liệu, hiện trạng SEO và quy chuẩn phát triển của dự án **thangit.com** (Network Pro Tools Hub).

---

## 1. Tổng quan dự án (Overview)

- **Định danh dự án**: `thangit.com` (Thắng iT — Network Pro Tools Hub).
- **Loại hình website**: 
  - **PWA (Progressive Web App)**: Cài đặt trực tiếp lên điện thoại / máy tính như native app, hỗ trợ offline mode qua Service Worker và cử chỉ kéo để làm mới (Pull-to-Refresh).
  - **Network Pro Tools Hub (5-in-1)**: Bộ công cụ mạng chuyên sâu chạy 100% Client-Side.
  - **Single Screen Dashboard**: Thiết kế 1 màn hình duy nhất, tối ưu mobile-first, loại bỏ chuyển tab cồng kềnh.
- **Mục đích chính & Luồng người dùng (User Flow)**:
  1. **Tầng Header & Định danh**: Hiển thị nhận diện thương hiệu Thắng iT Tools, trạng thái xác thực và nút chia sẻ trang (Web Share API / Copy Link).
  2. **Bộ công cụ mạng chuyên sâu (5 Subtabs)**:
     - **Speedtest Pro**: Đo tốc độ mạng (Ping / Jitter / Download stream 6MB / Upload XHR 1.5MB) trực tiếp qua Cloudflare Edge CDN, kèm hiển thị IP WAN thực tế.
     - **DNS & Tra Cứu**: Tra cứu bản ghi DNS qua Cloudflare DoH (1.1.1.1) và Tra cứu Reverse DNS (PTR) từ IP ra Hostname.
     - **Port Mạng**: Kiểm tra mở cổng TCP (Port Checker) và Tra cứu thư viện hơn 100 cổng mạng chuẩn (Port Directory).
     - **Subnet Calculator**: Tính toán chia dải mạng Subnet / CIDR bằng phép toán bit 32-bit unsigned integer, hiển thị Netmask, Wildcard, Broadcast, Range và phân lớp mạng.
     - **Wi-Fi QR Generator**: Tạo mã QR kết nối Wi-Fi offline lên thẻ `<canvas>`, hỗ trợ tải thẻ Wi-Fi, tải mã QR và in poster dán tường.
  3. **Tầng Footer**: Bản quyền kỹ thuật và liên kết hồ sơ lập trình viên (`https://ducthangnguyen.com`).
- **Danh sách công nghệ cốt lõi**:
  - **Ngôn ngữ & Cấu trúc**: HTML5 Semantic thuần, Vanilla CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism, Dark Mode chuẩn mobile-first max-width `480px`).
  - **Logic**: Vanilla JavaScript (ES6+), không phụ thuộc framework (No React/Vue, No jQuery, No Tailwind).
  - **Thư viện bên ngoài tối thiểu**:
    - [Font Awesome 6.5.1](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css): Icon vector.
    - [Google Fonts (Roboto)](https://fonts.googleapis.com/css2?family=Roboto): Typography.
    - `js/qrcode.min.js`: Thư viện render mã QR ngoại tuyến lên thẻ `<canvas>`.
  - **Nền tảng Hosting**: Tương thích hoàn toàn với Cloudflare Pages / GitHub Pages (100% Static HTML/CSS/JS).

---

## 2. Cấu trúc thư mục & Ý nghĩa từng file

```text
thangit.com/
├── assets/
│   ├── images/
│   │   ├── avata.jpg            # Ảnh đại diện tác giả (1080x1080)
│   │   ├── icon-192.png         # PWA Icon kích thước 192x192
│   │   ├── icon-512.png         # PWA Icon kích thước 512x512
│   │   ├── icon-maskable-192.png# PWA Maskable Icon cho Android
│   │   ├── icon-maskable-512.png# PWA Maskable Icon độ phân giải cao
│   │   └── logo-tit.svg         # Logo nhận diện thương hiệu Thắng IT (Vector SVG)
├── css/
│   └── style.css                # Toàn bộ CSS giao diện trang chủ, hệ thống biến màu, hiệu ứng & responsive
├── js/
│   ├── core.js                  # Điều khiển giao diện: Copy, Toast, PWA PTR, nạp dữ liệu tools UI
│   ├── qrcode.min.js            # Thư viện sinh mã QR offline lên Canvas (dùng cho công cụ Wi-Fi)
│   └── tools.js                 # Bộ xử lý logic: Subnet, Cloudflare Speedtest, DoH DNS, IP WAN, Port DB & Checker
├── apple-touch-icon.png         # Icon hiển thị khi lưu trang vào màn hình chính thiết bị iOS
├── favicon.ico                  # Favicon đa kích thước cho trình duyệt
├── favicon.png                  # Favicon PNG chất lượng cao
├── google954f6558285dd27a.html  # File xác thực quyền sở hữu website trên Google Search Console
├── index.html                   # Giao diện chính của website (Single Page Dashboard)
├── manifest.json                # Cấu hình PWA Web App Manifest (standalone, icons, theme color)
├── robots.txt                   # Cấu hình chỉ thị cho bọ tìm kiếm (khai báo sitemap)
├── sitemap.xml                  # Sơ đồ website chuẩn XML phục vụ lập chỉ mục SEO
└── sw.js                        # Service Worker quản lý bộ nhớ đệm, offline mode & chiến lược Network-First
```

---

## 3. Kiến trúc Logic & Giao diện

### 3.1. Phân chia trách nhiệm (Separation of Concerns)
- `tools.js` đóng vai trò là **Business Logic Layer / Engine**:
  - `calculateSubnet(ipStr, prefix)`: Xử lý chuyển đổi IP sang số nguyên 32-bit unsigned (`ipNum >>> 0`), tính toán Netmask, Wildcard, Broadcast, Host Range, RFC 1918.
  - `runNetworkSpeedTest(onProgress)`: Đo độ trễ Ping/Jitter, đọc stream tải xuống 6MB qua Cloudflare Edge CDN, đẩy gói upload 1.5MB qua XHR.
  - `queryCloudflareDoH(domain, type)`: Truy vấn DoH tới Cloudflare DNS 1.1.1.1 (`https://cloudflare-dns.com/dns-query`).
  - `queryReverseDns(ip)`: Tra cứu bản ghi PTR đảo ngược từ IP sang Hostname.
  - `checkTcpPort(host, port, timeout)`: Kiểm tra trạng thái cổng TCP (Open / Closed / Warning).
  - `NETWORK_PORTS_DATABASE`: Cơ sở dữ liệu hơn 100 cổng mạng phổ biến.
- `core.js` đóng vai trò là **Controller / Presentation Layer**:
  - Bắt sự kiện DOM switcher giữa 5 subtabs công cụ.
  - Xử lý clipboard copy, toast notifications, Mobile Pull-to-Refresh.
  - Đăng ký và quản lý Service Worker lifecycle.

### 3.2. Cơ chế Caching của Service Worker (`sw.js`)
- **Tên Cache**: `tit-hub-v22`.
- **Chiến lược Fetching**: Network-First Strategy. Fetch dữ liệu mới từ mạng trước, fallback sang cache storage khi ngoại tuyến.
- **Pull-to-Refresh**: Kéo từ đỉnh màn hình để xóa sạch cache và reload dữ liệu mới nhất.

---

## 4. Định hướng phân tách Domain

| Tiêu chí | `thangit.com` | `ducthangnguyen.com` |
| :--- | :--- | :--- |
| **Vai trò** | **Network Pro Tools Hub** (Web App công cụ mạng) | **Developer Profile / CV / Branding** |
| **Mục đích** | Phục vụ kỹ sư mạng, SysAdmin, DevOps và người dùng cần test mạng | Giới thiệu hồ sơ cá nhân, năng lực, dự án, thành tích nghề nghiệp |
| **Giao diện** | Dashboard công cụ tương tác 1 trang, dark neon, tốc độ cao | Trang cá nhân chuyên nghiệp, thanh lịch, chuẩn mực |

---

## 5. Hiện trạng SEO & Meta

- **Title**: `Thắng iT — Network Pro Tools Hub (Speedtest, DNS, Port, Subnet, Wi-Fi QR)`
- **Meta Description**: Tập trung 100% vào giá trị công cụ mạng client-side.
- **Structured Data (Schema.org)**:
  - `WebSite`: Khai báo website thangit.com.
  - `WebApplication`: Khai báo ứng dụng tiện ích web chuyên nghiệp `Thắng iT Network Pro Tools`.
- **Robots.txt**: Cho phép index toàn bộ, không còn đường dẫn `/admin/`.
- **Sitemap.xml**: Khai báo địa chỉ gốc `https://thangit.com/`.

---

## 6. Quy tắc phát triển (Development Guidelines)

1. **Vanilla-First**: Không đưa thêm framework (React/Vue/jQuery/Tailwind). Mọi tính năng viết bằng native Web APIs.
2. **Cache Busting**: Khi cập nhật CSS hoặc JS:
   - Tăng query parameter trong `index.html` (ví dụ: `v=YYYYMMDD_tools`).
   - Tăng `CACHE_NAME` trong `sw.js` (ví dụ: `tit-hub-v22` -> `tit-hub-v23`).
3. **Tách biệt Logic**: Mọi hàm tính toán / mạng đặt trong `js/tools.js`. Mọi hàm UI / sự kiện DOM đặt trong `js/core.js`.
