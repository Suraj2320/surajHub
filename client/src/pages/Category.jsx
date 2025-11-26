import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { ChevronRight, Grid3X3, LayoutList } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { SortSelect } from "@/components/products/SortSelect";
import { 
  getCategoryBySlug, 
  getProductsByCategory, 
  getBrandsByCategory,
  getPriceRange,
  filterProducts 
} from "@/data/products";

export default function Category() {
  const { slug } = useParams();
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const productsPerPage = 48;

  const category = getCategoryBySlug(slug);
  const brands = useMemo(() => getBrandsByCategory(slug), [slug]);
  const priceRange = useMemo(() => getPriceRange(slug), [slug]);

  const filteredProducts = useMemo(() => {
    return filterProducts(slug, filters, sortBy === "relevance" ? undefined : sortBy);
  }, [slug, filters, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = 0;
    const end = page * productsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

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

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
        <Link href="/">
          <span className="hover:text-foreground cursor-pointer">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-category-title">{category.name}</h1>
        <p className="text-muted-foreground" data-testid="text-category-description">{category.description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <FilterSidebar
          brands={brands}
          subcategories={category.subcategories}
          priceRange={priceRange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-sm text-muted-foreground" data-testid="text-product-count">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-3">
              <SortSelect value={sortBy} onChange={setSortBy} />
            </div>
          </div>

          <ProductGrid products={paginatedProducts} columns={4} />

          {hasMore && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLoadMore}
                data-testid="button-load-more"
              >
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
