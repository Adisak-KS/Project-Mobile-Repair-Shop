"<div align="center">

# 📱 Mobile Repair Shop - ระบบจัดการร้านซ่อมมือถือ

### ระบบจัดการร้านซ่อมมือถือแบบครบวงจร พัฒนาด้วย Node.js, Express, Next.js และ MongoDB

[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

</div>

---

## 📸 Preview

<div align="center">

### หน้า Login
![Login Page](./previews/01_sigin.png)

### Dashboard
![Dashboard](./previews/02_dashboard.png)

</div>

---

## 🚀 Features

- 🔐 ระบบ Authentication และ Authorization (JWT)
- 📦 จัดการสินค้า (Product Management)
- 💰 จัดการการขาย (Sales Management)
- 🔧 จัดการการซ่อม (Repair Service Management)
- 👥 จัดการผู้ใช้ (User Management)
- 🏢 ตั้งค่าข้อมูลร้าน (Company Settings)
- 📊 Dashboard และ Analytics
- 📄 Export ข้อมูลเป็น Excel
- 📖 Swagger API Documentation

## 🛠️ Technology Stack

<table>
<tr>
<td width="50%">

### Backend
- 🟢 **Node.js** 20
- ⚡ **Express.js** - Web Framework
- 📘 **TypeScript** - Type Safety
- 🔷 **Prisma ORM** - Database ORM
- 🍃 **MongoDB Atlas** - Cloud Database
- 🔐 **JWT** - Authentication
- 📖 **Swagger** - API Documentation

</td>
<td width="50%">

### Frontend
- ▲ **Next.js** 15.5 - React Framework
- ⚛️ **React** 19 - UI Library
- 📘 **TypeScript** - Type Safety
- 🎨 **Tailwind CSS** v4 - Styling
- 📊 **Recharts** - Charts & Analytics
- 🔄 **Axios** - HTTP Client

</td>
</tr>
</table>

## 📋 Prerequisites

ก่อนเริ่มต้น ต้องติดตั้งสิ่งเหล่านี้ก่อน:
- Docker และ Docker Compose
- Node.js 20+ (ถ้ารันแบบ local)
- MongoDB Atlas account (สำหรับ database)

## 🐳 การรันด้วย Docker (แนะนำ)

> 💡 **วิธีนี้เหมาะสำหรับ:** การรันแอปพลิเคชันแบบง่ายและรวดเร็ว ไม่ต้องติดตั้ง dependencies

### 1. Clone โปรเจกต์

```bash
git clone <repository-url>
cd Mobile-Repair
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ที่ **root directory** ของโปรเจกต์:

```bash
# สร้างไฟล์ .env ที่ root directory
touch .env
```

แก้ไขไฟล์ `.env` ให้มีค่าดังนี้:

```env
# Backend Environment Variables
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/mobile_repair_shop?retryWrites=true&w=majority&appName=Cluster0"
SECRET_KEY="your_secret_key_here"

# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

**สำคัญ:**
- แก้ `DATABASE_URL` ให้เป็น MongoDB Atlas connection string ของคุณ
- แก้ `SECRET_KEY` เป็นค่าสุ่มที่ปลอดภัย (เช่น random string ยาวๆ)

### 3. Build และรัน Docker Containers

รันคำสั่ง:

```bash
docker-compose up --build
```

หรือรันในโหมด detached:

```bash
docker-compose up -d --build
```

### 4. เข้าใช้งานแอปพลิเคชัน

เมื่อ containers รันสำเร็จ เข้าใช้งานได้ที่:

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 **Frontend** | http://localhost:4001 | หน้าเว็บแอปพลิเคชัน |
| 🔌 **Backend API** | http://localhost:4000 | REST API Server |
| 📖 **Swagger Docs** | http://localhost:4000/api-docs | API Documentation |

### คำสั่ง Docker ที่มีประโยชน์

```bash
# ดู logs
docker-compose logs -f

# ดู logs เฉพาะ backend
docker-compose logs -f backend

# ดู logs เฉพาะ frontend
docker-compose logs -f frontend

# หยุด containers
docker-compose down

# หยุดและลบ volumes
docker-compose down -v

# Rebuild containers
docker-compose up --build

# รัน container เฉพาะ service
docker-compose up backend
```

## 💻 การรันแบบ Local (ไม่ใช้ Docker)

> 💡 **วิธีนี้เหมาะสำหรับ:** Development และการแก้ไขโค้ด

### Backend Setup

```bash
cd backend
npm install                # ติดตั้ง dependencies
npx prisma generate        # Generate Prisma Client
npm run dev                # รัน development server
```

✅ Backend จะรันที่: **http://localhost:4000**

### Frontend Setup

```bash
cd frontend
npm install                # ติดตั้ง dependencies
npm run dev                # รัน development server
```

✅ Frontend จะรันที่: **http://localhost:4001**

## 📁 โครงสร้างโปรเจกต์

```
Mobile-Repair/
├── backend/                 # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Entry point
│   ├── prisma/             # Prisma schema และ migrations
│   ├── uploads/            # Uploaded files
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # Frontend (Next.js + React)
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   └── lib/           # Utility functions
│   ├── Dockerfile
│   └── package.json
│
├── .env                    # Environment variables (สำคัญ! ห้าม commit)
├── .gitignore              # Git ignore rules
├── docker-compose.yml      # Docker compose configuration
└── README.md
```

## 🔑 การสร้าง User แรก

หลังจากรันแอปพลิเคชันครั้งแรก คุณสามารถสมัครสมาชิกได้ 2 วิธี:

### วิธีที่ 1: ผ่านหน้าเว็บ (แนะนำ)
1. เปิดเบราว์เซอร์ไปที่ http://localhost:4001
2. คลิกที่ปุ่ม "สมัครสมาชิก" หรือไปที่ `/signup`
3. กรอกข้อมูลและสร้างบัญชี

### วิธีที่ 2: ผ่าน API
```bash
POST http://localhost:4000/api/v1/auth/signup
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "username": "admin",
  "password": "password123",
  "level": "admin"
}
```

> **หมายเหตุ:** `level` สามารถเป็น `"admin"` หรือ `"user"` ตามสิทธิ์ที่ต้องการ

## 📚 API Documentation

เอกสาร API ครบถ้วนพร้อม Interactive Testing:

- 📖 **Swagger UI**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

Swagger UI ช่วยให้คุณ:
- ✅ ดูรายละเอียด API endpoints ทั้งหมด
- ✅ ทดสอบ API ได้ทันทีผ่านเว็บ
- ✅ ดู Request/Response schemas
- ✅ ดูตัวอย่างการใช้งาน

## 🔧 Troubleshooting

<details>
<summary><b>❌ Container ไม่สามารถเชื่อมต่อ MongoDB</b></summary>

**วิธีแก้:**
- ✅ ตรวจสอบว่า `DATABASE_URL` ใน `.env` ถูกต้อง
- ✅ ตรวจสอบว่า MongoDB Atlas อนุญาต IP address ของคุณ (Network Access)
- ✅ ลอง whitelist IP `0.0.0.0/0` สำหรับการทดสอบ

</details>

<details>
<summary><b>❌ Frontend ไม่สามารถเรียก Backend API</b></summary>

**วิธีแก้:**
- ✅ ตรวจสอบว่า `NEXT_PUBLIC_API_URL` ถูกต้อง (ควรเป็น `http://localhost:4000/api/v1`)
- ✅ ตรวจสอบว่า backend container กำลังรันอยู่: `docker-compose ps`
- ✅ ดู logs ของ backend: `docker-compose logs backend`

</details>

<details>
<summary><b>❌ Port Conflicts (พอร์ตชนกัน)</b></summary>

ถ้า port 4000 หรือ 4001 ถูกใช้งานอยู่แล้ว แก้ไขใน [docker-compose.yml](docker-compose.yml):

```yaml
services:
  backend:
    ports:
      - "5000:4000"  # เปลี่ยน host port เป็น 5000
  frontend:
    ports:
      - "5001:4001"  # เปลี่ยน host port เป็น 5001
```

**อย่าลืม:** ถ้าเปลี่ยน port ต้องแก้ `NEXT_PUBLIC_API_URL` ด้วย

</details>

<details>
<summary><b>❌ Docker Container ไม่ Update หลังแก้โค้ด</b></summary>

**วิธีแก้:**
```bash
docker-compose down
docker-compose up --build
```

</details>

## 🤝 Contributing

Pull requests are welcome! สำหรับการเปลี่ยนแปลงที่สำคัญ กรุณาเปิด issue เพื่อพูดคุยถึงสิ่งที่คุณต้องการเปลี่ยนแปลงก่อน

## 📝 License

This project is licensed under the MIT License.

---

<div align="center">

### Made with ❤️ using Next.js and Express.js

**Mobile Repair Shop Management System**

⭐ ถ้าชอบโปรเจกต์นี้ อย่าลืมกด Star นะครับ!

</div>" 
