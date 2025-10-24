# 🖼️ IMGPS - Image Processing API

IMGPS is a powerful Node.js + Express API for uploading, transforming, and retrieving images securely.  
It supports authenticated uploads, transformations using Sharp, and paginated retrieval for users.

---

## 🚀 Features

- 🔐 **JWT-based Authentication**
- 📤 **Image Uploads with Multer**
- 🪄 **Image Transformations using Sharp** (resize, rotate, grayscale, format change, etc.)
- 📦 **Pagination for listing user images**
- 📁 **Automatic upload directory creation**
- 🌐 **Dynamic Base URL using environment variables**

---

## 🧩 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Auth:** JWT (JSON Web Token)  
- **File Handling:** Multer  
- **Image Processing:** Sharp  
- **UUID Generation:** uuid  
- **Environment Config:** dotenv

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
git clone https://github.com/Sarim1693/Image-Processing-System.git

## Install Dependencies
npm install

## Create .env file
**PORT:**3000
**JWT_SECRET:**YOUR_JWT_SECRET_KEY
**UPLOAD_DIR:** YOUR_UPLOAD_DIR
**BASE_URL:** http://localhost:3000

## Run the Server
node server.js
git clone https://github.com/<your-username>/IMGPS.git
cd IMGPS
