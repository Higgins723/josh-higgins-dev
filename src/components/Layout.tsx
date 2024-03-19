import React from 'react'
import { Helmet } from 'react-helmet'

type LayoutProps = {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <>
    <Helmet>
      <link rel='icon' href='/favicon.ico' type='image/x-icon' />
    </Helmet>

    {children}
  </>
)

export default Layout
