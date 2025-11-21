import { blog_data } from '@/assets/blog-img/assets'
import React, { useState } from 'react'
import BlogItem from './BlogItem'

const BlogList = () => {
    const [menu,setMenu] = useState('All');
  return (
    <div>
      <div className='flex justify-center gap-6 my-10 cursor-pointer'>
        <button onClick={()=>setMenu('All')}  className={ menu==="All"?'bg-black text-white py-1 px-4 rounded-sm cursor-pointer' :""}>All</button>
        <button onClick={()=>setMenu('Technology')} className={ menu==="Technology"?'bg-black text-white py-1 px-4 rounded-sm cursor-pointer' :""}>Technology</button>
        <button onClick={()=>setMenu('Startup')} className={ menu==="Startup"?'bg-black text-white py-1 px-4 rounded-sm cursor-pointer' :""}>Startup</button>
        <button onClick={()=>setMenu('Lifestyle')} className={ menu==="Lifestyle"?'bg-black text-white py-1 px-4 rounded-sm cursor-pointer' :""}>Lifestyle</button>
      </div>
      <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24 cursor-pointer'>
        {blog_data.filter((item)=> menu==="All"?true:item.category===menu).map((item,index )=>{
            return<BlogItem key={index} id={item.id} image={item.image} title={item.title}  description={item.description} category={item.category}  />
        })}
      </div>
    </div>
  )
}

export default BlogList
