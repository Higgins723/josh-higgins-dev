import React from 'react'
import type { HeadFC } from 'gatsby'

type LayoutProps = {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className='p-4'>
    {children}
  </div>
)

export default Layout

export const Head: HeadFC = () => <link rel='icon' href='/favicon.ico' type='image/x-icon' />
