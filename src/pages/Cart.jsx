import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Cart() {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);  // ← ADDED
    const { logout } = useAuth();

    const token = localStorage.getItem("token");

    const fetchCart = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load cart');  // ← Fixed typo
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
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update Quantity');
        }
    };

    const handleRemove = async (productId) => {
        setDeletingId(productId);  // ← Set deleting state
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
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove item');
        } finally {
            setDeletingId(null);  // ← Clear deleting state
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
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to clear cart');
        }
    };

    if (loading) {
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
                    <button onClick={() => handleClear()} className="btn-primary">
                        Clear Cart
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

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
                                        src={item.product?.image || 'https://via.placeholder.com/300'}
                                        alt={item.product?.name}
                                        className="cart-image"
                                    />
                                </div>
                                <div className="cart-info">
                                    <h3 className="cart-name">{item.product?.name}</h3>
                                    <p className="cart-category">{item.product?.category}</p>
                                    <p className="cart-price">${item.product?.price}</p>
                                    <p className={`cart-stock ${item.product?.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {item.product?.stock > 0 ? `In Stock (${item.product.stock})` : 'Out of Stock'}
                                    </p>

                                    {/* Quantity controls */}
                                    <div className="cart-qty-controls">
                                        <button
                                            onClick={() => handleQty(item.product._id, item.qty - 1, item.product.stock)}
                                            disabled={item.qty <= 1}
                                        >
                                            -
                                        </button>
                                        <span>Qty: {item.qty}</span>
                                        <button
                                            onClick={() => handleQty(item.product._id, item.qty + 1, item.product.stock)}
                                            disabled={item.qty >= item.product.stock}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="cart-item-total">
                                        Subtotal: ${(item.product?.price || 0) * item.qty}
                                    </p>

                                    <Link
                                        to={`/products/${item.product?._id}`}
                                        className="btn-primary"
                                        style={{ marginTop: '12px' }}
                                    >
                                        View Details
                                    </Link>

                                    <button
                                        onClick={() => handleRemove(item.product._id)}
                                        disabled={deletingId === item.product._id}
                                        className="btn-primary"
                                        style={{
                                            marginTop: '12px',
                                            border: '1px solid red',
                                            backgroundColor: 'red'
                                        }}
                                    >
                                        {deletingId === item.product._id ? 'Removing...' : 'Remove'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-total">
                        <h2>Total: ${subtotal.toFixed(2)}</h2>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Cart;