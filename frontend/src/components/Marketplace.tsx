import { useState, useEffect } from 'react';
import './Marketplace.css';

interface Product {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  wholesale_price: number;
  retail_price: number;
  rental_price_per_day: number;
  profit_margin: number;
  stock: number;
  sold_this_month: number;
  rented_count: number;
  supports_rental: boolean;
}

export function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderType, setOrderType] = useState<'purchase' | 'rental'>('purchase');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(7);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_AI_API_URL || 'http://47.93.166.48:8000';
      const assetsApiUrl = apiUrl.replace(':8000', ':8004');
      
      const response = await fetch(`${assetsApiUrl}/api/assets/products`);
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleOrder = async () => {
    if (!selectedProduct) return;

    try {
      const apiUrl = import.meta.env.VITE_AI_API_URL || 'http://47.93.166.48:8000';
      const assetsApiUrl = apiUrl.replace(':8000', ':8004');
      
      const response = await fetch(`${assetsApiUrl}/api/assets/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          type: orderType,
          quantity: quantity,
          rental_days: orderType === 'rental' ? rentalDays : 0
        })
      });

      const order = await response.json();
      alert(`订单创建成功！\n订单号: ${order.order_id}\n总价: $${order.total_price}`);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('订单创建失败');
    }
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    if (orderType === 'purchase') {
      return selectedProduct.retail_price * quantity;
    } else {
      return selectedProduct.rental_price_per_day * rentalDays * quantity;
    }
  };

  if (loading) {
    return <div className="marketplace-loading">加载中...</div>;
  }

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h1>🛒 虚拟商品市场</h1>
        <p className="marketplace-subtitle">
          购买或租赁优质虚拟商品，享受批发价优惠
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? '全部' : cat}
          </button>
        ))}
      </div>

      {/* 商品列表 */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-icon">{product.icon}</div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-stats">
                <div className="stat-item">
                  <span className="stat-label">库存</span>
                  <span className="stat-value">{product.stock} 件</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">月销量</span>
                  <span className="stat-value">{product.sold_this_month} 件</span>
                </div>
              </div>

              <div className="product-pricing">
                <div className="price-item">
                  <span className="price-label">购买价格</span>
                  <span className="price-value">${product.retail_price}</span>
                </div>
                {product.supports_rental && (
                  <div className="price-item">
                    <span className="price-label">租赁价格</span>
                    <span className="price-value">${product.rental_price_per_day}/天</span>
                  </div>
                )}
              </div>

              <div className="product-actions">
                <button
                  className="action-btn purchase"
                  onClick={() => {
                    setSelectedProduct(product);
                    setOrderType('purchase');
                  }}
                  disabled={product.stock === 0}
                >
                  💰 购买
                </button>
                {product.supports_rental && (
                  <button
                    className="action-btn rental"
                    onClick={() => {
                      setSelectedProduct(product);
                      setOrderType('rental');
                    }}
                    disabled={product.stock === 0}
                  >
                    ⏰ 租赁
                  </button>
                )}
              </div>

              {product.stock === 0 && (
                <div className="out-of-stock">暂时缺货</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 订单弹窗 */}
      {selectedProduct && (
        <div className="order-modal" onClick={() => setSelectedProduct(null)}>
          <div className="order-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>
              ✕
            </button>

            <h2>
              {selectedProduct.icon} {selectedProduct.name}
            </h2>
            <p className="modal-description">{selectedProduct.description}</p>

            <div className="order-type-selector">
              <button
                className={`type-btn ${orderType === 'purchase' ? 'active' : ''}`}
                onClick={() => setOrderType('purchase')}
              >
                💰 购买
              </button>
              {selectedProduct.supports_rental && (
                <button
                  className={`type-btn ${orderType === 'rental' ? 'active' : ''}`}
                  onClick={() => setOrderType('rental')}
                >
                  ⏰ 租赁
                </button>
              )}
            </div>

            <div className="order-form">
              <div className="form-group">
                <label>数量</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>

              {orderType === 'rental' && (
                <div className="form-group">
                  <label>租赁天数</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                  />
                </div>
              )}

              <div className="order-summary">
                <div className="summary-row">
                  <span>单价</span>
                  <span>
                    ${orderType === 'purchase'
                      ? selectedProduct.retail_price
                      : selectedProduct.rental_price_per_day}
                    {orderType === 'rental' && '/天'}
                  </span>
                </div>
                <div className="summary-row">
                  <span>数量</span>
                  <span>{quantity}</span>
                </div>
                {orderType === 'rental' && (
                  <div className="summary-row">
                    <span>天数</span>
                    <span>{rentalDays}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>总计</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button className="confirm-order-btn" onClick={handleOrder}>
                确认订单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
