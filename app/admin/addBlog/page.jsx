'use client';
import React, { useState } from "react";

const categories = ["Startup", "Technology", "Lifestyle"];

const AddBlogpage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    category: categories[0], // default first option
  });
  const [authorImg, setAuthorImg] = useState(null);
  const [blogImage, setBlogImage] = useState(null);

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authorImgBase64 = authorImg ? await toBase64(authorImg) : "";
    const blogImgBase64 = blogImage ? await toBase64(blogImage) : "";

    const blogData = {
      ...formData,
      authorImg: authorImgBase64,
      image: blogImgBase64,
      date: Date.now(),
    };

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        alert("Blog added successfully");
        setFormData({ title: "", description: "", author: "", category: categories[0] });
        setAuthorImg(null);
        setBlogImage(null);
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      }
    } catch (err) {
      alert("Failed to add blog: " + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Author Name</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Author Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setAuthorImg)}
            className="w-full text-gray-700"
          />
          {authorImg && (
            <img
              src={URL.createObjectURL(authorImg)}
              alt="Author Preview"
              className="mt-2 w-24 h-24 object-cover rounded"
            />
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Blog Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setBlogImage)}
            className="w-full text-gray-700"
          />
          {blogImage && (
            <img
              src={URL.createObjectURL(blogImage)}
              alt="Blog Preview"
              className="mt-2 w-24 h-24 object-cover rounded"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
        >
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlogpage;
