// src/components/ImageSlider.tsx

import React, { useState } from 'react';

interface ImageSliderProps {
  imageUrls: string[];
  onSelect: (index: number) => void; // Callback function to send selected index to parent
  selectedImage: number; // Current selected image index
}

const ImageSlider: React.FC<ImageSliderProps> = ({ imageUrls, onSelect, selectedImage }) => {
  const imagesPerPage = 5; // Set to display 5 images per page
  const [currentPage, setCurrentPage] = useState(0); // Track the current page

  const totalPages = Math.ceil(imageUrls.length / imagesPerPage); // Calculate total pages

  const handleImageClick = (index: number) => {
    onSelect(index + currentPage * imagesPerPage); // Adjust index based on current page
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const startIndex = currentPage * imagesPerPage; // Calculate start index for current page

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{
          transform: `translateX(-${currentPage * (100 / totalPages)}%)`,
        }}
      >
        {Array.from({ length: totalPages }, (_, pageIndex) => (
          <div key={pageIndex} className="flex gap-2">
            {imageUrls.slice(pageIndex * imagesPerPage, (pageIndex + 1) * imagesPerPage).map((url, index) => {
              const imageIndex = pageIndex * imagesPerPage + index; // Calculate the global index
              return (
                <img
                  key={index}
                  src={url}
                  alt={`Image ${imageIndex + 1}`}
                  onClick={() => handleImageClick(imageIndex)}
                  className={`w-full h-24 object-cover rounded-md cursor-pointer ${
                    selectedImage === imageIndex ? 'border-4 border-blue-500' : ''
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
      {/* <button
        onClick={prevPage}
        disabled={currentPage === 0}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-md shadow-md"
      >
        &lt;
      </button>
      <button
        onClick={nextPage}
        disabled={currentPage === totalPages - 1}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-md shadow-md"
      >
        &gt;
      </button> */}
      <div className="flex justify-center mt-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${
              currentPage === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentPage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
