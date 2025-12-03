'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blog/getBlog');
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        alert('Error loading blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleEdit = (id) => {
    router.push(`/admin/addBlog?id=${id}`);
  };

  const handleDelete = async (id) => {
    const ok = confirm('Are you sure you want to delete this blog?');
    if (!ok) return;
    const prev = blogs;
    setBlogs(b => b.filter(x => x._id !== id));

    try {
      const res = await fetch(`/api/blog/deleteBlog?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog');
      setBlogs(prev);
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-[1240px] mx-auto">
        <h1 className="text-2xl font-semibold mb-6">All blogs</h1>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author name
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blog title
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Loading blogs...
                  </td>
                </tr>
              )}

              {!loading && blogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No blogs found.
                  </td>
                </tr>
              )}

              {!loading &&
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 border-t">
                    {/* Author */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          {blog.authorImg ? (
                            <img
                              src={blog.authorImg}
                              alt={blog.author || 'Author'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                              {(blog.author || 'A')
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {blog.author || 'Unknown'}
                        </div>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 truncate max-w-[640px]">
                        {blog.title}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(blog.date)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(blog._id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent rounded-md bg-white hover:bg-gray-50 text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-transparent bg-red-50 hover:bg-red-100 text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
