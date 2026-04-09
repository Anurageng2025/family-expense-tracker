from PIL import Image
import os

source_path = r'C:\Users\anura\.gemini\antigravity\brain\11acb1ba-6c2a-433d-8a76-ae36810030c4\expansis_track_logo_concept_1775288706461.png'
res_dir = r'c:\Users\anura\Downloads\expansis_Track\expansis_Track\nextjs-frontend\android\app\src\main\res'

sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

def generate_icons():
    with Image.open(source_path) as img:
        # Convert to RGBA if not already
        img = img.convert("RGBA")
        
        for folder, size in sizes.items():
            folder_path = os.path.join(res_dir, folder)
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
            
            # 1. Standard ic_launcher.png
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            output_path = os.path.join(folder_path, 'ic_launcher.png')
            resized.save(output_path, "PNG")
            print(f"Generated {output_path}")

            # 2. Round ic_launcher_round.png (we'll just use the same for now, or add a circle mask)
            # Standard android icons for round just use the same image usually if it's already centered
            output_round_path = os.path.join(folder_path, 'ic_launcher_round.png')
            resized.save(output_round_path, "PNG")
            print(f"Generated {output_round_path}")

        # 3. Foreground icon for Adaptive Icons (usually needs to be slightly smaller)
        # We'll save it in drawable as a fallback since we created the XML earlier
        drawable_path = os.path.join(res_dir, 'drawable')
        if not os.path.exists(drawable_path):
            os.makedirs(drawable_path)
        
        # Adaptive foreground should be 108x108 but the actual logo should fit in safe zone
        fg_size = 108
        fg_img = Image.new("RGBA", (fg_size, fg_size), (0, 0, 0, 0))
        # Resize logo to fit safe zone (roughly 66%)
        safe_size = int(fg_size * 0.6)
        logo_resized = img.resize((safe_size, safe_size), Image.Resampling.LANCZOS)
        # Paste centered
        offset = (fg_size - safe_size) // 2
        fg_img.paste(logo_resized, (offset, offset), logo_resized)
        
        fg_output_path = os.path.join(drawable_path, 'ic_launcher_foreground.png')
        fg_img.save(fg_output_path, "PNG")
        print(f"Generated {fg_output_path}")

if __name__ == "__main__":
    generate_icons()
