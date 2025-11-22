"# Mobile Repair Shop - ระบบจัดการร้านซ่อมมือถือ

ระบบจัดการร้านซ่อมมือถือแบบครบวงจร พัฒนาด้วย Node.js, Express, Next.js และ MongoDB

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

### Backend
- Node.js 20
- Express.js
- TypeScript
- Prisma ORM
- MongoDB (Atlas)
- JWT Authentication
- Swagger (API Documentation)

### Frontend
- Next.js 15.5
- React 19
- TypeScript
- Tailwind CSS v4
- Recharts (Charts & Analytics)
- Axios

## 📋 Prerequisites

ก่อนเริ่มต้น ต้องติดตั้งสิ่งเหล่านี้ก่อน:
- Docker และ Docker Compose
- Node.js 20+ (ถ้ารันแบบ local)
- MongoDB Atlas account (สำหรับ database)

## 🐳 การรันด้วย Docker (แนะนำ)

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

- **Frontend**: http://localhost:4001
- **Backend API**: http://localhost:4000
- **API Documentation (Swagger)**: http://localhost:4000/api-docs

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

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

Backend จะรันที่: http://localhost:4000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend จะรันที่: http://localhost:4001

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

## 🔑 Default User Credentials

หลังจากรันครั้งแรก ให้สมัครสมาชิกผ่านหน้า `/signup` หรือใช้ API endpoint:

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

## 📚 API Documentation

ดู API Documentation ได้ที่:
- **Swagger UI**: http://localhost:4000/api-docs

## 🔧 การแก้ไขปัญหา

### ปัญหา: Container ไม่สามารถเชื่อมต่อ MongoDB

- ตรวจสอบว่า `DATABASE_URL` ใน `.env` ถูกต้อง
- ตรวจสอบว่า MongoDB Atlas อนุญาต IP address ของคุณ

### ปัญหา: Frontend ไม่สามารถเรียก Backend API

- ตรวจสอบว่า `NEXT_PUBLIC_API_URL` ถูกต้องใน `frontend/.env`
- ตรวจสอบว่า backend container กำลังรันอยู่: `docker-compose ps`

### ปัญหา: Port conflicts

ถ้า port 4000 หรือ 4001 ถูกใช้งานอยู่แล้ว แก้ไขใน `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "5000:4000"  # เปลี่ยน host port เป็น 5000
  frontend:
    ports:
      - "5001:4001"  # เปลี่ยน host port เป็น 5001
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Mobile Repair Shop Management System

---

Made with ❤️ using Next.js and Express.js" 
