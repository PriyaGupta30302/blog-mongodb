'use client';
import React from 'react';
import './editor-styles.css';

const BlogContent = ({ html }) => (
  <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: html }} />
);

export default BlogContent;
