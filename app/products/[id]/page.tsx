import React from 'react'
import { getProductById } from '@/lib/actions'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/intex'
type Props = {
  params: { id: string }
}

const ProductDetails = async ( {params: {id}} : Props) => {
  const product: Product = await getProductById(id);
  if(!product) redirect('/');

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
                {/* <p className='text-base font-semibold text-[#D46F88]'>{product.reviews}</p> */}
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
                {/* <p className='text-sm text-primary-orange font-semibold'>{product.stars  || 5}</p> */}
              </div>

              <div className='product-reviews'>
                <Image 
                  src='/assets/icons/comment.svg'
                  alt='comment'
                  width={16}
                  height={16}
                />
                {/* <p className='text-sm text-secondary font-semibold'>{product.reviewsCount}</p> */}
              </div>
            </div>
          
          </div>
        
        </div>

      </div>

      </div>
    </div>
  )
}

export default ProductDetails