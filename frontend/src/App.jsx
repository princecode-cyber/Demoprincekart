import React, { useState } from 'react';

const INITIAL_PRODUCTS = [
  { 
    id: 1,
    name: "Cyber Onyx Running Shoes", 
    price: 390, 
    description: "Advanced insulated outer shell with reactive premium sole tech.", 
    category: "Footwear", 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    stock: 24,
    isOutOfStock: false
  },
  { 
    id: 2,
    name: "Minimalist Matte Smartwatch", 
    price: 1300, 
    description: "Amphibious design language, titanium casing, 14-day hybrid performance battery.", 
    category: "Electronics", 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    stock: 8,
    isOutOfStock: false
  },
  { 
    id: 3,
    name: "Premium Cyber Obsidian Jacket", 
    price: 1290, 
    description: "Ultra-light breathable knit mesh upper with metallic matte zipper detailing.", 
    category: "Apparel", 
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    stock: 15,
    isOutOfStock: false
  }
];

const INITIAL_REGISTRY = {
  "princee": { password: "password123", role: "buyer", brand: "", phone: "+91 98765 43210", email: "princee@cyberkart.in", location: "742 Evergreen Terrace, Sector 4" },
  "nike_merchant": { password: "securepass", role: "partner", brand: "Nike", phone: "+91 88888 11111", email: "merch.support@nike.io", location: "Alpha Warehouse Hub 12, Bangalore" }
};

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [userRegistry, setUserRegistry] = useState(INITIAL_REGISTRY);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items");
  
  // Sales & Revenue Tracker Simulation Context
  const [totalSalesCount, setTotalSalesCount] = useState(304);
  const [totalRevenueValuation, setTotalRevenueValuation] = useState(38740);

  // User Authentication Context
  const [user, setUser] = useState(null);
  const [authTab, setAuthTab] = useState("login"); 
  const [userRole, setUserRole] = useState("buyer"); 
  const [authError, setAuthError] = useState("");
  
  // Login / Signup Inputs
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [brandName, setBrandName] = useState("");

  // Post-Login Profile Context
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileLocation, setProfileLocation] = useState("");

  // Payment Gateway Interface Modal State
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); 
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardPin, setCardPin] = useState("");

  // Product Creation state context
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Electronics");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemStock, setNewItemStock] = useState("50");
  const [newItemImage, setNewItemImage] = useState(null); 
  const [isDragging, setIsDragging] = useState(false);
  const [rowDragOverId, setRowDragOverId] = useState(null);

  // Partner Override Target Order Location State
  const [overrideLocations, setOverrideLocations] = useState({});

  const handleAuthAction = (e) => {
    e.preventDefault();
    setAuthError("");
    
    const normalizedUser = usernameInput.trim().toLowerCase();
    if (!normalizedUser || !passwordInput) {
      setAuthError("Credentials parameters cannot be empty fields.");
      return;
    }

    if (authTab === "signup") {
      if (userRegistry[normalizedUser]) {
        setAuthError("Security Conflict: Username node address already registered.");
        return;
      }
      if (userRole === "partner" && !brandName.trim()) {
        setAuthError("Brand Title registration context is mandatory.");
        return;
      }

      setUserRegistry({
        ...userRegistry,
        [normalizedUser]: {
          password: passwordInput,
          role: userRole,
          brand: userRole === "partner" ? brandName.trim() : "",
          phone: "Not Configured",
          email: "Not Configured",
          location: "Not Configured"
        }
      });
      
      alert("Registration Successful! Please sign in using your profile credentials.");
      setAuthTab("login");
      setPasswordInput("");
    } else {
      const discoveredUser = userRegistry[normalizedUser];
      if (!discoveredUser || discoveredUser.password !== passwordInput) {
        setAuthError("Access Denied: Invalid credentials profile mapping.");
        return;
      }

      setUser({
        name: usernameInput.trim(),
        role: discoveredUser.role,
        brand: discoveredUser.brand,
        phone: discoveredUser.phone,
        email: discoveredUser.email,
        location: discoveredUser.location
      });
      
      setProfilePhone(discoveredUser.phone);
      setProfileEmail(discoveredUser.email);
      setProfileLocation(discoveredUser.location);

      setUsernameInput("");
      setPasswordInput("");
      setBrandName("");
    }
  };

  const saveProfileChanges = (e) => {
    e.preventDefault();
    const normalizedKey = user.name.toLowerCase();
    
    const updatedUserObj = {
      ...userRegistry[normalizedKey],
      phone: profilePhone,
      email: profileEmail,
      location: profileLocation
    };

    setUserRegistry({
      ...userRegistry,
      [normalizedKey]: updatedUserObj
    });

    setUser(prev => ({
      ...prev,
      phone: profilePhone,
      email: profileEmail,
      location: profileLocation
    }));

    setIsUpdatingAccount(false);
    alert("Profile tracking details updated successfully.");
  };

  const handleInitiateCheckout = () => {
    if (!user.phone || user.phone === "Not Configured" || 
        !user.email || user.email === "Not Configured" || 
        !user.location || user.location === "Not Configured") {
      alert("Payment Forbidden: Please configure your Personal Profile Details (Number, Email, and Address) above first!");
      return;
    }
    setIsPaymentWindowOpen(true);
  };

  const processCheckoutSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === "CARD" && (!cardNumber || !cardExpiry || !cardCvv || !cardPin)) {
      alert("Please specify all cryptographic card parameters completely.");
      return;
    }

    const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalSalesCount(prev => prev + totalItemsCount);
    setTotalRevenueValuation(prev => prev + cartTotalPrice);

    const newOrderObj = {
      id: "PK-" + Math.floor(100000 + Math.random() * 900000),
      buyerName: user.name,
      date: new Date().toLocaleDateString(),
      items: [...cart],
      total: cartTotalPrice,
      method: paymentMethod,
      destination: user.location,
      statusStep: 1 
    };

    setOrders([newOrderObj, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setIsPaymentWindowOpen(false);
    
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardPin("");
    
    alert("Secure Order Dispatched Successfully!");
  };

  const updateDeliveryLocationByPartner = (orderId) => {
    const newLoc = overrideLocations[orderId];
    if (!newLoc || !newLoc.trim()) {
      alert("Please fill in a valid location description.");
      return;
    }
    setOrders(prevOrders => 
      prevOrders.map(o => o.id === orderId ? { ...o, destination: newLoc.trim() } : o)
    );
    alert(`Order ${orderId} location modified successfully.`);
  };

  const handleManualValueChange = (productId, field, deltaValue) => {
    setProducts(prevProducts => 
      prevProducts.map(p => {
        if (p.id === productId) {
          const currentVal = parseInt(p[field]) || 0;
          return { ...p, [field]: Math.max(0, currentVal + deltaValue) };
        }
        return p;
      })
    );
  };

  const handleInlineChange = (productId, field, value) => {
    setProducts(prevProducts =>
      prevProducts.map(p => p.id === productId ? { ...p, [field]: value } : p)
    );
  };

  const handleToggleStockStatus = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(p => p.id === productId ? { ...p, isOutOfStock: !p.isOutOfStock } : p)
    );
  };

  const handleRemoveProduct = (productId) => {
    if (window.confirm("Are you sure you want to remove this object?")) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    }
  };

  const processImageFile = (file, callback) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        callback(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file configuration.");
    }
  };

  const handleRowDrop = (e, productId) => {
    e.preventDefault();
    setRowDragOverId(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], (uri) => {
        handleInlineChange(productId, 'image', uri);
      });
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const parsedPrice = parseFloat(newItemPrice);
    const parsedStock = parseInt(newItemStock) || 0;
    if (!newItemName || isNaN(parsedPrice)) return;

    const finalImage = newItemImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";

    const newProductObject = {
      id: Date.now(),
      name: newItemName,
      price: parsedPrice,
      description: newItemDescription.trim() || "Premium custom catalog item.",
      category: newItemCategory,
      image: finalImage,
      stock: parsedStock,
      isOutOfStock: false
    };

    setProducts([newProductObject, ...products]); 
    setNewItemName("");
    setNewItemPrice("");
    setNewItemDescription("");
    setNewItemStock("50");
    setNewItemImage(null);
    setIsEditorOpen(false);
  };

  const addToCart = (product) => {
    if(product.isOutOfStock) return;
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All Items" || p.category === activeCategory;
    return matchesCategory && p.name.toLowerCase().includes(searchInput.toLowerCase());
  });

  return (
    <div style={{ backgroundColor: 'rgb(10, 10, 12)', minHeight: '100vh', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', paddingBottom: '80px', position: 'relative', overflowX: 'hidden' }}>
      
      {/* BACKGROUND GRAPHIC ORBS */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)', top: '2%', left: '-10%', pointerEvents: 'none', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', bottom: '5%', right: '-10%', pointerEvents: 'none', borderRadius: '50%' }}></div>

      <style>{`
        @keyframes floatEffect {
          0% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-25px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0px) scale(1); opacity: 0.4; }
        }
        @keyframes swayEffect {
          0% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(15px) rotate(8deg); }
          100% { transform: translateX(0px) rotate(0deg); }
        }
        .bubble-element {
          position: absolute; border-radius: 50%;
          background: linear-gradient(135deg, rgba(234,88,12,0.3), rgba(255,255,255,0.05));
          border: 1px solid rgba(255,255,255,0.15); pointer-events: none;
        }
        .doodle-path {
          position: absolute; border: 2px dashed rgba(234,88,12,0.25);
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; pointer-events: none;
          animation: swayEffect 8s ease-in-out infinite;
        }
        .glowing-brand-title { 
          font-size: 28px; font-weight: 900; letter-spacing: 2px; 
          background: linear-gradient(135deg, #ffffff, #fed7aa, #ea580c); 
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
          filter: drop-shadow(0 2px 10px rgba(234,88,12,0.4)); display: inline-block;
        }
        .showy-user-badge { 
          font-weight: 800; color: #ffedd5; background: rgba(254,215,170,0.15); 
          padding: 6px 14px; borderRadius: 8px; border: 1px solid rgba(254,215,170,0.3);
        }
        .control-row-btn { background: #2c0e06; border: 1px solid #ea580c; color: #fff; border-radius: 4px; width: 26px; height: 26px; cursor: pointer; font-weight: bold; display: inline-flex; align-items: center; justify-content: center; }
        .control-row-btn:hover { background: #ea580c; }
        .profile-container-card { background: rgb(20, 20, 25); border: 1px solid rgba(254,215,170,0.15); border-radius: 20px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); position: relative; overflow: hidden; }
        .profile-container-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #fdba74, #f97316, #c2410c); }
        .timeline-node { width: 14px; height: 14px; border-radius: 50%; background: #1e293b; position: relative; transition: all 0.3s; z-index: 2; }
        .timeline-node.active { background: #ea580c; box-shadow: 0 0 12px #ea580c; }
        .timeline-line { flex-grow: 1; height: 3px; background: #1e293b; margin: 0 -2px; z-index: 1; transition: all 0.3s; }
        .timeline-line.active { background: #ea580c; }
        .metric-mini-card { background: #18181b; border: 1px solid rgba(234,88,12,0.25); border-radius: 12px; padding: 16px 24px; display: flex; flex-direction: column; min-width: 180px; }
      `}</style>

      {!user ? (
        /* PORTAL LOGIN INTERFACE */
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: 'rgb(20, 20, 25)', border: '1px solid rgba(254,215,170,0.12)', borderRadius: '24px', width: '850px', display: 'flex', overflow: 'hidden', boxShadow: '0 0 45px rgba(0, 0, 0, 0.65)', position: 'relative' }}>
            
            {/* AMBIENT ART DECORATIVE VECTOR COLLAGE */}
            <div style={{ width: '42%', background: 'linear-gradient(135deg, #18181b, #09090b)', padding: '45px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgba(254,215,170,0.1)', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
              
              {/* Floating Bubbles */}
              <div className="bubble-element" style={{ width: '60px', height: '60px', top: '15%', left: '20%', animation: 'floatEffect 6s ease-in-out infinite' }}></div>
              <div className="bubble-element" style={{ width: '100px', height: '100px', bottom: '20%', right: '10%', animation: 'floatEffect 9s ease-in-out infinite 1s' }}></div>
              <div className="bubble-element" style={{ width: '40px', height: '40px', bottom: '60%', right: '25%', animation: 'floatEffect 5s ease-in-out infinite 0.5s' }}></div>
              
              {/* Abstract Doodles */}
              <div className="doodle-path" style={{ width: '180px', height: '160px', top: '25%', left: '10%' }}></div>
              <div className="doodle-path" style={{ width: '120px', height: '130px', bottom: '15%', left: '25%', animationDelay: '-3s' }}></div>

              <div style={{ position: 'relative', zIndex: 5 }}>
                <h4 className="glowing-brand-title">PRINCEKART</h4>
                <p style={{ color: '#fed7aa', fontSize: '13px', marginTop: '6px', fontWeight: '600' }}>Next-gen decentralized marketplace network</p>
              </div>

              <div style={{ position: 'relative', zIndex: 5, padding: '15px', backgroundColor: 'rgba(234,88,12,0.06)', borderRadius: '12px', border: '1px solid rgba(234,88,12,0.2)' }}>
                <span style={{ fontSize: '12px', color: '#fdba74', fontWeight: '600', display: 'block', marginBottom: '4px' }}>System Operational Metric</span>
                <span style={{ fontSize: '11px', color: '#a1a1aa', lineHeight: '1.4', display: 'block' }}>Gateway channels secure. Core cryptographic handshake pipelines synced.</span>
              </div>
            </div>

            {/* FORM VIEW CONTROLLER */}
            <div style={{ width: '58%', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box', position: 'relative', zIndex: 5 }}>
              <div style={{ display: 'flex', gap: '6px', backgroundColor: '#18181b', padding: '5px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button type="button" onClick={() => { setAuthTab("login"); setAuthError(""); }} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '9px', fontWeight: '700', cursor: 'pointer', backgroundColor: authTab === 'login' ? '#ea580c' : 'transparent', color: authTab === 'login' ? '#fff' : '#a1a1aa', fontSize: '14px' }}>Sign In</button>
                <button type="button" onClick={() => { setAuthTab("signup"); setAuthError(""); }} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '9px', fontWeight: '700', cursor: 'pointer', backgroundColor: authTab === 'signup' ? '#ea580c' : 'transparent', color: authTab === 'signup' ? '#fff' : '#a1a1aa', fontSize: '14px' }}>Sign Up</button>
              </div>

              {authError && <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>⚠️ {authError}</div>}

              <form onSubmit={handleAuthAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Account Vector Class</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div onClick={() => setUserRole("buyer")} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: userRole === 'buyer' ? '2px solid #ea580c' : '1px solid #27272a', backgroundColor: userRole === 'buyer' ? 'rgba(234,88,12,0.1)' : '#18181b', cursor: 'pointer', textAlign: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>🛍️ Buyer Profile</span>
                    </div>
                    <div onClick={() => setUserRole("partner")} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: userRole === 'partner' ? '2px solid #ea580c' : '1px solid #27272a', backgroundColor: userRole === 'partner' ? 'rgba(234,88,12,0.1)' : '#18181b', cursor: 'pointer', textAlign: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>🏪 Brand Partner</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '6px' }}>Username Address</label>
                  <input required type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="Enter username..." style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '6px' }}>Security Passcode</label>
                  <input required type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="••••••••" style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '8px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', outline: 'none' }} />
                </div>

                {authTab === "signup" && userRole === 'partner' && (
                  <div>
                    <label style={{ fontSize: '12px', color: '#ffedd5', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Brand Enterprise Title</label>
                    <input required type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Nike, Custom Corp..." style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '8px', border: '1px solid #ea580c', backgroundColor: '#18181b', color: '#fff', outline: 'none' }} />
                  </div>
                )}

                <button type="submit" style={{ width: '100%', padding: '13px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ea580c, #c2410c)', color: '#fff', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>Connect As {userRole.toUpperCase()}</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* LIVE APP FRAMEWORK */
        <>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 40px', backgroundColor: 'rgb(20, 20, 25)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ backgroundColor: '#ea580c', color: '#fff', fontWeight: '900', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '20px' }}>P</div>
              <span className="glowing-brand-title">PRINCEKART</span>
            </div>

            {user.role === 'buyer' && (
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search digital catalog metrics..." style={{ width: '350px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #ea580c', backgroundColor: '#18181b', color: '#fff', outline: 'none' }} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#fed7aa' }}>Identity: <strong className="showy-user-badge">{user.name}</strong> {user.role === 'partner' ? `[🏪 ${user.brand}]` : `[🛍️ Buyer Node]`}</span>
                <button onClick={() => { setUser(null); setIsCartOpen(false); setProducts(INITIAL_PRODUCTS); setIsUpdatingAccount(false); setOrders([]); }} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Disconnect</button>
              </div>
              
              {user.role === 'buyer' && (
                <button onClick={() => setIsCartOpen(!isCartOpen)} style={{ backgroundColor: '#ea580c', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '800', cursor: 'pointer' }}>
                  💼 CART
                  <span style={{ backgroundColor: '#fff', color: '#ea580c', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: '900' }}>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </button>
              )}
            </div>
          </header>

          {user.role === 'partner' ? (
            /* BRAND PARTNER DASHBOARD WORKSPACE */
            <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
              
              {/* LIVE ANALYTICS ENGINE STRIP */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <div className="metric-mini-card" style={{ borderLeft: '4px solid #ea580c' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Outbound Sales</span>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>{totalSalesCount} units</span>
                </div>
                <div className="metric-mini-card" style={{ borderLeft: '4px solid #22c55e' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Accumulated Gross Revenue</span>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#22c55e', marginTop: '4px' }}>${totalRevenueValuation.toLocaleString()}</span>
                </div>
                <div className="metric-mini-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Enterprise SKU Count</span>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>{products.length} Products</span>
                </div>
              </div>

              <div className="profile-container-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: '100%' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: '#fdba74', textTransform: 'uppercase' }}>🏪 Partner Registry & Warehouse Core</h4>
                    {!isUpdatingAccount ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px 40px', marginTop: '5px' }}>
                        <div><span style={{ fontSize: '12px', color: '#fdba74', display: 'block' }}>Merchant Full Name</span><strong style={{ color: '#fff', fontSize: '15px' }}>{user.name}</strong></div>
                        <div><span style={{ fontSize: '12px', color: '#fdba74', display: 'block' }}>Corporate Support Email</span><strong style={{ color: '#fff', fontSize: '15px' }}>{user.email}</strong></div>
                        <div><span style={{ fontSize: '12px', color: '#fdba74', display: 'block' }}>Secure Hot-Line Contact</span><strong style={{ color: '#fed7aa', fontSize: '15px' }}>{user.phone}</strong></div>
                        <div><span style={{ fontSize: '12px', color: '#fdba74', display: 'block' }}>Shop Location Coordinates Origin</span><strong style={{ color: '#ffedd5', fontSize: '15px' }}>{user.location}</strong></div>
                      </div>
                    ) : (
                      <form onSubmit={saveProfileChanges} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '4px' }}>Setup Secure Phone Line</label>
                          <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#18181b', border: '1px solid #ea580c', color: '#fff', outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '4px' }}>Setup Support Email</label>
                          <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#18181b', border: '1px solid #ea580c', color: '#fff', outline: 'none' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '4px' }}>Setup Physical Shop Location Coordinates</label>
                          <input type="text" value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#18181b', border: '1px solid #ea580c', color: '#fff', outline: 'none' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '5px' }}>
                          <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Commit Parameter Changes</button>
                          <button type="button" onClick={() => setIsUpdatingAccount(false)} style={{ padding: '8px 15px', backgroundColor: 'transparent', border: '1px solid #27272a', color: '#fdba74', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                  {!isUpdatingAccount && <button onClick={() => setIsUpdatingAccount(true)} style={{ background: 'rgba(254,215,170,0.1)', border: '1px solid rgba(254,215,170,0.2)', color: '#fed7aa', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>✏️ Update Details</button>}
                </div>
              </div>

              {orders.length > 0 && (
                <div style={{ backgroundColor: 'rgb(20, 20, 25)', border: '1px solid rgba(254,215,170,0.15)', borderRadius: '16px', padding: '25px', marginBottom: '35px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#fed7aa' }}>📦 Global Order Tracking & Delivery Management</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map(order => (
                      <div key={order.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                          <span style={{ fontSize: '12px', color: '#fdba74' }}>ORDER ID: <strong style={{ color: '#fed7aa' }}>{order.id}</strong></span>
                          <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '3px' }}>Buyer: {order.buyerName}</div>
                          <div style={{ fontSize: '13px', color: '#fdba74', marginTop: '2px' }}>Current Dest: <strong style={{ color: '#fff' }}>{order.destination}</strong></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="text" 
                            placeholder="Manually update destination..." 
                            value={overrideLocations[order.id] || ""} 
                            onChange={(e) => setOverrideLocations({ ...overrideLocations, [order.id]: e.target.value })}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ea580c', backgroundColor: 'rgb(10, 10, 12)', color: '#fff', outline: 'none', width: '220px', fontSize: '13px' }} 
                          />
                          <button 
                            onClick={() => updateDeliveryLocationByPartner(order.id)} 
                            style={{ padding: '8px 14px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                          >
                            Update Location
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(254,215,170,0.15)', paddingBottom: '20px', marginBottom: '35px' }}>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>Brand Management Dashboard: <span style={{ color: '#fed7aa' }}>{user.brand}</span></h2>
                </div>
                <button onClick={() => { setIsEditorOpen(!isEditorOpen); }} style={{ backgroundColor: '#ea580c', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                  {isEditorOpen ? '✕ Close Portal Form' : '+ Add Brand Item'}
                </button>
              </div>

              {isEditorOpen && (
                <div style={{ backgroundColor: 'rgb(20, 20, 25)', border: '2px solid #ea580c', borderRadius: '20px', padding: '30px', marginBottom: '40px' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '22px', fontWeight: '800' }}>🚀 Upload Asset Node</h3>
                  <form onSubmit={handleCreateProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: '#fdba74', marginBottom: '6px' }}>Product Title</label>
                      <input required type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. Kinetic Core Pods" style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #ea580c', backgroundColor: '#18181b', color: '#fff', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: '#fdba74', marginBottom: '6px' }}>Cost Index ($)</label>
                      <input required type="number" min="1" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} placeholder="e.g. 350" style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #ea580c', backgroundColor: '#18181b', color: '#fff', outline: 'none' }} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#fdba74', marginBottom: '6px' }}>Catalog Specifications</label>
                      <textarea rows="2" value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} placeholder="Describe product attributes..." style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #ea580c', backgroundColor: '#18181b', color: '#fff', resize: 'none' }}></textarea>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#fdba74', marginBottom: '6px' }}>Product Imagery Asset File Mapping</label>
                      <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) processImageFile(e.dataTransfer.files[0], setNewItemImage); }}
                        onClick={() => document.getElementById('new-file-upload').click()}
                        style={{ border: isDragging ? '2px dashed #fff' : '2px dashed #ea580c', backgroundColor: isDragging ? 'rgba(234,88,12,0.15)' : '#18181b', borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer' }}
                      >
                        <input id="new-file-upload" type="file" accept="image/*" onChange={(e) => { if(e.target.files[0]) processImageFile(e.target.files[0], setNewItemImage); }} style={{ display: 'none' }} />
                        {newItemImage ? (
                          <img src={newItemImage} alt="Preview" style={{ width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover' }} />
                        ) : (
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff', display: 'block' }}>Drag & Drop product image here</span>
                            <span style={{ fontSize: '12px', color: '#fdba74' }}>or click to browse your local storage files</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => setIsEditorOpen(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #ea580c', color: '#fdba74', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                      <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Publish Live</button>
                    </div>
                  </form>
                </div>
              )}

              {/* PRODUCT INVENTORY ROW EDITOR MATRIX */}
              <div style={{ backgroundColor: 'rgb(20, 20, 25)', border: '1px solid rgba(254,215,170,0.15)', borderRadius: '16px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(254,215,170,0.15)', backgroundColor: '#18181b' }}>
                      <th style={{ padding: '16px 20px', color: '#fdba74', fontSize: '12px', textTransform: 'uppercase' }}>Asset Mapping & D&D Update</th>
                      <th style={{ padding: '16px 20px', color: '#fdba74', fontSize: '12px', textTransform: 'uppercase' }}>Item Name Node</th>
                      <th style={{ padding: '16px 20px', color: '#fdba74', fontSize: '12px', textTransform: 'uppercase' }}>Valuation Cost ($)</th>
                      <th style={{ padding: '16px 20px', color: '#fdba74', fontSize: '12px', textTransform: 'uppercase' }}>Status Configuration</th>
                      <th style={{ padding: '16px 20px', color: '#fdba74', fontSize: '12px', textTransform: 'uppercase', textAlign: 'center' }}>Control Cluster</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr 
                        key={p.id} 
                        onDragOver={(e) => { e.preventDefault(); setRowDragOverId(p.id); }}
                        onDragLeave={() => setRowDragOverId(null)}
                        onDrop={(e) => handleRowDrop(e, p.id)}
                        style={{ borderBottom: '1px solid rgba(254,215,170,0.08)', backgroundColor: rowDragOverId === p.id ? 'rgba(234,88,12,0.1)' : 'transparent', transition: 'background-color 0.2s' }}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div 
                              onClick={() => document.getElementById(`row-file-${p.id}`).click()}
                              style={{ width: '50px', height: '50px', borderRadius: '8px', border: '1px dashed #ea580c', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                              title="Drag over or click to modify image asset drop"
                            >
                              <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, hover: { opacity: 1 }, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>📦</div>
                            </div>
                            <input id={`row-file-${p.id}`} type="file" accept="image/*" onChange={(e) => { if(e.target.files[0]) processImageFile(e.target.files[0], (uri) => handleInlineChange(p.id, 'image', uri)); }} style={{ display: 'none' }} />
                            <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Drop image file directly inside row layer</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <input type="text" value={p.name} onChange={(e) => handleInlineChange(p.id, 'name', e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', width: '200px', fontWeight: '600' }} />
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <input type="number" value={p.price} onChange={(e) => handleInlineChange(p.id, 'price', parseFloat(e.target.value) || 0)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', width: '80px', fontWeight: '700' }} />
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <button 
                            onClick={() => handleToggleStockStatus(p.id)} 
                            style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '12px', backgroundColor: p.isOutOfStock ? '#ef4444' : '#22c55e', color: '#fff' }}
                          >
                            {p.isOutOfStock ? '🔴 Out Of Stock' : '🟢 In Stock'}
                          </button>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <button type="button" onClick={() => handleRemoveProduct(p.id)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>🗑️ Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          ) : (
            /* ACTIVE BUYER STOREFRONT INTERFACE */
            <>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '20px', backgroundColor: 'rgb(20, 20, 25)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['All Items', 'Electronics', 'Footwear', 'Apparel'].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '10px 24px', borderRadius: '20px', border: activeCategory === cat ? '1px solid #fff' : '1px solid #ea580c', backgroundColor: activeCategory === cat ? 'rgba(254,215,170,0.15)' : '#18181b', color: activeCategory === cat ? '#fff' : '#fdba74', cursor: 'pointer', fontWeight: '700' }}>
                    {cat}
                  </button>
                ))}
              </div>

              <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
                <div className="profile-container-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '100%' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: '800', color: '#fed7aa', textTransform: 'uppercase' }}>🛍️ Customer Account Registry Meta</h4>
                      {!isUpdatingAccount ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 40px', marginTop: '5px' }}>
                          <div><span style={{ fontSize: '12px', color: '#fdba74', display: 'block' }}>User Full Name</span><strong style={{ color: '#fff', fontSize: '15px' }}>{user.name}</strong></div>
                          <div><span style={{ fontSize: '12px', color: '#fdba74', display: 'block' }}>Communication Email Address</span><strong style={{ color: '#fff', fontSize: '15px' }}>{user.email}</strong></div>
                          <div><span style={{ fontSize: '12px', color: '#fdba74', display: 'block' }}>Registered Contact Phone</span><strong style={{ color: '#fff', fontSize: '15px' }}>{user.phone}</strong></div>
                          <div><span style={{ fontSize: '12px', color: '#fdba74', display: 'block' }}>Object Delivery Destination Address</span><strong style={{ color: '#ffedd5', fontSize: '15px' }}>{user.location}</strong></div>
                        </div>
                      ) : (
                        <form onSubmit={saveProfileChanges} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                          <div>
                            <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '4px' }}>Setup Phone Number</label>
                            <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#18181b', border: '1px solid #ea580c', color: '#fff', outline: 'none' }} />
                          </div>
                          <div>
                            <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '4px' }}>Setup Email Address</label>
                            <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#18181b', border: '1px solid #ea580c', color: '#fff', outline: 'none' }} />
                          </div>
                          <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '4px' }}>Setup Delivery Destination Address</label>
                            <input type="text" value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#18181b', border: '1px solid #ea580c', color: '#fff', outline: 'none' }} />
                          </div>
                          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '5px' }}>
                            <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Save Identity Vector</button>
                            <button type="button" onClick={() => setIsUpdatingAccount(false)} style={{ padding: '8px 15px', backgroundColor: 'transparent', border: '1px solid #ea580c', color: '#fdba74', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        </form>
                      )}
                    </div>
                    {!isUpdatingAccount && <button onClick={() => setIsUpdatingAccount(true)} style={{ background: 'rgba(254,215,170,0.12)', border: '1px solid rgba(254,215,170,0.2)', color: '#fed7aa', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>✏️ Update Details</button>}
                  </div>
                </div>

                {orders.length > 0 && (
                  <div style={{ backgroundColor: 'rgb(20, 20, 25)', border: '1px solid rgba(254,215,170,0.15)', borderRadius: '20px', padding: '25px', marginBottom: '35px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '800' }}>📦 Your Order History & Live Tracking</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                      {orders.map((order) => (
                        <div key={order.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(254,215,170,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
                            <div><span style={{ color: '#fdba74', fontSize: '12px' }}>ORDER VECTOR ID</span><div style={{ color: '#fed7aa', fontWeight: '800' }}>{order.id}</div></div>
                            <div><span style={{ color: '#fdba74', fontSize: '12px' }}>DISPATCH DATE</span><div style={{ color: '#fff', fontWeight: '600' }}>{order.date}</div></div>
                            <div><span style={{ color: '#fdba74', fontSize: '12px' }}>GATEWAY METHOD</span><div style={{ color: '#fff', fontWeight: '700' }}>{order.method}</div></div>
                            <div><span style={{ color: '#fdba74', fontSize: '12px' }}>VALUATION TOTAL</span><div style={{ color: '#fff', fontWeight: '800' }}>${order.total.toLocaleString()}</div></div>
                          </div>

                          <div style={{ margin: '25px 0 15px 0', padding: '0 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                              <div className={`timeline-node ${order.statusStep >= 1 ? 'active' : ''}`}></div>
                              <div className={`timeline-line ${order.statusStep >= 2 ? 'active' : ''}`}></div>
                              <div className={`timeline-node ${order.statusStep >= 2 ? 'active' : ''}`}></div>
                              <div className={`timeline-line ${order.statusStep >= 3 ? 'active' : ''}`}></div>
                              <div className={`timeline-node ${order.statusStep >= 3 ? 'active' : ''}`}></div>
                              <div className={`timeline-line ${order.statusStep >= 4 ? 'active' : ''}`}></div>
                              <div className={`timeline-node ${order.statusStep >= 4 ? 'active' : ''}`}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', fontWeight: '700' }}>
                              <span style={{ color: order.statusStep >= 1 ? '#ea580c' : '#27272a' }}>Order Placed</span>
                              <span style={{ color: order.statusStep >= 2 ? '#ea580c' : '#27272a' }}>Shipped</span>
                              <span style={{ color: order.statusStep >= 3 ? '#ea580c' : '#27272a' }}>Out For Delivery</span>
                              <span style={{ color: order.statusStep >= 4 ? '#ea580c' : '#27272a' }}>Arrived Safely</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', backgroundColor: 'rgb(10, 10, 12)', padding: '8px 12px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#fdba74' }}>📍 Delivery Address Parameters: <strong style={{ color: '#fff' }}>{order.destination}</strong></span>
                            <button onClick={() => {
                              setOrders(prev => prev.map(o => o.id === order.id ? { ...o, statusStep: o.statusStep < 4 ? o.statusStep + 1 : 1 } : o));
                            }} style={{ backgroundColor: '#18181b', border: '1px solid #ea580c', color: '#fff', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>
                              ⚡ Simulate Shipment Move
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '28px' }}>Step into Tomorrow.</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                  {filteredProducts.map(product => (
                    <div key={product.id} style={{ backgroundColor: 'rgb(20, 20, 25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: product.isOutOfStock ? 0.75 : 1 }}>
                      <div style={{ height: '230px', width: '100%', backgroundColor: '#18181b', position: 'relative' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {product.isOutOfStock && (
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ backgroundColor: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontWeight: '800', fontSize: '14px', letterSpacing: '1px' }}>OUT OF STOCK</span>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#ea580c', fontWeight: '800' }}>{product.category || "Footwear"}</span>
                          <h3 style={{ fontSize: '19px', fontWeight: '700', marginTop: '6px', marginBottom: '10px' }}>{product.name}</h3>
                          <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{product.description}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                          <span style={{ fontSize: '24px', fontWeight: '800' }}>${product.price}</span>
                          <button 
                            disabled={product.isOutOfStock}
                            onClick={() => addToCart(product)} 
                            style={{ backgroundColor: product.isOutOfStock ? '#27272a' : '#ea580c', color: product.isOutOfStock ? '#a1a1aa' : '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: product.isOutOfStock ? 'not-allowed' : 'pointer' }}
                          >
                            {product.isOutOfStock ? 'Sold Out' : 'Add To Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </main>

              {/* SLIDEOUT CART DRAWER */}
              {isCartOpen && (
                <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px', backgroundColor: 'rgb(20, 20, 25)', borderLeft: '2px solid #ea580c', boxShadow: '-10px 0 40px rgba(0,0,0,0.6)', zIndex: 200, padding: '30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>🛍️ Checkout Portfolio</h3>
                      <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#fdba74', fontSize: '22px', cursor: 'pointer' }}>✕</button>
                    </div>

                    {cart.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '50px 0', color: '#a1a1aa' }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📦</div>
                        <p style={{ margin: 0, fontSize: '15px' }}>Your chosen cart configuration mapping is empty.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', maxHeight: 'calc(100vh - 340px)' }}>
                        {cart.map((item) => (
                          <div key={item.id} style={{ display: 'flex', gap: '12px', backgroundColor: '#18181b', padding: '12px', borderRadius: '12px', border: '1px solid #27272a', alignItems: 'center' }}>
                            <img src={item.image} alt="" style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div style={{ flexGrow: 1 }}>
                              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{item.name}</h5>
                              <p style={{ margin: '4px 0 0 0', color: '#fdba74', fontSize: '13px' }}>${item.price} × {item.quantity}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#fca5a5', fontSize: '16px', cursor: 'pointer' }}>🗑️</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                      <div style={{ backgroundColor: 'rgba(24,24,27,0.5)', padding: '12px', borderRadius: '8px', border: '1px solid #27272a', marginBottom: '15px', fontSize: '12px', color: '#fdba74' }}>
                        📍 Target Destination: <span style={{ color: '#fff', fontWeight: '600' }}>{user.location}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ color: '#a1a1aa', fontWeight: '600' }}>Subtotal Valuation:</span>
                        <span style={{ color: '#fff', fontSize: '24px', fontWeight: '800' }}>${cartTotalPrice.toLocaleString()}</span>
                      </div>
                      <button onClick={handleInitiateCheckout} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#ea580c', color: '#fff', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(234,88,12,0.3)' }}>Proceed to Checkout Gateway</button>
                    </div>
                  )}
                </div>
              )}

              {/* SECURITY PAYMENT GATEWAY VIEW MODAL */}
              {isPaymentWindowOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,10,12,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '20px' }}>
                  <div style={{ backgroundColor: 'rgb(20, 20, 25)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '520px', padding: '35px', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #27272a', paddingBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>💳 Secure Payment Gateway</h3>
                      <button onClick={() => setIsPaymentWindowOpen(false)} style={{ background: 'none', border: 'none', color: '#fdba74', fontSize: '22px', cursor: 'pointer' }}>✕</button>
                    </div>

                    <form onSubmit={processCheckoutSubmit}>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '13px', color: '#fdba74', display: 'block', marginBottom: '10px', fontWeight: '600' }}>Select Settlement Method</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div onClick={() => setPaymentMethod("COD")} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: paymentMethod === 'COD' ? '2px solid #ea580c' : '1px solid #27272a', backgroundColor: '#18181b', cursor: 'pointer', textAlign: 'center', fontWeight: '700' }}>
                            <span style={{ color: '#fff' }}>💵 COD</span>
                          </div>
                          <div onClick={() => setPaymentMethod("CARD")} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: paymentMethod === 'CARD' ? '2px solid #ea580c' : '1px solid #27272a', backgroundColor: '#18181b', cursor: 'pointer', textAlign: 'center', fontWeight: '700' }}>
                            <span style={{ color: '#fff' }}>💳 Card Core</span>
                          </div>
                        </div>
                      </div>

                      {paymentMethod === "CARD" && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#18181b', padding: '20px', borderRadius: '14px', border: '1px solid #27272a', marginBottom: '20px' }}>
                          <div>
                            <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '6px' }}>16-Digit Card Number</label>
                            <input required type="text" maxLength="16" value={cardNumber} onChange={(e) => setCardNumber(e.target.replace(/\D/g, ""))} placeholder="XXXX XXXX XXXX XXXX" style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: 'rgb(10, 10, 12)', color: '#fff', outline: 'none', fontFamily: 'monospace' }} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '6px' }}>Expiry (MM/YY)</label>
                              <input required type="text" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: 'rgb(10, 10, 12)', color: '#fff', outline: 'none', textAlign: 'center' }} />
                            </div>
                            <div>
                              <label style={{ fontSize: '12px', color: '#fdba74', display: 'block', marginBottom: '6px' }}>CVV</label>
                              <input required type="password" maxLength="3" value={cardCvv} onChange={(e) => setCardCvv(e.target.replace(/\D/g, ""))} placeholder="•••" style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: 'rgb(10, 10, 12)', color: '#fff', outline: 'none', textAlign: 'center' }} />
                            </div>
                          </div>
                        </div>
                      )}

                      <div style={{ backgroundColor: 'rgba(24,24,27,0.6)', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', border: '1px solid #27272a' }}>
                        <span style={{ color: '#a1a1aa', fontSize: '14px' }}>Valuation Due:</span>
                        <span style={{ color: '#fff', fontSize: '22px', fontWeight: '800' }}>${cartTotalPrice.toLocaleString()}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={() => setIsPaymentWindowOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ea580c', backgroundColor: 'transparent', color: '#fdba74', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#ea580c', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>Authorize Transaction</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}