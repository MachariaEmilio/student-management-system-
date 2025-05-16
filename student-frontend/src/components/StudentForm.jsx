import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function StudentForm({ onCreate }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    parentName: "",
    parentEmail: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:3000/api/students/send", {
        parentEmail: formData.parentEmail,
      });
      toast.success("OTP sent to parent email");
      setOtpSent(true);
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:3000/api/students/verify", {
        parentEmail: formData.parentEmail,
        otp,
      });
      toast.success("OTP verified");
      setOtpVerified(true);
    } catch {
      toast.error("Invalid or expired OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify OTP before submitting");
      return;
    }
    onCreate(formData);
    setFormData({ name: "", age: "", parentName: "", parentEmail: "" });
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">Create New Student</h2>

      <input
        type="text"
        name="name"
        placeholder="Student Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="number"
        name="age"
        placeholder="Student Age"
        value={formData.age}
        onChange={handleChange}
        required
        min={1}
        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        name="parentName"
        placeholder="Parent Name"
        value={formData.parentName}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="email"
        name="parentEmail"
        placeholder="Parent Email"
        value={formData.parentEmail}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {!otpSent && (
        <button
          type="button"
          onClick={sendOtp}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
        >
          Send OTP
        </button>
      )}

      {otpSent && !otpVerified && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={verifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Verify OTP
          </button>
        </>
      )}

      <button
        type="submit"
        disabled={!otpVerified}
        className={`px-4 py-2 rounded transition w-full ${
          otpVerified
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-white cursor-not-allowed"
        }`}
      >
        Create Student
      </button>
    </form>
  );
}
