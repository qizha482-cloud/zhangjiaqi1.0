import os
import zipfile

def zip_directory(folder_path, output_path, exclude_dirs=None, exclude_files=None):
    if exclude_dirs is None:
        exclude_dirs = []
    if exclude_files is None:
        exclude_files = []
        
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            # Modify dirs in-place to prevent os.walk from visiting excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            
            for file in files:
                if file in exclude_files or file.startswith('.'):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, arcname)

if __name__ == "__main__":
    print("Starting packaging of Zhaqi's Creative Portfolio...")
    
    # 1. Package the build output (dist/ folder) for easy deployment
    if os.path.exists('dist'):
        print("Packaging build output (dist/)...")
        zip_directory('dist', 'creative-portfolio-dist.zip')
        print("✓ Created creative-portfolio-dist.zip (Ready to deploy directly to Netlify/Vercel/GitHub Pages)")
    else:
        print("Error: 'dist' folder not found. Please compile the app first.")
        
    # 2. Package the full source code (excluding node_modules and dist)
    print("Packaging full source code...")
    zip_directory(
        '.', 
        'creative-portfolio-src.zip', 
        exclude_dirs=['node_modules', 'dist', 'out'],
        exclude_files=['creative-portfolio-src.zip', 'creative-portfolio-dist.zip', 'package_project.py']
    )
    print("✓ Created creative-portfolio-src.zip (Full source code excluding dependencies)")
    print("Packaging completed successfully!")
