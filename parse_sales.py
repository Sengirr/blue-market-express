import re
import sys

months = {
    'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
    'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
    'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
}

try:
    with open('historical_sales_2014.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
except FileNotFoundError:
    print("File not found")
    sys.exit(1)

values = []
# Pattern: martes, enero 22, 2013 166,65
# Also handles sábado, marzo 02, 2013 1392,89
pattern = re.compile(r'(\w+),\s+(\w+)\s+(\d+),\s+(\d+)\s+([\d,.]+)')

for line in lines:
    line = line.strip()
    if not line: continue
    
    match = pattern.search(line)
    if match:
        dow, month_name, day, year, amount_str = match.groups()
        month = months.get(month_name.lower())
        if not month:
            continue
        
        # Format date as YYYY-MM-DD
        formatted_date = f"{year}-{month}-{day.zfill(2)}"
        
        # Format amount (replace comma with dot for SQL)
        formatted_amount = amount_str.replace(',', '.')
        
        values.append(f"('{formatted_date}', {formatted_amount}, 'Caja Histórica 2014')")

if values:
    with open('daily_sales_import_2014.sql', 'w', encoding='utf-8') as out:
        batch_size = 50
        for i in range(0, len(values), batch_size):
            batch = values[i:i+batch_size]
            sql = f"INSERT INTO public.daily_sales (date, amount, notes) VALUES\n" + ",\n".join(batch) + ";"
            out.write(f"-- BATCH {i//batch_size + 1}\n")
            out.write(sql + "\n\n")
    print("SQL written to daily_sales_import_2014.sql")
else:
    print("No data parsed")
