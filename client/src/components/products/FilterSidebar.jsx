import { useState } from "react";
import { X, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Filter } from "lucide-react";

export function FilterSidebar({ 
  brands = [], 
  subcategories = [],
  priceRange = { min: 0, max: 100000 },
  filters,
  onFilterChange,
  onClearFilters
}) {
  const [openSections, setOpenSections] = useState({
    price: true,
    brands: true,
    subcategories: true,
    ratings: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePriceChange = (values) => {
    onFilterChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1]
    });
  };

  const handleBrandChange = (brand, checked) => {
    const currentBrands = filters.brands || [];
    const newBrands = checked
      ? [...currentBrands, brand]
      : currentBrands.filter(b => b !== brand);
    onFilterChange({
      ...filters,
      brands: newBrands
    });
  };

  const handleSubcategoryChange = (subcategory, checked) => {
    const current = filters.subcategories || [];
    const newSubs = checked
      ? [...current, subcategory]
      : current.filter(s => s !== subcategory);
    onFilterChange({
      ...filters,
      subcategories: newSubs
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? undefined : rating
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters} data-testid="button-clear-filters">
          Clear All
        </Button>
      </div>

      <Separator />

      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <span className="font-medium">Price Range</span>
          {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="px-2">
            <Slider
              min={priceRange.min}
              max={priceRange.max}
              step={100}
              value={[filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max]}
              onValueChange={handlePriceChange}
              className="mb-4"
              data-testid="slider-price"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span data-testid="text-min-price">{formatPrice(filters.minPrice || priceRange.min)}</span>
              <span data-testid="text-max-price">{formatPrice(filters.maxPrice || priceRange.max)}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {brands.length > 0 && (
        <>
          <Collapsible open={openSections.brands} onOpenChange={() => toggleSection('brands')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <span className="font-medium">Brands</span>
              {openSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={(filters.brands || []).includes(brand)}
                      onCheckedChange={(checked) => handleBrandChange(brand, checked)}
                      data-testid={`checkbox-brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </>
      )}

      {subcategories.length > 0 && (
        <>
          <Collapsible open={openSections.subcategories} onOpenChange={() => toggleSection('subcategories')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <span className="font-medium">Categories</span>
              {openSections.subcategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-2">
                {subcategories.map((sub) => (
                  <label key={sub} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={(filters.subcategories || []).includes(sub)}
                      onCheckedChange={(checked) => handleSubcategoryChange(sub, checked)}
                      data-testid={`checkbox-subcategory-${sub.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <span className="text-sm">{sub}</span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </>
      )}

      <Collapsible open={openSections.ratings} onOpenChange={() => toggleSection('ratings')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <span className="font-medium">Customer Ratings</span>
          {openSections.ratings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded-md transition-colors ${
                  filters.minRating === rating ? 'bg-primary/10' : 'hover:bg-muted'
                }`}
                onClick={() => handleRatingChange(rating)}
                data-testid={`button-rating-${rating}`}
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm">& Up</span>
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-28 p-4 border rounded-lg bg-card">
          <FilterContent />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2" data-testid="button-filter-mobile">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterContent />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
              <SheetClose asChild>
                <Button className="w-full" data-testid="button-apply-filters">
                  Apply Filters
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
