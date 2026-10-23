import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { CartToast } from '../components/CartToast';

const ShopContext = createContext();

export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const ShopProvider = ({ children }) => {
  // Master product catalog state (supports Admin CRUD)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Favorites state: list of product IDs
  const [favoriteIds, setFavoriteIds] = useState(['prod-1', 'prod-3']); // initial sample favorites

  // Cart state: list of standardized cart items with product, id, name, price, quantity, subtotal
  const [cart, setCart] = useState([
    {
      product: INITIAL_PRODUCTS[0],
      id: INITIAL_PRODUCTS[0].id,
      productId: INITIAL_PRODUCTS[0].id,
      name: INITIAL_PRODUCTS[0].name,
      imageUrl: INITIAL_PRODUCTS[0].imageUrl,
      image: INITIAL_PRODUCTS[0].imageUrl,
      fallbackEmoji: INITIAL_PRODUCTS[0].fallbackEmoji,
      price: INITIAL_PRODUCTS[0].price,
      pricePerKg: INITIAL_PRODUCTS[0].price,
      unitPrice: INITIAL_PRODUCTS[0].price,
      unit: INITIAL_PRODUCTS[0].unit || 'kg',
      quantity: 2,
      subtotal: INITIAL_PRODUCTS[0].price * 2,
    },
    {
      product: INITIAL_PRODUCTS[2],
      id: INITIAL_PRODUCTS[2].id,
      productId: INITIAL_PRODUCTS[2].id,
      name: INITIAL_PRODUCTS[2].name,
      imageUrl: INITIAL_PRODUCTS[2].imageUrl,
      image: INITIAL_PRODUCTS[2].imageUrl,
      fallbackEmoji: INITIAL_PRODUCTS[2].fallbackEmoji,
      price: INITIAL_PRODUCTS[2].price,
      pricePerKg: INITIAL_PRODUCTS[2].price,
      unitPrice: INITIAL_PRODUCTS[2].price,
      unit: INITIAL_PRODUCTS[2].unit || 'kg',
      quantity: 1,
      subtotal: INITIAL_PRODUCTS[2].price * 1,
    },
  ]);

  // Cart toast notification message state
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Past simulated orders
  const [orders, setOrders] = useState([]);

  // ================= FAVORITES METHODS =================
  const isFavorite = (productId) => favoriteIds.includes(productId);

  const toggleFavorite = (productId) => {
    setFavoriteIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const removeFavorite = (productId) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearFavorites = () => {
    setFavoriteIds([]);
  };

  // Get full product objects for current favorites
  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favoriteIds.includes(p.id));
  }, [products, favoriteIds]);

  // ================= CART METHODS =================
  const showToast = (msg = 'Added to cart successfully') => {
    setToastMessage(msg);
  };

  const addToCart = (product, quantityToAdd = 1) => {
    if (!product || quantityToAdd <= 0) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id || item.product?.id === product.id
      );

      if (existingIndex > -1) {
        // Product already in cart: update its quantity & subtotal without duplicates
        const updated = [...prevCart];
        const existingItem = updated[existingIndex];
        const newQty = existingItem.quantity + quantityToAdd;
        const itemPrice = product.price || existingItem.price || 0;
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQty,
          subtotal: itemPrice * newQty,
        };
        return updated;
      } else {
        // New item in cart with full item specifications
        const itemPrice = product.price || 0;
        return [
          ...prevCart,
          {
            product,
            id: product.id,
            productId: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            image: product.imageUrl,
            fallbackEmoji: product.fallbackEmoji,
            price: itemPrice,
            pricePerKg: itemPrice,
            unitPrice: itemPrice,
            unit: product.unit || 'kg',
            quantity: quantityToAdd,
            subtotal: itemPrice * quantityToAdd,
          },
        ];
      }
    });

    // Show immediate success feedback banner
    showToast('Added to cart successfully');
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === productId || item.product?.id === productId
      );
      if (existingIndex === -1) return prevCart;

      const currentItem = prevCart[existingIndex];
      const newQuantity = currentItem.quantity + delta;

      if (newQuantity <= 0) {
        // Remove item from cart when quantity is 0 or less
        return prevCart.filter(
          (item) => item.productId !== productId && item.product?.id !== productId
        );
      } else {
        const updated = [...prevCart];
        const itemPrice = currentItem.price || currentItem.product?.price || 0;
        updated[existingIndex] = {
          ...currentItem,
          quantity: newQuantity,
          subtotal: itemPrice * newQuantity,
        };
        return updated;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => item.productId !== productId && item.product?.id !== productId
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // ================= CALCULATED TOTALS =================
  // Total quantity of items (for badge count on tab bar)
  const cartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Subtotal: sum of (price * quantity)
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.price ?? item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  // Free delivery above ₹200, else ₹25 (₹0 if cart is empty)
  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= 200 ? 0 : 25;
  }, [cart, cartSubtotal]);

  // Promotional discount: ₹15 off for orders above ₹300
  const discount = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= 300 ? 15 : 0;
  }, [cart, cartSubtotal]);

  // Grand total
  const cartTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal + deliveryFee - discount;
  }, [cart, cartSubtotal, deliveryFee, discount]);

  // ================= ADMIN PRODUCT MANAGEMENT =================
  const addProduct = (newProductData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      rating: 4.5,
      reviewsCount: 1,
      unit: 'kg',
      fallbackEmoji: newProductData.category === 'Fruits' ? '🍎' : '🥦',
      badgeColor: newProductData.category === 'Fruits' ? '#FFF9C4' : '#E8F5E9',
      relatedProductIds: ['prod-1', 'prod-3'],
      ...newProductData,
      price: Number(newProductData.price) || 50,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            ...updatedData,
            price: Number(updatedData.price) || p.price,
          };
        }
        return p;
      })
    );

    // Also update product details in cart if present
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            product: {
              ...item.product,
              ...updatedData,
              price: Number(updatedData.price) || item.product.price,
            },
          };
        }
        return item;
      })
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // Remove from cart and favorites
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    setFavoriteIds((prev) => prev.filter((id) => id !== productId));
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  // ================= FILTERED PRODUCTS =================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // ================= ORDER MANAGEMENT =================
  const placeOrder = ({ customerUser, deliveryAddress = '42 Palm Grove Avenue, Green Acres, Bengaluru' } = {}) => {
    if (!cart || cart.length === 0) return null;

    const uniqueNum = `${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const orderId = `ORD-${uniqueNum}`;
    const nowIso = new Date().toISOString();

    const orderData = {
      id: orderId,
      orderId: orderId,
      customerId: customerUser?.id || 'cust-1',
      customerName: customerUser?.fullName || 'Customer',
      customerEmail: customerUser?.email || 'customer@grocery.com',
      customerPhone: customerUser?.phone || '9876543210',
      items: cart.map((item) => {
        const prod = item.product || {};
        const price = item.price ?? item.pricePerKg ?? prod.price ?? 0;
        return {
          productId: item.productId || prod.id,
          id: item.productId || prod.id,
          name: item.name || prod.name,
          category: prod.category || 'Groceries',
          image: item.imageUrl || item.image || prod.imageUrl,
          imageUrl: item.imageUrl || item.image || prod.imageUrl,
          fallbackEmoji: item.fallbackEmoji || prod.fallbackEmoji || '🥗',
          pricePerKg: price,
          price: price,
          unitPrice: price,
          quantity: item.quantity,
          unit: item.unit || prod.unit || 'kg',
          subtotal: item.subtotal || price * item.quantity,
        };
      }),
      subtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      discount: discount,
      totalAmount: cartTotal,
      total: cartTotal,
      status: 'Pending', // Initial status must be Pending per requirement 1.7
      deliveryAddress: deliveryAddress,
      createdAt: nowIso,
      updatedAt: nowIso,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setOrders((prev) => [orderData, ...prev]);
    clearCart();
    return orderData;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const validStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid order status.' };
    }

    let found = false;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.orderId === orderId) {
          found = true;
          return {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    return { success: found };
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId || o.orderId === orderId) || null;
  };

  const getCustomerOrders = (customerIdentifier) => {
    if (!customerIdentifier) return [];
    return orders.filter(
      (o) =>
        o.customerId === customerIdentifier ||
        o.customerEmail?.toLowerCase() === String(customerIdentifier).toLowerCase()
    );
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        favoriteIds,
        favoriteProducts,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartItemsCount,
        cartSubtotal,
        deliveryFee,
        discount,
        cartTotal,
        toastMessage,
        showToast,
        setToastMessage,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,
        getCustomerOrders,
      }}
    >
      {children}
      {toastMessage && (
        <CartToast
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      )}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
