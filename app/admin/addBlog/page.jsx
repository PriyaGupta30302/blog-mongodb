// app/(your-route)/AddBlogpage.jsx
'use client';
import React, { useState, useRef } from 'react';
import RichTextEditor from '@/components/adminComponents/RichTextEditor'; // adjust path if needed
import '@/components/adminComponents/editor-styles.css'; // ensure editor styles loaded on this page
import { assets } from '@/assets/blog-img/assets';
// removed next/image usage in previews because we use URL.createObjectURL for local previews

const categories = ["Startup", "Technology", "Lifestyle"];

const AddBlogpage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "", // HTML string from editor
    author: "",
    category: categories[0],
  });

  // files and previews
  const [authorImg, setAuthorImg] = useState(null);
  const [blogImage, setBlogImage] = useState(null);

  // used to remount the editor to clear it
  const [editorKey, setEditorKey] = useState(1);

  // refs to clear native file input values
  const authorInputRef = useRef(null);
  const blogInputRef = useRef(null);

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

  // Editor change handler receives { json, html, readTime }
  const handleEditorChange = ({ json, html, readTime }) => {
    setFormData(prev => ({ ...prev, description: html }));
  };

  const resetFormFields = () => {
    // Clear text fields
    setFormData({ title: "", description: "", author: "", category: categories[0] });

    // Clear file state and native inputs
    setAuthorImg(null);
    setBlogImage(null);
    if (authorInputRef.current) authorInputRef.current.value = '';
    if (blogInputRef.current) blogInputRef.current.value = '';

    // Remount editor to ensure internal state (character count, html, etc.) is cleared
    setEditorKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authorImgBase64 = authorImg ? await toBase64(authorImg) : "";
      const blogImgBase64 = blogImage ? await toBase64(blogImage) : "";

      const blogData = {
        ...formData,
        authorImg: authorImgBase64,
        image: blogImgBase64,
        date: Date.now(),
      };

      const response = await fetch("/api/blog/createBlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        alert("Blog added successfully");
        // clear the form & editor
        resetFormFields();
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting blog: ' + (err.message || err));
    }
  };

  // small helper to trigger click on file inputs from our preview placeholders
  const triggerFileClick = (ref) => {
    if (ref && ref.current) ref.current.click();
  };

  // Helper to get placeholder src (supports different import shapes)
  const getPlaceholderSrc = (maybeAsset) => {
    if (!maybeAsset) return '';
    if (typeof maybeAsset === 'string') return maybeAsset;
    if (maybeAsset.src) return maybeAsset.src;
    return '';
  };

  // Attempt to get upload_area from assets (adjust key if your asset name differs)
  const uploadPlaceholder = getPlaceholderSrc(assets?.upload_area || assets?.uploadArea || '');

  return (
    <div className="max-w-[1140px] mx-auto  p-6 my-10 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <RichTextEditor
            key={editorKey} // remounts editor when key changes
            initialContent={formData.description || null}
            onContentChange={handleEditorChange}
          />
        </div>

        {/* Author */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Author Name</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Author Image */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Author Image</label>

          {/* Hidden input */}
          <input
            ref={authorInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setAuthorImg)}
            className="hidden"
          />

          {/* Preview or Upload Placeholder */}
          <div
            className="w-48 h-32 border border-gray-300 rounded-md overflow-hidden cursor-pointer"
            onClick={() => triggerFileClick(authorInputRef)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileClick(authorInputRef); }}
          >
            <img
              src={authorImg ? URL.createObjectURL(authorImg) : (uploadPlaceholder || '')}
              alt="Author Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Upload Button */}
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => triggerFileClick(authorInputRef)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              
              Upload/change author image
            </button>

            {/* optionally show preview filename */}
            {authorImg && (
              <span className="text-sm text-gray-600 truncate max-w-[220px]">
                {authorImg.name}
              </span>
            )}
          </div>
        </div>

        {/* Blog Image */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Blog Image</label>

          {/* Hidden input */}
          <input
            ref={blogInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setBlogImage)}
            className="hidden"
          />

          {/* Preview or Upload Placeholder */}
          <div
            className="w-48 h-28 border border-gray-300 rounded-md overflow-hidden cursor-pointer"
            onClick={() => triggerFileClick(blogInputRef)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileClick(blogInputRef); }}
          >
            <img
              src={blogImage ? URL.createObjectURL(blogImage) : (uploadPlaceholder || '')}
              alt="Blog Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => triggerFileClick(blogInputRef)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              
              Upload/change blog image
            </button>

            {blogImage && (
              <span className="text-sm text-gray-600 truncate max-w-[220px]">
                {blogImage.name}
              </span>
            )}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors">
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlogpage;
