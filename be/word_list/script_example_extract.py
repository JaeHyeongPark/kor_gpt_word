import pandas as pd
import json

# 원본 CSV 파일 읽기
input_file = "/Users/johnp/kor_gpt_word/be/word_list/words_rows_240705.csv"
df = pd.read_csv(input_file)

# 새로운 데이터프레임을 저장할 리스트
data = []

# 각 행에 대해 예문을 추출
for index, row in df.iterrows():
    examples = json.loads(row['examples'])
    for key in examples:
        data.append({
            'id': row['id'],
            'word': row['word'],
            'example_kor': examples[key]['kor']
        })

# 새로운 데이터프레임 생성
new_df = pd.DataFrame(data)

# 새로운 CSV 파일로 저장
output_file = "/Users/johnp/kor_gpt_word/be/word_list/extracted_examples_240706.csv"
new_df.to_csv(output_file, index=False)

print(f"추출된 예문들이 {output_file}에 저장되었습니다.")