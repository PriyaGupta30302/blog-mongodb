import React, { useState, useEffect } from 'react';
import BlogItem from './BlogItem';

const categories = ["All", "Technology", "Startup", "Lifestyle"];

const BlogList = () => {
  const [menu, setMenu] = useState('All');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      let url = "/api/blog/getBlog";
      if (menu !== "All") url += `?category=${menu}`;
      const res = await fetch(url);
      const data = await res.json();
      setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, [menu]);

  return (
    <div className='max-w-[1340px] mx-auto'>
      <div className='flex justify-center gap-3 my-10 cursor-pointer'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setMenu(cat)}
            className={menu === cat ? 'bg-black text-white py-1 px-4 rounded-sm cursor-pointer' : ''}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-0 cursor-pointer'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          blogs.map((item, index) => (
            <BlogItem
              key={item._id || index}
              id={item._id || item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;
