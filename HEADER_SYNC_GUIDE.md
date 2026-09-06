# HƯỚNG DẪN ĐỒNG BỘ GIAO DIỆN HEADER, AVATAR & NÚT LIÊN LẠC (3 TRANG)
> **Mục đích:** Khi mở cả 3 website (`thangnd.io.vn`, `thangit.com`, `thangnhayday.com`) cạnh nhau trên trình duyệt, **Avatar, Tên, @Handle, Giới thiệu (3 dòng) và hàng 4 Nút liên lạc sẽ thẳng hàng ngang 100% (Pixel-Perfect)** từ đỉnh xuống đáy.

---

## 1. BỘ THÔNG SỐ CHUẨN ĐỒNG BỘ (DESIGN TOKENS)

| Thành phần | Thông số chuẩn | Chi tiết & Tọa độ |
| :--- | :--- | :--- |
| **Body Padding** | `padding: 16px 14px 50px; margin: 0;` | Đỉnh trang cách mép trên trình duyệt đúng 16px |
| **App Container** | `display: flex; flex-direction: column; gap: 16px; padding: 0;` | Khoảng cách giữa các khối lớn là 16px |
| **Top Nav Action Bar** | `height: 38px; padding: 6px 4px;` | Đang hoạt động & Nút Share tròn 38px |
| **Avatar Wrapper** | **`104px × 104px`**, `margin: 0 auto 12px;` | Avatar tròn 50%, viền xoay `inset: -3px`, Y = 70px |
| **Tên Profile (h1)** | `font-size: 1.45rem; line-height: 1.2; font-weight: 800; margin: 0;` | Tích xanh 18x18px float animation |
| **@Handle** | `font-size: 0.88rem; font-weight: 700; margin: 2px 0 0; line-height: 1.3;` | `@thangnd`, `@thangit`, `@thangnhayday` |
| **Ô Giới thiệu (Bio)** | **`max-width: 360px; height: 64px; line-height: 1.55; font-size: 0.88rem; margin: 8px auto 0;`** | Khóa cứng ô 64px (chuẩn 3 dòng), căn giữa dọc |
| **Hàng 4 Nút liên lạc** | **`max-width: 320px; height: 48px; margin: 16px auto 0; gap: 10px;`** | Nút squircle bo góc `14px`, căn giữa |

---

## 2. NỘI DUNG TỪNG TRANG

### A. Trang 1: `thangnd.io.vn`
- **Tên:** `Nguyễn Đức Thắng`
- **Handle:** `@thangnd`
- **Bio (3 dòng):**
  ```html
  <p class="profile-bio">
    Cổng kết nối hệ sinh thái trực tuyến của <strong>Nguyễn Đức Thắng</strong>. Nơi chia sẻ Chuyên môn Mạng Cisco (<strong>ThangIT.com</strong>) &amp; Hành trình 100 ngày rèn luyện thể thao (<strong>ThangNhayDay.com</strong>) 🚀🔥
  </p>
  ```
- **4 Nút:** Zalo, Telegram, Discord, GitHub

### B. Trang 2: `thangit.com`
- **Tên:** `Thắng IT`
- **Handle:** `@thangit`
- **Bio (3 dòng):**
  ```html
  <p class="profile-bio">
    Quản trị hệ thống &amp; Mạng máy tính quy mô lớn • Tối ưu hạ tầng Cisco, Mikrotik &amp; Cloudflare. Chia sẻ công cụ IT, tiện ích bỏ túi &amp; đồ công nghệ hữu ích 🚀
  </p>
  ```
- **4 Nút:** Zalo, Telegram, Discord, GitHub

### C. Trang 3: `thangnhayday.com`
- **Tên:** `Thắng Nhảy Dây`
- **Handle:** `@thangnhayday`
- **Bio (3 dòng):**
  ```html
  <p class="profile-bio">
    Chia sẻ hành trình 100 ngày nhảy dây giảm mỡ bụng, cải thiện vóc dáng &amp; thể lực mỗi ngày. Khám phá kỹ thuật nhảy dây và đồ tập tại nhà chất lượng! 💪🔥
  </p>
  ```
- **4 Nút:** Facebook, YouTube, TikTok, Mời Cafe ☕

---

## 3. KẾT QUẢ ĐẠT ĐƯỢC
1. **Đỉnh của 3 Avatar** nằm trên cùng 1 đường thẳng ngang (Y = `70px`).
2. **Khối tên & @Handle** nằm trên cùng 1 đường thẳng ngang.
3. **Ô bio 3 dòng** cao đúng `64px`, đáy ô kết thúc tại cùng tọa độ Y trên cả 3 trang.
4. **Hàng 4 Nút liên lạc** ở cả 3 trang bắt đầu tại cùng tọa độ Y và cùng kích thước `48px`, thẳng hàng tuyệt đối (Pixel-Perfect)!
