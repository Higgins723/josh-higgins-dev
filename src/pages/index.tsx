import React, { useState } from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import Layout from '../components/Layout'
import MatrixIntro from '../components/MatrixIntro'

const IndexPage: React.FC<PageProps> = () => {
  const [showMain, setShowMain] = useState(false)

  return (
    <Layout>
      <main>
        {showMain ? (
          <div>Hello World</div>
        ): (
          <MatrixIntro continueBtn={() => setShowMain(true)} />
        )}
      </main>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Josh Higgins - Developer</title>
