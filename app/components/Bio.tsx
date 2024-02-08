import Image from 'next/image'
import React from 'react'

const Bio = () => {
  return (
    <div className='flex flex-col px-2 ml-24'>
        <Image src="/photo.jpg" alt='El Desenfreno Ediciones' width={300} height={350} className='pt-4'/> 
        <p className='text-sm font-neue-display leading-6 italic -tracking-wide'>El Desenfreno se expande en busca de rincones donde la poesía pueda ser alojada: una editorial, un ciclo, un desparramo de fuerzas. Un nicho en el que resistir. En busca de expresiones que nos convoquen y comulguen para encontrar una nueva forma dentro de lo poético. En tiempos donde incluso la palabra es tomada por el mercado, es necesario resaltar las singularidades, el empuje subversivo que cada discurso alcanza corriéndose de cualquier lógica imperante. El desenfreno persigue la tensión, el sonido de un vidrio roto, la presencia de imágenes y escrituras del vértigo.</p>
    </div>
  )
}

export default Bio