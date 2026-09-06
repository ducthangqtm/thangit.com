# HƯỚNG DẪN ĐỒNG BỘ GIAO DIỆN HEADER, AVATAR & NÚT LIÊN LẠC (3 TRANG)
> **Mục đích:** Khi mở cả 3 website (`thangnd.io.vn`, `thangit.com`, `thangnhayday.com`) cạnh nhau, Avatar và hàng Nút liên lạc sẽ **thẳng hàng 100% (Pixel-Perfect)** về độ cao, kích thước và lề đỉnh.
> **Cách dùng sau này:** Khi mở folder nào (`thangit.com` hoặc `thangnhayday.com`), bạn chỉ cần nhắn bot: *"Áp dụng đồng bộ theo file HEADER_SYNC_GUIDE.md"* là xong ngay lập tức!

---

## 1. BỘ THÔNG SỐ CHUẨN ĐỒNG BỘ (DESIGN TOKENS)

* **Padding đỉnh (Top Spacing):** `padding-top: 16px` cho khung chứa chính.
* **Khoảng cách Top Nav -> Avatar:** `margin-top: 18px` hoặc `gap: 18px`.
* **Kích thước Avatar:** **`104px × 104px`** (bo tròn 50%, viền xoay gradient `inset: -3px`).
* **Hàng nút liên lạc (Social Bar):**
  * `grid-template-columns: repeat(4, 1fr)`
  * `max-width: 320px`
  * Chiều cao nút: `height: 48px`
  * Bo góc: `border-radius: 14px`
* **Khoảng chặn chiều cao Bio (Bio Height Lock):**
  * Đặt `min-height: 54px` cho khối chữ mô tả bio để dù chữ dài 2 hay 3 dòng thì hàng nút liên lạc ở cả 3 trang luôn chạm đúng cùng một tọa độ Y.

---

## 2. HƯỚNG DẪN CHI TIẾT CHO TỪNG TRANG

---

### A. TRANG 1: `thangnd.io.vn` (Cổng Gateway)
*File cần cập nhật:* `css/style.css`

```css
/* 1. Đồng bộ lề đỉnh Container */
.app-container {
  padding: 16px 16px 40px;
  gap: 18px;
}

/* 2. Chuẩn hóa kích thước Avatar về 104px */
.avatar-wrapper {
  width: 104px;
  height: 104px;
}

.avatar-img {
  width: 104px;
  height: 104px;
}

/* 3. Khóa độ cao Bio để Nút liên lạc thẳng tắp */
.profile-bio {
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

### B. TRANG 2: `thangit.com` (Trang IT & Portfolio)
*File cần cập nhật:* `css/style.css`

```css
/* 1. Đồng bộ khoảng cách đỉnh */
.app-container {
  padding: 16px 14px 40px;
  gap: 18px; /* Tăng từ 16px lên 18px cho bằng 2 trang kia */
}

/* 2. Tăng kích thước Avatar từ 96px lên 104px */
.avatar-wrapper {
  width: 104px;
  height: 104px;
}

.avatar-img {
  width: 104px;
  height: 104px;
}

.avatar-badge {
  width: 28px;
  height: 28px;
  font-size: 14px;
}

/* 3. Khóa độ cao Bio để Social Bar thẳng hàng */
.profile-bio {
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

### C. TRANG 3: `thangnhayday.com` (Trang Nhảy Dây & Thể Thao)
*File cần cập nhật:* `style.css`

```css
/* 1. Đồng bộ khoảng cách đỉnh */
.app-container {
  gap: 18px; /* Khóa chuẩn 18px */
}

/* 2. Avatar đã chuẩn sẵn 104px (Giữ nguyên) */
.avatar-wrapper {
  width: 104px;
  height: 104px;
  margin-bottom: 12px;
}

/* 3. Khóa độ cao Bio để Social Bar thẳng hàng */
.profile-bio {
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 3. CHECKLIST KIỂM TRA SAU KHI ĐỒNG BỘ
- [ ] Mở cả 3 tab cạnh nhau trên màn hình máy tính.
- [ ] Dùng thước kẻ ngang (hoặc mắt nhìn) xem tâm của 3 Avatar có nằm trên 1 đường thẳng không.
- [ ] Xem hàng 4 nút bấm liên lạc ở cả 3 trang có song song và cao bằng nhau không.
