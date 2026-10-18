import os
import sys
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_installer_bitmaps():
    build_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'build')
    electron_assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'electron', 'assets')
    os.makedirs(build_dir, exist_ok=True)
    os.makedirs(electron_assets_dir, exist_ok=True)

    force = '--force' in sys.argv
    existing_custom = [
        os.path.join(electron_assets_dir, 'installerSidebar.bmp'),
        os.path.join(electron_assets_dir, 'installerHeader.bmp')
    ]
    if not force and all(os.path.exists(p) for p in existing_custom):
        print("Custom installer bitmaps already exist in frontend/electron/assets. Skipping generation (pass --force to overwrite).")
        # Ensure build directory is synced with electron/assets
        import shutil
        for fname in ['installerSidebar.bmp', 'uninstallerSidebar.bmp', 'installerHeader.bmp']:
            src = os.path.join(electron_assets_dir, fname)
            dst = os.path.join(build_dir, fname)
            if os.path.exists(src):
                shutil.copy2(src, dst)
        return
    
    icon_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'public', 'icon.png')
    
    # 1. Load icon and extract VM mark
    icon_img = Image.open(icon_path).convert('RGBA')
    bg_color = (11, 14, 20)
    # Mask out the background to get pure logo ribbon
    mask = Image.new('L', icon_img.size, 0)
    data = icon_img.load()
    for y in range(icon_img.height):
        for x in range(icon_img.width):
            r, g, b, _ = data[x, y]
            if abs(r - bg_color[0]) > 22 or abs(g - bg_color[1]) > 22 or abs(b - bg_color[2]) > 22:
                mask.putpixel((x, y), 255)
    
    # Smooth the mask
    mask = mask.filter(ImageFilter.GaussianBlur(1))
    vm_crop_box = (180, 395, 1080, 860)
    vm_mark = icon_img.crop(vm_crop_box)
    vm_mask = mask.crop(vm_crop_box)
    
    # Fonts
    font_bold = ImageFont.truetype('C:/Windows/Fonts/seguisb.ttf', 16)
    font_studio = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 10)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 9)
    font_feat = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 8)
    font_foot = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 8)

    # -------------------------------------------------------------
    # 2. Generate installerSidebar.bmp (164 x 314 px)
    # -------------------------------------------------------------
    w_side, h_side = 164, 314
    sidebar = Image.new('RGB', (w_side, h_side), (11, 14, 20))
    draw_side = ImageDraw.Draw(sidebar)

    # Background subtle vertical gradient
    for y in range(h_side):
        factor = y / float(h_side)
        r = int(10 + 6 * math.sin(factor * math.pi))
        g = int(14 + 10 * math.sin(factor * math.pi))
        b = int(22 + 18 * math.sin(factor * math.pi))
        draw_side.line([(0, y), (w_side, y)], fill=(r, g, b))

    # Glowing aura behind logo
    aura = Image.new('RGBA', (w_side, h_side), (0, 0, 0, 0))
    draw_aura = ImageDraw.Draw(aura)
    cx, cy = w_side // 2, 70
    for radius in range(55, 10, -5):
        alpha = int(24 * (1.0 - radius / 55.0))
        draw_aura.ellipse([cx - radius, cy - int(radius * 0.7), cx + radius, cy + int(radius * 0.7)], fill=(14, 99, 233, alpha))
    sidebar.paste(Image.composite(aura.convert('RGB'), sidebar, aura.split()[3]), (0, 0))

    # Resize VM mark to fit nicely (~108px wide)
    logo_w = 108
    logo_h = int(vm_mark.height * (logo_w / vm_mark.width))
    resized_vm = vm_mark.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    resized_mask = vm_mask.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    
    # Paste logo mark
    logo_x = (w_side - logo_w) // 2
    logo_y = 44
    sidebar.paste(resized_vm.convert('RGB'), (logo_x, logo_y), resized_mask)

    # Redraw context for text
    draw_side = ImageDraw.Draw(sidebar)
    
    # Title: VisualMark
    text_title = "VisualMark"
    tb = draw_side.textbbox((0, 0), text_title, font=font_bold)
    tw = tb[2] - tb[0]
    draw_side.text(((w_side - tw) // 2, 108), text_title, fill=(255, 255, 255), font=font_bold)

    # Subtitle: S T U D I O
    text_studio = "S T U D I O"
    tb_st = draw_side.textbbox((0, 0), text_studio, font=font_studio)
    tw_st = tb_st[2] - tb_st[0]
    draw_side.text(((w_side - tw_st) // 2, 128), text_studio, fill=(56, 189, 248), font=font_studio)

    # Accent separator bar
    bar_w = 50
    draw_side.line([((w_side - bar_w) // 2, 145), ((w_side + bar_w) // 2, 145)], fill=(37, 99, 235), width=2)

    # Tagline
    tagline = "Markdown & Documentation IDE"
    tb_tag = draw_side.textbbox((0, 0), tagline, font=font_sub)
    tw_tag = tb_tag[2] - tb_tag[0]
    draw_side.text(((w_side - tw_tag) // 2, 153), tagline, fill=(148, 163, 184), font=font_sub)

    # Feature List
    features = [
        "Live AST Markdown Engine",
        "FastAPI AI Sidecar",
        "Vector SVG Badge Studio",
        "Interactive Diagrams",
        "Git Source Control"
    ]
    feat_y = 182
    for feat in features:
        draw_side.text((16, feat_y), "✓", fill=(56, 189, 248), font=font_feat)
        draw_side.text((28, feat_y), feat, fill=(148, 163, 184), font=font_feat)
        feat_y += 18

    # Subtle bottom divider
    draw_side.line([(16, 288), (w_side - 16, 288)], fill=(30, 41, 59), width=1)
    
    # Footer
    foot = "v1.1.2 Desktop"
    tb_f = draw_side.textbbox((0, 0), foot, font=font_foot)
    draw_side.text(((w_side - (tb_f[2] - tb_f[0])) // 2, 294), foot, fill=(100, 116, 139), font=font_foot)

    # -------------------------------------------------------------
    # 3. Generate installerHeader.bmp (150 x 57 px)
    # Standard NSIS MUI2 header image on the top right
    # -------------------------------------------------------------
    w_head, h_head = 150, 57
    # Background: Modern Slate-100 (#F1F5F9) to blend with MUI_BGCOLOR
    slate_bg = (241, 245, 249)
    header = Image.new('RGB', (w_head, h_head), slate_bg)
    draw_head = ImageDraw.Draw(header)

    badge_x = 94
    badge_y = 6
    badge_size = 45
    badge_r = 10
    draw_head.rounded_rectangle(
        [badge_x, badge_y, badge_x + badge_size, badge_y + badge_size],
        radius=badge_r,
        fill=(15, 20, 28),
        outline=(203, 213, 225),
        width=1
    )

    b_logo_w = 34
    b_logo_h = int(vm_mark.height * (b_logo_w / vm_mark.width))
    b_vm = vm_mark.resize((b_logo_w, b_logo_h), Image.Resampling.LANCZOS)
    b_mask = vm_mask.resize((b_logo_w, b_logo_h), Image.Resampling.LANCZOS)
    
    b_x = badge_x + (badge_size - b_logo_w) // 2
    b_y = badge_y + (badge_size - b_logo_h) // 2
    header.paste(b_vm.convert('RGB'), (b_x, b_y), b_mask)

    font_h_title = ImageFont.truetype('C:/Windows/Fonts/seguisb.ttf', 11)
    font_h_sub = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 8)

    draw_head = ImageDraw.Draw(header)
    h_title = "VisualMark"
    tb_ht = draw_head.textbbox((0, 0), h_title, font=font_h_title)
    draw_head.text((badge_x - (tb_ht[2] - tb_ht[0]) - 8, 14), h_title, fill=(15, 23, 42), font=font_h_title)

    h_sub = "STUDIO"
    tb_hs = draw_head.textbbox((0, 0), h_sub, font=font_h_sub)
    draw_head.text((badge_x - (tb_hs[2] - tb_hs[0]) - 8, 29), h_sub, fill=(2, 132, 199), font=font_h_sub)

    # Save to both target directories
    for out_dir in [build_dir, electron_assets_dir]:
        sidebar_path = os.path.join(out_dir, 'installerSidebar.bmp')
        sidebar.save(sidebar_path, format='BMP')
        print(f"Generated {sidebar_path} ({w_side}x{h_side})")

        uninstaller_path = os.path.join(out_dir, 'uninstallerSidebar.bmp')
        sidebar.save(uninstaller_path, format='BMP')
        print(f"Generated {uninstaller_path} ({w_side}x{h_side})")

        header_path = os.path.join(out_dir, 'installerHeader.bmp')
        header.save(header_path, format='BMP')
        print(f"Generated {header_path} ({w_head}x{h_head})")

if __name__ == '__main__':
    create_installer_bitmaps()
