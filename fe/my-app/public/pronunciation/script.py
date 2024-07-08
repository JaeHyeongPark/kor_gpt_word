import pandas as pd
from gtts import gTTS
import os
import ast

# Load the CSV file
file_path = '/Users/johnp/kor_gpt_word/be/word_list/words_rows_240705.csv'
words_df = pd.read_csv(file_path)

# Create output directory with a specific name
output_dir = '/Users/johnp/kor_gpt_word/be/pronunciation/mp3_list/240705'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def text_to_mp3(text, lang='ko', filename='output.mp3'):
    tts = gTTS(text=text, lang=lang)
    tts.save(filename)
    print(f'Audio content written to file {filename}')

# Start from a specific index (14th row, which is index 13)
start_index = 24

# Process each row in the DataFrame starting from the specified index
# for index, row in words_df.iterrows():
for index, row in words_df.iloc[start_index:].iterrows():
    word = row['word']
    
    # Replace '/' with ',' in the word
    if '/' in word:
        word = word.replace('/', ',')

    try:
        # Attempt to parse the examples column using ast.literal_eval
        examples = ast.literal_eval(row['examples'])  # Parse the JSON string in the 'examples' column
        example_1 = examples['example_1']['kor']
        example_2 = examples['example_2']['kor']
        
        # Generate filenames
        word_filename = os.path.join(output_dir, f"{word}_word.mp3")
        example_1_filename = os.path.join(output_dir, f"{word}_example_1.mp3")
        example_2_filename = os.path.join(output_dir, f"{word}_example_2.mp3")
        
        # Convert text to mp3
        text_to_mp3(word, lang='ko', filename=word_filename)
        text_to_mp3(example_1, lang='ko', filename=example_1_filename)
        text_to_mp3(example_2, lang='ko', filename=example_2_filename)

    except (ValueError, SyntaxError) as e:
        print(f"Error parsing JSON for row {index}: {e}")
        continue
