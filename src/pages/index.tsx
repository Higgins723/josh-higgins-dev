import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import Layout from '../components/Layout'

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <main>
        Future home of my portfolio
      </main>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Josh Higgins - Developer</title>
