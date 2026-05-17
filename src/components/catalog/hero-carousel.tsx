"use client";

import { useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { FiPlay, FiChevronRight, FiChevronLeft, FiFilm, FiTv, FiCamera } from "react-icons/fi";
import { CatalogTitle } from "@/lib/catalog";

interface HeroCarouselProps {
  titles: CatalogTitle[];
}

export function HeroCarousel({ titles }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: titles.length > 1,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    cssEase: "linear",
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-12">
        <ul className="flex items-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <button
        className={`h-1.5 transition-all duration-300 ${
          i === currentSlide ? "w-8 bg-amber" : "w-4 bg-zinc-600"
        }`}
      >
        <span className="sr-only">Go to slide {i + 1}</span>
      </button>
    ),
    prevArrow: (
      <button className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/60 md:left-8">
        <FiChevronLeft className="h-6 w-6" />
      </button>
    ),
    nextArrow: (
      <button className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/60 md:right-8">
        <FiChevronRight className="h-6 w-6" />
      </button>
    ),
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      <Slider {...settings}>
        {titles.map((title, index) => (
          <div key={title.id} className="relative h-[85vh] min-h-[600px]">
            {/* Backdrop */}
            {title.backdropUrl ? (
              <Image
                src={title.backdropUrl}
                alt=""
                fill
                className="object-cover"
                priority={index === 0}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.15_0.02_45)] via-[oklch(0.1_0.005_45)] to-[oklch(0.08_0.01_85)]" />
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.1_0.005_45)] via-[oklch(0.1_0.005_45)]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[oklch(0.1_0.005_45)] to-transparent" />
            <div className="absolute inset-0 film-grain" />

            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
              <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
                <div className="max-w-2xl">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-sm bg-amber/20 px-2 py-0.5 text-xs font-medium uppercase tracking-widest text-amber">
                      Featured
                    </span>
                    <span className="text-xs uppercase tracking-widest text-zinc-500">
                      {title.type === "MOVIE" ? "Film" : title.type === "SERIES" ? "Series" : "Documentary"}
                    </span>
                  </div>

                  <h1 className="text-5xl font-heading uppercase leading-[0.9] tracking-wider text-white md:text-7xl lg:text-8xl">
                    {title.title}
                  </h1>

                  <div className="mt-4 flex items-center gap-3 text-sm text-zinc-400">
                    {title.releaseYear && <span>{title.releaseYear}</span>}
                    {title.rating && (
                      <>
                        <span className="text-zinc-600">/</span>
                        <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs">{title.rating}</span>
                      </>
                    )}
                    {title.duration && (
                      <>
                        <span className="text-zinc-600">/</span>
                        <span>{Math.floor(title.duration / 60)}h {title.duration % 60}m</span>
                      </>
                    )}
                  </div>

                  {title.synopsis && (
                    <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-300">
                      {title.synopsis.length > 200
                        ? `${title.synopsis.slice(0, 200)}...`
                        : title.synopsis}
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href={`/watch/${title.id}`}
                      className="group flex items-center gap-2 rounded-sm bg-amber px-6 py-3 text-sm font-medium uppercase tracking-wider text-[oklch(0.1_0.005_45)] transition-all hover:bg-amber/90 hover:shadow-[0_0_30px_rgba(200,155,60,0.3)]"
                    >
                      <FiPlay className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
                      Watch Now
                    </Link>
                    <Link
                      href={`/title/${title.id}`}
                      className="flex items-center gap-2 rounded-sm border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-zinc-600 hover:bg-zinc-800/50"
                    >
                      Details
                      <FiChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
