import * as React from 'react'
import { Link, type HeadFC, type PageProps } from 'gatsby'
import Layout from '../components/Layout'

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <div className='flex items-center justify-center w-screen h-screen bg-gray-100 px-4 sm:px-6 lg:px-8'>
        <div className='px-6 py-10 bg-white rounded-md shadow-xl sm:px-10'>
          <div className='flex flex-col items-center'>
            <h1 className='font-bold text-blue-600 text-7xl sm:text-9xl'>404</h1>
            <h6 className='mb-2 text-xl font-bold text-center text-gray-800 sm:text-2xl md:text-3xl'>
              <span className='text-red-500'>Oops!</span> Page not found
            </h6>
            <p className='mb-8 text-center text-gray-500 md:text-lg'>
              The page you’re looking for doesn’t exist.
            </p>
            <Link to='/' className='px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100'>Go home</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
