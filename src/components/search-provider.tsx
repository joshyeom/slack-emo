"use client";

import { type ReactNode, createContext, useContext, useDeferredValue, useState } from "react";

type SearchContextType = {
  query: string;
  deferredQuery: string;
  setQuery: (value: string) => void;
  clear: () => void;
  isSearching: boolean;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const clear = () => setQuery("");

  return (
    <SearchContext.Provider
      value={{
        query,
        deferredQuery,
        setQuery,
        clear,
        isSearching: query !== deferredQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
