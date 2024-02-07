import './globals.css'
import localFont from 'next/font/local';
import Menu from './components/Menu'
import Dropdown from './components/Dropdown'
import Bio from './components/Bio'

const aggie = localFont({
  src: [
    {
      path: '../public/fonts/Aggie-Regular.otf',
      weight: '400',
    }
  ],
  variable: '--font-aggie'
});


export const metadata = {
  stylesheet: 'https://use.typekit.net/maa8yuy.css',
  title: 'El Desenfreno Ediciones',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <main className='max-w-full max-h-screen md:flex md:flex-col md:ml-4 md:py-2'>
        <div className='w-full hidden md:block fixed top-0 border-b-[1px]'>
          <Menu/>    
        </div>
        <div className='flex flex-col md:hidden'>
          <h5 className={`${aggie.className} 'border border-b-white border-x-0 border-t-0 text-center text-xl'`}>
            EL DESENFRENO EDICIONES
          </h5>
          <Dropdown/>
        </div>
        <div className='flex mr-4'>
        <div className='md:flex fixed z-10 top-8 left-4'>
          <div className='md:w-1/4 h-screen md:flex hidden md:visible  border-l-[1px]'>
          <div className='w-48'>MARQUEE</div>
              {/* <MarqueeTitle/> */}
            <Bio/>
          </div>
          </div>
          <div className='md:w-3/4 md:ml-[30rem] md:mt-8 font-neue-haas-grotesk'>{children}</div>
        </div>
        </main>
      </body>
    </html>
  )
}
