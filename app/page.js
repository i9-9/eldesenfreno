import Image from 'next/image'
import EdItem from './components/EdItem'
import editions from './editions'
import Menu from './components/Menu'
import MarqueeTitle from './components/MarqueeTitle'

export default function Home() {
  
  return (
    <main className="w-full md:flex">
      <MarqueeTitle/>
      <Menu/>
      <div className='flex flex-col'>
      <h5 className='uppercase ml-2 font-neue-haas-grotesk font-xl font-extrabold border border-t-white border-b-0 border-x-0 mt-4 pt-1'>Novedades</h5>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
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
