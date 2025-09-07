"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CarouselSlide {
  id: string;
  title: string;
  label: string;
  content: {
    title: string;
    subtitle?: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage?: string;
    layout: "full-image" | "split" | "illustration";
  };
}

const slides: CarouselSlide[] = [
  {
    id: "checking-offers",
    title: "Checking Offers",
    label: "Checking Offers",
    content: {
      title: "earn up to $500 with a checking account that gets you.",
      subtitle: "Choose a qualified account and meet requirements.",
      ctaText: "Get Details",
      ctaLink: "/personal/checking/checking-account-bonus-offers.html",
      backgroundImage: "/images/banner-1.jpg",
      layout: "full-image",
    },
  },
  {
    id: "open-account",
    title: "Open an Account",
    label: "Open an Account",
    content: {
      title: "for every financial need, we'll meet you in the moment.",
      ctaText: "Open an Account",
      ctaLink: "/personal/open-an-account.html",
      backgroundImage: "/images/banner-2.jpg",
      layout: "full-image",
    },
  },
  {
    id: "money-market",
    title: "Money Market Savings",
    label: "Money Market Savings",
    content: {
      title: "earn 4.25% interest rate (4.28% blended APY*) for 6 months.",
      subtitle:
        "Rate available with Key Select Money Market Savings® balances of $25,000 to $1,999,999.99 with an increase in total relationship balances or total liquid deposit balance of at least $25,000.",
      ctaText: "Get Details",
      ctaLink: "/personal/promo/savings/mmda.html",
      layout: "split",
    },
  },
];

export default function HeroBannerSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = slides[currentSlide];

  const renderSlideContent = () => {
    const slide = currentSlideData;

    if (slide.content.layout === "split") {
      return (
        <div className="bg-white h-full flex relative">
          {/* Red accent line */}
          <div className="absolute top-0 left-0 w-16 h-1 bg-danger-600"></div>

          <div className="container mx-auto flex h-full">
            {/* Left side - Content */}
            <div className="w-1/2 flex items-center justify-start p-16 pl-20">
              <div className="max-w-lg">
                <h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                  <span className="block">
                    earn <span className="text-primary-600">4.25%</span>{" "}
                    interest rate
                  </span>
                  <span className="block">
                    (<span className="text-primary-600">4.28%</span> blended
                  </span>
                  <span className="block">
                    APY<sup className="text-primary-600">*</sup>) for 6 months.
                  </span>
                </h2>

                <p className="text-gray-700 text-sm mb-8 leading-relaxed">
                  Rate available with Key Select Money Market Savings
                  <sup>®</sup> balances of $25,000 to $1,999,999.99 with an
                  increase in total relationship balances or total liquid
                  deposit balance of at least $25,000.
                </p>

                <Link
                  href={slide.content.ctaLink}
                  className="themeBtn inline-flex items-center gap-2"
                >
                  {slide.content.ctaText}
                  <ArrowRight className="buttonArrow w-5 h-5" />
                  <span></span>
                </Link>
              </div>
            </div>

            {/* Right side - Phone illustration */}
            <div className="w-1/2 flex items-center justify-center relative">
              <div className="relative">
                <svg
                  width="200"
                  height="300"
                  viewBox="0 0 200 300"
                  className="relative z-10"
                >
                  <path
                    d="M60 250 Q50 240 45 220 Q40 200 50 180 Q60 160 80 150 Q100 140 120 150 Q140 160 150 180 Q160 200 155 220 Q150 240 140 250 L140 280 Q140 290 130 290 L70 290 Q60 290 60 280 Z"
                    className="fill-amber-700"
                  />
                </svg>

                <div className="absolute top-8 left-12 w-24 h-40 bg-gray-900 rounded-xl shadow-xl">
                  <div className="absolute top-2 left-2 right-2 bottom-2 bg-white rounded-lg overflow-hidden">
                    <div className="p-3 h-full">
                      <div className="h-1/2 flex items-end justify-center mb-2">
                        <div className="flex items-end space-x-1 h-16">
                          <div className="w-2 h-8 bg-red-500 rounded-t"></div>
                          <div className="w-2 h-12 bg-yellow-500 rounded-t"></div>
                          <div className="w-2 h-16 bg-green-500 rounded-t"></div>
                          <div className="w-2 h-10 bg-blue-500 rounded-t"></div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            $
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Full image layout
    return (
      <div
        className="relative h-full bg-cover  bg-no-repeat flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${slide.content.backgroundImage}')`,
        }}
      >
        {/* Red accent line */}
        <div className="absolute top-0 left-0 w-16 h-1 bg-danger-600"></div>

        <div className="container mx-auto px-8 lg:px-16">
          <div className="max-w-2xl text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {slide.content.title}
            </h2>

            {slide.content.subtitle && (
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                {slide.content.subtitle}
              </p>
            )}

            <Link
              href={slide.content.ctaLink}
              className="themeBtn inline-flex items-center mb-12 gap-2"
            >
              {slide.content.ctaText}
              <ArrowRight className="buttonArrow w-5 h-5" />
              <span></span>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full h-[65dvh] my-[12.5vh] mx-auto">
      <style jsx>{`
        /* Theme Button Styles */
        .themeBtn {
          position: relative;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          background: #e22026;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          font-weight: 600;
          text-transform: uppercase;
          border-radius: 0;
          overflow: hidden;
          z-index: 1;
          transition: all 0.5s ease;
          gap: 10px;
        }

        .themeBtn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #550401;
          z-index: -1;
          transition: transform 0.5s ease;
          transform: scaleX(0);
          transform-origin: right;
        }

        .themeBtn:hover {
          color: #fff;
        }

        .themeBtn:hover::before {
          transform: scaleX(1);
          transform-origin: left;
        }

        .themeBtn span {
          position: relative;
          z-index: 2;
          margin-left: 10px;
        }

        .buttonArrow {
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease;
        }

        .themeBtn:hover .buttonArrow {
          transform: translateX(5px);
        }
      `}</style>

      <div
        className="relative w-full h-full"
        role="group"
        aria-live="polite"
        aria-roledescription="carousel"
      >
        {/* Carousel Content */}
        <div className="relative overflow-hidden h-full">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="w-full flex-shrink-0 h-full"
                role="tabpanel"
                aria-label={`Slide ${index + 1} of ${slides.length}`}
                aria-roledescription="slide"
                tabIndex={currentSlide === index ? 0 : -1}
              >
                {renderSlideContent()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Indicators - Positioned at bottom */}
      <div className="flex flex-col lg:flex-row">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`flex-1 border-b-[1px] lg:border-r-[1px] lg:border-b-0 border-white px-8 py-10 cursor-pointer text-sm font-medium transition-all duration-200 relative ${
              currentSlide === index
                ? "text-white bg-primary-600 text-lg"
                : "text-gray-700 bg-primary-600/40 hover:bg-primary-600 hover:text-white"
            }`}
            aria-label={slide.label}
            role="tab"
            aria-selected={currentSlide === index}
            aria-current={currentSlide === index ? "true" : undefined}
          >
            <span className="relative z-10">{slide.label}</span>
            {currentSlide === index && (
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-danger-800"></div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
