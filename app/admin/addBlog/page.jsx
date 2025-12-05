'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import RichTextEditor from '@/components/adminComponents/RichTextEditor';
import '@/components/adminComponents/editor-styles.css';
import { assets } from '@/assets/blog-img/assets';
import { MobileAdminNav } from '@/components/adminComponents/Sidebar';

const categories = ["Startup", "Technology", "Lifestyle"];

const AddBlogpage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");
  const isEditMode = Boolean(editId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    category: categories[0],
  });

  const [authorImg, setAuthorImg] = useState(null); // File | string | null
  const [blogImage, setBlogImage] = useState(null); // File | string | null
  const [editorKey, setEditorKey] = useState(1);
  const authorInputRef = useRef(null);
  const blogInputRef = useRef(null);
  const [loading, setLoading] = useState(isEditMode);

  // ---- helpers ----
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const triggerFileClick = (ref) => {
    ref?.current?.click();
  };

  const getPlaceholderSrc = (maybeAsset) => {
    if (!maybeAsset) return '';
    if (typeof maybeAsset === 'string') return maybeAsset;
    if (maybeAsset.src) return maybeAsset.src;
    return '';
  };

  const uploadPlaceholder = getPlaceholderSrc(
    assets?.upload_area || assets?.uploadArea || ''
  );

  // ---- load blog when editing ----
  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/getBlog?id=${editId}`);
        if (!res.ok) throw new Error('Failed to load blog');
        const blog = await res.json();

        setFormData({
          title: blog.title || "",
          description: blog.description || "",
          author: blog.author || "",
          category: blog.category || categories[0],
        });

        setAuthorImg(blog.authorImg || null);
        setBlogImage(blog.image || null);
        setEditorKey((k) => k + 1);
      } catch (err) {
        console.error(err);
        alert("Error loading blog for edit");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [isEditMode, editId]);

  // ---- handlers ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleEditorChange = ({ json, html, readTime }) => {
    setFormData(prev => ({ ...prev, description: html }));
  };

  const resetFormFields = () => {
    setFormData({ title: "", description: "", author: "", category: categories[0] });
    setAuthorImg(null);
    setBlogImage(null);
    if (authorInputRef.current) authorInputRef.current.value = '';
    if (blogInputRef.current) blogInputRef.current.value = '';
    setEditorKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const blogData = {
      ...formData,
      authorImg:
        authorImg instanceof File ? await toBase64(authorImg) : authorImg || "",
      image:
        blogImage instanceof File ? await toBase64(blogImage) : blogImage || "",
      date: Date.now(),
    };

    let response;
    if (isEditMode) {
      // UPDATE
      response = await fetch(`/api/blog/updateBlog?id=${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });
    } else {
      // CREATE
      response = await fetch("/api/blog/createBlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });
    }

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}
      console.error("Submit error:", response.status, errorData);
      throw new Error(errorData.error || `Request failed with ${response.status}`);
    }

    // ✅ success: read response body and log it
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    const blog = data.blog || data; // handle both shapes just in case

    if (isEditMode) {
      console.log(
        "✏️ Client: blog updated:",
        blog?._id || editId,
        "-",
        blog?.title || formData.title
      );
      alert("Blog updated successfully");
    } else {
      console.log(
        "✅ Client: blog created:",
        blog?._id,
        "-",
        blog?.title || formData.title
      );
      alert("Blog added successfully");
    }

    router.push("/admin/blogList");
  } catch (err) {
    console.error(err);
    alert("Error submitting blog: " + err.message);
  }
};


  if (loading) {
    return (
      <div className="max-w-[1140px] mx-auto p-6 my-10 bg-white rounded shadow-md">
        <p>Loading blog...</p>
      </div>
    );
  }

  // ---- UI ----
  return (
    <div className='md:px-10'>
       <div className='pt-5'>
        <MobileAdminNav/>
       </div>
    <div className="max-w-[1140px] mx-auto p-3  md:p-6 mb-10 md:my-10 bg-white rounded shadow-md ">
     
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {isEditMode ? "Edit Blog" : "Add Blog"}
      </h1>

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
            key={editorKey}
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
          <input
            ref={authorInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setAuthorImg)}
            className="hidden"
          />

          <div
            className="w-48 h-32 border border-gray-300 rounded-md overflow-hidden cursor-pointer"
            onClick={() => triggerFileClick(authorInputRef)}
            role="button"
            tabIndex={0}
          >
            <img
              src={
                authorImg
                  ? authorImg instanceof File
                    ? URL.createObjectURL(authorImg)
                    : authorImg
                  : (uploadPlaceholder || '')
              }
              alt="Author Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Blog Image */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Blog Image</label>
          <input
            ref={blogInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setBlogImage)}
            className="hidden"
          />

          <div
            className="w-48 h-28 border border-gray-300 rounded-md overflow-hidden cursor-pointer"
            onClick={() => triggerFileClick(blogInputRef)}
            role="button"
            tabIndex={0}
          >
            <img
              src={
                blogImage
                  ? blogImage instanceof File
                    ? URL.createObjectURL(blogImage)
                    : blogImage
                  : (uploadPlaceholder || '')
              }
              alt="Blog Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/blogList')}
            className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
          >
            {isEditMode ? "Update Blog" : "Add Blog"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddBlogpage;
