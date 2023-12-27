import Image from 'next/image';
import React from 'react'

interface PIProps {
  title: string;
  iconSrc: string;
  value: string;
}

const PriceInfoCard = ({title, iconSrc, value}: PIProps) => {
  //Round the value to 3 decimal places
  const formattedValue = parseFloat(value).toFixed(3); 
  
  return (
    <div className={`price-info_card`}>
      <p className='text-base text-black-100'>{title}</p>
      <div className='flex gap-1'>
        <Image src={iconSrc} alt={title} width={24} height={24}/>
        <p className='text-xl font-bold text-secondary'>{formattedValue}лв</p>
      </div>
    </div>
  )
}

export default PriceInfoCard