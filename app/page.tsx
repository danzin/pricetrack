
import Hero from '@/components/Hero'
import Searchbar from '@/components/Searchbar'
import Image from 'next/image'
import { getAllProducts, heroImages } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'
const Home = async () => {
  const allProducts = await getAllProducts();
  const randomImages = await heroImages();


  return (
    <>
      <section className="px-6 md:px-20 py-24 border-2">
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
          <Hero heroImages={randomImages}/>
        </div>
      </section>
      
      <section className='trending-section'>
        <h2 className='section-text'>Trending</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product}/>

          ))}
        </div>
      </section>
    </>
  )
}

export default Home