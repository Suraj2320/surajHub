# E-Commerce Platform Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from leading e-commerce platforms (Flipkart, Amazon, Shopify) with emphasis on Flipkart's product-focused, high-density information architecture optimized for browsing and discovery.

## Core Design Principles
1. **Product-First Visual Hierarchy**: Images and pricing drive the layout
2. **Efficient Information Density**: Maximum product visibility without clutter
3. **Conversion-Optimized Flow**: Clear paths from browse → cart → checkout
4. **Trust Through Polish**: Professional presentation builds credibility

## Typography System

**Font Stack**: Inter for UI elements, Poppins for headings (Google Fonts)

- **Primary Headings (H1)**: text-4xl font-bold (product names, page titles)
- **Secondary Headings (H2)**: text-2xl font-semibold (category titles, section headers)
- **Tertiary Headings (H3)**: text-xl font-medium (subsections, card titles)
- **Body Text**: text-base font-normal (descriptions, specifications)
- **Small Text**: text-sm (labels, metadata, stock info)
- **Micro Text**: text-xs (badges, helper text)
- **Price Display**: text-2xl font-bold (discounted), text-lg line-through font-normal (original)

## Layout & Spacing System

**Tailwind Units**: Standardize on 2, 4, 6, 8, 12, 16 for consistent rhythm

- **Component Padding**: p-4 (cards), p-6 (sections), p-8 (containers)
- **Vertical Spacing**: space-y-4 (lists), space-y-8 (major sections)
- **Grid Gaps**: gap-4 (product grids), gap-6 (feature sections)
- **Container Max-Width**: max-w-7xl mx-auto for main content
- **Page Margins**: px-4 md:px-6 lg:px-8

## Navigation Architecture

### Top Navbar (Sticky)
- Full-width with shadow-md, sticky top-0, z-50
- Three-tier layout:
  - **Top Bar**: Logo (left) + Search Bar (center, max-w-2xl) + Cart Icon with badge + Profile dropdown (right)
  - **Category Menu Bar**: Horizontal mega-menu with 10-15 categories, hover reveals subcategories
- Height: h-16 for top bar, h-12 for category bar
- Search: Rounded-full input with search icon, autocomplete dropdown below

### Breadcrumb Navigation
- Below navbar on product/category pages
- text-sm with chevron separators, last item font-semibold

## Product Catalog Components

### Product Grid Layout
- **Desktop**: grid-cols-4 (4 products per row)
- **Tablet**: grid-cols-3
- **Mobile**: grid-cols-2
- Gap: gap-4 md:gap-6
- Shows 40-50 products with "Load More" button or pagination at bottom

### Product Card Structure
- Aspect-ratio-square image container
- Padding: p-4
- Border: border rounded-lg with hover:shadow-lg transition
- **Contents (top to bottom)**:
  - Image (full-width, object-cover)
  - Brand name (text-xs uppercase tracking-wide, mb-1)
  - Product title (text-sm font-medium, line-clamp-2, h-10)
  - Rating: Star icons + count (text-xs, mt-2)
  - Pricing: Discounted (text-xl font-bold) + Original (text-sm line-through) + Discount % badge (text-xs, green badge)
  - Stock status (text-xs, mt-1)
  - Add to Cart button (w-full, mt-4)

### Sidebar Filters (Desktop)
- Fixed width: w-64
- Sticky position, top-24
- Sections: Price Range, Brands (checkboxes), Ratings, Categories
- Each filter section: mb-6, border-b pb-4
- Price slider: Custom range input
- Clear Filters button at top

### Mobile Filters
- Bottom sheet/drawer that slides up
- Filter button in top toolbar opens drawer
- Apply Filters button at bottom

## Product Detail Page

### Layout Structure
- Two-column grid: grid-cols-1 lg:grid-cols-2 gap-8
- **Left Column**: Image Gallery
  - Main image: aspect-ratio-square, large preview
  - Thumbnail strip below: 4-5 thumbnails, horizontal scroll
  - Zoom on hover (desktop)
- **Right Column**: Product Information
  - Breadcrumb navigation
  - Product title (text-3xl font-bold)
  - Rating + review count
  - Pricing (large, prominent)
  - Size/Color selectors (if applicable, button groups)
  - Quantity selector (- box +)
  - Add to Cart + Buy Now buttons (full-width stack)
  - Delivery info box (border, rounded, p-4, mt-6)
  - Specifications accordion (mt-8)
  - Related Products carousel at page bottom

## Shopping Cart & Checkout

### Cart Sidebar/Page
- Cart items: Vertical list with dividers
- **Cart Item Row**:
  - grid-cols-[80px_1fr_80px] gap-4
  - Thumbnail (80px square)
  - Product info (title, price, quantity selector)
  - Remove icon
- Cart summary box: sticky, border, p-6
  - Subtotal, Shipping, Tax, Total (each row with justify-between)
  - Checkout button (w-full, large)

### Checkout Flow
- Multi-step indicator at top (1. Address → 2. Payment → 3. Confirm)
- Two-column: Form (left, w-2/3) + Order Summary (right, w-1/3 sticky)
- Form fields: Full-width inputs, labels above, focus:ring
- Saved addresses: Card selection pattern with radio buttons

## Dashboard Layouts

### User Dashboard
- Sidebar navigation (left, w-64): Orders, Profile, Addresses, Wishlist
- Main content area: max-w-4xl
- Order cards: border, rounded-lg, p-6, hover:shadow
  - Order number + date (header)
  - Product thumbnails (horizontal)
  - Status badge (top-right)
  - Track Order button

### Seller Dashboard
- Stats cards row: grid-cols-3, gap-6
  - Total Products, Total Sales, Active Orders
  - Large number (text-3xl font-bold), icon, small trend indicator
- Product management table: Striped rows, action buttons (Edit/Delete)
- Add Product: Form with image uploader, rich text editor for description

### Admin Dashboard
- Analytics charts at top (2-column grid)
- Tabbed interface: Users | Sellers | Products | Orders
- Data tables with search, filters, pagination
- Action buttons: Approve/Reject for sellers, Status updates for orders

## Images

**Product Images**: Required throughout
- **Product Cards**: Square aspect ratio, 300x300px minimum, consistent sizing
- **Product Detail**: Main image 800x800px, thumbnails 100x100px
- **Category Banners**: Wide aspect (16:9), 1200x675px showing category hero
- **User/Seller Avatars**: Circular, 40px (navbar), 80px (profile pages)
- **Brand Logos**: Small rectangular in filters, 120x40px

**No large hero image** - this is a catalog-focused e-commerce site, not a marketing landing page. Homepage immediately displays product grids organized by categories.

## Responsive Breakpoints
- Mobile-first approach
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px
- Sidebar filters → bottom drawer on mobile
- 4-col grid → 3-col → 2-col on smaller screens
- Stack checkout columns on tablet and below

## Interactive Elements
- Hover states: Cards lift (shadow-lg), links underline, buttons darken
- Active states: Buttons pressed effect (scale-95)
- Loading states: Skeleton loaders for product cards, spinner for buttons
- Transitions: transition-all duration-200 for smooth interactions
- Toast notifications for cart actions, orders (top-right corner)