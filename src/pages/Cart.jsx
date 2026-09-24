import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Cart() {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchCart = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart(data);
        } catch(err) {
            setError(err.respond?.data?.message || 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);


    const handleQty = async (productId, qty, stock) => {
        if (qty < 1) return;
        if (qty > stock) {
            setError(`Only ${stock} in stock`);
            return;
        }

        setError("");
        try {
            const { data } = await axios.put(`${API_URL}/api/cart/items/${productId}`,
                { qty },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCart(data);
        } catch(err) {
            setError(err.respond?.data?.message || 'Failed to update Quantity');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        setError('');
        try {
            const { data } = await axios.delete(`${API_URL}/api/cart/items/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCart(data);
        } catch(err) {
            setError(err.respond?.data?.message || 'Failed to remove item');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        if (!window.confirm("Are you sure you want to clear the cart?")) return;

        setError('');
        try {
            const { data } = await axios.delete(`${API_URL}/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart(data);
        } catch(err) {
            setError(err.respond?.data?.message || 'Failed to clear cart');
        }
    };

    if (loading)  {
    return <div className='loading'>Loading cart...</div>;
  }

  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.qty;
  }, 0);

  return (
     <div className="dashboard">
            <header className="dashboard-header">
                <div className="logo">Account Hub</div>
                <nav>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/products" className="nav-link">Products</Link>
                    <Link to="/my-products" className="nav-link">My Products</Link>
                    <Link to="/cart" className='nav-link active'>Cart</Link>
                    <Link to="/settings" className="nav-link">Settings</Link>
                    <button onClick={logout} className="btn-outline">Logout</button>
                </nav>
            </header>

            <main className="container">
                <div className="cart-header">
                    <h1 className="cart-title">My Cart</h1>
                    <button
                        onClick={() => handleClear()}
                        className="btn-primary"
                    >
                        Clear Cart
                    </button>
                 
                   <div className="cart-grid">
                    {items.length === 0 ? (
                        <div className="empty-state">
                            <p>No items in cart!</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item._id} className="cart-card">
                                <div className="cart-image-wrapper">
                                    <img 
                                        src={item.image || 'https://via.placeholder.com/300'} 
                                        alt={item.name}
                                        className="cart-image"
                                    />
                                </div>
                                <div className="cart-info">
                                    <h3 className="cart-name">{item.name}</h3>
                                    <p className="cart-category">{item.category}</p>
                                    <p className="cart-price">${item.price}</p>
                                    <p className={`cart-stock ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {item.stock > 0 ? `In Stock (${item.stock})` : 'Out of Stock'}
                                    </p>
                                    <Link to={`/products/${item._id}`} className="btn-primary" style={{ marginTop: '12px' }}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                    </div>


                </div>
            </main>
        </div>
    )
}


export default Cart;