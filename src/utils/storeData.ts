
export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'plants' | 'home' | 'personal' | 'accessories';
  imageUrl: string;
  stock: number;
  sustainabilityRating: 1 | 2 | 3 | 4 | 5; // 1-5 stars
  featured?: boolean;
}

export const storeProducts: StoreProduct[] = [
  {
    id: 'plant-1',
    name: 'Indoor Snake Plant',
    description: 'Low-maintenance air-purifying plant, perfect for beginners.',
    pointsCost: 250,
    category: 'plants',
    imageUrl: 'https://images.unsplash.com/photo-1616500594881-c379afa7af6b?q=80&w=500',
    stock: 10,
    sustainabilityRating: 5,
    featured: true
  },
  {
    id: 'plant-2',
    name: 'Peace Lily',
    description: 'Beautiful flowering plant that helps clean indoor air.',
    pointsCost: 300,
    category: 'plants',
    imageUrl: 'https://images.unsplash.com/photo-1615213612138-4d1e2c33932d?q=80&w=500',
    stock: 8,
    sustainabilityRating: 5
  },
  {
    id: 'plant-3',
    name: 'Spider Plant',
    description: 'Fast-growing, adaptable plant that removes toxins from the air.',
    pointsCost: 200,
    category: 'plants',
    imageUrl: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?q=80&w=500',
    stock: 15,
    sustainabilityRating: 4
  },
  {
    id: 'home-1',
    name: 'Bamboo Utensil Set',
    description: 'Reusable bamboo cutlery set with carrying case.',
    pointsCost: 180,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1584346133934-a3c73e3daa14?q=80&w=500',
    stock: 20,
    sustainabilityRating: 5,
    featured: true
  },
  {
    id: 'home-2',
    name: 'Beeswax Food Wraps',
    description: 'Reusable, biodegradable alternative to plastic wrap.',
    pointsCost: 220,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1601459441284-7f0889bac6b3?q=80&w=500',
    stock: 12,
    sustainabilityRating: 5
  },
  {
    id: 'personal-1',
    name: 'Bamboo Toothbrush',
    description: 'Biodegradable toothbrush with soft bristles.',
    pointsCost: 80,
    category: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=500',
    stock: 30,
    sustainabilityRating: 4
  },
  {
    id: 'personal-2',
    name: 'Organic Cotton Tote',
    description: 'Durable, washable shopping bag made from organic cotton.',
    pointsCost: 150,
    category: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1590105577767-e21a1067899f?q=80&w=500',
    stock: 25,
    sustainabilityRating: 4,
    featured: true
  },
  {
    id: 'accessories-1',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated, reusable water bottle that keeps drinks hot or cold.',
    pointsCost: 350,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=500',
    stock: 18,
    sustainabilityRating: 5
  },
  {
    id: 'accessories-2',
    name: 'Solar Powered Charger',
    description: 'Portable solar panel for charging phones and small devices.',
    pointsCost: 500,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1624846156538-f83ead4f99b4?q=80&w=500',
    stock: 5,
    sustainabilityRating: 5,
    featured: true
  },
  {
    id: 'home-3',
    name: 'Recycled Glass Containers',
    description: 'Set of 3 food storage containers made from recycled glass.',
    pointsCost: 280,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1590845947667-163222006344?q=80&w=500',
    stock: 10,
    sustainabilityRating: 4
  },
  {
    id: 'plant-4',
    name: 'Herb Garden Kit',
    description: 'Everything you need to grow basil, parsley, and mint at home.',
    pointsCost: 320,
    category: 'plants',
    imageUrl: 'https://images.unsplash.com/photo-1466692476655-abc7e1d0af05?q=80&w=500',
    stock: 7,
    sustainabilityRating: 5
  },
  {
    id: 'personal-3',
    name: 'Shampoo Bar',
    description: 'Zero-waste solid shampoo that lasts as long as 3 bottles.',
    pointsCost: 120,
    category: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1607006483513-0462750565eb?q=80&w=500',
    stock: 15,
    sustainabilityRating: 5
  }
];

// Function to get products by category
export const getProductsByCategory = (category: StoreProduct['category'] | 'all') => {
  if (category === 'all') {
    return storeProducts;
  }
  return storeProducts.filter(product => product.category === category);
};

// Function to get featured products
export const getFeaturedProducts = () => {
  return storeProducts.filter(product => product.featured);
};

// Function to get a product by ID
export const getProductById = (id: string) => {
  return storeProducts.find(product => product.id === id);
};
