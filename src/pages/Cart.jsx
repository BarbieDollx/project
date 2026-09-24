import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Cart() {
    const [cart, setCart] = useState([]);
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
            setcart(data);
        } catch(err) {
            setError(err.respond?.data?.message || 'Failed to clear cart');
        }
    };

    if (loading)  {
    return <div className='loading'>Loading cart...</div>;
  }

  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = items.product?.price || 0;
    return sum + price * item.qty;
  }, 0);

  return (
     <div className="dashboard">
            <header className="dashboard-header">
                <div className="logo">Account Hub</div>
                <nav>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/products" className="nav-link active">Products</Link>
                    <Link to="/my-products" className="nav-link">My Products</Link>
                    <Link to="/cart" className='nav-link'>Cart</Link>
                    <Link to="/settings" className="nav-link">Settings</Link>
                    <button onClick={logout} className="btn-outline">Logout</button>
                </nav>
            </header>

            <main className="container">
                <div className="products-header">
                    <h1 className="products-title">All Products</h1>
                    <Link to="/create-product" className="btn-primary">
                        + Add Product
                    </Link>
                </div>
                </main>
    </div>
  )
}


export default Cart;