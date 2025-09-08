# Document Request Workflow Implementation

## Complete Process Flow

### 1. Student Request (Initial)
- Student logs in and requests a document (Good Moral, Transcript, etc.)
- Request is created with status: `pending`

### 2. Registrar Reviews Request
- Registrar views student profile and sees pending requests
- Registrar clicks "New Request" to request the document from accounting
- This calls: `POST /api/requests/{id}/request-document` with amount
- Request status changes to: `payment_required`
- Notifications sent to:
  - Accounting: "New document request from Registrar"
  - Student: "Payment required - go to accounting office"

### 3. Student Pays at Accounting
- Student goes to accounting office with cash
- Accounting staff logs in and sees "Request from Registrar" page
- Lists all requests with status `payment_required`
- Accounting clicks "Process Payment" 
- This calls: `POST /api/payments/process`
- Request status changes to: `payment_approved`
- Notifications sent to:
  - Registrar: "Payment received for [student]'s [document]"
  - Student: "Payment confirmed - request being processed"

### 4. Registrar Approves & Prints
- Registrar sees notification about payment approval
- Registrar approves the request: `POST /api/requests/{id}/approve`
- Request status changes to: `approved`
- Registrar prints document: `POST /api/requests/{id}/print`
- Request status changes to: `ready for pick-up`
- Student gets notification: "Document ready for pick-up"

## API Endpoints

### Request Management
- `POST /api/requests` - Create new request
- `POST /api/requests/{id}/request-document` - Registrar requests from accounting
- `POST /api/requests/{id}/approve` - Registrar approves after payment
- `POST /api/requests/{id}/print` - Mark as printed
- `GET /api/requests/student/{studentId}/billing` - Student billing info

### Payment Management
- `GET /api/payments/pending` - Get requests awaiting payment (Accounting view)
- `POST /api/payments/process` - Process payment (Accounting function)
- `GET /api/payments/student/{studentId}` - Get student's payment history

## Frontend Components

### Registrar (Admin)
- `StudentDetailView.js` - Shows student profile with document requests
- `NewRequestModal.js` - Modal for creating new document requests

### Accounting
- `RequestFromRegistrarView.js` - Shows pending payment requests from registrar

### Student
- Student can view their billing status and request status

## Database Models

### Request Model
```sql
- id (primary key)
- studentId (foreign key to users)
- documentType (string)
- purpose (text)
- status (enum: pending, payment_required, payment_pending, payment_approved, approved, rejected, ready for pick-up)
- amount (decimal)
- requestedBy (string - registrar who requested)
- requestedAt (datetime)
- approvedBy (string - registrar who approved)
- approvedAt (datetime)
- printedAt (datetime)
```

### Payment Model
```sql
- id (primary key)
- requestId (foreign key to requests)
- studentId (string - student ID number)
- amount (decimal)
- paymentMethod (enum: cash, check, online)
- paymentStatus (enum: pending, paid, refunded)
- paidAt (datetime)
- receivedBy (string - accounting staff)
- receiptNumber (string)
```

## Status Flow
1. `pending` → Student created request
2. `payment_required` → Registrar requested document from accounting
3. `payment_approved` → Accounting processed payment
4. `approved` → Registrar approved request
5. `ready for pick-up` → Document printed and ready

## Testing Steps
1. Login as student → Create document request
2. Login as registrar → View student → Request document from accounting
3. Login as accounting → Process payment for the request
4. Login as registrar → Approve and print document
5. Verify notifications and status updates throughout
