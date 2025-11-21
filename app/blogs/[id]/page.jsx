'use client';
import { assets, blog_data } from '@/assets/blog-img/assets';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, use } from 'react'

export default function Page({ params }) {

  const resolvedParams = use(params);   // ✅ unwrap promise
  const { id } = resolvedParams;

  const [data, setdata] = useState(null);

  const fetchBlogData = () => {
    for (let i = 0; i < blog_data.length; i++) {

      if (Number(id) === blog_data[i].id) {   // using resolved id
        setdata(blog_data[i]);
        console.log(blog_data[i]);
        break;
      }

    }
  }

  useEffect(() => {
    fetchBlogData();
  }, []);

  return (data?<>
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
        <div className='flex justify-between items-center'>
            <Link href={'/'}>
            <Image src={assets.logo} alt='' className='w-[130px] sm:w-auto'/>
            </Link>
            <button className='flex items-center gap-2 text-center font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
                Get Started <Image src={assets.arrow} alt='' />
            </button>
        </div>
        <div className='text-center my-24 '>
            <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto leading-snug tracking-wide '>{data.title}</h1>
            <Image src={data.author_img} alt='' width={60} height={60} className='mx-auto mt-6 border border-white rounded-full'/>
            <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
        </div>
    </div>
    <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
        <Image src={data.image} alt='' width={1280} height={720} className='border-4 border-white'/>
        <h1 className='my-8 text-[26px]  font-bold'>Introduction:</h1>
        <p>{data.description}</p>
        <h3 className=' my-5 text-[18px] font-semibold '>Step 1: Self-Reflection and Goal Setting </h3>
            <p className='my-3'>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</p>
            <p className='my-3'>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</p>
        <h3 className=' my-5 text-[18px] font-semibold '>Step 2: Self-Reflection and Goal Setting  </h3>
            <p className='my-3'>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</p>
            <p className='my-3'>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</p>

            <h3 className=' my-5 text-[18px] font-semibold '>Step 3: Self-Reflection and Goal Setting  </h3>
            <p className='my-3'>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</p>
            <p className='my-3'>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</p>

            <h3 className=' my-5 text-[18px] font-semibold '>Conclusion:</h3>
            <p className='my-3'>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</p>

            <div className='my-24'>
                <p className='text-black font-semibold my-4'>Share this article on social media</p>
                <div className='flex'>
                    <Image src={assets.facebook_icon} alt='' width={50} className='cursor-pointer'/>
                    <Image src={assets.twitter_icon} alt='' width={50} className='cursor-pointer'/>
                    <Image src={assets.googleplus_icon} alt='' width={50} className='cursor-pointer'/>
                </div>
            </div>
       

    </div>
    </>:<></>
  )
}
