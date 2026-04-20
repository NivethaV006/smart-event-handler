# EventSync AI Module
### Predictive Analytics & Routing Engine

This module provides the analytical heavy lifting for the EventSync platform, using Python-based logic to predict optimal paths and wait times.

## 🧠 Key Features
- **Predictive Routing**: Calculates optimal paths by avoiding high-density "congestion" zones.
- **Queue Analysis**: Provides wait-time estimations based on incoming sensor metadata.
- **REST Interface**: Lightweight FastAPI server for seamless integration with the Node.js backend.

## 🚀 Installation & Setup
1. **Navigate to this directory**:
   ```bash
   cd ai-module
   ```
2. **Set up virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Start the AI server**:
   ```bash
   uvicorn main:app --port 8000
   ```

## 🛠 Tech Stack
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Web Server**: Uvicorn

---
**Developed for Virtual PromptWars**
