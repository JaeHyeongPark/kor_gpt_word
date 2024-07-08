import pandas as pd

# CSV 파일 로드
df = pd.read_csv('generated_sql_queries.csv')

# 수정된 쿼리를 저장할 리스트
modified_queries = []

# 각 행에 대해 쿼리를 생성 및 수정
for index, row in df.iterrows():
    sql_query = row['sql_query']

    # update와 where 절 앞뒤로 붙어있는 큰따옴표 제거
    sql_query = sql_query.strip(' " ')

    # jsonb_set의 값 부분을 수정
    sql_query = sql_query.replace('\'""', '\'"')
    sql_query = sql_query.replace('""\'', '"\'')

    # 수정된 쿼리 저장
    modified_queries.append(sql_query.strip())

# 수정된 쿼리를 데이터프레임으로 변환
queries_df = pd.DataFrame(modified_queries, columns=["sql_query"])

# 데이터프레임을 CSV 파일로 저장
queries_df.to_csv('modified_sql_queries.csv', index=False)

print("CSV 파일이 성공적으로 생성되었습니다.")
