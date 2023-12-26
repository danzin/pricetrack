import React from 'react'
import { getProductById, getSimilar } from '@/lib/actions'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import PriceInfoCard from '@/components/PriceInfoCard'
import ProductCard from '@/components/ProductCard'
import Modal from '@/components/Modal'
type Props = {
  params: { id: string }
}

const ProductDetails = async ( {params: {id}} : Props) => {
  const product: Product = await getProductById(id);
  if(!product) redirect('/');

  const similarProducts = await getSimilar(id)
  return (
    <div className='product-container'>
      
      <div className='flex xl:flex-row flex-col gap-28'>

        <div className='product-image'>
          <Image 
            src={product.imageUrl}
            alt={product.name}
            width={580}
            height={200}
            className='mx-auto'
            />
        </div>

        <div className="flex-1 flex flex-col">
          <div className='flex justify-betweren items-start gap-5 flex-wrap pb-6'>
              <div className='flex flex-col gap-3'>
                <p className='text-[28px] text-secondary font-semibold'>{product.name}</p>
                <Link href={product.url} target='_blank' className='text-base text-black opacity-60'>
                  Visit Product Page
                </Link>
              </div>

              <div className='flex items-center gap-3'>
                <div className='product-hearts'>
                  <Image 
                    src='/assets/icons/red-heart.svg'
                    alt='heart'
                    width={20}
                    height={20}
                  />
                  {/* <p className='text-base font-semibold text-[#D46F88]'></p> */}
                </div>
              <div className='p-2 bg-white-200 rounded-10'>
                <Image 
                  src='/assets/icons/bookmark.svg'
                  alt='bookmark'
                  width={20}
                  height={20}
                />
              </div>
              <div className='p-2 bg-white-200 rounded-10'>
                <Image 
                  src='/assets/icons/share.svg'
                  alt='share'
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>

            <div className='product-info'>
              <div className='flex-flex-col gap-2'>
                <p className='text-34 text-secondary font-bold'>
                  {product.currentPrice}лв
                </p>
              </div>

              <div className='flex flex-col gap-4'>
                <div className='flex gap-3'>
                  <div className='product-stars'>
                    <Image 
                      src='/assets/icons/star.svg'
                      alt='star'
                      width={16}
                      height={16}
                    />
                    <p className='text-sm text-primary-orange font-semibold'>{product.starRating}</p>
                  </div>

                  <div className='product-reviews'>
                    <Image 
                      src='/assets/icons/comment.svg'
                      alt='comment'
                      width={16}
                      height={16}
                    />
                    <p className='text-sm text-secondary font-semibold'>{product.reviewsCount}</p>
                  </div>           
                </div>
              </div> 

            </div>
            <div className='my-7 flex flex-col gap-5'>
                <div className='flex gap-5 flex-wrap'>
                  <PriceInfoCard 
                  title='Current price'
                  iconSrc='/assets/icons/price-tag.svg'
                  value={`${product.currentPrice}лв`}
                  />
                  <PriceInfoCard 
                  title='Average price'
                  iconSrc='/assets/icons/chart.svg'
                  value={`${product.averagePrice}лв`}
                  />
                  <PriceInfoCard 
                  title='Highest price'
                  iconSrc='/assets/icons/arrow-up.svg'
                  value={`${product.highestPrice}лв`}
                  />
                  <PriceInfoCard 
                  title='Lowest price'
                  iconSrc='/assets/icons/arrow-down.svg'
                  value={`${product.lowestPrice}лв`}
                  />
                </div>
            </div>

            <Modal productId={id}/>
        </div>
      </div>

      <div className='flex flex-col gap-16'>

          <div className='flex flex-col gap-5'>
            <h3 className='text-2xl text-secondary font-semibold'>Product Description</h3>
            <div className='flex flex-col gap-4'>
              <p>{product.description}</p>
            </div>
          </div>

      </div>

      {similarProducts && similarProducts?.length > 0 && (
        <div className='py-14 flex flex-col gap-2 w-full'>
          <p className='section-text'>Similar Products</p>
          <div className='flex flex-wrap gap-10 mt-7 w-full'>
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product}/>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails