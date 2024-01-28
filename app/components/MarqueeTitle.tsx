'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';


const MarqueeTitle = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  let yPercent = 0;
  let direction = -1;


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.3,
        start: 0,
        end: window.innerHeight,
        onUpdate: e => direction = e.direction * 1
      },
      y: "150px",
    })
    requestAnimationFrame(animate);
  }, [])

  const animate = () => {
    if(yPercent < -100){
      yPercent = 0;
    }
    else if(yPercent > 0){
      yPercent = -100;
    }
    gsap.set(firstText.current, {yPercent: yPercent})
    gsap.set(secondText.current, {yPercent: yPercent})
    requestAnimationFrame(animate);
    yPercent += 0.1 * direction;
  }

  return (
    <div className='max-h-screen w-16 border border-r-white border-t-0 border-l-0 border-b-0 overflow-hidden px-4'>
      <div className='relative whitespace-nowrap' ref={slider}>
          <p className='-rotate-90 mt-[40rem] text-5xl font-aggie' ref={firstText}>EL DESENFRENO </p>
          <p className='-rotate-90 mt-[45rem] text-5xl font-aggie' ref={secondText}>EL DESENFRENO </p>
      </div>
    </div>
  )
}

export default MarqueeTitle