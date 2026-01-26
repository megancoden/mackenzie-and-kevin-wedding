'use client';

import { useState } from 'react';

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Replace these with your actual photo paths and captions
  const photos = [
    {
      src: '/images/2018-04-28.JPG',
      alt: 'Photo 1',
      caption: 'Our first photo together'
    },
    {
      src: '/images/2019-05-13.JPG',
      alt: 'Photo 2',
      caption: 'A cooking class together'
    },
    {
      src: '/images/2020-07-09.JPG',
      alt: 'Photo 3',
      caption: 'The proposal moment'
    },
    {
      src: '/images/2020-07-15.JPG',
      alt: 'Photo 4',
      caption: 'A trip to montana'
    },
    {
      src: '/images/2021-03-14.JPG',
      alt: 'Photo 1',
      caption: 'Montana adventures'
    },
    {
      src: '/images/2021-05-15.JPEG',
      alt: 'Photo 2',
      caption: 'Enjoying new haven pizza on pi day 2021'
    },
    {
      src: '/images/2021-07-23-2.JPEG',
      alt: 'Photo 3',
      caption: 'The proposal moment'
    },
    {
      src: '/images/2021-07-23.JPEG',
      alt: 'Photo 4',
      caption: 'Celebrating our engagement'
    },
    {
      src: '/images/2022-09-26.JPG',
      alt: 'Photo 1',
      caption: 'Macchu piccu trip 2022'
    },
    {
      src: '/images/2022-09-27.jpeg',
      alt: 'Photo 2',
      caption: 'Another day in macchu piccu'
    },
    {
      src: '/images/2023-09-19.jpeg',
      alt: 'Photo 3',
      caption: 'Enjoying some lobster in maine 2023'
    },
    {
      src: '/images/2024-02-17.JPEG',
      alt: 'Photo 4',
      caption: 'Hiking with our new dog Roger!'
    },
    {
      src: '/images/2024-12-21.JPEG',
      alt: 'Photo 1',
      caption: '12/21/24: Roger bringing me an engagement ring!'
    },
    {
      src: '/images/2024-12-21-2.JPEG',
      alt: 'Photo 2',
      caption: 'Celebrating our engagement with Roger'
    },
    {
      src: '/images/2026-01-05-2.JPG',
      alt: 'Photo 3',
      caption: 'Florida'
    },
    {
      src: '/images/2026-01-05.JPG',
      alt: 'Photo 4',
      caption: 'Adventures'
    }
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

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 my-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Our Story</h2>
      
      <div className="relative">
        {/* Main Image */}
        <div className="relative h-96 overflow-hidden rounded-lg">
          <img
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
            aria-label="Previous photo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
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
    </div>
  );
}