"use client"

import Link from 'next/link'
import React from 'react'
import ContactForm from '../ui/ContactForm'

const Contact = () => {
  return (
    <div className='flex flex-col text-sm mt-4 font-neue-display'>
      <ContactForm />
    </div>
  )
}

export default Contact