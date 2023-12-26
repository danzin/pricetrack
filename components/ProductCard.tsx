import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface PCProps {
  product: Product;
}
const ProductCard = ({product}: PCProps) => {

  return (
    <Link className='product-card' href={`/products/${product._id}`}>
      <div className='product-card_img-container'>
        <Image 
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className='product-card-img'
        />
      </div>

      <div className='flex flex-col gap-1'>
        <h3 className='product-title'>{product.name}</h3>
        <p className='text-black opacity-70'>
          {product.productCode || ''}
        </p>
      </div>
   
      <div className='flex justify-between'>
        <p className='text-black opacity-50'>{product.category}</p>
      </div>

      <p>
        <span>{product.currentPrice}лв
        </span>
      </p>
    </Link>
  )
}

export default ProductCard