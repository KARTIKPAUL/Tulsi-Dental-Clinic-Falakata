import React, { useState, useEffect, useRef } from "react";

// Sample images for the carousel
import carouselImage1 from "../../../../assets/image/banner-1.png";
import carouselImage2 from "../../../../assets/image/banner-2.png";


export default function Carousel() {
  const images = [
    carouselImage1,
    carouselImage2,

  ];

  // Extend images by adding clones of the first and last images
  const extendedImages = [
    images[images.length - 1],
    ...images,
    images[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 due to the clone at the beginning
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slidesRef = useRef(null);

  // Function to calculate the actual index for indicators
  const getRealIndex = () => {
    if (currentIndex === 0) {
      return images.length - 1;
    } else if (currentIndex === extendedImages.length - 1) {
      return 0;
    } else {
      return currentIndex - 1;
    }
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  });

  // Function to move to the next slide
  const nextSlide = () => {
    if (isTransitioning) return;
    setCurrentIndex(currentIndex + 1);
    setIsTransitioning(true);
  };

  // Function to move to the previous slide
  const prevSlide = () => {
    if (isTransitioning) return;
    setCurrentIndex(currentIndex - 1);
    setIsTransitioning(true);
  };

  // Handle transition end to create infinite effect
  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    if (currentIndex === extendedImages.length - 1) {
      // Jump back to the real first image
      setCurrentIndex(1);
      slidesRef.current.style.transition = "none";
      slidesRef.current.style.transform = `translateX(-${100}%)`;
      // Force reflow
      void slidesRef.current.offsetWidth;
      slidesRef.current.style.transition = "transform 1s ease-in-out";
    } else if (currentIndex === 0) {
      // Jump to the real last image
      setCurrentIndex(extendedImages.length - 2);
      slidesRef.current.style.transition = "none";
      slidesRef.current.style.transform = `translateX(-${
        (extendedImages.length - 2) * 100
      }%)`;
      // Force reflow
      void slidesRef.current.offsetWidth;
      slidesRef.current.style.transition = "transform 1s ease-in-out";
    }
  };

  // Update transform style on currentIndex change
  useEffect(() => {
    slidesRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
  }, [currentIndex]);

  return (
    <div className="relative w-full">
      {/* Carousel Wrapper */}
      <div className="relative   overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          ref={slidesRef}
          onTransitionEnd={handleTransitionEnd}
          style={{
            willChange: "transform",
          }}
        >
          {extendedImages.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full">
              <img
                src={image}
                alt={`Carousel Image ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev and Next buttons */}
      {/* <button
        onClick={prevSlide}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 z-30 bg-white/50 p-3 rounded-full focus:outline-none hover:bg-white/70"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 z-30 bg-white/50 p-3 rounded-full focus:outline-none hover:bg-white/70"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button> */}

      {/* Indicators */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isTransitioning) return;
              setCurrentIndex(index + 1); // Adjust for extendedImages offset
              setIsTransitioning(true);
            }}
            className={`w-1 h-1 md:w-2 md:h-2 rounded-full ${
              getRealIndex() === index ? "bg-blue-600" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
