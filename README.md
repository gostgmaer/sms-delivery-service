# 📱 SMS Delivery Service

Production-grade SMS delivery microservice with **33 provider integrations** and **103 ready-to-use templates**. Built for any website, any business model.

**📬 Quick Links:**
- [Postman Collection](./postman-collection.json) - 20+ ready-to-use API requests
- [Sample Templates](./sample-templates.json) - 103 production-ready SMS templates

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 2. Configure Environment
```bash
cp .env.sample .env
# Edit .env with your settings
```

### 3. Start Service
```bash
# Development
npm run dev

# Production
npm start

# Docker
docker-compose up
```

**✨ 103 SMS templates are automatically imported on first startup!**

To disable auto-import, set `AUTO_IMPORT_TEMPLATES=false` in your `.env` file.

To manually import templates: `node import-templates.js`

### 4. Test with Postman (Optional)
Import [postman-collection.json](./postman-collection.json) into Postman for instant API testing with 20+ ready-to-use requests!

---

## ✨ Features

### 📡 **33 SMS Providers**
- **Tier 1 - Free (No CC)**: mock, fast2sms, 2factor, smsgateway
- **Tier 2 - Free Credits**: infobip, telnyx, vonage, msg91, d7networks, mtalkz, brevo, messagebird
- **Tier 3 - Enterprise**: twilio, kaleyra, airteliq, jiocx, exotel, routemobile, valuefirst, smscountry

### 📋 **103 SMS Templates**
Complete coverage for:
- 🔐 Security & Authentication (7)
- 🛒 E-commerce (11)
- 🚗 Service Marketplace (13)
- 💳 Payments (6)
- 👤 Account Management (10)
- 📅 Appointments & Events (5)
- 🎁 Promotions & Loyalty (13)
- 🚕 Transportation (3)
- 🎓 Education (7)
- 🏆 Auctions (3)
- All templates available in [sample-templates.json](./sample-templates.json)

### 🎯 **Core Capabilities**
- ✅ Multi-provider support with fallback
- ✅ Automatic retry with exponential backoff
- ✅ Multi-tenant architecture
- ✅ OTP generation & verification
- ✅ Template engine with variables
- ✅ DLT compliance (India)
- ✅ Bulk SMS sending
- ✅ Webhook delivery receipts
- ✅ Rate limiting (global + per-tenant)
- ✅ Analytics & reporting
- ✅ Phone number normalization
- ✅ Unicode support
- ✅ GDPR compliance

---

## 📚 API Documentation

### 🔐 Authentication
All endpoints require `Authorization: Bearer <API_KEY>` header (except health & webhooks).

Multi-tenant: Add `X-Tenant-Id` header.

### 🌐 Base URL
```
http://localhost:3000/api/v1
```

---

## 📬 Postman Collection Examples

### 1️⃣ Health Check

**Request:**
```http
GET /api/v1/health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "uptime": 3425.123,
  "timestamp": "2026-04-08T10:30:00.000Z",
  "version": "1.0.0",
  "provider": "fast2sms",
  "db": {
    "status": "connected"
  },
  "requestId": "req_abc123",
  "statusCode": 200
}
```

---

### 2️⃣ Send Simple SMS

**Request:**
```http
POST /api/v1/sms/send
Content-Type: application/json
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Request Body:**
```json
{
  "to": "+919876543210",
  "message": "Your order #ORD123 has been confirmed! Expected delivery: Dec 25, 2024",
  "messageType": "TRANSACTIONAL",
  "from": "MYAPP"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_7f8d9e6a5b4c3d2e",
    "to": "+919876543210",
    "from": "MYAPP",
    "message": "Your order #ORD123 has been confirmed! Expected delivery: Dec 25, 2024",
    "status": "SENT",
    "provider": "fast2sms",
    "providerMessageId": "prov_123456789",
    "segmentCount": 1,
    "unicode": false,
    "messageType": "TRANSACTIONAL",
    "tenantId": "default",
    "createdAt": "2026-04-08T10:30:00.000Z"
  },
  "timestamp": "2026-04-08T10:30:00.000Z",
  "requestId": "req_def456",
  "statusCode": 200,
  "status": "success"
}
```

---

### 3️⃣ Send SMS with Template (by Name)

**Request:**
```http
POST /api/v1/sms/send
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Request Body (using template name - most convenient):**
```json
{
  "to": "+919876543210",
  "templateName": "Order Confirmation",
  "variables": {
    "orderId": "ORD123",
    "deliveryDate": "Dec 25, 2024",
    "trackingUrl": "https://track.example.com/ORD123"
  }
}
```

**OR using template code (recommended for production):**
```json
{
  "to": "+919876543210",
  "templateCode": "ORDER_CONFIRMATION",
  "variables": {
    "orderId": "ORD123",
    "deliveryDate": "Dec 25, 2024"
  }
}
```

**OR using template ID (backward compatible):**
```json
{
  "to": "+919876543210",
  "templateId": "661234567890abcdef123456",
  "variables": {
    "orderId": "ORD123",
    "deliveryDate": "Dec 25, 2024"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_a1b2c3d4e5f6g7h8",
    "to": "+919876543210",
    "message": "Order ORD123 confirmed! Your order will be delivered by Dec 25, 2024. Track: https://track.example.com/ORD123",
    "status": "SENT",
    "provider": "fast2sms",
    "providerMessageId": "prov_987654321",
    "segmentCount": 2,
    "templateId": "661234567890abcdef123456",
    "tenantId": "default",
    "createdAt": "2026-04-08T10:35:00.000Z"
  },
  "timestamp": "2026-04-08T10:35:00.000Z",
  "requestId": "req_ghi789",
  "statusCode": 200,
  "status": "success"
}
```

**💡 Template Reference Options:**
1. **`templateName`** - Most convenient, use exact template name
2. **`templateCode`** - Recommended for production (env-independent)
3. **`templateId`** - Backward compatible (MongoDB ID, changes per environment)

---

### 4️⃣ Send OTP

**Request:**
```http
POST /api/v1/sms/send-otp
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Request Body:**
```json
{
  "to": "+919876543210",
  "channel": "SMS",
  "otpLength": 6,
  "expiryMinutes": 10
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_otp_xyz123",
    "to": "+919876543210",
    "message": "Your OTP is 847659. Valid for 10 minutes. Do not share this code with anyone.",
    "status": "SENT",
    "provider": "fast2sms",
    "otpHash": "$2b$10$abcdef1234567890",
    "expiresAt": "2026-04-08T10:45:00.000Z",
    "attemptsRemaining": 3
  },
  "timestamp": "2026-04-08T10:35:00.000Z",
  "requestId": "req_jkl012",
  "statusCode": 200,
  "status": "success"
}
```

---

### 5️⃣ Verify OTP

**Request:**
```http
POST /api/v1/sms/verify-otp
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Request Body:**
```json
{
  "to": "+919876543210",
  "otp": "847659"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "message": "OTP verified successfully"
  },
  "timestamp": "2026-04-08T10:36:00.000Z",
  "requestId": "req_mno345",
  "statusCode": 200,
  "status": "success"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired OTP",
    "code": "INVALID_OTP",
    "attemptsRemaining": 2
  },
  "timestamp": "2026-04-08T10:36:00.000Z",
  "requestId": "req_mno346",
  "statusCode": 400,
  "status": "error"
}
```

---

### 6️⃣ Send Bulk SMS

Send SMS to multiple recipients at once, either with individual messages or using templates.

**Endpoint:**
```http
POST /api/v1/sms/send-bulk
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Option 1: Bulk SMS with Template Code (Recommended)**
```json
{
  "recipients": [
    {
      "to": "+919876543210",
      "variables": { "orderId": "ORD001", "deliveryDate": "Dec 25, 2024" }
    },
    {
      "to": "+919876543211",
      "variables": { "orderId": "ORD002", "deliveryDate": "Dec 26, 2024" }
    },
    {
      "to": "+919876543212",
      "variables": { "orderId": "ORD003", "deliveryDate": "Dec 27, 2024" }
    }
  ],
  "templateCode": "ORDER_CONFIRMATION",
  "messageType": "TRANSACTIONAL",
  "batchSize": 50
}
```

**Option 2: Bulk SMS with Template Name (Convenient)**
```json
{
  "recipients": [
    {
      "to": "+919876543210",
      "variables": { "customerName": "John", "provider": "ABC Services" }
    },
    {
      "to": "+919876543211",
      "variables": { "customerName": "Mary", "provider": "XYZ Services" }
    }
  ],
  "templateName": "Service Provider Matched",
  "messageType": "TRANSACTIONAL"
}
```

**Option 3: Bulk SMS with Individual Messages**
```json
{
  "recipients": [
    {
      "to": "+919876543210",
      "message": "Hi John! Your order ORD001 is ready for pickup."
    },
    {
      "to": "+919876543211",
      "message": "Hi Mary! Your order ORD002 has been shipped."
    },
    {
      "to": "+919876543212",
      "message": "Hi Bob! Your order ORD003 is out for delivery."
    }
  ],
  "messageType": "TRANSACTIONAL",
  "campaignName": "Order Status Updates"
}
```

**Option 4: Bulk SMS with Shared Message (Promotional)**
```json
{
  "recipients": [
    { "to": "+919876543210" },
    { "to": "+919876543211" },
    { "to": "+919876543212" }
  ],
  "message": "Flash Sale! Get 50% off on all products. Visit: https://example.com/sale",
  "messageType": "PROMOTIONAL",
  "campaignName": "Flash Sale Campaign"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "campaignId": "camp_abc123def456",
    "totalCount": 3,
    "status": "RUNNING"
  }
}
```

**Notes:**
- Bulk SMS processing is **asynchronous** - you get a `campaignId` immediately
- Use `GET /api/v1/analytics/campaigns/{campaignId}` to check progress
- Template code/name works the same as single SMS
- `batchSize` controls how many SMS are sent in parallel (default: 50, max: 500)
- All recipients must have valid phone numbers
- For templates: variables are merged per recipient
      },
      {
        "to": "+919876543212",
        "messageId": "msg_bulk_003",
        "status": "SENT",
        "success": true
      }
    ]
  },
  "timestamp": "2026-04-08T10:40:00.000Z",
  "requestId": "req_pqr678",
  "statusCode": 200,
  "status": "success"
}
```

---

### 7️⃣ Create Template

**Request:**
```http
POST /api/v1/templates
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Request Body:**
```json
{
  "name": "Order Confirmation Custom",
  "body": "Hi {{customerName}}! Your order {{orderId}} worth {{amount}} has been confirmed. Delivery by {{deliveryDate}}.",
  "category": "TRANSACTIONAL",
  "variables": ["customerName", "orderId", "amount", "deliveryDate"],
  "isActive": true,
  "dltTemplateId": "1234567890123456",
  "dltEntityId": "1234567890",
  "metadata": {
    "useCase": "E-commerce order confirmation",
    "department": "Sales"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "661234567890abcdef789012",
    "name": "Order Confirmation Custom",
    "body": "Hi {{customerName}}! Your order {{orderId}} worth {{amount}} has been confirmed. Delivery by {{deliveryDate}}.",
    "category": "TRANSACTIONAL",
    "variables": ["customerName", "orderId", "amount", "deliveryDate"],
    "isActive": true,
    "dltTemplateId": "1234567890123456",
    "dltEntityId": "1234567890",
    "tenantId": "default",
    "metadata": {
      "useCase": "E-commerce order confirmation",
      "department": "Sales"
    },
    "createdAt": "2026-04-08T10:45:00.000Z",
    "updatedAt": "2026-04-08T10:45:00.000Z"
  },
  "timestamp": "2026-04-08T10:45:00.000Z",
  "requestId": "req_stu901",
  "statusCode": 201,
  "status": "success"
}
```

---

### 8️⃣ List Messages (with Filters)

**Request:**
```http
GET /api/v1/sms?status=DELIVERED&messageType=TRANSACTIONAL&limit=10&page=1&sortBy=createdAt&order=desc
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "messageId": "msg_xyz789",
        "to": "+919876543210",
        "message": "Your order has been delivered!",
        "status": "DELIVERED",
        "provider": "fast2sms",
        "messageType": "TRANSACTIONAL",
        "segmentCount": 1,
        "deliveredAt": "2026-04-08T10:30:00.000Z",
        "createdAt": "2026-04-08T10:25:00.000Z"
      },
      {
        "messageId": "msg_abc456",
        "to": "+919876543211",
        "message": "Payment received successfully!",
        "status": "DELIVERED",
        "provider": "fast2sms",
        "messageType": "TRANSACTIONAL",
        "segmentCount": 1,
        "deliveredAt": "2026-04-08T10:28:00.000Z",
        "createdAt": "2026-04-08T10:23:00.000Z"
      }
    ],
    "pagination": {
      "total": 247,
      "page": 1,
      "limit": 10,
      "totalPages": 25,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2026-04-08T10:50:00.000Z",
  "requestId": "req_vwx234",
  "statusCode": 200,
  "status": "success"
}
```

---

### 9️⃣ Get Message by ID

**Request:**
```http
GET /api/v1/sms/msg_xyz789
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_xyz789",
    "tenantId": "default",
    "to": "+919876543210",
    "from": "MYAPP",
    "message": "Your order has been delivered!",
    "status": "DELIVERED",
    "provider": "fast2sms",
    "providerMessageId": "prov_123456",
    "messageType": "TRANSACTIONAL",
    "segmentCount": 1,
    "unicode": false,
    "referenceId": "order_12345",
    "metadata": {
      "orderId": "ORD12345",
      "userId": "user_001"
    },
    "deliveryStatus": {
      "status": "DELIVERED",
      "timestamp": "2026-04-08T10:30:00.000Z",
      "providerStatus": "delivered"
    },
    "createdAt": "2026-04-08T10:25:00.000Z",
    "updatedAt": "2026-04-08T10:30:00.000Z"
  },
  "timestamp": "2026-04-08T10:55:00.000Z",
  "requestId": "req_yza567",
  "statusCode": 200,
  "status": "success"
}
```

---

### 🔟 Analytics Summary

**Request:**
```http
GET /api/v1/analytics/summary?from=2026-04-01T00:00:00.000Z&to=2026-04-08T23:59:59.999Z
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalMessages": 15420,
    "successfulMessages": 15012,
    "failedMessages": 408,
    "deliveryRate": 97.35,
    "byStatus": {
      "DELIVERED": 14850,
      "SENT": 162,
      "FAILED": 408
    },
    "byMessageType": {
      "TRANSACTIONAL": 12840,
      "PROMOTIONAL": 2250,
      "OTP": 330
    },
    "byProvider": {
      "fast2sms": 10500,
      "msg91": 4920
    },
    "totalSegments": 18234,
    "averageSegmentsPerMessage": 1.18,
    "dateRange": {
      "from": "2026-04-01T00:00:00.000Z",
      "to": "2026-04-08T23:59:59.999Z"
    }
  },
  "timestamp": "2026-04-08T11:00:00.000Z",
  "requestId": "req_bcd890",
  "statusCode": 200,
  "status": "success"
}
```

---

### 1️⃣1️⃣ Provider Health Check

**Request:**
```http
GET /api/v1/analytics/provider-health
Authorization: Bearer your-api-key-here
X-Tenant-Id: default
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "name": "fast2sms",
        "status": "healthy",
        "totalMessages": 10500,
        "successRate": 98.5,
        "averageDeliveryTime": 2.3,
        "lastUsed": "2026-04-08T10:58:00.000Z"
      },
      {
        "name": "msg91",
        "status": "healthy",
        "totalMessages": 4920,
        "successRate": 95.2,
        "averageDeliveryTime": 3.1,
        "lastUsed": "2026-04-08T10:55:00.000Z"
      }
    ],
    "overall": {
      "healthyProviders": 2,
      "totalProviders": 2,
      "systemHealth": "healthy"
    }
  },
  "timestamp": "2026-04-08T11:05:00.000Z",
  "requestId": "req_efg123",
  "statusCode": 200,
  "status": "success"
}
```

---

### 📝 Error Response Examples

**Invalid API Key (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or missing API key",
    "code": "UNAUTHORIZED"
  },
  "timestamp": "2026-04-08T11:10:00.000Z",
  "requestId": "req_hij456",
  "statusCode": 401,
  "status": "error"
}
```

**Missing Tenant ID (400):**
```json
{
  "success": false,
  "error": {
    "message": "Missing X-Tenant-Id header. Set DEFAULT_TENANT_ID in the service env or pass the header explicitly.",
    "code": "VALIDATION_ERROR"
  },
  "timestamp": "2026-04-08T11:11:00.000Z",
  "requestId": "req_klm789",
  "statusCode": 400,
  "status": "error"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "to",
        "message": "Invalid phone number format"
      },
      {
        "field": "message",
        "message": "Message text is required"
      }
    ]
  },
  "timestamp": "2026-04-08T11:12:00.000Z",
  "requestId": "req_nop012",
  "statusCode": 400,
  "status": "error"
}
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "error": {
    "message": "Too many requests. Please try again later.",
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 60
  },
  "timestamp": "2026-04-08T11:13:00.000Z",
  "requestId": "req_qrs345",
  "statusCode": 429,
  "status": "error"
}
```

---

### 🚀 Quick Test Collection

**Import this into Postman:**

1. Download [postman-collection.json](./postman-collection.json)
2. Open Postman → Import → Select the file
3. Update collection variables:
   - `baseUrl`: `http://localhost:3000/api/v1`
   - `apiKey`: `your-actual-api-key`
   - `tenantId`: `default` (or your tenant ID)
4. Start making requests!

**Or manually create collection:**

1. Create new collection "SMS Delivery Service"
2. Set collection variables:
   - `baseUrl`: `http://localhost:3000/api/v1`
   - `apiKey`: `your-api-key-here`
   - `tenantId`: `default`
3. Add authorization header to collection: `Authorization: Bearer {{apiKey}}`
4. Add header: `X-Tenant-Id: {{tenantId}}`
5. Copy-paste the request examples above

---

### 📊 Complete API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Health & Status** ||||
| `GET` | `/health` | Service health check | ❌ No |
| **SMS Operations** ||||
| `POST` | `/sms/send` | Send single SMS | ✅ Yes |
| `POST` | `/sms/send-otp` | Send OTP code | ✅ Yes |
| `POST` | `/sms/verify-otp` | Verify OTP code | ✅ Yes |
| `POST` | `/sms/send-bulk` | Send bulk SMS messages | ✅ Yes |
| `GET` | `/sms` | List all messages (with filters) | ✅ Yes |
| `GET` | `/sms/:messageId` | Get message by ID | ✅ Yes |
| `DELETE` | `/sms/:messageId/gdpr-purge` | GDPR delete message | ✅ Yes |
| **Templates** ||||
| `GET` | `/templates` | List all templates | ✅ Yes |
| `POST` | `/templates` | Create new template | ✅ Yes |
| `GET` | `/templates/:templateId` | Get template by ID | ✅ Yes |
| `PUT` | `/templates/:templateId` | Update template | ✅ Yes |
| `DELETE` | `/templates/:templateId` | Delete template | ✅ Yes |
| **Analytics** ||||
| `GET` | `/analytics/summary` | Message statistics summary | ✅ Yes |
| `GET` | `/analytics/provider-health` | Provider performance metrics | ✅ Yes |
| `GET` | `/analytics/campaigns` | List all campaigns | ✅ Yes |
| `GET` | `/analytics/campaigns/:id` | Get campaign details | ✅ Yes |
| `GET` | `/analytics/campaigns/:id/stats` | Campaign statistics | ✅ Yes |
| **Webhooks** ||||
| `POST` | `/webhooks/twilio` | Twilio delivery webhook | ❌ No (Provider-signed) |
| `POST` | `/webhooks/vonage` | Vonage delivery webhook | ❌ No (Provider-signed) |
| `POST` | `/webhooks/msg91` | MSG91 delivery webhook | ❌ No (Provider-signed) |
| `POST` | `/webhooks/fast2sms` | Fast2SMS delivery webhook | ❌ No (Provider-signed) |
| `POST` | `/webhooks/{provider}` | Other provider webhooks | ❌ No (Provider-signed) |

**Common Query Parameters:**
- `limit` - Number of results per page (default: 50)
- `page` - Page number for pagination (default: 1)
- `status` - Filter by status: `SENT`, `DELIVERED`, `FAILED`
- `messageType` - Filter by type: `TRANSACTIONAL`, `PROMOTIONAL`, `OTP`
- `from` - Start date for analytics (ISO 8601)
- `to` - End date for analytics (ISO 8601)
- `sortBy` - Sort field (e.g., `createdAt`)
- `order` - Sort order: `asc` or `desc`

**Common Headers:**
- `Authorization: Bearer <API_KEY>` - Required for authenticated endpoints
- `X-Tenant-Id: <TENANT_ID>` - Required if multi-tenancy is enabled
- `Content-Type: application/json` - For POST/PUT requests
- `X-Request-ID: <UUID>` - Optional, for request tracking

---

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Cache**: Redis (optional)
- **Logging**: Winston
- **Validation**: express-validator
- **Testing**: Jest

### Project Structure
```
sms-delivery-service/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, validation, rate limiting
│   ├── models/          # MongoDB models
│   ├── providers/       # 33 SMS provider integrations
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helpers & utilities
│   └── validators/      # Request validators
├── tests/               # Test suites
├── sample-templates.json       # 103 SMS templates
├── import-templates.js         # Template importer
└── docker-compose.yml          # Docker setup
```

---

## 🔧 Configuration

### Required Environment Variables
```bash
NODE_ENV=production
PORT=3000
API_KEY=your-secret-api-key
MONGODB_URI=mongodb://localhost:27017/sms-delivery-service
SMS_PROVIDER=fast2sms  # or any supported provider
```

### Optional
```bash
# Tenancy
TENANCY_ENABLED=true
DEFAULT_TENANT_ID=default

# Provider Fallback
SMS_PROVIDER_FALLBACK=msg91

# Redis (for distributed rate limiting)
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_MAX=100
SMS_RATE_LIMIT_MAX=50
```

---

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

### Standalone Docker
```bash
docker build -t sms-delivery-service .
docker run -p 3000:3000 \
  -e API_KEY=your-key \
  -e MONGODB_URI=mongodb://mongo:27017/sms \
  -e SMS_PROVIDER=fast2sms \
  sms-delivery-service
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# With coverage
npm run test:coverage

# Specific test
npm test -- sms.test.js
```

---

## 📊 Provider Selection Guide

### For Development
- **mock** - No credentials, instant testing
- **fast2sms** - Free in India, no CC required

### For Production (India)
- **msg91** - ₹50 free credit
- **gupshup** - Enterprise-grade
- **kaleyra** - High deliverability
- **airteliq** - Airtel's official platform

### For Production (International)
- **twilio** - Industry standard
- **vonage** - Reliable, €2 free
- **telnyx** - $10 free, no CC
- **infobip** - 30-day trial

### For Specific Regions
- **d7networks** - Middle East & Asia
- **sinch** - Global coverage
- **messagebird** - Europe-focused

---

## 🎯 Use Cases

### ✅ **Local Service Marketplace** (Uber-like)
Complete flow from service request → provider match → tracking → completion → rating
- 13 dedicated templates
- Real-time updates
- Emergency alerts
- Provider management

### ✅ **E-commerce Store**
Order lifecycle from confirmation → shipping → delivery + engagement
- 11 order templates
- Cart abandonment recovery
- Inventory alerts
- Customer feedback

### ✅ **SaaS Application**
User onboarding, security, billing, team collaboration
- Security alerts (2FA, login, password reset)
- Subscription management
- Feature announcements
- Team invitations

### ✅ **Education Platform**
Course management, assignments, exams, certifications
- 7 education templates
- Exam reminders
- Grade publishing
- Certificate issuance

### ✅ **Healthcare App**
Appointments, prescriptions, reminders
- Appointment management
- Prescription refills
- Patient engagement

### ✅ **Banking/Fintech**
Transactions, payments, security
- Payment confirmations
- Balance alerts
- Security notifications

---

## 📈 Scaling

### Horizontal Scaling
- Stateless design - run multiple instances
- Redis for distributed rate limiting
- MongoDB connection pooling

### Performance
- Lazy provider loading
- Request caching
- Bulk processing
- Async operations

### Monitoring
- Winston logging (JSON format)
- Request IDs for tracing
- Provider health metrics
- Analytics dashboard

---

## 🔒 Security

- ✅ API key authentication
- ✅ Rate limiting (global + per-tenant)
- ✅ Input validation
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Environment-based config
- ✅ Webhook signature verification
- ✅ Non-root Docker user

---

## 🌍 Compliance

### India (DLT)
- All templates support DLT fields
- Entity ID & Template ID configuration
- Sender ID registration support

### GDPR
- Data export functionality
- GDPR purge endpoints
- Consent management ready

---

## 📝 License

MIT License - Use freely for personal or commercial projects

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests
4. Submit pull request

---

---

## 🎉 Ready to Go!

```bash
# 1. Setup
cp .env.sample .env && npm install

# 2. Import 103 templates
node import-templates.js

# 3. Start service
npm run dev

# 4. Send first SMS
curl -X POST http://localhost:3000/api/v1/sms/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"+919876543210","message":"Hello from SMS Service!"}'
```

**You're now ready to send SMS for any website or application!** 🚀
