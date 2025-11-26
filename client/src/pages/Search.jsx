import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { SortSelect } from "@/components/products/SortSelect";
import { searchProducts, filterProducts, getPriceRange, allProducts } from "@/data/products";

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const productsPerPage = 48;

  useEffect(() => {
    setSearchTerm(initialQuery);
    setQuery(initialQuery);
  }, [initialQuery]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return searchProducts(searchTerm);
  }, [searchTerm]);

  const brands = useMemo(() => {
    return [...new Set(searchResults.map(p => p.brand))];
  }, [searchResults]);

  const priceRange = useMemo(() => {
    if (searchResults.length === 0) return { min: 0, max: 100000 };
    const prices = searchResults.map(p => p.discountPrice);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [searchResults]);

  const filteredProducts = useMemo(() => {
    let filtered = searchResults;
    
    if (filters.brands?.length) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.discountPrice >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.discountPrice <= filters.maxPrice);
    }
    
    if (filters.minRating !== undefined) {
      filtered = filtered.filter(p => p.ratingAvg >= filters.minRating);
    }
    
    if (sortBy && sortBy !== "relevance") {
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.discountPrice - b.discountPrice);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.discountPrice - a.discountPrice);
          break;
        case 'rating':
          filtered.sort((a, b) => b.ratingAvg - a.ratingAvg);
          break;
        case 'newest':
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'discount':
          filtered.sort((a, b) => {
            const discA = ((a.price - a.discountPrice) / a.price) * 100;
            const discB = ((b.price - b.discountPrice) / b.price) * 100;
            return discB - discA;
          });
          break;
      }
    }
    
    return filtered;
  }, [searchResults, filters, sortBy]);

  const paginatedProducts = useMemo(() => {
    const end = page * productsPerPage;
    return filteredProducts.slice(0, end);
  }, [filteredProducts, page]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(query);
    setPage(1);
    setFilters({});
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products, brands and more..."
              className="w-full pl-12 pr-4 h-12 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="input-search-page"
            />
          </div>
        </form>
      </div>

      {searchTerm && (
        <h1 className="text-2xl font-bold mb-6" data-testid="text-search-results">
          Search Results for "{searchTerm}"
          <span className="text-muted-foreground font-normal text-lg ml-2">
            ({filteredProducts.length} products)
          </span>
        </h1>
      )}

      {!searchTerm ? (
        <div className="text-center py-16">
          <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg text-muted-foreground">Enter a search term to find products</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-16">
          <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium mb-2">No products found</p>
          <p className="text-muted-foreground">Try searching with different keywords</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <FilterSidebar
            brands={brands}
            subcategories={[]}
            priceRange={priceRange}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground" data-testid="text-search-count">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
              <SortSelect value={sortBy} onChange={setSortBy} />
            </div>

            <ProductGrid products={paginatedProducts} columns={4} />

            {hasMore && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleLoadMore}
                  data-testid="button-load-more-search"
                >
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
