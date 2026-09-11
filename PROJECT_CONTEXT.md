# thangit.com - Project Architecture & Technical Context

Tài liệu kỹ thuật tổng hợp toàn diện về kiến trúc, mã nguồn, luồng dữ liệu, hiện trạng SEO và quy chuẩn phát triển của dự án **thangit.com**.

---

## 1. Tổng quan dự án (Overview)

- **Định danh dự án**: `thangit.com` (TiT — Nguyễn Đức Thắng).
- **Loại hình website**: 
  - **PWA (Progressive Web App)**: Cài đặt trực tiếp lên điện thoại / máy tính như native app, hỗ trợ offline mode qua Service Worker và cử chỉ kéo để làm mới (Pull-to-Refresh).
  - **Portfolio & Network Hub**: Hồ sơ năng lực cá nhân của Senior Network Administrator & Vibe Coder.
  - **Network Pro Tools Hub (4-in-1)**: Bộ công cụ mạng chuyên sâu chạy 100% Client-Side.
  - **Curated Tech Affiliate**: Danh mục sản phẩm công nghệ chọn lọc cho dân SysAdmin/IT, tích hợp hệ thống quản trị không dùng backend (Serverless Headless CMS).
- **Mục đích chính & Luồng người dùng (User Flow)**:
  1. **Tầng Profile & Định danh**: Người dùng truy cập trang chủ tiếp cận ngay thương hiệu cá nhân, bio tóm tắt năng lực, cùng 4 nút liên hệ nhanh (Zalo, Telegram, Discord, GitHub).
  2. **Tầng Chuyển đổi Tab (3 Primary Tabs)**:
     - **Tab 1: ⚡ Công Cụ Mạng (4-in-1)**: Người dùng có thể kiểm tra nhanh IP WAN của mình, đo tốc độ mạng Speedtest (Ping/Jitter/Download/Upload) trực tiếp qua Cloudflare Edge CDN, tra cứu bản ghi DNS qua Cloudflare DoH (1.1.1.1), tính toán chia dải mạng Subnet / CIDR, tạo mã QR kết nối Wi-Fi (xuất ảnh PNG / in poster dán tường) và tra cứu nhanh danh mục hơn 100 cổng mạng (Port Directory).
     - **Tab 2: 💼 Hồ Sơ & Dịch Vụ**: Hiển thị hồ sơ năng lực thực chiến (10+ năm kinh nghiệm quản trị hạ tầng mạng logistics quy mô lớn 40.000m², 500+ thiết bị), lịch sử công tác, học vấn, danh sách kỹ năng cốt lõi (Cisco, Mikrotik, VPN, Linux, Proxmox, Cloudflare, Python/Flask Automation) và nút kêu gọi hành động (CTA) liên hệ tư vấn qua Zalo.
     - **Tab 3: 🛒 Đồ Công Nghệ**: Tải động danh sách sản phẩm phụ kiện/thiết bị IT từ `data/products.json`. Người dùng duyệt sản phẩm và bấm link Shopee Affiliate có gắn tag tài trợ (`rel="noopener sponsored"`).
  3. **Tầng PWA & Điều hướng**: Hỗ trợ chia sẻ trang (Web Share API), sao chép thông tin tức thời (Clipboard API + Toast feedback), hỗ trợ kéo từ đỉnh màn hình để xóa cache và tải lại trang mới nhất.
- **Danh sách công nghệ cốt lõi**:
  - **Ngôn ngữ & Cấu trúc**: HTML5 Semantic thuần, Vanilla CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism, Dark Mode chuẩn mobile-first max-width `480px`).
  - **Logic**: Vanilla JavaScript (ES6+), không phụ thuộc framework (No React/Vue, No jQuery, No Tailwind).
  - **Thư viện bên ngoài tối thiểu**:
    - [Font Awesome 6.5.1](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css): Icon vector.
    - [Google Fonts (Roboto)](https://fonts.googleapis.com/css2?family=Roboto): Typography đồng bộ thương hiệu.
    - `js/qrcode.min.js`: Thư viện render mã QR ngoại tuyến lên thẻ `<canvas>`.
  - **Nền tảng Hosting**: Tương thích hoàn toàn với GitHub Pages / Cloudflare Pages (100% Static HTML/CSS/JS).

---

## 2. Cấu trúc thư mục & Ý nghĩa từng file

```text
thangit.com/
├── admin/
│   └── index.html               # Trang quản trị sản phẩm & danh mục Affiliate (Headless CMS via GitHub API)
├── assets/
│   ├── images/
│   │   ├── avata.jpg            # Ảnh đại diện chính chủ (1080x1080)
│   │   ├── icon-192.png         # PWA Icon kích thước 192x192
│   │   ├── icon-512.png         # PWA Icon kích thước 512x512
│   │   ├── icon-maskable-192.png# PWA Maskable Icon cho Android
│   │   └── icon-maskable-512.png# PWA Maskable Icon độ phân giải cao
│   └── logo-tit.svg             # Logo nhận diện thương hiệu Thắng IT (Vector SVG)
├── css/
│   └── style.css                # Toàn bộ CSS giao diện trang chủ, hệ thống biến màu, hiệu ứng & responsive
├── data/
│   └── products.json            # Cơ sở dữ liệu JSON lưu trữ danh mục và sản phẩm Affiliate
├── js/
│   ├── core.js                  # Điều khiển giao diện chính: Tabs, Copy, Toast, PWA PTR, nạp dữ liệu tools
│   ├── qrcode.min.js            # Thư viện sinh mã QR offline lên Canvas (dùng cho công cụ Wi-Fi)
│   └── tools.js                 # Bộ xử lý logic: Subnet, Cloudflare Speedtest, DoH DNS, IP WAN, Port DB
├── apple-touch-icon.png         # Icon hiển thị khi lưu trang vào màn hình chính thiết bị iOS
├── favicon.ico                  # Favicon đa kích thước cho trình duyệt
├── favicon.png                  # Favicon PNG chất lượng cao
├── google954f6558285dd27a.html  # File xác thực quyền sở hữu website trên Google Search Console
├── index.html                   # Giao diện chính của website (Single Page Application layout)
├── manifest.json                # Cấu hình PWA Web App Manifest (standalone, icons, theme color)
├── robots.txt                   # Cấu hình chỉ thị cho bọ tìm kiếm (Disallow /admin/, khai báo sitemap)
├── sitemap.xml                  # Sơ đồ website chuẩn XML phục vụ lập chỉ mục SEO
└── sw.js                        # Service Worker quản lý bộ nhớ đệm, offline mode & chiến lược Network-First
```

### Chi tiết vai trò các file trọng yếu:

| File | Vai trò kỹ thuật |
| :--- | :--- |
| `index.html` | Điểm vào chính của ứng dụng. Chứa toàn bộ cây DOM của 3 tabs, header profile, schema SEO thực thể tác giả, container công cụ và script khởi chạy. |
| `admin/index.html` | Bảng điều khiển quản trị (Dashboard). Hoạt động hoàn toàn ở client, xác thực bằng GitHub Personal Access Token (PAT) lưu tại `localStorage`. Đọc, ghi và commit file `data/products.json` trực tiếp qua GitHub REST API (v3) lên branch `main`. Đồng thời lưu bản sao vào `localStorage` để xem trước tức thì. |
| `js/core.js` | Quản lý vòng đời DOM: Khởi tạo sự kiện tab, clipboard, toast notification, đăng ký Service Worker, quản lý cử chỉ kéo làm mới (Pull-to-Refresh) có rung phản hồi (Haptic Vibrate), kích hoạt render dữ liệu cho từng tab công cụ khi người dùng chuyển tab. |
| `js/tools.js` | Chứa các module nghiệp vụ kỹ thuật mạng: Thuật toán tính Subnet (thao tác bit 32-bit unsigned integer), hệ thống đo tốc độ mạng Cloudflare Speedtest (Ping/Jitter/Download stream/Upload via XHR), truy vấn DNS qua giao thức HTTPS (DoH 1.1.1.1), phát hiện IP WAN thực tế, cơ sở dữ liệu `NETWORK_PORTS_DATABASE` với hơn 100 cổng chuẩn. |
| `data/products.json` | Nguồn dữ liệu duy nhất (Single Source of Truth) cho tab Đồ Công Nghệ và trang Quản trị. |
| `sw.js` | Service Worker quản lý cache tĩnh (`tit-hub-v21`), chiến lược nạp dữ liệu mạng ưu tiên (Network-First) đảm bảo luôn lấy nội dung mới nhất và fallback sang cache khi mất kết nối mạng. |

---

## 3. Data Schema (`data/products.json`)

File `data/products.json` được định dạng chuẩn JSON, phân tách thành 2 mảng chính: `categories` (danh mục) và `items` (danh sách sản phẩm).

### Trích xuất cấu trúc dữ liệu JSON mẫu:

```json
{
  "categories": [
    {
      "id": "all",
      "name": "⚡ Tất Cả"
    },
    {
      "id": "phukien",
      "name": "Phụ Kiện"
    }
  ],
  "items": [
    {
      "id": "item-1788860025028",
      "title": "Lót Chuột Cỡ Lớn Full 100 Mẫu Kích Thước 80x30cm",
      "category": "phukien",
      "badge": "Bán Chạy",
      "price": "68.000đ",
      "image": "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mh74izzqj28ba6.webp",
      "url": "https://s.shopee.vn/80CVM4lRWL"
    }
  ]
}
```

### Ý nghĩa và đặc tả các trường (Fields Specification):

#### Bảng `categories`
| Trường (Key) | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `String` | Có | Mã định danh duy nhất của danh mục (slug không dấu, viết liền, ví dụ: `all`, `phukien`, `network`). `all` là danh mục mặc định hệ thống. |
| `name` | `String` | Có | Tên hiển thị của danh mục trên giao diện (thường kèm icon/emoji). |

#### Bảng `items`
| Trường (Key) | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `String` | Có | Mã định danh sản phẩm duy nhất theo timestamp (ví dụ: `item-1788860025028`). |
| `title` | `String` | Có | Tên tiêu đề sản phẩm hiển thị trên card. |
| `category` | `String` | Có | Khóa ngoại liên kết tới trường `id` của bảng `categories`. |
| `badge` | `String` | Không | Nhãn nổi bật hiển thị ở góc ảnh (ví dụ: `Hot`, `Khuyên Dùng`, `Best Seller`). Bỏ trống nếu không có. |
| `price` | `String` | Không | Mức giá hiển thị tham khảo (ví dụ: `68.000đ` hoặc `Giá ưu đãi`). Nếu để trống, giao diện tự hiển thị "Giá ưu đãi". |
| `image` | `String` | Có | Đường dẫn URL hình ảnh sản phẩm (hỗ trợ CDN Shopee hoặc link ảnh trực tuyến). |
| `url` | `String` | Có | Link tiếp thị liên kết (Shopee Affiliate link: `https://s.shopee.vn/...`). |

---

## 4. Kiến trúc Logic & Giao diện

### 4.1. Cơ chế Fetch Data & Render DOM (`js/core.js` & `js/tools.js`)

1. **Lazy Loading cho Tab Đồ Công Nghệ**:
   - Dữ liệu sản phẩm không tải ngay khi vừa mở trang để tối ưu First Contentful Paint (FCP).
   - Khi người dùng bấm sang tab `tab-aff`, hàm `loadAffiliateProducts()` mới kích hoạt:
     - Gửi request: `fetch('/data/products.json?v=' + Date.now())` (thêm tham số timestamp để vô hiệu hóa cache trình duyệt).
     - **Cơ chế Fallback thông minh**: Nếu fetch gặp lỗi (mất mạng hoặc lỗi máy chủ), hàm tự động truy xuất dữ liệu từ `localStorage.getItem('thangit_local_data')`.
     - Render động các thẻ sản phẩm qua template literals chèn vào `#home-products-grid`. Thẻ hình ảnh được gán `loading="lazy"`.
2. **Logic Tách rời (Separation of Concerns)**:
   - `tools.js` đóng vai trò là **Business Logic Layer / Engine**:
     - `calculateSubnet(ipStr, prefix)`: Xử lý chuyển đổi IP sang số nguyên 32-bit unsigned (`ipNum >>> 0`), tính mặt nạ mạng (Netmask), Wildcard mask, Broadcast IP, dải IP khả dụng và phân lớp mạng (Class A/B/C/D/E, Public/Private RFC 1918) hoàn toàn bằng phép toán bit.
     - `runNetworkSpeedTest(onProgress)`: Thực hiện 3 giai đoạn độc lập:
       - *Ping & Jitter*: Đo độ trễ tới `https://speed.cloudflare.com/__down?bytes=0`.
       - *Download Speed*: Đọc stream luồng nhị phân 6MB từ Cloudflare Edge CDN qua `ReadableStreamDefaultReader`, tính tốc độ theo thời gian thực (live Mbps).
       - *Upload Speed*: Đẩy gói tin 1.5MB bằng `XMLHttpRequest` lắng nghe sự kiện `xhr.upload.onprogress`.
     - `queryCloudflareDoH(domain, type)`: Gửi truy vấn DoH (DNS over HTTPS) tới endpoint `https://cloudflare-dns.com/dns-query` với header `Accept: application/dns-json`.
     - `fetchClientIpInfo()`: Kiểm tra IP thông qua `api.ipify.org`, có dự phòng qua `1.1.1.1/cdn-cgi/trace`.
   - `core.js` đóng vai trò là **Controller / Presentation Layer**: Bắt các sự kiện DOM (click, input, change), lấy giá trị, gọi hàm từ `tools.js`, định dạng kết quả và cập nhật vào DOM.

### 4.2. Cách thức hoạt động của trang quản trị (`admin/index.html`)

Trang Admin hoạt động theo mô hình **Serverless Headless CMS**:
1. **Xác thực**:
   - Sử dụng GitHub Personal Access Token (PAT) có quyền truy cập repo `ducthangqtm/thangit.com`.
   - Token được lưu trữ an toàn trong `localStorage` trên máy người dùng (`thangit_gh_token`), không gửi qua bất kỳ máy chủ trung gian nào.
2. **Đọc dữ liệu**:
   - Gọi GitHub API: `GET https://api.github.com/repos/ducthangqtm/thangit.com/contents/data/products.json`.
   - Lấy chuỗi mã hóa Base64 và lưu lại mã hash `sha` của file hiện tại.
   - Giải mã Base64 thành chuỗi JSON tiếng Việt (`decodeURIComponent(escape(atob(...)))`) và hiển thị lên giao diện quản trị dạng danh sách trực quan.
3. **Thao tác dữ liệu**:
   - Hỗ trợ đầy đủ: Thêm mới, Sửa thông tin, Xóa, Đổi thứ tự sản phẩm (Move up / Move down) và Quản lý danh mục.
   - Khi có thay đổi, dữ liệu được ghi ngay vào `localStorage('thangit_local_data')` và thanh thông báo nổi "Lưu & Xuất Bản Ngay" xuất hiện.
4. **Xuất bản (Commit trực tiếp vào Git)**:
   - Khi bấm "Lưu & Xuất Bản Ngay", hàm `publishChanges()` thực hiện:
     - Chuyển đổi dữ liệu sang chuỗi JSON và mã hóa Base64 UTF-8 an toàn (`btoa(unescape(encodeURIComponent(jsonContent)))`).
     - Gửi request `PUT` trực tiếp tới GitHub API kèm theo `sha` của phiên bản cũ và commit message rõ ràng: `"Update tech products & categories from Admin Panel"`.
     - Sau khi GitHub ghi nhận commit lên nhánh `main`, nền tảng hosting (GitHub Pages / Cloudflare Pages) sẽ tự động kích hoạt deploy bản mới trong vài giây.

### 4.3. Cơ chế Caching của Service Worker (`sw.js`)

- **Tên Cache**: `tit-hub-v21` (được cập nhật tăng số phiên bản khi triển khai bản mới).
- **Vòng đời (Lifecycle)**:
  - `install`: Lưu trước (Pre-cache) danh sách tài nguyên tĩnh cốt lõi (`/`, `index.html`, `data/products.json`, CSS, JS, logo, avatar, icons) qua `cache.addAll()`. Kích hoạt ngay lập tức với `self.skipWaiting()`.
  - `activate`: Quét toàn bộ các cache key hiện có trong trình duyệt, xóa bỏ các cache cũ khác phiên bản hiện tại, sau đó chiếm quyền điều khiển các client ngay lập tức bằng `self.clients.claim()`.
- **Chiến lược Fetching (Network-First Strategy)**:
  - Đối với tất cả request `GET`: Luôn cố gắng fetch từ mạng trước (`fetch(event.request)`).
  - Nếu kết nối thành công và response hợp lệ (status 200, type 'basic'), tự động nhân bản (`clone()`) và lưu đè bản mới nhất vào Cache Storage (`cache.put()`).
  - Nếu mất mạng (Offline) hoặc request thất bại, tự động chuyển hướng tìm kiếm trong Cache Storage (`caches.match(event.request)`).
- **Cơ chế Pull-to-Refresh kết hợp**:
  - Khi người dùng kéo trang từ đỉnh xuống trên thiết bị di động, `initPullToRefresh()` trong `core.js` sẽ kích hoạt hiệu ứng đàn hồi.
  - Khi vượt ngưỡng kéo, code sẽ tự động xóa sạch toàn bộ Cache Storage của trình duyệt (`caches.delete()`) và nạp lại trang với tham số ngẫu nhiên `_r=timestamp` để đảm bảo làm mới 100% dữ liệu.

---

## 5. Hiện trạng SEO & Meta

### 5.1. Thẻ Meta, OpenGraph & Canonical trong `index.html`

- **Meta Tiêu chuẩn**:
  - `viewport`: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover` (tối ưu tràn viền cho tai thỏ và thanh điều hướng trên mobile).
  - `title`: `Nguyễn Đức Thắng (Thắng iT) — Senior Network Administrator & Vibe Coder`.
  - `description`: Nêu rõ năng lực quản trị mạng 10+ năm kinh nghiệm và chia sẻ công cụ IT hữu ích.
  - `keywords`: Bao quát đầy đủ các từ khóa thương hiệu (`thắng it`, `nguyễn đức thắng`) và công cụ mạng (`subnet calculator`, `dns lookup doh`, `wifi qr`, `vietqr`).
  - `canonical`: Trỏ chuẩn xác về `https://thangit.com`.
- **Xác thực thực thể chéo (IndieWeb / Identity Verification)**:
  - `<link rel="me" href="https://thangnhayday.com">`
  - `<link rel="me" href="https://github.com/ducthangqtm">`
- **Social Metadata (Open Graph & Twitter Card)**:
  - Đầy đủ `og:type` (`website`), `og:site_name`, `og:url`, `og:title`, `og:description`.
  - Ảnh đại diện chia sẻ mạng xã hội `og:image` kích thước chuẩn 1080x1080 (`/assets/images/avata.jpg`).
  - Thẻ Twitter: `twitter:card` thiết lập `summary_large_image`.
- **Dữ liệu có cấu trúc (Schema.org JSON-LD — Entity Graph)**:
  - Sử dụng mô hình `@graph` liên kết 3 thực thể lớn:
    1. `WebSite` (`https://thangit.com/#website`): Khai báo tên website, định danh tác giả.
    2. `ProfilePage` (`https://thangit.com/#profilepage`): Xác nhận đây là trang hồ sơ cá nhân.
    3. `Person` (`https://thangit.com/#person`): Khai báo chi tiết thực thể Nguyễn Đức Thắng với các biệt danh (`Thắng IT`, `ducthangqtm`, `Thắng Nhảy Dây`), chức danh, danh sách liên kết mạng xã hội (`sameAs`) và các lĩnh vực chuyên môn (`knowsAbout`: Cisco, Mikrotik RouterOS, VLAN & VPN, Proxmox VE, Cloudflare, Python Automation, Vibe Coding).

### 5.2. Nội dung tóm tắt của `robots.txt` và `sitemap.xml`

- **`robots.txt`**:
  ```text
  User-agent: *
  Allow: /
  Disallow: /admin/

  Sitemap: https://thangit.com/sitemap.xml
  ```
  *Ý nghĩa*: Cho phép tất cả các công cụ tìm kiếm thu thập thông tin trang chủ và các trang công khai, đồng thời chặn tuyệt đối bot lập chỉ mục thư mục quản trị nội bộ `/admin/`. Khai báo vị trí sitemap chính xác.
- **`sitemap.xml`**:
  - Khai báo duy nhất địa chỉ gốc `https://thangit.com/`.
  - `lastmod`: Cập nhật ngày chỉnh sửa gần nhất.
  - `changefreq`: `daily` (tần suất cập nhật hàng ngày).
  - `priority`: `1.0` (mức độ ưu tiên cao nhất).

### 5.3. Nhận xét cấu trúc thẻ Heading & Semantic HTML

- **Heading Hierarchy (Phân cấp tiêu đề)**:
  - **Duy nhất một thẻ `<h1>`**: `<h1 class="profile-name">Thắng iT ...</h1>` đại diện cho chủ đề và thực thể trung tâm của toàn bộ trang web.
  - **Các thẻ `<h2>`**: Dùng cho tên hồ sơ trong tab CV (`<h2 class="cv-name">Nguyễn Đức Thắng</h2>`) và tiêu đề poster in Wi-Fi.
  - **Các thẻ `<h3>`**: Phân chia các khối chức năng rõ ràng (`<h3 class="tool-title">` cho từng công cụ mạng, `<h3 class="cv-section-title">` cho từng phần kinh nghiệm / học vấn / kỹ năng).
  - **Các thẻ `<h4>`**: Dùng cho tên từng sản phẩm công nghệ (`<h4 class="product-name">`).
  - *Đánh giá*: Cấu trúc heading đạt điểm tuyệt đối về chuẩn SEO kỹ thuật, không xảy ra hiện tượng đa thẻ H1 hay nhảy cóc cấp độ heading.
- **Semantic HTML5**:
  - Trang được bao bọc hợp lý bằng thẻ `<main class="app-container">`.
  - Phân vùng chức năng bằng `<header>`, `<nav>`, `<section>`, `<footer>`.
  - Bảng dữ liệu trong công cụ Subnet sử dụng `<table>`, `<tr>`, `<td>` chuẩn mực cho dữ liệu dạng ma trận/tính toán.
  - Khả năng tiếp cận (Accessibility - a11y): Tất cả các nút icon đều có thuộc tính `aria-label` và `title`, ảnh đại diện có `alt` và kích thước `width`/`height` rõ ràng.

---

## 6. Quy tắc phát triển (Development Guidelines)

### 6.1. Quy ước lập trình (Code Conventions)

1. **Vanilla-First — Zero Heavy Dependencies**:
   - Giữ mã nguồn hoàn toàn thuần túy (Pure Vanilla JS & CSS).
   - Tuyệt đối **không** tự ý thêm các thư viện cồng kềnh như React, Vue, jQuery, Tailwind CSS, Bootstrap hoặc các gói NPM nặng nếu không có yêu cầu bắt buộc.
   - Các chức năng mới nên được viết bằng native Web APIs (Canvas API, Clipboard API, Web Crypto, Fetch API, Performance API).
2. **Cấu trúc CSS & Biến hệ thống (CSS Tokens)**:
   - Toàn bộ giao diện sử dụng các biến màu CSS đặt tại `:root` trong `css/style.css` (như `--bg-body`, `--neon-cyan`, `--neon-green`, `--card-bg`, `--text-dim`).
   - Mọi thành phần UI mới phải kế thừa các biến màu có sẵn để bảo đảm tính nhất quán của theme Dark Neon / Glassmorphism.
3. **Tổ chức Module JavaScript**:
   - Logic nghiệp vụ (tính toán mạng, gọi API ngoại vi, xử lý thuật toán) phải đặt trong `js/tools.js`.
   - Logic điều khiển giao diện (bắt sự kiện DOM, render HTML, hiệu ứng toast/copy) đặt trong `js/core.js`.
   - Giữ các hàm độc lập, có comment mô tả mục đích và kiểm tra dữ liệu đầu vào cẩn thận.

### 6.2. Lưu ý tối ưu Core Web Vitals (CWV) & Hiệu năng

1. **LCP (Largest Contentful Paint)**:
   - Ảnh đại diện Profile `avata.jpg` nằm trong viewport đầu tiên được đặt thuộc tính `loading="eager"` kèm định kích thước cố định `width="104" height="104"`.
   - Font Google (Roboto) được tối ưu kết nối với thẻ `<link rel="preconnect">` tới `fonts.googleapis.com` và `fonts.gstatic.com`.
2. **FID / INP (First Input Delay & Interaction to Next Paint)**:
   - Các thao tác tính toán (như tính Subnet khi gõ IP, tìm kiếm cổng mạng, gõ tên Wi-Fi) phải được xử lý tức thời hoặc có cơ chế debounce (150ms - 200ms) để không gây nghẽn luồng xử lý giao diện chính (Main Thread).
3. **CLS (Cumulative Layout Shift)**:
   - Tất cả khung chứa hình ảnh (sản phẩm, avatar) và container công cụ phải có kích thước tối thiểu (min-height) hoặc tỉ lệ khung hình để tránh hiện tượng giật giật layout khi dữ liệu được nạp xong.
4. **Lazy Loading hình ảnh**:
   - Tất cả ảnh sản phẩm trong tab affiliate và ảnh logo trong tab CV đều phải có thuộc tính `loading="lazy"`.
5. **Quy trình cập nhật Service Worker & Cache Busting**:
   - Khi chỉnh sửa file CSS hoặc JS, cần cập nhật query parameter phiên bản trong `index.html` (ví dụ: `style.css?v=YYYYMMDD_vX`).
   - Đồng thời, **bắt buộc tăng phiên bản `CACHE_NAME`** trong `sw.js` (ví dụ: từ `tit-hub-v21` lên `tit-hub-v22`) để Service Worker tự động kích hoạt tiến trình xóa bộ nhớ đệm cũ và tải tài nguyên mới cho toàn bộ người dùng.
