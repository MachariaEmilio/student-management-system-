import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

export default function App() {
  const [students, setStudents] = useState([]);

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/students");
      setStudents(res.data);
    } catch (error) {
      toast.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Create new student
  const createStudent = async (studentData) => {
    try {
      await axios.post("http://localhost:3000/api/students", studentData);
      toast.success("Student created successfully!");
      fetchStudents();
    } catch (error) {
      toast.error("Failed to create student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-bold text-center mb-10">
        Student Management Dashboard
      </h1>
      <StudentForm onCreate={createStudent} />
      <StudentList students={students} refreshStudents={fetchStudents} />
    </div>
  );
}
