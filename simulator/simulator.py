import requests
import random
import time

URL = "http://127.0.0.1:5000/log"  # Change if Flask runs elsewhere

while True:
    # Simulate test data
    position = random.choice(["A", "B"])
    status = random.choice(["placed", "removed"])
    duty_cycle = round(random.uniform(65, 85), 2)

    payload = {
        "position": position,
        "status": status,
        "duty_cycle": duty_cycle
    }

    print("Sending:", payload)
    try:
        res = requests.post(URL, json=payload)
        print("Response:", res.text)
    except Exception as e:
        print("Error:", e)

    time.sleep(5)
