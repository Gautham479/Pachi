import { create } from 'zustand';

const MOCK_BASE_PRICE = 499;

export const useStore = create((set) => ({
  selectedFile: null,
  config: {
    material: 'PLA',
    color: 'Black',
    colorMode: 'Single Color',
    quality: 'Standard (0.2mm)',
    strength: 20,
  },
  mockPrice: null,
  cart: [],
  isCartOpen: false,
  searchQuery: '',
  products: [],
  scrollPosition: 0,
  activeTab: 'products',

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setProducts: (products) => set({ products }),
  setScrollPosition: (pos) => set({ scrollPosition: pos }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  clearCart: () => set({ cart: [] }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== id)
  })),

  setSelectedFile: (file) => set((state) => {
    // If a file is selected, update mock price based on current config
    const price = file ? calculateMockPrice(state.config) : null;
    return { selectedFile: file, mockPrice: price };
  }),

  setConfig: (newConfig) => set((state) => {
    const updatedConfig = { ...state.config, ...newConfig };
    const price = state.selectedFile ? calculateMockPrice(updatedConfig) : null;
    return { config: updatedConfig, mockPrice: price };
  }),

  clearFile: () => set({ selectedFile: null, mockPrice: null }),

  addToCart: () => set((state) => {
    if (!state.selectedFile || !state.mockPrice) return state;
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      fileName: state.selectedFile.name,
      config: state.config,
      price: state.mockPrice
    };
    
    return {
      cart: [...state.cart, newItem],
      selectedFile: null,
      mockPrice: null
    };
  }),

  addDirectItemToCart: (item) => set((state) => ({
    cart: [...state.cart, { id: Math.random().toString(36).substr(2, 9), ...item }]
  })),
}));

// A simple mock pricing calculator based on selections
function calculateMockPrice(config) {
  let price = MOCK_BASE_PRICE;
  
  if (config.material === 'ABS') price += 100;
  else if (config.material === 'PETG') price += 150;
  else if (config.material === 'TPU') price += 200;

  if (config.quality === 'High (0.1mm)') price += 200;
  else if (config.quality === 'Draft (0.3mm)') price -= 100;

  // Add cost based on strength filling
  price += Math.floor(config.strength * 2.5);

  return price;
}
