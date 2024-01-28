'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import EdItem from './components/EdItem'
import editions from './editions'
import Menu from './components/Menu'
import MarqueeTitle from './components/MarqueeTitle'
import Dropdown from './components/Dropdown'

export default function Home() {
  return (
    <main className="w-full max-h-screen md:flex">
      <div className='w-1/4 md:flex fixed z-50 top-0 left-0 hidden'>
        <MarqueeTitle/>
        <Menu/>
      </div>
      <div className='flex flex-col md:hidden'>
      <h5 className='border border-b-white border-x-0 border-t-0 text-center text-xl'>EL DESENFRENO EDICIONES</h5>
      <Dropdown/>
      </div>
      <div className='flex flex-col md:ml-[25rem] w-full mr-4'>
      <h5 className='uppercase md:ml-2 pl-2 md:pl-0 font-neue-haas-grotesk font-xl font-extrabold border border-t-white border-b-0 border-x-0 md:mt-4 pt-1 text-xl tracking-tighter'>Novedades</h5>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {editions.map((edition, index) => (
          <div key={index} id={`${index}`}>
            <EdItem 
              image={edition.image}
              title={edition.title}
              author={edition.author}
              review={edition.review}
              reviewName={edition.reviewName}
              link={edition.link}
            />
          </div>
        ))}
      </div>

      </div>
    </main>
  )
}
