from flask import Flask, request, jsonify
from firebase_admin import credentials, db, initialize_app
from datetime import datetime

app = Flask(__name__)

cred = credentials.Certificate("rfid-bookshelf-tracking-firebase-adminsdk-fbsvc-7565320b37.json")
initialize_app(cred, {'databaseURL': 'https://rfid-bookshelf-tracking-default-rtdb.firebaseio.com/'})

@app.route('/log', methods=['POST'])
def log_data():
    data = request.get_json()

    position = data.get("position")
    status = data.get("status")
    duty_cycle = data.get("duty_cycle")

    # Validate
    if position is None or status is None or duty_cycle is None:
        return jsonify({"error": "Missing fields"}), 400

    # Fetch book mapping
    mapping_ref = db.reference("book_mapping")
    mappings = mapping_ref.get() or {}

    matched_book = "Unknown Book"

    # Compare duty cycle range to find matching book
    for book_name, values in mappings.items():
        min_duty = float(values.get("min_duty", 0))
        max_duty = float(values.get("max_duty", 0))

        if min_duty <= duty_cycle <= max_duty:
            matched_book = book_name
            break

    # Save record in Firebase
    db.reference("book_status").push({
        "book_name": matched_book,
        "position": position,
        "status": status,
        "duty_cycle": duty_cycle,
        "timestamp": datetime.now().isoformat()
    })

    return jsonify({"status": "success", "book_name": matched_book})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
