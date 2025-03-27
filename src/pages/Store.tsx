
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StoreProduct, getProductsByCategory, getFeaturedProducts, getProductById } from '@/utils/storeData';
import { Leaf, ShoppingBag, TreeDeciduous, BadgeDollarSign, Recycle } from 'lucide-react';

const Store = () => {
  const { user, spendGreenPoints } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | 'plants' | 'home' | 'personal' | 'accessories'>('all');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get products based on active category
  const products = activeCategory === 'all' 
    ? getProductsByCategory('all')
    : getProductsByCategory(activeCategory);
  
  // Featured products for the hero section
  const featuredProducts = getFeaturedProducts();
  
  // Handle redeem click
  const handleRedeemClick = (productId: string) => {
    const product = getProductById(productId);
    if (product) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
    }
  };
  
  // Handle confirm redemption
  const handleConfirmRedemption = () => {
    if (selectedProduct && user) {
      const success = spendGreenPoints(selectedProduct.pointsCost, selectedProduct.name);
      if (success) {
        setIsDialogOpen(false);
      }
    }
  };
  
  // Render stars for sustainability rating
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Leaf
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-green-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 page-transition">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Green Rewards Store</h1>
        <p className="text-foreground/80 mb-6">
          Redeem your hard-earned green points for sustainable products
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <div className="inline-flex items-center bg-white rounded-full px-4 py-1 text-green-800 shadow-sm mb-4">
                <BadgeDollarSign className="h-4 w-4 mr-2 text-green-600" />
                <span className="font-medium">Your balance: {user?.greenScore || 0} points</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Shop Sustainable Products</h2>
              <p className="text-foreground/80 mb-4">
                Convert your eco-friendly actions into real-world products that help you live more sustainably.
                Every item in our store is carefully selected for its environmental impact.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white">Carbon Neutral</Badge>
                <Badge variant="outline" className="bg-white">Plastic-Free</Badge>
                <Badge variant="outline" className="bg-white">Sustainable Materials</Badge>
              </div>
            </div>
            
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              {featuredProducts.slice(0, 2).map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-sm mb-1 truncate">{product.name}</div>
                    <div className="text-xs text-green-700 font-semibold">{product.pointsCost} points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Store Navigation */}
      <div className="mb-8">
        <Tabs 
          defaultValue="all" 
          value={activeCategory}
          onValueChange={(value) => setActiveCategory(value as any)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all" className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">All Products</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="plants" className="flex items-center">
              <TreeDeciduous className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Plants</span>
              <span className="sm:hidden">Plants</span>
            </TabsTrigger>
            <TabsTrigger value="home" className="flex items-center">
              <Recycle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Home Goods</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center">
              <Leaf className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Personal Care</span>
              <span className="sm:hidden">Care</span>
            </TabsTrigger>
            <TabsTrigger value="accessories" className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Accessories</span>
              <span className="sm:hidden">Acc.</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {product.pointsCost} points
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-foreground/80 h-10 overflow-hidden">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    {renderRatingStars(product.sustainabilityRating)}
                    <span className="text-xs text-foreground/70">
                      Stock: {product.stock}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    className="w-full"
                    disabled={(user?.greenScore || 0) < product.pointsCost}
                    onClick={() => handleRedeemClick(product.id)}
                  >
                    {(user?.greenScore || 0) >= product.pointsCost ? 'Redeem' : 'Not enough points'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to exchange your green points for this item?
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="flex gap-4 items-start py-4">
              <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedProduct.name}</h3>
                <p className="text-sm text-foreground/80">{selectedProduct.description}</p>
                <div className="flex mt-2 items-center">
                  <Badge variant="outline" className="bg-green-50 text-green-700 mr-3">
                    {selectedProduct.pointsCost} points
                  </Badge>
                  <div className="text-sm text-foreground/80">
                    Your balance: <span className="font-medium">{user?.greenScore || 0} points</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmRedemption}
              disabled={!selectedProduct || (user?.greenScore || 0) < (selectedProduct?.pointsCost || 0)}
            >
              Confirm Redemption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Store;
