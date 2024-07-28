import os

# Define the paths to the original and new blob folders
original_blob_folder = 'public/blobs/blob1'
new_blob_folders = ['public/blobs/blob2', 'public/blobs/blob3', 'public/blobs/blob4', 'public/blobs/blob5', 'public/blobs/blob6', 'public/blobs/blob7', 'public/blobs/blob8', 'public/blobs/blob9', 'public/blobs/blob10']

# Define the colors for the new blobs
colors = {
    'blob2': '#FF0000',  # Red
    'blob3': '#00FF00',   # Green
    'blob4': '#0000FF',   # Blue
    'blob5': '#FFFF00',   # Yellow
    'blob6': '#FF00FF',   # Magenta
    'blob7': '#00FFFF',   # Cyan
    'blob8': '#800080',   # Purple
    'blob9': '#FFA500',   # Orange
    'blob10': '#008000'   # Dark Green
}

# Ensure the new blob folders exist
for folder in new_blob_folders:
    os.makedirs(folder, exist_ok=True)

# Process each SVG file in the original blob folder
for i in range(1, 7):
    original_svg_path = os.path.join(original_blob_folder, f'{i}.svg')
    
    # Read the original SVG content
    with open(original_svg_path, 'r') as file:
        svg_content = file.read()
    
    # Create new SVG files with the specified colors
    for blob, color in colors.items():
        new_svg_content = svg_content.replace('#00CED1', color)
        new_svg_path = os.path.join(f'public/blobs/{blob}', f'{i}.svg')
        with open(new_svg_path, 'w') as new_file:
            new_file.write(new_svg_content)

print("SVG files created successfully in blob2 and blob3.")