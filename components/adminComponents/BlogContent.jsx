// components/adminComponents/BlogContent.jsx
'use client';
import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import '@/components/adminComponents/editor-styles.css'; // keep this import

const BlogContent = ({ html }) => {
  // sanitize HTML to avoid XSS
  const cleanHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(html || '') : (html || '');

  return (
    // We include .ProseMirror and .blog-content so your editor CSS applies.
    // prose-lg keeps existing tailwind prose sizing if you're using the plugin.
    <div
      className="blog-content ProseMirror prose prose-lg   px-0 md:px-4"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default BlogContent;
