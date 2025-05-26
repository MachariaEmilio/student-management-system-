📘 Student Notification System
A Node.js-based backend service that sends email notifications to parents when a student is at risk of being removed from the school system.


🚀 Features

 🔍 Fetch student info using their ID
 📬 Send email notifications to parents using Gmail (Nodemailer)
 ✅ Update student record to mark them as "notified"
 🛡 Error handling and status responses


📦 Tech Stack

  Node.js  
  Express         
  Prisma ORM            
  Nodemailer      
  Gmail SMTP          
  dotenv         



⚙️ Setup Instructions

1. Clone the Repository
```
git clone https://github.com/your-username/student-notification-system.git
cd student-notification-system
```

 2. Install Dependencies

```
npm install
```

3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=yourapppassword
```

4. Setup Prisma

```bash
npx prisma init         
npx prisma generate
npx prisma migrate dev 
```

 5. Run the Server

```bash
npm start
```


 📨 How Email Notification Works

1. The `notifyParent` endpoint is called with a student ID.
2. The system:

   * Retrieves the student record from the database.
   * Sends an email to the parent's email using Nodemailer.
   * Marks the student as notified in the DB.

---

 🔗 Example API Endpoint

POST `/api/notify/:id`

Response:

```json
{
  "message": "Parent notified"
}
```

If student not found:

```json
{
  "message": "Student not found"
}
```

📄 Sample Code

mailer.js

```js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotificationEmail = async (to, studentName) => {
  const mailOptions = {
    from: `"School Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Notice: ${studentName} may be removed`,
    text: `Dear Parent,\n\nThis is to notify you that your child, ${studentName}, may be removed from our school system.\n\nRegards,\nSchool Admin`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendNotificationEmail };
```

studentController.js

```js
const { sendNotificationEmail } = require('../mailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.notifyParent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await sendNotificationEmail(student.parentEmail, student.name);

    await prisma.student.update({
      where: { id },
      data: { notified: true },
    });

    res.json({ message: "Parent notified" });
  } catch (err) {
    res.status(500).json({ message: "Notification failed", error: err.message });
  }
};
```
