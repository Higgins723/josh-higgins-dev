import React from 'react'
import type { HeadFC } from 'gatsby'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <>
    {children}
  </>
)

export default Layout

export const Head: HeadFC = () => <link rel='icon' href='/favicon.ico' type='image/x-icon' />
