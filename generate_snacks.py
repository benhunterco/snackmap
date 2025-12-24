import os
import json
import re
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from pillow_heif import register_heif_opener
from datetime import datetime

register_heif_opener()

IMAGE_FOLDER = './public/img/snacks'
OUTPUT_FILE = './src/data/snacks.js'
DEFAULT_POS = [-90.0000, 0.0000] 

def get_decimal_from_dms(dms, ref):
    try:
        degrees = float(dms[0])
        minutes = float(dms[1])
        seconds = float(dms[2])
        decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
        if ref in ['S', 'W']:
            decimal = -decimal
        return decimal
    except Exception:
        return None

def get_metadata(img):
    """Extracts GPS and Date from Pillow Image object."""
    exif = img.getexif()
    position = DEFAULT_POS
    date_str = None
    
    if not exif:
        return position, date_str

    # 1. Get Date (Tag 306 is DateTime, but 36867 is DateTimeOriginal)
    # We look in the main EXIF and the secondary EXIF (IFD 34665)
    all_exif = {TAGS.get(tag, tag): value for tag, value in exif.items()}
    
    # Check common date tags
    raw_date = all_exif.get("DateTime")
    exif_ifd = exif.get_ifd(34665) # SubIFD
    if exif_ifd:
        raw_date = exif_ifd.get(36867, raw_date) # DateTimeOriginal

    if raw_date:
        try:
            # EXIF dates are usually 'YYYY:MM:DD HH:MM:SS'
            dt_obj = datetime.strptime(raw_date, '%Y:%m:%d %H:%M:%S')
            date_str = dt_obj.strftime('%B %d, %Y') # e.g. "December 23, 2025"
        except:
            date_str = str(raw_date)

    # 2. Get GPS (IFD 34853)
    gps_tile = exif.get_ifd(34853) 
    if gps_tile:
        gps_info = {GPSTAGS.get(tag, tag): value for tag, value in gps_tile.items()}
        if 'GPSLatitude' in gps_info and 'GPSLatitudeRef' in gps_info:
            lat = get_decimal_from_dms(gps_info['GPSLatitude'], gps_info['GPSLatitudeRef'])
            lon = get_decimal_from_dms(gps_info['GPSLongitude'], gps_info['GPSLongitudeRef'])
            if lat is not None and lon is not None:
                position = [lat, lon]
            
    return position, date_str

def load_existing_snacks():
    if not os.path.exists(OUTPUT_FILE): return {}
    with open(OUTPUT_FILE, 'r') as f:
        content = f.read()
        match = re.search(r'export const SNACKS = (\[.*\]);', content, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group(1))
                return {item['image']: item for item in data}
            except: pass
    return {}

def main():
    existing_snacks = load_existing_snacks()
    new_snacks = []
    all_files = os.listdir(IMAGE_FOLDER)
    
    # Track raw sources to prevent duplicate entries from the generated JPEGs
    raw_extensions = ('.heic', '.heif', '.png')
    basenames_with_raw = {os.path.splitext(f)[0] for f in all_files if f.lower().endswith(raw_extensions)}
    
    for filename in sorted(all_files):
        name_only, ext = os.path.splitext(filename)
        ext = ext.lower()
        
        if ext == '.jpg' and name_only in basenames_with_raw: continue
        if ext not in ('.jpg', '.jpeg', '.png', '.heic', '.heif'): continue

        jpg_filename = f"{name_only}.jpg"
        web_path = f"/img/snacks/{jpg_filename}"

        if web_path in existing_snacks:
            new_snacks.append(existing_snacks[web_path])
            continue

        file_path = os.path.join(IMAGE_FOLDER, filename)
        try:
            with Image.open(file_path) as img:
                position, date_taken = get_metadata(img)
                
                # Conversion & Save
                target_path = os.path.join(IMAGE_FOLDER, jpg_filename)
                img_converted = img.convert("RGB")
                img_converted.thumbnail((1200, 1200)) 
                img_converted.save(target_path, "JPEG", quality=85)
                
                print(f"✨ Added: {filename} (Dated: {date_taken})")

                clean_name = name_only.replace('_', ' ').replace('-', ' ').title()
                new_snacks.append({
                    "id": str(len(new_snacks) + 1),
                    "name": clean_name,
                    "date": date_taken or "Unknown Date", # Added the date field
                    "position": position,
                    "description": f"Found on {date_taken}" if date_taken else "A tasty find!",
                    "image": web_path
                })
        except Exception as e:
            print(f"❌ Failed {filename}: {e}")

    js_content = f"export const SNACKS = {json.dumps(new_snacks, indent=2)};"
    with open(OUTPUT_FILE, 'w') as f:
        f.write(js_content)
    print(f"\n✅ Sync complete. Total snacks: {len(new_snacks)}")

if __name__ == "__main__":
    main()