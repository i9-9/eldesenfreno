import Link from 'next/link'
import React from 'react'

const Contact = () => {
  return (
    <div className='flex flex-col ml-2 mr-8 text-lg mt-4 md:mt-0'>
      <p>Ya sea que busque dar su primer paso en el mundo de la escritura o ganar exposición a través de nuestra editorial, puede encontrarnos en nuestra bandeja de entrada en:</p>
      <Link href='mailto:eldesenfreno@gmail.com' target='_blank' className='underline my-4'>eldesenfreno@gmail.com</Link>
      <p>Seguimos disponibles para responder cualquier pregunta que pueda tener y, si alguna vez desea discutir sus ideas, recuerde: nuestras puertas están abiertas.</p>
    </div>
  )
}

export default Contact