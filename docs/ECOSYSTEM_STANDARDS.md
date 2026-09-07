# HỆ THỐNG QUY CHUẨN THIẾT KẾ & SEO HỆ SINH THÁI THẮNG ND
> **Bản hợp nhất chính thức** áp dụng cho cả 3 website:
> - **Cổng Trung Tâm:** `thangnd.io.vn` (Nguyễn Đức Thắng / Thắng ND Hub)
> - **Chuyên Trang IT:** `thangit.com` (Thắng IT — Network & Vibe Coding)
> - **Chuyên Trang Thể Thao:** `thangnhayday.com` (Thắng Nhảy Dây — Bio Link & Fitness)

---

## 1. QUY CHUẨN GIAO DIỆN & BỐ CỤC ĐỒNG BỘ (PIXEL-PERFECT)
Khi mở cả 3 website cạnh nhau, toàn bộ thành phần từ đỉnh xuống chân trang đều **thẳng hàng tăm tắp (Pixel-Perfect)**:

| Thành phần | Thông số CSS chuẩn | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Body Padding** | `padding: 16px 14px 50px; margin: 0;` | Khoảng cách từ đỉnh trình duyệt đúng 16px |
| **App Container** | `max-width: 480px; width: 100%; margin: 0 auto !important; gap: 16px;` | Chuẩn Mobile-First, căn giữa màn hình |
| **Top Nav** | `height: 38px; padding: 6px 4px;` | Đang hoạt động (trái) & Nút Chia sẻ (phải) |
| **Avatar Wrapper** | **`104px × 104px`**, `margin: 0 auto 12px;` | Avatar tròn 50%, viền xoay `inset: -3px` |
| **Profile Name (h1)** | `font-size: 1.45rem; line-height: 1.2; font-weight: 800; margin: 0;` | Kèm tích xanh verified 18px float animation |
| **@Handle** | `font-size: 0.88rem; font-weight: 700; margin: 2px 0 0; line-height: 1.3;` | `@thangnd`, `@thangit`, `@thangnhayday` |
| **Ô Tiểu Sử (Bio)** | **`height: 64px; margin: 8px auto 0; font-size: 0.81rem - 0.88rem;`** | **Khóa cứng 64px**, đúng 3 dòng nội dung |
| **4 Nút Mạng Xã Hội** | **`max-width: 320px; height: 48px; margin: 16px auto 0; gap: 10px;`** | Nút Squircle bo góc `14px`, 4 cột đều nhau |
| **Hàng Tabs Phân Loại** | `padding: 4px 0 6px; gap: 6px;` | Nút tab bo góc `13px - 14px`, ghim cố định hàng |
| **Lưới Thẻ / Sản Phẩm** | `grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;` | Lưới 2 cột song song, bo góc thẻ `14px` |

---

## 2. NỘI DUNG TIỂU SỬ (BIO) 3 DÒNG CHUẨN

* **`thangnd.io.vn`**:
  - Dòng 1: Cổng kết nối hệ sinh thái trực tuyến của **Nguyễn Đức Thắng**
  - Dòng 2: Chuyên môn Mạng Cisco & Vibe Coding : **ThangIT.com** *(Neon Cyan)*
  - Dòng 3: Hành trình 100 ngày rèn luyện thể thao : **ThangNhayDay.com** *(Neon Amber)*

* **`thangit.com`**:
  - Dòng 1-3: Quản trị hệ thống & Mạng máy tính quy mô lớn • Tối ưu hạ tầng Cisco, Mikrotik & Cloudflare. Chia sẻ công cụ IT, tiện ích bỏ túi & đồ công nghệ hữu ích 🚀

* **`thangnhayday.com`**:
  - Dòng 1-3: Chia sẻ hành trình 100 ngày nhảy dây giảm mỡ bụng, cải thiện vóc dáng & thể lực mỗi ngày. Khám phá kỹ thuật nhảy dây và đồ tập tại nhà chất lượng! 💪🔥

---

## 3. QUY CHUẨN ENTITY SEO & LIÊN KẾT CHÉO HỆ SINH THÁI

### A. Xác thực thực thể IndieWeb (`rel="me"`)
Trong thẻ `<head>` của từng trang luôn khai báo đầy đủ 2 trang còn lại:
```html
<link rel="me" href="https://thangnd.io.vn" />
<link rel="me" href="https://thangit.com" />
<link rel="me" href="https://thangnhayday.com" />
```

### B. Liên kết Chân trang (Footer Backlinks)
Cả `thangit.com` và `thangnhayday.com` đều dẫn link về cổng định danh trung tâm:
```html
<p class="footer-identity-link">
  Sáng lập bởi <a href="https://thangnd.io.vn" target="_blank" rel="me">Nguyễn Đức Thắng (Thắng ND)</a>
</p>
```

### C. Schema.org JSON-LD Graph
Đồng bộ thuộc tính `author` và `sameAs` trỏ chéo giữa 3 tên miền giúp Google Knowledge Graph liên kết thành một Thực thể Người duy nhất (Nguyễn Đức Thắng).

---

## 4. QUY CHUẨN ICON / FAVICON CHUẨN GOOGLE SEARCH
Theo hướng dẫn của Google Search Central, icon tìm kiếm bắt buộc phải là file ảnh raster hình vuông có kích thước bội số 48px:
* **File chuẩn:** `favicon.png` (192x192px) và `favicon.ico` (multi-size: 16x16, 32x32, 48x48px).
* **`thangnd.io.vn`:** Logo TiT công nghệ hình tròn.
* **`thangit.com`:** Avatar Thắng IT bo viền Neon Cyan `#00f0ff`.
* **`thangnhayday.com`:** Avatar Thắng Nhảy Dây bo viền Neon Amber `#f59e0b`.
