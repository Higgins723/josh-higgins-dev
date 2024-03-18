import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main>
      Future home of my portfolio
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Josh Higgins - Developer</title>
