'use client'

import { useSidebar } from '../context/SidebarContext'

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()

  return (
    <main
      className={`md:mt-[72px] md:flex-1 transition-all duration-300 ${
        isOpen ? 'md:ml-[clamp(300px,calc(25vw+22px),400px)] md:px-6' : 'md:ml-0 md:pl-[50px] md:pr-4'
      }`}
    >
      {children}
    </main>
  )
}
