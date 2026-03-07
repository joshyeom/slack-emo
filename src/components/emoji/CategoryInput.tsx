"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui";

import { useCategories } from "@/hooks/use-categories";

type CategoryInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const CategoryInput = ({ value, onChange, disabled }: CategoryInputProps) => {
  const { data: categories = [] } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = categories.filter((cat) => cat.name.toLowerCase().includes(value.toLowerCase()));

  const showDropdown = isOpen && value.length > 0 && filtered.length > 0;

  const handleSelect = useCallback(
    (name: string) => {
      onChange(name);
      setIsOpen(false);
      setHighlightIndex(-1);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "Enter" && highlightIndex >= 0) {
        e.preventDefault();
        handleSelect(filtered[highlightIndex].name);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [showDropdown, filtered, highlightIndex, handleSelect]
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  return (
    <div ref={containerRef} className="relative">
      <Input
        placeholder="카테고리 (예: 직장생활, 리액션)"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightIndex(-1);
        }}
        onFocus={() => value.length > 0 && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      {showDropdown && (
        <ul
          ref={listRef}
          className="bg-popover absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border p-1 shadow-md"
        >
          {filtered.map((cat, index) => (
            <li
              key={cat.id}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(cat.name);
              }}
              onMouseEnter={() => setHighlightIndex(index)}
              className={cn(
                "cursor-pointer rounded-sm px-2 py-1.5 text-sm",
                index === highlightIndex && "bg-accent text-accent-foreground"
              )}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
