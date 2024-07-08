import pandas as pd

df = pd.read_csv('example_with_pronunciation.csv')
example_data = []

for index, row in df.iterrows():
    word_id=row['id']
    example_kor = row['example_kor']
    example_pronunciation = row['example_pronunciation']
    example_num = df[df['id'] == word_id].index.get_loc(index) + 1  # example 번호 계산
    example_data.append((word_id, example_kor, example_pronunciation, example_num))

sql_queries = []

for data in example_data:
    word_id, example_kor, example_pronunciation, example_num = data
    example_field = f'example_{example_num}'
    sql_query = f"""
    UPDATE words
    SET examples = jsonb_set(
        examples::jsonb,
        '{{{example_field},pronounce}}',
        '"{example_pronunciation}"'::jsonb
    )
    WHERE id = {word_id};
    """
    sql_queries.append(sql_query.strip())

queries_df = pd.DataFrame(sql_queries, columns=["sql_query"])

# 데이터프레임을 CSV 파일로 저장
queries_df.to_csv('generated_sql_queries.csv', index=False)