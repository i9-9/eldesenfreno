import Image from 'next/image'
import React from 'react'

const Bio = () => {
  return (
    <div className='flex flex-col px-2 ml-24 '>
        <Image
          src="/photo.png"
          alt='El Desenfreno Ediciones'
          width={300}
          height={350}
          sizes="300px"
          className='pt-4'
        /> 
        <div>
          <p className=' text-white text-xs font-neue-display leading-6 italic -tracking-wide mt-2 p-2 transition-all duration-300 drop-shadow	 opacity-80 rounded-md'>
            <span className='font-semibold'>
            El Desenfreno
              </span> se expande en busca de rincones donde la poesía pueda ser alojada: una editorial, un ciclo, un desparramo de fuerzas. Un nicho en el que resistir. En busca de expresiones que nos convoquen y comulguen para encontrar una nueva forma dentro de lo poético. En tiempos donde incluso la palabra es tomada por el mercado, es necesario resaltar las singularidades, el empuje subversivo que cada discurso alcanza corriéndose de cualquier lógica imperante. El desenfreno persigue la tensión, el sonido de un vidrio roto, la presencia de imágenes y escrituras del vértigo.</p>
        </div>

        {/* Instagram Button */}
        <div className="mt-8 px-2">
          <a 
            href="https://www.instagram.com/eldesenfreno.ediciones/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 p-3 bg-[#2C2C2C] hover:bg-gray-400 text-white text-xs font-neue-display font-medium transition-all duration-300 drop-shadow opacity-80 hover:opacity-100 rounded-md border border-[#666666] border-opacity-20"
          >
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            
          </a>
        </div>

    </div>
  )
}

export default Bio