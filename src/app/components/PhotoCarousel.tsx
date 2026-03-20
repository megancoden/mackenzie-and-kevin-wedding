'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const MIN_SWIPE = 50;

  const photos = [
    { src: '/images/2018-04-28.JPG', alt: 'Photo 1', caption: 'Our first photo together', date: '04/28/2018' },
    { src: '/images/2019-05-13.JPG', alt: 'Photo 2', caption: 'Mastering some culinary skills in Chicago', date: '05/13/2019' },
    { src: '/images/2020-07-09.JPG', alt: 'Photo 3', caption: 'Mountain biking in Glacier National Park', date: '07/09/2020' },
    { src: '/images/2020-07-15.JPG', alt: 'Photo 4', caption: 'Big Sky adventures', date: '07/15/2020' },
    { src: '/images/2021-03-14.JPG', alt: 'Photo 5', caption: 'We love New Haven style pizza', date: '03/14/2021' },
    { src: '/images/2021-05-15.JPEG', alt: 'Photo 6', caption: "Enjoying Connecticut's natural beauty", date: '05/15/2021' },
    { src: '/images/2021-07-23.JPEG', alt: 'Photo 7', caption: 'Exploring the Biltmore Estate', date: '07/23/2021' },
    { src: '/images/2022-09-26.JPG', alt: 'Photo 8', caption: 'Scenic views on the Inca Trail', date: '09/26/2022' },
    { src: '/images/2024-02-17.JPEG', alt: 'Photo 9', caption: "Roger's first family hike", date: '02/17/2024' },
    { src: '/images/2024-12-21.JPEG', alt: 'Photo 10', caption: 'Kevin enlisted some help from Roger with the proposal', date: '12/21/2024' },
    { src: '/images/2024-12-21-2.JPEG', alt: 'Photo 11', caption: 'Celebrating our engagement with Roger', date: '12/21/2024' },
    { src: '/images/IMG_0473.JPG', alt: 'Photo 12', caption: 'Enjoying our engagement', date: '08/18/2025' },
    { src: '/images/IMG_0503.JPG', alt: 'Photo 13', caption: 'Enjoying our engagement', date: '08/18/2025' },
    { src: '/images/IMG_0512.JPG', alt: 'Photo 14', caption: 'Enjoying our engagement', date: '08/18/2025' },
    { src: '/images/IMG_0530.JPG', alt: 'Photo 15', caption: 'Enjoying our engagement', date: '08/18/2025' },
    { src: '/images/IMG_0514.JPG', alt: 'Photo 16', caption: 'Enjoying our engagement', date: '08/18/2025' },
    { src: '/images/IMG_0562.JPG', alt: 'Photo 17', caption: 'Enjoying our engagement', date: '08/18/2025' },
    { src: '/images/IMG_1195.jpeg', alt: 'Photo 18', caption: 'Enjoying our engagement', date: '08/18/2025' },
  ];

  const goToPrevious = () =>
    setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1));

  const goToNext = () =>
    setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) >= MIN_SWIPE) {
      delta > 0 ? goToNext() : goToPrevious();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full bg-[#f2f5f3] rounded-2xl shadow-md p-6 sm:p-8 my-8">

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="header-title">Our History</h2>
        <div className="flex items-center gap-3 mt-3 mx-auto max-w-xs">
          <div className="flex-1 h-px bg-[var(--wedding-secondary-dark)]/20" />
          <span className="text-[var(--wedding-secondary-dark)]/30 text-xs">✦          <div className="min-h-screen py-12 px-4 pt-[96px] mt-8 background">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
              {/* ... */}
            </div>
          </div></span>
          <div className="flex-1 h-px bg-[var(--wedding-secondary-dark)]/20" />
        </div>
      </div>

      {/* Image area */}
      <div
        className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-[#f2f5f3] select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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
              priority={index < 3}
            />
          </div>
        ))}

        {/* Prev button */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#f2f5f3]/80 hover:bg-[#f2f5f3] p-2 rounded-full shadow-md transition z-10"
          aria-label="Previous photo"
        >
          <svg className="w-5 h-5 text-[var(--wedding-secondary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#f2f5f3]/80 hover:bg-[#f2f5f3] p-2 rounded-full shadow-md transition z-10"
          aria-label="Next photo"
        >
          <svg className="w-5 h-5 text-[var(--wedding-secondary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Counter badge */}
        <div className="absolute bottom-3 right-3 bg-black/30 text-white casual-font text-xs px-2 py-1 rounded-full z-10">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Caption & date */}
      <div className="text-center mt-5 space-y-1 min-h-[3rem]">
        <p className="casual-font italic text-[var(--wedding-secondary-dark)] text-base sm:text-lg">
          {photos[currentIndex].caption}
        </p>
        <p className="casual-font text-xs text-[var(--wedding-secondary-dark)]/50 tracking-widest">
          {photos[currentIndex].date}
        </p>
      </div>

      {/* Dot navigation */}
      <div className="flex justify-center flex-wrap gap-2 mt-5">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'w-4 h-2.5 bg-[var(--wedding-secondary-dark)]'
                : 'w-2.5 h-2.5 bg-[var(--wedding-secondary-dark)]/25 hover:bg-[var(--wedding-secondary-dark)]/50'
            }`}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile swipe hint */}
      <p className="text-center casual-font text-xs text-[var(--wedding-secondary-dark)]/30 mt-3 sm:hidden">
        swipe to browse
      </p>
    </div>
  );
}