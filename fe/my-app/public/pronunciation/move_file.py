import os
import shutil

# Define source and destination directories
source_dir = '/Users/johnp/kor_gpt_word/be/pronunciation/mp3_list/240705'
dest_dir = '/Users/johnp/kor_gpt_word/be/pronunciation/mp3_list'

# List all files in the source directory
files = os.listdir(source_dir)

# Move each file from the source directory to the destination directory
for file_name in files:
    full_file_name = os.path.join(source_dir, file_name)
    if os.path.isfile(full_file_name):
        shutil.move(full_file_name, dest_dir)
        print(f'Moved: {full_file_name} to {dest_dir}')

# Optionally, remove the now empty source directory
os.rmdir(source_dir)
print(f'Removed directory: {source_dir}')
