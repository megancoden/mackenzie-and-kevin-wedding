'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Replace these with your actual photo paths and captions
  const photos = [
    {
      src: '/images/2018-04-28.JPG',
      alt: 'Photo 1',
      caption: 'Our first photo together',
      date: '04/28/2018'
    },
    {
      src: '/images/2019-05-13.JPG',
      alt: 'Photo 2',
      caption: 'A cooking class together',
      date: '05/13/2019'
    },
    {
      src: '/images/2020-07-09.JPG',
      alt: 'Photo 3',
      caption: 'A trip to montana',
      date: '07/09/2020'
    },
    {
      src: '/images/2020-07-15.JPG',
      alt: 'Photo 4',
      caption: 'Montana adventures',
      date: '07/15/2020'
    },
    {
      src: '/images/2021-03-14.JPG',
      alt: 'Photo 5',
      caption: 'Enjoying new haven pizza on pi day 2021',
      date: '03/14/2021'
    },
    {
      src: '/images/2021-05-15.JPEG',
      alt: 'Photo 6',
      caption: 'We love hiking together',
      date: '05/15/2021'
    },
    {
      src: '/images/2021-07-23.JPEG',
      alt: 'Photo 7',
      caption: 'More views',
      date: '07/23/2021'
    },
    {
      src: '/images/2022-09-26.JPG',
      alt: 'Photo 8',
      caption: 'Macchu piccu trip 2022',
      date: '09/26/2022'
    },
    {
      src: '/images/2023-09-19.jpeg',
      alt: 'Photo 9',
      caption: 'Enjoying some lobster in Maine ',
      date: '09/19/2023'
    },
    {
      src: '/images/2024-02-17.JPEG',
      alt: 'Photo 10',
      caption: 'Hiking with our new dog Roger!',
      date: '02/17/2024'
    },
    {
      src: '/images/2024-12-21.JPEG',
      alt: 'Photo 11',
      caption: '12/21/24: Roger bringing me an engagement ring!',
      date: '12/21/2024'
    },
    {
      src: '/images/2024-12-21-2.JPEG',
      alt: 'Photo 12',
      caption: 'Celebrating our engagement with Roger',
      date: '12/21/2024'
    },
    {
      src: '/images/2025-04-05.JPG',
      alt: 'Photo 13',
      caption: 'Adventures',
      date: '04/05/2025'
    }, 
    {
      src: '/images/IMG_0473.JPG',
      alt: 'Photo 14',
      caption: 'Enjoying our engagement',
      date: '08/18/2025'
    }, 
    {
      src: '/images/IMG_0503.JPG',
      alt: 'Photo 15',
      caption: 'Enjoying our engagement',
      date: '08/18/2025'
    }, 
    {
      src: '/images/IMG_0512.JPG',
      alt: 'Photo 16',
      caption: 'Enjoying our engagement',
      date: '08/18/2025'
    }, 
    {
      src: '/images/IMG_0530.JPG',
      alt: 'Photo 17',
      caption: 'Enjoying our engagement',
      date: '08/18/2025'
    },
    {
      src: '/images/IMG_0514.JPG',
      alt: 'Photo 18',
      caption: 'Enjoying our engagement',
      date: '08/18/2025'
    },
    {
      src: '/images/IMG_0562.JPG',
      alt: 'Photo 19',
      caption: 'Enjoying our engagement',
      date: '08/18/2025'
    }, 
    {
      src: '/images/IMG_1195.jpeg',
      alt: 'Photo 20',
      caption: 'Enjoying our engagement',
      date: '08/18/2025'
    }, 
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6 my-8">
      <h2 className="header-title mb-4 flex justify-center">Our history</h2>
      
      <div className="relative">
        <div className="relative h-96 overflow-hidden rounded-lg">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-300 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-contain"
                priority={index < 3} // Prioritize first 3 images
              />
              {/* Date overlay - inside each image container */}
              {index === currentIndex && photo.date && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm z-10">
                  {photo.date}
                </div>
              )}
            </div>
          ))}


          
          
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition z-10"
            aria-label="Previous photo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition z-10"
            aria-label="Next photo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Caption */}
        <div className="text-center mt-4 mb-4">
          <p className="text-lg text-gray-700 italic">
            {photos[currentIndex].caption}
          </p>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentIndex
                  ? 'bg-gray-800'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* <div className="hidden">
  <Image
    src={photos[(currentIndex + 1) % photos.length].src}
    alt="preload next"
    width={800}
    height={600}
  />
  <Image
    src={photos[(currentIndex - 1 + photos.length) % photos.length].src}
    alt="preload previous"
    width={800}
    height={600}
  />
</div> */}
    </div>
  );
}