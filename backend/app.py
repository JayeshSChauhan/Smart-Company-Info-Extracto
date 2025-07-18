# import os
# import pandas as pd
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)
# CSV_PATH = 'company_data.csv'

# @app.route('/api/enrich', methods=['POST'])
# def enrich_company():
#     data = request.get_json()
#     print('[Server] Received:', data)

#     # Load existing or create new DataFrame
#     if os.path.exists(CSV_PATH):
#         df = pd.read_csv(CSV_PATH)
#         existing_cols = list(df.columns)
#     else:
#         df = pd.DataFrame()
#         existing_cols = []

#     # Union columns preserving order
#     new_cols = list(data.keys())
#     full_cols = list(dict.fromkeys(existing_cols + new_cols))

#     # Build new row with all columns, default pd.NA
#     new_row = {col: data.get(col, pd.NA) for col in full_cols}
#     new_df = pd.DataFrame([new_row], columns=full_cols)

#     # Append, fill missing, and save
#     df = pd.concat([df, new_df], ignore_index=True)
#     df = df.reindex(columns=full_cols).fillna('NULL')
#     df.to_csv(CSV_PATH, index=False)

#     return jsonify({'status': 'ok', 'received': data, 'columns': full_cols})

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)


import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CSV_PATH = 'company_data.csv'

# OPTIONAL fallback function import
try:
    from playwright_fetcher import fetch_full_company_data
    PLAYWRIGHT_ENABLED = True
except ImportError:
    PLAYWRIGHT_ENABLED = False
    print("[Warning] playwright_fetcher not found. Fallback disabled.")

@app.route('/api/enrich', methods=['POST'])
def enrich_company():
    data = request.get_json()
    print('[Server] Received:', data)

    # 🧠 Try Playwright fallback if any key fields are missing
    if PLAYWRIGHT_ENABLED and (
        not data.get("location") or not data.get("website")
    ):
        try:
            print("[Info] Using Playwright fallback to enrich data...")
            enriched_data = fetch_full_company_data(data.get("profile_url", ""))
            for key, value in enriched_data.items():
                if not data.get(key):  # Don't overwrite existing
                    data[key] = value
        except Exception as e:
            print("[Error] Playwright fallback failed:", e)

    # 📦 Load existing or create new DataFrame
    if os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
        existing_cols = list(df.columns)
    else:
        df = pd.DataFrame()
        existing_cols = []

    # 🔗 Union columns preserving order
    new_cols = list(data.keys())
    full_cols = list(dict.fromkeys(existing_cols + new_cols))

    # 🆕 Build new row with all columns
    new_row = {col: data.get(col, pd.NA) for col in full_cols}
    new_df = pd.DataFrame([new_row], columns=full_cols)

    # 📝 Append and save
    df = pd.concat([df, new_df], ignore_index=True)
    df = df.reindex(columns=full_cols).fillna('NULL')
    df.to_csv(CSV_PATH, index=False)

    return jsonify({'status': 'ok', 'received': data, 'columns': full_cols})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
