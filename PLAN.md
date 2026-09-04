# Kế Hoạch Xây Dựng Website thangit.com
**Phong cách:** Network Operations Center (NOC) Dashboard & Vibe Coder Portfolio  
**Mô hình:** 100% Static Web (Không cần Database, Siêu tốc, Tối ưu SEO, 0đ vận hành trên Cloudflare Pages)

---

## 1. Thông Tin Dự Án & Kho Lưu Trữ (Repository)
* **Domain:** thangit.com (Đã sở hữu trên Cloudflare Registrar)
* **GitHub Repo:** https://github.com/ducthangqtm/thangit.com.git (Private/Public)
* **Thư mục làm việc trên máy:** C:\Users\thangnd\Desktop\thangit.com
* **Lệnh kết nối Git ban đầu (đã chuẩn bị sẵn):**
  ```bash
  git init
  git branch -M main
  git remote add origin https://github.com/ducthangqtm/thangit.com.git
  ```

---

## 2. Mục Tiêu & Định Vị Thương Hiệu
* **Chủ sở hữu:** Nguyễn Đức Thắng (Thắng IT)
* **Định vị:** Network Administrator & Vibe Coder.
* **Thông điệp cốt lõi:** Làm chủ hạ tầng mạng, kết hợp sức mạnh AI (Vibe Coding) để kiến tạo các sản phẩm số thực chiến, tốc độ cao và hoạt động bền bỉ 24/7.
* **Chi phí vận hành:** **0đ/tháng** (Deploy qua GitHub -> Cloudflare Pages tự động, miễn phí SSL, CDN toàn cầu).

---

## 3. Kiến Trúc Kỹ Thuật (Architecture)
* **Không Database:** Toàn bộ dữ liệu hiển thị tĩnh, an toàn tuyệt đối, không sợ bị hack/SQL injection, không lo tốn phí duy trì server.
* **Công nghệ:** HTML5 Semantic, Modern Vanilla CSS (Dark Cyber Obsidian Theme, Glassmorphism, CSS Variables), Modern JavaScript (ES6 Modules).
* **Cơ chế triển khai:** GitHub -> Cloudflare Pages (tương tự như cách vận hành thangnhayday.com). Push git là tự động live sau 10-15 giây.

---

## 4. Các Phân Hệ Tính Năng (Modules)

### A. Topbar: System Status & NOC Bar
* **Đèn LED trạng thái:** Xanh lá nhấp nháy SYSTEM STATUS: ONLINE (200 OK).
* **Live Latency Ping:** Đo thời gian phản hồi thực tế từ trình duyệt đến Cloudflare Edge server (ví dụ: Ping: 12ms (HAN - Hanoi POP)).
* **Quick Nav:** Về trang chủ, Công cụ mạng, Dự án, Kỹ năng, Liên hệ.

### B. Hero Section: The Network Engineer & Vibe Coder
* **Avatar / Huy hiệu:** Nhận diện Thắng IT với viền phát sáng công nghệ.
* **Headline:** *Nguyễn Đức Thắng — Quản Trị Mạng & Vibe Coder*.
* **Mô tả ngắn:** Kết hợp tư duy hạ tầng mạng thực chiến và AI để giải quyết bài toán số hóa nhanh gọn, hiệu quả.
* **Nút hành động (CTA):** Khám phá dự án & Kiểm tra mạng của bạn.

### C. Live Network Toolbox (Tiện Ích Mạng Trực Tuyến - Không Cần DB)
1. **Network Inspector (Soi IP & Thông tin mạng của bạn):**
   * Hiển thị IP Public, vị trí địa lý, nhà mạng (ISP), giao thức kết nối (HTTP/3, TLS 1.3).
2. **Ping & Latency Tester:**
   * Đo độ trễ mạng thực tế từ thiết bị người dùng đến các trung tâm dữ liệu.
3. **Password / Token Generator cho dân IT:**
   * Công cụ tạo mật khẩu bảo mật cao (chọn độ dài, ký tự đặc biệt) chạy 100% trên trình duyệt.

### D. Showcase Dự Án Thực Chiến
1. **thangnhayday.com (Dự án tiêu biểu):**
   * *Mô tả:* Hệ thống Bio Link & Affiliate Hub cho KOC thể thao. Xây dựng thương hiệu cá nhân, kết nối hàng nghìn người theo dõi hành trình 100 ngày nhảy dây và tối ưu hóa chuyển đổi Shopee.
   * *Tag:* KOC Fitness • Affiliate Marketing • Web Performance.
2. **NOC Dashboard thangit.com:**
   * *Mô tả:* Trung tâm thông tin cá nhân và tiện ích mạng chạy không độ trễ trên Cloudflare Edge.
3. **Các giải pháp mạng & tự động hóa (Mikrotik, Cisco, Linux Server, Homelab).**

### E. Kỹ Năng & Hạ Tầng (Bento Grid)
* **Mạng & Hạ tầng:** Router/Switch Mikrotik, Cisco, VLAN, VPN, WAN/LAN, Firewall, Cáp mạng & WiFi Doanh nghiệp.
* **Hệ thống & Cloud:** Linux (Ubuntu/Debian), Windows Server, Docker, Virtualization (Proxmox/ESXi), Cloudflare (DNS, WAF, Pages).
* **Vibe Coding & Tools:** AI Prompting, HTML/CSS/JS, Git/GitHub, Visual Studio Code.

### F. Terminal Contact & Social
* **Email:** contact@thangit.com (kèm nút copy 1 chạm).
* **Social Hub:** Kết nối Facebook, Zalo, YouTube, TikTok, GitHub.

---

## 5. Quy Trình Triển Khai (Deployment Checklist)
1. [x] Mua tên miền thangit.com trên Cloudflare Registrar.
2. [x] Tạo repository GitHub: https://github.com/ducthangqtm/thangit.com.git.
3. [x] Chuyển workspace sang thư mục thangit.com.
4. [x] Khởi tạo Git & liên kết remote origin.
5. [x] Xây dựng mã nguồn tĩnh (index.html, css/, js/).
6. [ ] Git commit & push lên GitHub main.
7. [ ] Vào Cloudflare Pages -> Connect Git repo thangit.com -> Deploy.
8. [ ] Gán custom domain thangit.com (Active tức thì).
