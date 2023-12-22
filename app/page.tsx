import Hero from '@/components/Hero'
import Searchbar from '@/components/Searchbar'
import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <>
      <section className="px-6 md:px-20 py-24 border-2 border-red-500">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className='small-text'>
              Price History Of Products:
              <Image 
                src="/assets/icons/arrow-right.svg"
                alt="arrow"
                width={16}
                height={16}
                />
            </p>
            <h1 className='head-text'>
              Start Using 
              <span className='text-primary-green'> PriceCatch</span>
            </h1>
            <p className='mt-6'>
            Stay in the loop by keeping track of prices of select products
            </p>
            <Searchbar/>
          </div>
          <Hero/>
        </div>
      </section>
      
      <section className='trending-section'>
        <h2 className='section-text'>Trending</h2>
        <div className="flex"></div>
      </section>
    </>
  )
}

export default Home