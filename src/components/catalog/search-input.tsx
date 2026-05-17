"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isInitialized.current) {
      setQuery(searchParams.get("search") ?? "");
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set("search", debouncedQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");

    router.push(`/catalog?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(query);
  }, [query]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md" role="search">
      <label htmlFor="catalog-search" className="sr-only">
        Search catalog
      </label>
      <div className={`relative rounded-sm border transition-all duration-200 ${
        isFocused
          ? "border-amber/40 ring-1 ring-amber/20"
          : "border-zinc-700/50"
      }`}>
        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search titles..."
          className="w-full rounded-sm bg-zinc-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none backdrop-blur-sm"
          aria-label="Search catalog"
        />
      </div>
    </form>
  );
}
