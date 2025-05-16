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

