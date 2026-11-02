import React, { useState, useMemo } from 'react';
import { useCafe } from '../../context/CafeContext';
import { MenuCategory, MenuItem } from '../../types/cafe';
import { Search, Plus, Clock } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const { menuItems, openCustomizer, addToCart } = useCafe();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const categories: Array<{ id: string; label: string; subLabel: string }> = [
    { id: 'all', label: 'All Items', subLabel: 'Full Menu' },
    { id: 'coffee', label: 'Coffee & Espresso', subLabel: 'Specialty Roasts' },
    { id: 'viennoiserie', label: 'Viennoiserie', subLabel: 'Pure Butter Bakery' },
    { id: 'brunch', label: 'Savory Brunch', subLabel: 'Tartines & Toast' },
    { id: 'desserts', label: 'Pastries & Desserts', subLabel: 'Signature Cakes' },
    { id: 'tea', label: 'Teas & Infusions', subLabel: 'Mariage Frères' },
  ];

  const popularTags = ['Single Origin', 'AOP Charentes Butter', 'Valrhona Chocolate', 'Organic', 'Barista Favorite'];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.frenchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [menuItems, selectedCategory, searchQuery, selectedTag]);

  return (
    <section className="py-10 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D46] block">
              Daily Artisanal Menu
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B231B] mt-1">
              Seasonal Offerings
            </h2>
            <p className="text-sm text-[#665A4F] mt-1 max-w-xl">
              Prepared to order using certified organic stoneground flours, churned French AOP butter, and freshly roasted single-origin coffees.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, croissants..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#DCD3C5] bg-white text-[#2B231B] focus:outline-none focus:border-[#8C6D46] shadow-2xs"
            />
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-5 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#2B231B] text-white border-[#2B231B] shadow-xs'
                    : 'bg-white text-[#5C5248] border-[#E2D8CC] hover:border-[#8C6D46] hover:text-[#2B231B]'
                }`}
              >
                <span>{cat.label}</span>
                <span className="opacity-60 text-[10px] ml-1.5 hidden sm:inline">
                  ({cat.subLabel})
                </span>
              </button>
            );
          })}
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 text-xs text-[#7A6D60]">
          <span className="text-[11px] font-mono uppercase text-[#A39486] shrink-0">
            Filters:
          </span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
              selectedTag === 'all'
                ? 'bg-[#EAE2D5] text-[#2B231B] font-semibold'
                : 'hover:bg-[#EFE9DF]'
            }`}
          >
            All
          </button>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-[#8C6D46] text-white font-semibold'
                  : 'bg-[#F2ECE3] hover:bg-[#EAE2D5] text-[#5C5248]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-[#DDD5C7] bg-white">
            <p className="font-serif text-lg text-[#2B231B]">No menu items found</p>
            <p className="text-xs text-[#8C7A6B] mt-1">
              Try adjusting your search query or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedTag('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#2B231B] rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const isAvailable = item.inStock && item.stockCount > 0;

              return (
                <div
                  key={item.id}
                  className={`group relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                    isAvailable
                      ? 'border-[#E5DDD0] hover:border-[#C4B5A2] hover:shadow-lg hover:-translate-y-0.5'
                      : 'border-[#ECE5DC] opacity-75'
                  }`}
                >
                  {/* Visual Image Container (4:3 aspect ratio) */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#EAE3D6]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Stock Alert or Featured Note */}
                    {!isAvailable ? (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#2B231B]/90 text-white text-[11px] font-mono tracking-wider uppercase backdrop-blur-xs">
                        Sold Out (86'd)
                      </div>
                    ) : item.stockCount <= 5 ? (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#D97706]/90 text-white text-[11px] font-medium backdrop-blur-xs">
                        Only {item.stockCount} left
                      </div>
                    ) : item.featured ? (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#FAF8F5]/90 text-[#8C6D46] text-[11px] font-semibold tracking-wide backdrop-blur-xs">
                        Featured
                      </div>
                    ) : null}

                    {/* Price Tag Overlay on Card Corner */}
                    <div className="absolute bottom-3 left-3 bg-[#FAF8F5]/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/50 shadow-xs">
                      <span className="font-mono text-sm font-bold text-[#2B231B] tabular-nums">
                        €{item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Unboxed Metadata with typographic separator */}
                      <div className="flex items-center gap-1.5 text-[11px] text-[#8C7A6B] uppercase font-mono tracking-wider">
                        <span>{item.category}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.prepTimeMinutes}m</span>
                        </span>
                        {item.tags.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="truncate">{item.tags[0]}</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#2B231B] mt-1 group-hover:text-[#8C6D46] transition-colors leading-tight">
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#8C7A6B] italic mt-0.5">
                        {item.frenchName}
                      </p>

                      <p className="text-xs text-[#665A4F] mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 mt-4 border-t border-[#F0EAE1] flex items-center justify-between gap-3">
                      <span className="text-xs text-[#8C7A6B]">
                        {isAvailable ? `${item.stockCount} in stock` : 'Currently unavailable'}
                      </span>

                      {isAvailable ? (
                        <div className="flex items-center gap-2">
                          {item.customizationOptions ? (
                            <button
                              onClick={() => openCustomizer(item)}
                              className="px-3 py-1.5 text-xs font-semibold text-[#2B231B] bg-[#EFE9DF] hover:bg-[#E5DDCF] rounded-lg transition-colors cursor-pointer"
                            >
                              Customise
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(item, {}, 1)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2B231B] hover:bg-[#43372B] rounded-lg transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 text-xs font-medium text-[#A39486] bg-[#F2EDE5] rounded-lg cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
