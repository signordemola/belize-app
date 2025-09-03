"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./HeroBanner.module.css";

const slides = [
  {
    id: 1,
    bgImage: "/images/banner-1.jpg",
    patternImage: "/images/shape-1.png",
    category: "Flexi Savings",
    rate: "Earn up to 2.5% APY",
    title: "Enjoy zero free banking on your sb account.",
    buttonText: "Book a Consultation",
    href: "/service-details",
  },
  {
    id: 2,
    bgImage: "/images/banner-2.jpg",
    patternImage: "/images/shape-1.png",
    category: "Business Loan",
    rate: "From 8.5% APR",
    title: "Fuel your business growth with our easy loan",
    buttonText: "Apply Your Loan",
    href: "/loans-1",
  },
  {
    id: 3,
    bgImage: "/images/banner-3.jpg",
    patternImage: "/images/shape-1.png",
    category: "Credit Card",
    rate: "Enjoy 0% Annual Fee",
    title: "Maximize benefits with your every transaction",
    buttonText: "Apply Your Card",
    href: "/cards",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <section
      className={styles.bannerSection}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slideItem} ${
              currentSlide === index ? styles.active : ""
            }`}
            style={{
              opacity: currentSlide === index ? 1 : 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              transition: "opacity 1000ms ease-in-out",
            }}
          >
            {/* Background Layer */}
            <div
              className={`${styles.bgLayer} ${
                currentSlide === index ? styles.bgLayerActive : ""
              }`}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                backgroundImage: `url(${slide.bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Pattern Layer */}
            <div
              className={styles.patternLayer}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                backgroundImage: `url(${slide.patternImage})`,
                backgroundRepeat: "repeat",
              }}
            />

            {/* Content */}
            <div className={styles.outerContainer}>
              <div className={styles.contentBox}>
                <h5
                  className={`${styles.contentH5} ${
                    currentSlide === index ? styles.contentActive : ""
                  }`}
                >
                  <span className={styles.categorySpan}>{slide.category}</span>
                  {slide.rate}
                </h5>
                <h2
                  className={`${styles.contentH2} ${
                    currentSlide === index ? styles.contentActive : ""
                  }`}
                >
                  {slide.title}
                </h2>
                <div
                  className={`${styles.btnBox} ${
                    currentSlide === index ? styles.contentActive : ""
                  }`}
                >
                  <Link href={slide.href} className={styles.themeBtn}>
                    <span>{slide.buttonText}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation and Dots */}
      <div className={styles.owlNav}>
        <button
          onClick={prevSlide}
          className={styles.owlPrev}
          aria-label="Previous Slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className={styles.owlDots}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.owlDot} ${
                currentSlide === index ? styles.active : ""
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className={styles.owlNext}
          aria-label="Next Slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
