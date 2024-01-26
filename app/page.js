import Image from 'next/image'
import EdItem from './components/EdItem'
import editions from './editions'
import Menu from './components/Menu'

export default function Home() {
  return (
    <main className="w-full md:flex">
      <Menu/>
      <div className='flex flex-col'>
      <h5 className='uppercase ml-2'>Novedades</h5>
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
