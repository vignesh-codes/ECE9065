// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'

export const CardCarousal = () => {
    const slides = [
        { id: 1, content: 'Slide 1', bgColor: 'bg-yellow-50' },
        { id: 2, content: 'Slide 2', bgColor: 'bg-yellow-100' },
        { id: 3, content: 'Slide 3', bgColor: 'bg-yellow-200' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    return (
        <div>{/* Carousel Wrapper */}
            <div className="overflow-hidden relative">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <div
                            key={slide.id}
                            className={`flex-shrink-0 w-full h-60 ${slide.bgColor} rounded-2xl flex justify-center items-center`}
                        >
                            <span className="text-3xl font-semibold text-yellow-600">{slide.content}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                className="absolute left-5 top-1/2 -translate-y-1/2 p-2 border border-solid border-yellow-600 rounded-full hover:bg-yellow-600 group"
                onClick={handlePrev}
            >
                <svg
                    className="h-5 w-5 text-yellow-600 group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                >
                    <path
                        d="M10.0002 11.9999L6 7.99971L10.0025 3.99719"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <button
                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 border border-solid border-yellow-600 rounded-full hover:bg-yellow-600 group"
                onClick={handleNext}
            >
                <svg
                    className="h-5 w-5 text-yellow-600 group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                >
                    <path
                        d="M5.99984 4.00012L10 8.00029L5.99748 12.0028"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-5 gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-yellow-600' : 'bg-yellow-300'
                            }`}
                    ></button>
                ))}
            </div></div>
    )
}
