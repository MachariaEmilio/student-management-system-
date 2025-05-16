import React, { useState } from 'react'

export default function StudentForm({ onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parentName: '',
    parentEmail: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    // For age, convert to number
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate(formData)
    setFormData({ name: '', age: '', parentName: '', parentEmail: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md space-y-4">
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

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Create Student
      </button>
    </form>
  )
}
