# ShopHub Frontend - React + Vite + Tailwind CSS

## Project Overview
ShopHub is a production-ready e-commerce platform built with React and Vite. The frontend is a modern, futuristic shopping platform inspired by Flipkart and Amazon with advanced Tailwind CSS styling, glassmorphism effects, and smooth animations.

## Folder Structure

```
client/src/
├── pages/                          # All application pages
│   ├── Home.jsx                    # Homepage with featured products and categories
│   ├── Landing.jsx                 # Landing page for new users
│   ├── ProductDetail.jsx           # Individual product page with full details
│   ├── Category.jsx                # Category listing page with filters
│   ├── Cart.jsx                    # Shopping cart page
│   ├── Checkout.jsx                # Multi-step checkout flow
│   ├── Account.jsx                 # User account overview
│   ├── Orders.jsx                  # User order history
│   ├── Wishlist.jsx                # Saved items/wishlist
│   ├── Admin.jsx                   # Admin dashboard (analytics, users, sellers, orders)
│   ├── Seller.jsx                  # Seller dashboard (product management)
│   ├── Support.jsx                 # Support center with FAQs
│   ├── Contact.jsx                 # Contact us form
│   ├── PrivacyPolicy.jsx           # Privacy policy page
│   ├── Login.jsx                   # User login page
│   ├── Signup.jsx                  # User registration page
│   └── NotFound.jsx                # 404 page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx              # Main navigation bar (sticky, logo, search, cart, profile)
│   │   ├── Footer.jsx              # Footer component (links, info, contact)
│   │   └── Sidebar.jsx             # Optional sidebar navigation
│   │
│   ├── products/
│   │   ├── ProductCard.jsx         # Product card with hover effects (modern design)
│   │   ├── ProductGrid.jsx         # Grid layout for product display (responsive)
│   │   ├── ProductDetail.jsx       # Detailed product view with images, specs, reviews
│   │   ├── FilterSidebar.jsx       # Filter panel (price, brand, rating, category)
│   │   └── SortSelect.jsx          # Sort options (price, rating, newest, etc)
│   │
│   ├── cart/
│   │   └── CartItem.jsx            # Individual cart item component
│   │
│   ├── checkout/
│   │   ├── AddressForm.jsx         # Shipping address form
│   │   ├── PaymentForm.jsx         # Payment method selection
│   │   └── OrderSummary.jsx        # Order summary and totals
│   │
│   └── ui/                         # shadcn UI components (pre-built)
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       ├── select.jsx
│       ├── accordion.jsx
│       └── ... (other shadcn components)
│
├── hooks/
│   ├── useAuth.js                  # Authentication state and methods
│   ├── useCart.js                  # Cart operations (add, remove, update)
│   ├── use-toast.js                # Toast notifications
│   └── useProduct.js               # Product data fetching
│
├── context/
│   ├── CartContext.jsx             # Cart state management
│   ├── AuthContext.jsx             # Auth state management (if separate)
│   └── ThemeContext.jsx            # Dark/light theme toggle
│
├── lib/
│   ├── queryClient.js              # TanStack Query configuration
│   ├── api.js                      # API utility functions
│   └── utils.js                    # Helper utilities (formatting, validation)
│
├── data/
│   └── products.js                 # Mock/seed product data (15 categories, 400+ products)
│
├── App.jsx                         # Main app component with routing
├── main.jsx                        # React entry point
└── index.css                       # Global Tailwind CSS styles
```

## Key Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Homepage with featured products |
| `/landing` | Landing | First-time visitor landing page |
| `/category/:slug` | Category | Products filtered by category |
| `/product/:slug` | ProductDetail | Full product details, reviews, ratings |
| `/cart` | Cart | Shopping cart with item management |
| `/checkout` | Checkout | Multi-step checkout (address → payment → confirm) |
| `/account` | Account | User profile and quick access to orders/addresses/wishlist |
| `/orders` | Orders | Order history and tracking |
| `/wishlist` | Wishlist | Saved items for later |
| `/admin` | AdminDashboard | Analytics, user management, seller approval, order management |
| `/seller` | SellerDashboard | Product management, sales stats, orders |
| `/support` | Support | Help center with FAQs and contact options |
| `/contact` | Contact | Contact form and business info |
| `/privacy` | PrivacyPolicy | Privacy policy document |
| `/login` | Login | User login |
| `/signup` | Signup | User registration |

## Components & Features

### Navbar
- **Sticky header** with glassmorphism effect (backdrop-blur)
- **Logo** with gradient text
- **Search bar** with auto-complete suggestions
- **Shopping cart badge** showing item count
- **User profile dropdown** (if logged in) with Orders, Wishlist, Settings, Logout
- **Mobile menu** for small screens
- **Category navigation** on hover

### ProductCard
- **Modern design** with gradient backgrounds
- **Smooth hover effects** (scale, brightness, shadow)
- **Discount badge** with gradient (e.g., "20% OFF")
- **Rating display** with star icon
- **Price comparison** (original vs discount price)
- **Stock status** indicator (in stock, low stock, out of stock)
- **Wishlist button** on hover
- **Add to Cart button** with loading state

### ProductGrid
- **Responsive columns** (4 on desktop, 3 on tablet, 2 on mobile)
- **Infinite scroll or pagination** support
- **Loading skeleton** state
- **Filter integration** with real-time updates

### Checkout Flow
- **Step indicator** (address → payment → confirm)
- **Address form** with validation
- **Saved address selection**
- **Payment method options** (card, UPI, wallet, net banking)
- **Order summary** (sticky on desktop)
- **Coupon/promo code** input
- **Final order confirmation**

### Dashboards
- **Admin Dashboard**: User stats, seller management, order analytics, platform insights
- **Seller Dashboard**: Product upload, sales metrics, inventory management, order fulfillment
- **User Account**: Order history, saved addresses, wishlist, profile settings

### Auth Pages
- **Login**: Email + password with "remember me" and forgot password options
- **Signup**: Multi-field registration (first name, last name, email, password)
- Both pages have **futuristic gradient backgrounds** with glassmorphism cards

### Support Pages
- **Support Center**: Searchable FAQ with 20+ questions, contact options
- **Contact Form**: Name, email, subject, message with real-time validation
- **Privacy Policy**: Full legal text with sectioned layout

## Design System & Tailwind CSS

### Colors
- **Primary**: Used for main actions and highlights
- **Accent**: Used for secondary actions and accents
- **Destructive**: Used for delete/remove actions (red)
- **Muted**: Used for secondary text and backgrounds

### Typography
- **Headings**: Bold, modern fonts with gradient text effects
- **Body**: Clear, readable sans-serif for content
- **Small text**: For metadata, labels, badges

### Effects & Animations
- **Gradients**: Background gradients throughout (from-primary to-accent)
- **Glassmorphism**: Backdrop blur effects on modals and cards
- **Shadows**: Subtle shadows that increase on hover
- **Animations**: Smooth transitions (scale, opacity, color) on interactions
- **Hover states**: Cards lift up, buttons change color, text becomes primary

### Responsive Design
- **Mobile-first approach**
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible layouts**: Grid and flex layouts adjust to screen size

## Data Flow

### Authentication
1. User enters credentials on Login/Signup page
2. `useAuth()` hook sends request to `/api/auth/login` or `/api/auth/signup`
3. Server responds with session token stored in secure cookies
4. User is redirected to homepage on success
5. `useAuth()` hook checks session on app load

### Product Loading
1. `Home.jsx` uses `getFeaturedProducts()` from `data/products.js`
2. `Category.jsx` filters products by category slug
3. `ProductDetail.jsx` fetches full product info including reviews
4. Filters update product list in real-time via state

### Cart Operations
1. User clicks "Add to Cart" on ProductCard
2. `useCart()` hook adds item to CartContext
3. Cart badge in Navbar updates
4. User navigates to `/cart` to view cart
5. Can update quantity or remove items
6. Proceeds to `/checkout` to complete purchase

### Checkout Flow
1. User fills in shipping address
2. Selects payment method
3. Reviews order summary
4. Clicks "Place Order"
5. Stripe payment modal appears
6. Payment processed, order created
7. Redirected to order confirmation page

## API Integration

### TanStack Query Setup
- Queries automatically retry on failure
- Cache invalidation on mutations
- Loading states available via `.isLoading` and `.isPending`
- Error handling with `.error` property

### Example Query
```javascript
const { data: products, isLoading } = useQuery({
  queryKey: ['/api/products'],
  queryFn: () => fetch('/api/products').then(r => r.json())
});
```

### Example Mutation
```javascript
const addToCartMutation = useMutation({
  mutationFn: (product) => apiRequest('POST', '/api/cart', { product }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/cart'] })
});
```

## Performance Optimizations
- **Lazy loading** of product images
- **Code splitting** for large components
- **Memoization** of components to prevent unnecessary re-renders
- **Request debouncing** for search queries
- **Image optimization** with proper aspect ratios

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables
```
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Local Development

```bash
npm install
npm run dev
```

The app will start on `http://localhost:5000`

## Build for Production

```bash
npm run build
npm run preview
```

## Styling Notes
- All UI is built with Tailwind CSS + shadcn components
- Custom gradients and animations in `index.css`
- Dark mode fully supported with Tailwind's dark mode utilities
- All components respect the color scheme and are fully accessible

## Key Technologies
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built component library
- **TanStack Query** - Server state management
- **wouter** - Client-side routing
- **Lucide React** - Icon library
- **Stripe** - Payment processing
