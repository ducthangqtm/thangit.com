# HƯỚNG DẪN ĐỒNG BỘ SEO VỚI CỔNG ĐỊNH DANH THANGND.IO.VN
> **Áp dụng cho:** thangit.com
> **Website trung tâm:** https://thangnd.io.vn (Nguyễn Đức Thắng / Thắng ND)

---

## 1. Mục Đích
- Kết nối thực thể (Entity SEO / Knowledge Graph): Báo cho Google biết **ThangIT.com** và **ThangND.io.vn** là do cùng một người sở hữu.
- Tăng sức mạnh SEO 2 chiều (Internal Backlink / Link Juice) giữa cổng công nghệ và cổng định danh cá nhân.

---

## 2. Đoạn Mã Cần Thêm Vào `index.html` (ThangIT.com)

### A. Thêm Link vào Footer (Chân trang)
Chèn vào trong thẻ `<footer>` của `index.html`:
```html
<p class="footer-identity-link">
  Phát triển bởi <a href="https://thangnd.io.vn" target="_blank" rel="me">Thắng ND</a> • Cổng định danh cá nhân
</p>
```
*(Thuộc tính `rel="me"` là quy chuẩn quốc tế để Google xác thực cùng chủ sở hữu).*

### B. Thêm / Cập Nhật Schema JSON-LD trong thẻ `<head>`
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Thắng IT",
  "url": "https://thangit.com",
  "author": {
    "@type": "Person",
    "name": "Nguyễn Đức Thắng",
    "alternateName": ["Thắng ND", "ducthangqtm"],
    "url": "https://thangnd.io.vn",
    "sameAs": [
      "https://thangnd.io.vn",
      "https://github.com/ducthangqtm"
    ]
  }
}
</script>
```
