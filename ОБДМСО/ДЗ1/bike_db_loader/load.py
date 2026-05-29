import csv
import pg8000
from io import StringIO

DB_HOST = '127.0.0.1'
DB_NAME = 'bike_sharing'
DB_USER = 'postgres'
DB_PASS = 'admin'

conn = pg8000.connect(
    host=DB_HOST,
    port=5432,
    user=DB_USER,
    password=DB_PASS,
    database=DB_NAME
)
cur = conn.cursor()

def get_or_create_dim(cur, table, pk_col, unique_cols, all_cols, values):
    # Формируем условие WHERE для уникальных колонок
    where_clause = " AND ".join([f"{col} = %s" for col in unique_cols])
    select_sql = f"SELECT {pk_col} FROM {table} WHERE {where_clause}"
    cur.execute(select_sql, [values[col] for col in unique_cols])
    row = cur.fetchone()
    if row:
        return row[0]
    # Если не найдено — вставляем
    cols = ", ".join(all_cols)
    placeholders = ", ".join(["%s"] * len(all_cols))
    insert_sql = f"INSERT INTO {table} ({cols}) VALUES ({placeholders}) RETURNING {pk_col}"
    cur.execute(insert_sql, [values[col] for col in all_cols])
    return cur.fetchone()[0]

with open('day.csv', 'rb') as f:
    raw = f.read()
text = raw.decode('latin1')
reader = csv.DictReader(StringIO(text))

for row in reader:
    data = {
        'instant': int(row['instant']),
        'hum': float(row['hum']),
        'casual': int(row['casual']),
        'temp': float(row['temp']),
        'dteday': row['dteday'],
        'atemp': float(row['atemp']),
        'registered': int(row['registered']),
        'cnt': int(row['cnt']),
        'windspeed': float(row['windspeed']),
        'mnth': int(row['mnth']),
        'weekday': int(row['weekday']),
        'holiday': int(row['holiday']),
        'workingday': int(row['workingday']),
        'season': int(row['season']),
        'weathersit': int(row['weathersit']),
        'yr': int(row['yr']),
    }

    # dim_windspeed_mnth_weekday → PK = K2
    K2 = get_or_create_dim(
        cur,
        'dim_windspeed_mnth_weekday',
        pk_col='K2',
        unique_cols=['windspeed', 'mnth', 'weekday'],
        all_cols=['windspeed', 'mnth', 'weekday', 'weathersit'],
        values=data
    )

    # dim_season_month_atemp → PK = K3
    K3 = get_or_create_dim(
        cur,
        'dim_season_month_atemp',
        pk_col='K3',
        unique_cols=['atemp', 'mnth'],
        all_cols=['atemp', 'mnth', 'season'],
        values=data
    )

    # dim_temp_group → PK = K4
    K4 = get_or_create_dim(
        cur,
        'dim_temp_group',
        pk_col='K4',
        unique_cols=['atemp', 'temp'],
        all_cols=['atemp', 'temp', 'yr'],
        values=data
    )

    # dim_holiday_temp_weekday → PK = K5
    K5 = get_or_create_dim(
        cur,
        'dim_holiday_temp_weekday',
        pk_col='K5',
        unique_cols=['temp', 'weekday'],
        all_cols=['temp', 'holiday', 'weekday'],
        values=data
    )

    # dim_working_day → PK = K6
    K6 = get_or_create_dim(
        cur,
        'dim_working_day',
        pk_col='K6',
        unique_cols=['weekday', 'holiday'],
        all_cols=['weekday', 'holiday', 'workingday'],
        values=data
    )

    # Факт-таблица fact_day: PK = K1, FK = K2, K3, K4, K5, K6
    cur.execute("""
        INSERT INTO fact_day (
            instant, hum, casual, temp, dteday, atemp, registered, cnt,
            K2, K3, K4, K5, K6
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data['instant'], data['hum'], data['casual'], data['temp'], data['dteday'],
        data['atemp'], data['registered'], data['cnt'],
        K2, K3, K4, K5, K6
    ))

conn.commit()
cur.close()
conn.close()
print("Загрузка завершена!")
