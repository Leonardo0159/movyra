"use client";

import Slider from "react-slick";
import Image from "next/image";
import { User } from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CastMember {
  id: string;
  name: string;
  role: string | null;
  imageUrl: string | null;
  characterName: string | null;
}

interface CastListProps {
  castMembers: CastMember[];
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute -left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800 hover:text-amber group-hover:opacity-100"
      aria-label="Previous"
    >
      <FiChevronLeft className="h-4 w-4" />
    </button>
  );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute -right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800 hover:text-amber group-hover:opacity-100"
      aria-label="Next"
    >
      <FiChevronRight className="h-4 w-4" />
    </button>
  );
}

export function CastList({ castMembers }: CastListProps) {
  if (castMembers.length === 0) return null;

  const settings = {
    dots: false,
    infinite: castMembers.length > 5,
    speed: 500,
    slidesToShow: Math.min(6, castMembers.length),
    slidesToScroll: 3,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(5, castMembers.length),
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(4, castMembers.length),
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: Math.min(3, castMembers.length),
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="group py-8" aria-labelledby="cast-heading">
      <div className="mb-5 flex items-end gap-3">
        <h2 id="cast-heading" className="text-2xl font-heading uppercase tracking-wider text-white md:text-3xl">
          Cast & Crew
        </h2>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>
      <div className="cast-carousel relative">
        <Slider {...settings}>
          {castMembers.map((member) => (
            <div key={member.id}>
              <div className="flex flex-col items-center text-center">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-zinc-800/50 ring-1 ring-zinc-700/50 transition-all duration-300 hover:ring-amber/30">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-8 w-8 text-zinc-600" />
                    </div>
                  )}
                </div>
                <p className="mt-2.5 text-sm font-medium text-zinc-200">{member.name}</p>
                {member.characterName && (
                  <p className="text-xs text-zinc-500">{member.characterName}</p>
                )}
                {member.role && member.role !== "Actor" && (
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-600">{member.role}</p>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
