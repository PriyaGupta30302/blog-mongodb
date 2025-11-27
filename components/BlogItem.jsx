// BlogItem.jsx (only the relevant changes shown)
import React from 'react'
import { assets } from '../assets/blog-img/assets'
import Image from 'next/image'
import Link from 'next/link'
import '@/components/adminComponents/editor-styles.css';

function stripHtml(html) {
  if (!html) return '';
  // Safe client-friendly approach: use DOMParser when available,
  // fallback to regex if on server or parser missing.
  if (typeof window !== 'undefined' && window.DOMParser) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  return html.replace(/<[^>]+>/g, '');
}

const BlogItem = ({title, description, category, image, id}) => {
  const validImage = image 
    ? (image.startsWith('http') || image.startsWith('/assets') || image.startsWith('data:image'))
      ? image
      : `/assets/blog-img/${image}.jpg`
    : assets.placeholder;

  const plain = stripHtml(description);
  const excerpt = plain.length > 140 ? plain.slice(0, 140).trim() + '…' : plain;

  return (
    <div className='max-w-[1240px] mx-auto'>
    <div className="max-w-[330px] sm:max-w-[300px] h-[440px] flex flex-col bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] transition-shadow duration-300 ease-in-out">
      <Link href={`/blogs/${id}`}>
        <Image src={validImage} alt='' width={400} height={200} className='border-b border-black object-cover h-[200px]' />
      </Link>
      <p className="ml-5 mt-5 px-2 py-0.5 inline-block bg-black text-white text-sm self-start">{category}</p>

      <div className='p-5 flex flex-col flex-1'>
        <h5 className='mb-2 text-lg md:text-xl font-semibold tracking-wide text-gray-900 line-clamp-1'>{title}</h5>

        {/* Use plain excerpt (no raw HTML) */}
        <p className='mb-3 text-sm md:text-[15px] tracking-wide  text-gray-700 line-clamp-3'>
          {excerpt}
        </p>

        <div className="flex-1"></div>
        <Link href={`/blogs/${id}`} className='inline-flex items-center py-2 font-semibold ml-2 text-center'>
          Read more <Image src={assets.arrow} className='ml-2 mt-1' alt='' width={12} />
        </Link>
      </div>
    </div>
    </div>
  )
}

export default BlogItem
