const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendNotificationEmail = require("../utils/mailer");

// Create student
exports.createStudent = async (req, res) => {
  try {
    const student = await prisma.student.create({ data: req.body });
    res.status(201).json(student);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating student", error: err.message });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

// Notify parent
exports.notifyParent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return res.status(404).json({ message: "Student not found" });

    await sendNotificationEmail(student.parentEmail, student.name);

    await prisma.student.update({
      where: { id },
      data: { notified: true },
    });

    res.json({ message: "Parent notified" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Notification failed", error: err.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.notified) {
      return res
        .status(403)
        .json({ message: "Notify parent before deleting student" });
    }

    await prisma.student.delete({ where: { id } });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};



const otpStore = {}; // You can replace this with Redis or DB for production

exports.sendOtp = async (req, res) => {
  const { parentEmail } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[parentEmail] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 mins

  try {
    await sendNotificationEmail.sendOtpEmail(parentEmail, otp);
    res.json({ message: "OTP sent to parent email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

exports.verifyOtp = (req, res) => {
  const { parentEmail, otp } = req.body;
  const record = otpStore[parentEmail];

  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete otpStore[parentEmail]; // Clear OTP after success
  res.json({ message: "OTP verified" });
};
