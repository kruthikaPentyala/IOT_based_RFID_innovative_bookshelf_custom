import requests
import random
import time
import json

API_ENDPOINT = "http://127.0.0.1:5000/log"  # Flask server

tags = ["TAG001", "TAG002", "TAG003", "TAG004", "TAG005"]
shelves = ["SHELF_A1", "SHELF_A2", "SHELF_B1", "SHELF_B2", "SHELF_C1"]

while True:
    tag = random.choice(tags)
    shelf = random.choice(shelves)
    payload = {"tag_id": tag, "position": shelf}

    try:
        response = requests.post(API_ENDPOINT, json=payload)
        if response.status_code == 200:
            print(f"Logged {tag} at {shelf}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print("Request failed:", e)

    time.sleep(3)
