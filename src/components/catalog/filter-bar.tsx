"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TitleType } from "@prisma/client";
import { FiFilter } from "react-icons/fi";

interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

interface FilterBarProps {
  genres: FilterOption[];
  categories: FilterOption[];
}

const typeOptions: { value: TitleType; label: string }[] = [
  { value: "MOVIE", label: "Films" },
  { value: "SERIES", label: "Series" },
  { value: "DOCUMENTARY", label: "Documentaries" },
];

export function FilterBar({ genres, categories }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);

  const [selectedType, setSelectedType] = useState<string>(searchParams.get("type") ?? "");
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get("genreId") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("categoryId") ?? "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isInitialized.current) {
      setSelectedType(searchParams.get("type") ?? "");
      setSelectedGenre(searchParams.get("genreId") ?? "");
      setSelectedCategory(searchParams.get("categoryId") ?? "");
    }
  }, [searchParams]);

  const applyFilters = useCallback((type: string, genre: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) params.set("type", type);
    else params.delete("type");
    if (genre) params.set("genreId", genre);
    else params.delete("genreId");
    if (category) params.set("categoryId", category);
    else params.delete("categoryId");
    params.set("page", "1");

    router.push(`/catalog?${params.toString()}`);
  }, [router, searchParams]);

  const handleTypeChange = useCallback((value: string) => {
    if (!isInitialized.current) isInitialized.current = true;
    setSelectedType(value);
    applyFilters(value, selectedGenre, selectedCategory);
  }, [selectedGenre, selectedCategory, applyFilters]);

  const handleGenreChange = useCallback((value: string) => {
    if (!isInitialized.current) isInitialized.current = true;
    setSelectedGenre(value);
    applyFilters(selectedType, value, selectedCategory);
  }, [selectedType, selectedCategory, applyFilters]);

  const handleCategoryChange = useCallback((value: string) => {
    if (!isInitialized.current) isInitialized.current = true;
    setSelectedCategory(value);
    applyFilters(selectedType, selectedGenre, value);
  }, [selectedType, selectedGenre, applyFilters]);

  const activeFilters = [selectedType, selectedGenre, selectedCategory].filter(Boolean).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-sm border border-zinc-700/50 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-600 hover:text-white"
      >
        <FiFilter className="h-4 w-4" />
        Filters
        {activeFilters > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber text-xs font-medium text-[oklch(0.1_0.005_45)]">
            {activeFilters}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-sm border border-zinc-700/50 bg-zinc-900 p-4 shadow-xl backdrop-blur-md">
          <div className="space-y-4">
            <div>
              <label htmlFor="type-filter" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleTypeChange("")}
                  className={`rounded-sm px-2.5 py-1 text-xs transition-colors ${
                    !selectedType ? "bg-amber/20 text-amber" : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleTypeChange(opt.value)}
                    className={`rounded-sm px-2.5 py-1 text-xs transition-colors ${
                      selectedType === opt.value ? "bg-amber/20 text-amber" : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="genre-filter" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Genre
              </label>
              <select
                id="genre-filter"
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800 px-3 py-1.5 text-sm text-white focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category-filter" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Category
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800 px-3 py-1.5 text-sm text-white focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
