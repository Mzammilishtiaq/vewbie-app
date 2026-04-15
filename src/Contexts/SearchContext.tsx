import React, {createContext, useState, useContext, ReactNode} from "react";

type SearchContextType = {
  searchVisible: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({children}: {children: ReactNode}) => {
  const [searchVisible, setSearchVisible] = useState(false);

  const openSearch = () => setSearchVisible(true);
  const closeSearch = () => setSearchVisible(false);

  return (
    <SearchContext.Provider value={{searchVisible, openSearch, closeSearch}}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);