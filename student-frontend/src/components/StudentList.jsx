import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteModal from "./DeleteModal";

export default function StudentList({ students, refreshStudents }) {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const openModal = (student) => setSelectedStudent(student);
  const closeModal = () => setSelectedStudent(null);

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;

    try {
      // Notify parent
      await axios.post(
        `http://localhost:3000/api/students/${selectedStudent.id}/notify`
      );
      toast.success("Parent notified");

      // Delete student
      await axios.delete(
        `http://localhost:3000/api/students/${selectedStudent.id}`
      );
      toast.success("Student deleted");

      refreshStudents();
    } catch (err) {
      toast.error("Failed to delete student");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Student List</h2>

      <ul className="space-y-4">
        {students.length === 0 ? (
          <li className="text-gray-500">No students created yet.</li>
        ) : (
          students.map((student) => (
            <li
              key={student.id}
              className="border border-gray-300 rounded p-4 shadow-sm bg-white space-y-2"
            >
              <p>
                <strong>ID:</strong> {student.id}
              </p>
              <p>
                <strong>Name:</strong> {student.name}
              </p>
              <p>
                <strong>Age:</strong> {student.age}
              </p>
              <p>
                <strong>Parent Name:</strong> {student.parentName}
              </p>
              <p>
                <strong>Parent Email:</strong> {student.parentEmail}
              </p>

              <button
                onClick={() => openModal(student)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {selectedStudent && (
        <DeleteModal
          student={selectedStudent}
          onCancel={closeModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
