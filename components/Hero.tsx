"use client"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";

interface HeroImage {
  imgUrl: string;
  alt: string;
}

interface HeroProps {
  heroImages: HeroImage[];
}
const Hero = ({heroImages}: HeroProps ) => {
  return (
    <div className="hero-carousel carausel-white"> 
      <Carousel 
        showThumbs={false}
        autoPlay 
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
      >
        {heroImages.map((image) =>(
          <Image
            src={image.imgUrl} 
            alt={image.alt}
            width={484}
            height={484}
            className="object-contain"
            key={image.alt}
            />
        ))}
      </Carousel>
    </div>
  )
}

export default Hero