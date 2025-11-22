import swaggerJSDoc from "swagger-jsdoc";

const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mobile Repair Shop API",
      version: "1.0.0",
      description: `
        ระบบจัดการร้านซ่อมมือถือแบบครบวงจร

        ## คุณสมบัติหลัก
        - 🔐 **Authentication & Authorization** - ระบบยืนยันตัวตนด้วย JWT
        - 👥 **User Management** - จัดการผู้ใช้งานและสิทธิ์การเข้าถึง
        - 🏢 **Company Management** - จัดการข้อมูลบริษัท
        - 📦 **Product Management** - จัดการสินค้าและสต็อก
        - 💰 **Sales Management** - จัดการการขายและรายงาน
        - 🔧 **Service Management** - จัดการบริการซ่อมและติดตาม

        ## การเริ่มต้นใช้งาน
        1. สมัครสมาชิกหรือเข้าสู่ระบบผ่าน \`/auth/signup\` หรือ \`/auth/signin\`
        2. คัดลอก JWT Token จาก response
        3. คลิกปุ่ม **Authorize** 🔓 ด้านบน
        4. ใส่ Token แล้วคลิก Authorize
        5. ทดสอบ API endpoints ที่ต้องการ
      `,
      contact: {
        name: "Mobile Repair Shop Support",
        email: "support@mobilerepair.com",
        url: "https://mobilerepair.com/support"
      },
      license: {
        name: "MIT License",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development Server",
      },
      {
        url: "http://localhost:4000/api/v1",
        description: "Development Server (API v1)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "ใส่ JWT Token ที่ได้รับจากการ SignIn (/auth/signin)",
        },
      },
      schemas: {
        StandardResponse: {
          type: "object",
          properties: {
            statusCode: {
              type: "number",
              example: 200,
            },
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation Successfully",
            },
            data: {
              type: "object",
            },
            meta: {
              type: "object",
              properties: {
                requestId: {
                  type: "string",
                  format: "uuid",
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            statusCode: {
              type: "number",
              example: 400,
            },
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error Message",
            },
            meta: {
              type: "object",
              properties: {
                requestId: {
                  type: "string",
                  format: "uuid",
                },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            username: {
              type: "string",
              example: "admin",
            },
            firstName: {
              type: "string",
              example: "สมชาย",
            },
            lastName: {
              type: "string",
              example: "ใจดี",
            },
            level: {
              type: "string",
              enum: ["admin", "user"],
              example: "admin",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        Company: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "บริษัท ซ่อมมือถือ จำกัด",
            },
            address: {
              type: "string",
              example: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
            },
            phone: {
              type: "string",
              example: "02-123-4567",
            },
            taxId: {
              type: "string",
              example: "0105558888888",
            },
            email: {
              type: "string",
              format: "email",
              example: "info@mobilerepair.com",
            },
            website: {
              type: "string",
              format: "uri",
              example: "https://www.mobilerepair.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "iPhone 15 Pro Max 256GB",
            },
            barcode: {
              type: "string",
              example: "8850999320102",
            },
            cost: {
              type: "number",
              format: "float",
              example: 35000,
            },
            price: {
              type: "number",
              format: "float",
              example: 42000,
            },
            qty: {
              type: "integer",
              example: 10,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        Sell: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            serial: {
              type: "string",
              example: "SN123456789",
            },
            price: {
              type: "number",
              format: "float",
              example: 42000,
            },
            customerName: {
              type: "string",
              example: "สมชาย ใจดี",
            },
            customerPhone: {
              type: "string",
              example: "081-234-5678",
            },
            status: {
              type: "string",
              enum: ["pending", "confirmed"],
              example: "pending",
            },
            productId: {
              type: "integer",
              example: 1,
            },
            userId: {
              type: "integer",
              example: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        Service: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            customerName: {
              type: "string",
              example: "สมชาย ใจดี",
            },
            customerPhone: {
              type: "string",
              example: "081-234-5678",
            },
            deviceType: {
              type: "string",
              example: "iPhone 15 Pro Max",
            },
            problem: {
              type: "string",
              example: "หน้าจอแตก",
            },
            status: {
              type: "string",
              enum: ["รอดำเนินการ", "กำลังซ่อม", "ซ่อมเสร็จแล้ว", "ส่งมอบแล้ว"],
              example: "รอดำเนินการ",
            },
            estimatedCost: {
              type: "number",
              format: "float",
              example: 3500,
            },
            note: {
              type: "string",
              example: "รอคอนเฟิร์มกับลูกค้า",
            },
            userId: {
              type: "integer",
              example: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health Check",
        description: "API สำหรับตรวจสอบสถานะระบบ (ไม่ต้องใช้ Token)",
      },
      {
        name: "Authentication",
        description: "API สำหรับการยืนยันตัวตน (ไม่ต้องใช้ Token)",
      },
      {
        name: "Users",
        description: "API สำหรับจัดการผู้ใช้งาน (ต้องใช้ Token)",
      },
      {
        name: "Company",
        description: "API สำหรับจัดการข้อมูลบริษัท (ต้องใช้ Token)",
      },
      {
        name: "Products",
        description: "API สำหรับจัดการสินค้า (ต้องใช้ Token)",
      },
      {
        name: "Sales",
        description: "API สำหรับจัดการการขาย (ต้องใช้ Token)",
      },
      {
        name: "Services",
        description: "API สำหรับจัดการบริการซ่อม (ต้องใช้ Token)",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(option);
