"use client";

import Slider from "react-slick";
import { TitleCard } from "./title-card";
import { CatalogTitle } from "@/lib/catalog";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CategoryRowProps {
  category: string;
  titles: CatalogTitle[];
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute -left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800 hover:text-amber group-hover:opacity-100"
      aria-label="Previous"
    >
      <FiChevronLeft className="h-5 w-5" />
    </button>
  );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute -right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800 hover:text-amber group-hover:opacity-100"
      aria-label="Next"
    >
      <FiChevronRight className="h-5 w-5" />
    </button>
  );
}

export function CategoryRow({ category, titles }: CategoryRowProps) {
  if (titles.length === 0) return null;

  const settings = {
    dots: false,
    infinite: titles.length > 6,
    speed: 500,
    slidesToShow: Math.min(6, titles.length),
    slidesToScroll: 3,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(5, titles.length),
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(4, titles.length),
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, titles.length),
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: Math.min(2, titles.length),
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="group py-6" aria-labelledby={`category-${category}`}>
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-4 flex items-end gap-3">
          <h2
            id={`category-${category}`}
            className="text-2xl font-heading uppercase tracking-wider text-white md:text-3xl"
          >
            {category}
          </h2>
          <div className="h-px flex-1 bg-zinc-800/50" />
        </div>
      </div>
      <div className="category-row relative">
        <Slider {...settings}>
          {titles.map((title) => (
            <div key={title.id}>
              <TitleCard
                id={title.id}
                type={title.type}
                title={title.title}
                releaseYear={title.releaseYear}
                rating={title.rating}
                posterUrl={title.posterUrl}
                genres={title.genres}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
