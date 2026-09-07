# HỆ THỐNG QUY CHUẨN THIẾT KẾ & SEO HỆ SINH THÁI THẮNG IT & THẮNG NHẢY DÂY
> **Bản hợp nhất chính thức** áp dụng cho hệ sinh thái "Song Mã .COM":
> - **Chuyên Trang Công Nghệ & Định Danh Chính:** `thangit.com` (Thắng IT — Senior Network Administrator & Vibe Coder)
> - **Chuyên Trang Thể Thao & Đồ Tập:** `thangnhayday.com` (Thắng Nhảy Dây — Hành Trình 100 Ngày & Đồ Tập Tại Nhà)
> - **Trạm Chuyển Hướng:** `thangnd.io.vn` (Redirect 301 tự động chuyển sang `thangit.com`)

---

## 1. QUY CHUẨN GIAO DIỆN & BỐ CỤC ĐỒNG BỘ (PIXEL-PERFECT)
Khi mở cả 2 website cạnh nhau, toàn bộ thành phần từ đỉnh xuống chân trang đều **thẳng hàng tăm tắp (Pixel-Perfect)**:

| Thành phần | Thông số CSS chuẩn | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Body Padding** | `padding: 16px 14px 50px; margin: 0;` | Khoảng cách từ đỉnh trình duyệt đúng 16px |
| **App Container** | `max-width: 480px; width: 100%; margin: 0 auto !important; gap: 16px;` | Chuẩn Mobile-First, căn giữa màn hình |
| **Top Nav** | `height: 38px; padding: 6px 4px;` | Đang hoạt động (trái) & Nút Chia sẻ (phải) |
| **Avatar Wrapper** | **`104px × 104px`**, `margin: 0 auto 12px;` | Avatar tròn 50%, viền xoay `inset: -3px` + hiệu ứng sóng surge chạm đáy bừng sáng |
| **Profile Name (h1)** | `font-size: 1.45rem; line-height: 1.2; font-weight: 800; margin: 0;` | Kèm tích xanh verified 18px float animation |
| **@Handle** | `font-size: 0.88rem; font-weight: 700; margin: 2px 0 0; line-height: 1.3;` | `@thangit`, `@thangnhayday` |
| **Ô Tiểu Sử (Bio)** | **`height: 64px; margin: 8px auto 0; font-size: 0.81rem - 0.88rem;`** | **Khóa cứng 64px**, đúng 3 dòng nội dung |
| **4 Nút Mạng Xã Hội** | **`max-width: 320px; height: 48px; margin: 16px auto 0; gap: 10px;`** | Nút Squircle bo góc `14px`, 4 cột đều nhau |
| **Hàng Tabs Phân Loại** | `padding: 4px 0 6px; gap: 6px;` | Nút tab bo góc `13px - 14px`, ghim cố định hàng |
| **Lưới Thẻ / Sản Phẩm** | `grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;` | Lưới 2 cột song song, bo góc thẻ `14px` |

---

## 2. NỘI DUNG TIỂU SỬ (BIO) 3 DÒNG CHUẨN

* **`thangit.com`**:
  - Quản trị hệ thống & Mạng máy tính quy mô lớn • Tối ưu hạ tầng Cisco, Mikrotik & Cloudflare. Chia sẻ công cụ IT, tiện ích bỏ túi & đồ công nghệ hữu ích 🚀

* **`thangnhayday.com`**:
  - Chia sẻ hành trình 100 ngày nhảy dây giảm mỡ bụng, cải thiện vóc dáng & thể lực mỗi ngày. Khám phá kỹ thuật nhảy dây và đồ tập tại nhà chất lượng! 💪🔥

---

## 3. QUY CHUẨN ENTITY SEO & LIÊN KẾT CHÉO HỆ SINH THÁI

### A. Xác thực thực thể IndieWeb (`rel="me"`)
Trong thẻ `<head>` của từng trang liên kết chéo qua lại:
```html
<link rel="me" href="https://thangnhayday.com" />
<link rel="me" href="https://github.com/ducthangqtm" />
```

### B. Liên kết Chân trang (Footer Crosslinks)
Cả 2 trang liên kết chéo với nhau:
- `thangit.com` liên kết sang `thangnhayday.com` và `Admin`.
- `thangnhayday.com` liên kết sang `thangit.com` và `Admin`.

### C. Schema.org JSON-LD Graph
Đồng bộ thực thể cá nhân:
- Tên: **Nguyễn Đức Thắng**
- Tên gọi khác: `["Thắng IT", "Thắng ND", "ducthangqtm", "Thắng Nhảy Dây"]`
- Website: `https://thangit.com`
