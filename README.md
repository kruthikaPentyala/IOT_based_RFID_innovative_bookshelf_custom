# 📘 Smart Library Book Tracking System (WPT + IoT Integration)

### 🔹 Overview  
This project is an **IoT-based Smart Library System** that uses **Wireless Power Transfer (WPT)** and **real-time data management** to automatically detect and monitor books on a smart bookshelf.  
The system brings together hardware, backend, and frontend components to create a seamless and efficient **automated book tracking solution**.

The project revolves around three main pillars:
1. **Smart Bookshelf (Reader Unit)**  
2. **Book Tag Circuit (Transmitter Unit)**  
3. **ESP32 Communication Module**

---

### ⚙️ Working Principle  

The project integrates **Wireless Power Transfer (WPT)**, **Pulse Width Modulation (PWM)**, and **IoT-based real-time communication** to identify and track books dynamically.

Each **book** is embedded with a **tag circuit**, designed using a **555 timer** in astable mode along with a **variable resistor**.  
When the resistance changes, the **duty cycle** of the PWM signal varies — this duty cycle serves as the book’s **unique identifier**.

The **smart bookshelf** contains a **receiver coil** that transfers energy wirelessly to the tag circuit through **inductive coupling**.  
When the book is placed on the shelf, the tag circuit becomes active and produces its corresponding PWM signal.  
This PWM signal is detected and read by the **ESP32 module**, which acts as the communication bridge.

The ESP32 sends the detected data — including the **duty cycle** and **presence status** — to a **Flask backend server** using the **HTTP protocol**.  
The Flask server compares the duty cycle value with the predefined duty cycle ranges stored in the **Firebase Realtime Database** to identify which book it corresponds to.

Once identified, the backend logs the information to Firebase along with:
- Book Name  
- Shelf Position  
- Status (Placed or Removed)  
- Duty Cycle  
- Timestamp  

The **React web interface** retrieves this data in real-time from Firebase and visually displays the current state of each book.  
If a book is placed, it shows “✅ Placed in Shelf A”, and if it is removed, it updates to “❌ Removed”.  
Additionally, the web interface includes a **manual mapping feature** where users can assign book names to specific duty cycle ranges, making the system flexible and scalable.

---

### 🧩 System Architecture  

1. **Hardware Layer (Arduino + ESP32)**  
   - The tag circuit on each book generates a unique duty cycle.  
   - WPT provides wireless power to activate the tag.  
   - ESP32 reads the signal and sends it to the Flask backend.

2. **Backend (Flask Server)**  
   - Receives data from ESP32 in JSON format.  
   - Identifies books based on duty cycle mapping.  
   - Updates Firebase Realtime Database with timestamp and status.

3. **Database (Firebase Realtime Database)**  
   - Stores mapping of duty cycle ranges to book names.  
   - Stores live book status updates with time and position.

4. **Frontend (React Web Dashboard)**  
   - Displays live updates of all books (name, position, status, timestamp).  
   - Includes mapping page for manual addition or modification of books.  
   - Auto-syncs with Firebase for real-time reflection.

---

### 🚀 Features  
- Real-time book identification and tracking  
- Wireless powering of tag circuits via WPT  
- Cloud-based Firebase synchronization  
- React-based dynamic dashboard  
- Manual mapping and configuration feature  
- Instant updates when books are placed or removed  

---

### 🧠 Technologies Used  
| Component | Technology |
|------------|-------------|
| Backend | Flask (Python) |
| Database | Firebase Realtime Database |
| Frontend | React.js |
| IoT Communication | ESP32 + HTTP |
| Power Transfer | Inductive Coupling (WPT) |
| Tag Circuit | 555 Timer (Astable Multivibrator) |

---

### ⚙️ How to Run the Project Locally  

#### 🧩 Prerequisites  
- Python 3.10+  
- Node.js and npm  
- Firebase account (with Realtime Database enabled)

---

#### 🐍 **1. Run the Flask Backend**
```bash
cd backend
pip install flask firebase-admin
python app.py
```
Server runs at → **http://127.0.0.1:5000**

---

#### 🌐 **2. Run the Web Interface**
```bash
cd web-interface
npm install
npm start
```
Dashboard runs at → **http://localhost:3000**

---

#### 🔄 **3. Test the Data Flow**
Use simulator to send mock JSON data to Flask:
```bash
python simulator.py
```

---

### 📄 Database Structure  
```
Firebase Realtime Database
├── book_mapping
│    ├── Book A
│    │     ├── min_duty: 70
│    │     └── max_duty: 80
│    └── Book B
│          ├── min_duty: 81
│          └── max_duty: 90
│
└── book_status
     ├── -Nh123abc
     │     ├── book_name: "Book A"
     │     ├── position: "A"
     │     ├── status: "placed"
     │     ├── duty_cycle: 75.4
     │     └── timestamp: "2025-10-31T12:45:23"
```

---

### 👩‍💻 Contribution  
Worked on **software and database management**, including:
- Firebase structure design  
- Flask backend for data processing  
- React frontend for real-time dashboard  
- Integration between IoT, backend, and database

---

### 🏁 Conclusion  
This project integrates **WPT**, **IoT**, and **Cloud Computing** to create a **smart automated library system**, enabling end-to-end connectivity from hardware to real-time web visualization.
