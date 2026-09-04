import os
import subprocess
import time
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "assets", "images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# 1. Standard App Icon HTML (Fit with comfortable 8% padding for iOS & standard Android)
html_standard = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1024px;
    height: 1024px;
    background: #04070d;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .icon-svg {
    width: 900px;
    height: 900px;
  }
</style>
</head>
<body>
<svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none">
  <defs>
    <linearGradient id="tit-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1829"/>
      <stop offset="100%" stop-color="#04070e"/>
    </linearGradient>
    <linearGradient id="tit-neon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="50%" stop-color="#00ff9d"/>
      <stop offset="100%" stop-color="#00f0ff"/>
    </linearGradient>
    <filter id="tit-outer-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="0.8" flood-color="#00f0ff" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Cyber Badge Outer Frame -->
  <rect x="1.5" y="1.5" width="41" height="41" rx="10" fill="url(#tit-bg)" stroke="url(#tit-neon)" stroke-width="1.8" filter="url(#tit-outer-glow)"/>

  <!-- Center i: Radar Transmission Waves -->
  <circle cx="22" cy="12" r="5" stroke="rgba(0, 255, 157, 0.45)" stroke-width="1.2" fill="none"/>
  <circle cx="22" cy="12" r="8" stroke="rgba(0, 240, 255, 0.28)" stroke-width="1.0" fill="none"/>

  <!-- Center i: Antenna Beacon Dot -->
  <circle cx="22" cy="12" r="2.3" fill="#00ff9d"/>

  <!-- Letters Group: Smooth, Soft Rounded T - i - T -->
  <g>
    <!-- Left T: Rounded top bar and stem -->
    <path d="M 6.5 15.2 H 16.5 M 11.5 15.2 V 29" stroke="url(#tit-neon)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Center i: Soft Stem -->
    <path d="M 22 18.5 V 29" stroke="#00f0ff" stroke-width="3.4" stroke-linecap="round"/>
    <!-- Pulse Packet dot -->
    <circle cx="22" cy="23.5" r="1.3" fill="#ffffff"/>

    <!-- Right T: Rounded top bar and stem -->
    <path d="M 27.5 15.2 H 37.5 M 32.5 15.2 V 29" stroke="url(#tit-neon)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
</body>
</html>
"""

# 2. Maskable Icon HTML (Android Adaptive Icon safe zone: 66% diameter / 17% padding)
html_maskable = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1024px;
    height: 1024px;
    background: #04070d;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .icon-svg {
    width: 720px;
    height: 720px;
  }
</style>
</head>
<body>
<svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none">
  <defs>
    <linearGradient id="tit-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1829"/>
      <stop offset="100%" stop-color="#04070e"/>
    </linearGradient>
    <linearGradient id="tit-neon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="50%" stop-color="#00ff9d"/>
      <stop offset="100%" stop-color="#00f0ff"/>
    </linearGradient>
    <filter id="tit-outer-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="0.8" flood-color="#00f0ff" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Cyber Badge Outer Frame -->
  <rect x="1.5" y="1.5" width="41" height="41" rx="10" fill="url(#tit-bg)" stroke="url(#tit-neon)" stroke-width="1.8" filter="url(#tit-outer-glow)"/>

  <!-- Center i: Radar Transmission Waves -->
  <circle cx="22" cy="12" r="5" stroke="rgba(0, 255, 157, 0.45)" stroke-width="1.2" fill="none"/>
  <circle cx="22" cy="12" r="8" stroke="rgba(0, 240, 255, 0.28)" stroke-width="1.0" fill="none"/>

  <!-- Center i: Antenna Beacon Dot -->
  <circle cx="22" cy="12" r="2.3" fill="#00ff9d"/>

  <!-- Letters Group: Smooth, Soft Rounded T - i - T -->
  <g>
    <!-- Left T: Rounded top bar and stem -->
    <path d="M 6.5 15.2 H 16.5 M 11.5 15.2 V 29" stroke="url(#tit-neon)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Center i: Soft Stem -->
    <path d="M 22 18.5 V 29" stroke="#00f0ff" stroke-width="3.4" stroke-linecap="round"/>
    <!-- Pulse Packet dot -->
    <circle cx="22" cy="23.5" r="1.3" fill="#ffffff"/>

    <!-- Right T: Rounded top bar and stem -->
    <path d="M 27.5 15.2 H 37.5 M 32.5 15.2 V 29" stroke="url(#tit-neon)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
</body>
</html>
"""

def render_html_to_png(html_content, temp_html_path, out_png_path):
    with open(temp_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=1024,1024",
        f"--screenshot={out_png_path}",
        f"file:///{temp_html_path.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd, check=True)

temp_std_html = os.path.join(BASE_DIR, "tools", "temp_std.html")
temp_mask_html = os.path.join(BASE_DIR, "tools", "temp_mask.html")
master_std_png = os.path.join(BASE_DIR, "tools", "master_std.png")
master_mask_png = os.path.join(BASE_DIR, "tools", "master_mask.png")

print("Rendering master 1024x1024 icons via Chrome headless...")
render_html_to_png(html_standard, temp_std_html, master_std_png)
render_html_to_png(html_maskable, temp_mask_html, master_mask_png)

print("Downsampling with Pillow Lanczos filter for crisp rendering...")
# Standard icons
img_std = Image.open(master_std_png).convert("RGBA")
img_std.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(OUTPUT_DIR, "icon-512.png"), "PNG", optimize=True)
img_std.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(OUTPUT_DIR, "icon-192.png"), "PNG", optimize=True)
img_std.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(OUTPUT_DIR, "apple-touch-icon.png"), "PNG", optimize=True)
img_std.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(BASE_DIR, "apple-touch-icon.png"), "PNG", optimize=True)
img_std.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(OUTPUT_DIR, "favicon-32x32.png"), "PNG", optimize=True)

# Maskable icons
img_mask = Image.open(master_mask_png).convert("RGBA")
img_mask.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(OUTPUT_DIR, "icon-maskable-512.png"), "PNG", optimize=True)
img_mask.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(OUTPUT_DIR, "icon-maskable-192.png"), "PNG", optimize=True)

# Clean up temp files
for p in [temp_std_html, temp_mask_html, master_std_png, master_mask_png]:
    if os.path.exists(p):
        os.remove(p)

print("Icons successfully generated!")
