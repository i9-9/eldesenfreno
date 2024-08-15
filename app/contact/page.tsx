import Link from 'next/link'
import React from 'react'

const Contact = () => {
  return (
    <div className='flex flex-col ml-2 mr-8 text-sm mt-4 md:mt-0 font-neue-display' >
      <h3 className="text-base mb-6">Contacto</h3>
      <p className='text-xs'>Ya sea que busque dar su primer paso en el mundo de la escritura o ganar exposición a través de nuestra editorial, puede encontrarnos en nuestra bandeja de entrada en:</p>
      <Link href='mailto:eldesenfreno@gmail.com' target='_blank' className='underline my-4 text-xs'>eldesenfreno@gmail.com</Link>
      <p className='text-xs'>Seguimos disponibles para responder cualquier pregunta que pueda tener y, si alguna vez desea discutir sus ideas, recuerde: nuestras puertas están abiertas.</p>
    </div>
  )
}

export default Contact