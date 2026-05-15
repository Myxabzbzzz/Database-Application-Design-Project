// app/collection/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// ---------- Types ----------
interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  colors: string[];
  sizes: string[];
  category: string;
  isLikedByUser: boolean;
}

// ---------- Sample Data (temporary) ----------
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    brand: 'MAISON ELARA',
    name: 'Structured Linen Blazer',
    price: 1250,
    rating: 4.9,
    reviewCount: 124,
    image: '/images/product1.jpg',
    colors: ['Black', 'Beige'],
    sizes: ['S', 'M', 'L'],
    category: 'Outerwear',
    isLikedByUser: false,
  },
  {
    id: '2',
    brand: 'STUDIO NOIR',
    name: 'Ribbed Cashmere Turtleneck',
    price: 890,
    rating: 5.0,
    reviewCount: 88,
    image: '/images/product2.jpg',
    colors: ['Black', 'Charcoal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    category: 'Knitwear',
    isLikedByUser: true,
  },
  {
    id: '3',
    brand: 'AURA ATELIER',
    name: 'Bias-Cut Silk Maxi Dress',
    price: 2100,
    rating: 4.8,
    reviewCount: 142,
    image: '/images/product3.jpg',
    colors: ['Black', 'Ivory'],
    sizes: ['XS', 'S', 'M'],
    category: 'All Apparel',
    isLikedByUser: false,
  },
  {
    id: '4',
    brand: 'VANGUARD FOOTWEAR',
    name: 'Handcrafted Chelsea Boots',
    price: 950,
    rating: 4.7,
    reviewCount: 215,
    image: '/images/product4.jpg',
    colors: ['Black', 'Brown'],
    sizes: ['S', 'M', 'L'],
    category: 'Accessories',
    isLikedByUser: false,
  },
  {
    id: '5',
    brand: 'NOMAD GOODS',
    name: 'Structured Leather Tote',
    price: 1480,
    rating: 4.9,
    reviewCount: 58,
    image: '/images/product5.jpg',
    colors: ['Black', 'Tan'],
    sizes: ['One Size'],
    category: 'Accessories',
    isLikedByUser: true,
  },
  {
    id: '6',
    brand: 'NORDIC CRAFT',
    name: 'Oversized Wool Overcoat',
    price: 1650,
    rating: 4.0,
    reviewCount: 112,
    image: '/images/product6.jpg',
    colors: ['Black', 'Navy'],
    sizes: ['M', 'L', 'XL'],
    category: 'Outerwear',
    isLikedByUser: false,
  },
];

// Categories with counts (static for demo)
const CATEGORIES = [
  { name: 'All Apparel', count: 248 },
  { name: 'Outerwear', count: 42 },
  { name: 'Knitwear', count: 56 },
  { name: 'Accessories', count: 89 },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLOR_OPTIONS = ['Black', 'White', 'Beige', 'Navy', 'Brown', 'Tan'];
const RATING_OPTIONS = [4.5, 4.0, 3.5];

// Star Rating Component
const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - fullStars - (hasHalf ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {[...Array(fullStars)].map((_, i) => <span key={i}>★</span>)}
      {hasHalf && <span>½</span>}
      {[...Array(empty)].map((_, i) => <span key={i} className="text-gray-300">★</span>)}
    </div>
  );
};

// ---------- Main Component ----------
export default function CollectionPage() {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All Apparel');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 5000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  // ---------- Fetch products from backend (TODO) ----------
  const fetchProducts = useCallback(async () => {
    // TODO: Replace with real API call to /api/products
    // Accept query params: category, sizes, colors, minPrice, maxPrice, rating, sort, search
    // Should return filtered products with isLikedByUser based on current user session.
    setProducts(SAMPLE_PRODUCTS);
  }, []);

  // ---------- Apply all filters (client-side demo; move to backend for production) ----------
  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Category
    if (selectedCategory !== 'All Apparel') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    // Sizes
    if (selectedSizes.length) {
      filtered = filtered.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }
    // Colors
    if (selectedColors.length) {
      filtered = filtered.filter(p => p.colors.some(c => selectedColors.includes(c)));
    }
    // Price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    // Rating
    if (selectedRating) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    // Sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'featured' – keep original order
        break;
    }
    setFilteredProducts(filtered);
    setVisibleCount(6);
  }, [products, selectedCategory, selectedSizes, selectedColors, priceRange, selectedRating, sortBy, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // ---------- Like / Unlike (TODO: connect to backend) ----------
  const toggleLike = async (productId: string, currentLiked: boolean) => {
    // Optimistic update
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, isLikedByUser: !currentLiked } : p
      )
    );
    // TODO: POST /api/wishlist { productId, liked: !currentLiked }
    // Include authentication token.
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setVisibleCount(prev => prev + 6);
    setLoadingMore(false);
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('All Apparel');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([200, 5000]);
    setSelectedRating(null);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ---------- HEADER with 3 buttons on the right ---------- */}
      <header className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            {/* Logo */}
            <div className="text-2xl font-light tracking-wide font-serif">alva</div>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-black transition">Collections</a>
              <a href="#" className="hover:text-black transition">Designers</a>
            </nav>

            {/* Search bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search curated elegance..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-400"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Three buttons: User, Wishlist, Cart */}
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-black transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-black transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-black transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide text-gray-900 mb-4">Curated Collection</h1>
          <p className="text-gray-500 max-w-2xl text-lg">
            Explore our meticulously selected range of seasonal essentials, where artisanal craftsmanship meets contemporary silhouette.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* ---------- LEFT SIDEBAR - FULL FILTERS ---------- */}
          <aside className="lg:w-1/4 space-y-8">
            {/* Category */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`block w-full text-left text-sm py-1 ${
                      selectedCategory === cat.name ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
                    } transition`}
                  >
                    {cat.name} <span className="text-gray-400 text-xs ml-1">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Size</h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      if (selectedSizes.includes(size))
                        setSelectedSizes(selectedSizes.filter(s => s !== size));
                      else
                        setSelectedSizes([...selectedSizes, size]);
                    }}
                    className={`px-3 py-1.5 text-sm border ${
                      selectedSizes.includes(size)
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-500'
                    } transition`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette (swatches) */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Color Palette</h3>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      if (selectedColors.includes(color))
                        setSelectedColors(selectedColors.filter(c => c !== color));
                      else
                        setSelectedColors([...selectedColors, color]);
                    }}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColors.includes(color) ? 'border-black scale-110' : 'border-gray-300'
                    } transition-all`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Price Range</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={6000}
                step={50}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full accent-black"
              />
              <input
                type="range"
                min={0}
                max={6000}
                step={50}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-black mt-2"
              />
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Rating</h3>
              <div className="space-y-2">
                {RATING_OPTIONS.map(rate => (
                  <button
                    key={rate}
                    onClick={() => setSelectedRating(selectedRating === rate ? null : rate)}
                    className={`flex items-center gap-2 text-sm ${
                      selectedRating === rate ? 'text-black' : 'text-gray-500'
                    } hover:text-black transition`}
                  >
                    <RatingStars rating={rate} />
                    <span>{rate}+</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 underline hover:text-black transition mt-4"
            >
              Clear all filters
            </button>
          </aside>

          {/* ---------- RIGHT SIDE: PRODUCT GRID ---------- */}
          <div className="lg:w-3/4">
            {/* Sort and product count bar */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500">{filteredProducts.length} products</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Product grid - scrolls naturally with page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {displayedProducts.map(product => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                    {/* TODO: Replace with Next.js Image from your actual image URL */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      [Image: {product.name}]
                    </div>
                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(product.id, product.isLikedByUser);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur flex items-center justify-center text-black hover:text-red-500 transition"
                    >
                      {product.isLikedByUser ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 tracking-wide mb-1">{product.brand}</p>
                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-700 font-semibold mb-2">${product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={product.rating} />
                      <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 border border-gray-300 text-gray-700 text-sm tracking-wide uppercase hover:bg-black hover:text-white hover:border-black transition disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load more refined pieces'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ---------- RICH FOOTER (more filled) ---------- */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-light tracking-wide font-serif mb-4">alva</div>
              <p className="text-sm text-gray-500">Refining the essence of modern elegance.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">All Collections</a></li>
                <li><a href="#" className="hover:text-black">Designers</a></li>
                <li><a href="#" className="hover:text-black">New Arrivals</a></li>
                <li><a href="#" className="hover:text-black">Exclusive</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Contact Us</a></li>
                <li><a href="#" className="hover:text-black">FAQs</a></li>
                <li><a href="#" className="hover:text-black">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-black">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Terms of Service</a></li>
                <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-xs text-gray-400">
            <p>© 2024 AURA EXCLUSIVE. REFINED ELEGANCE. All rights reserved.</p>
            <p className="mt-1">alva — where craftsmanship meets contemporary design.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}