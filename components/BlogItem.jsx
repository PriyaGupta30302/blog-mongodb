import { assets } from '../assets/blog-img/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({title, description, category, image, id}) => {
  // Fallback image
  const validImage = image 
    ? (image.startsWith('http') || image.startsWith('/assets') || image.startsWith('data:image'))
      ? image
      : `/assets/blog-img/${image}.jpg`
    : assets.placeholder;

  return (
    <div className="max-w-[330px] sm:max-w-[300px] h-[440px] flex flex-col bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] transition-shadow duration-300 ease-in-out">
      <Link href={`/blogs/${id}`}>
        <Image src={validImage} alt='' width={400} height={200} className='border-b border-black object-cover h-[200px]' />
      </Link>
      <p className="ml-5 mt-5 px-2 py-0.5 inline-block bg-black text-white text-sm self-start">{category}</p>


      <div className='p-5 flex flex-col flex-1'>
        <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900 line-clamp-1'>{title}</h5>
        <p className='mb-3 text-sm tracking-tight text-gray-700 line-clamp-3'>{description}</p>
        {/* Spacer to push Read more to bottom */}
        <div className="flex-1"></div>
        <Link href={`/blogs/${id}`} className='inline-flex items-center py-2 font-semibold ml-2 text-center'>
          Read more <Image src={assets.arrow} className='ml-2 mt-1' alt='' width={12} />
        </Link>
      </div>
    </div>
  )
}

export default BlogItem
