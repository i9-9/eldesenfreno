import Link from 'next/link'
import React from 'react'

const Contact = () => {
  return (
    <div className='flex flex-col'>
      <p>Ya sea que busque dar su primer paso en el mundo de la escritura o ganar exposición a través de nuestra editorial, puede encontrarnos en nuestra bandeja de entrada en:</p>
      <Link href='mailto:eldesenfreno@gmail.com' target='_blank' className='underline'>eldesenfreno@gmail.com</Link>
    </div>
  )
}

export default Contact