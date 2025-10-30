from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime
import uuid

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate("rfid-bookshelf-tracking-firebase-adminsdk-fbsvc-7565320b37.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://rfid-bookshelf-tracking-default-rtdb.firebaseio.com/"
})

@app.route('/log', methods=['POST'])
def log_transaction():
    data = request.get_json()
    tag_id = data.get('tag_id')
    position = data.get('position')

    if not tag_id or not position:
        return jsonify({"error": "Missing tag_id or position"}), 400

    txn_id = f"TXN_{uuid.uuid4().hex[:8]}"
    timestamp = datetime.utcnow().isoformat()

    # Push to Firebase
    db.reference('transactions').push({
        "txn_id": txn_id,
        "tag_id": tag_id,
        "to_position": position,
        "timestamp": timestamp
    })

    # Update current position
    db.reference('current_positions').child(tag_id).set({
        "position": position,
        "timestamp": timestamp
    })

    return jsonify({"message": "Transaction logged successfully"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
