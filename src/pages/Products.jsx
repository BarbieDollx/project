import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./Products.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { logout } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching from:', `${API_URL}/api/products`); // ← Debug log
                
                const res = await fetch(`${API_URL}/api/products`);
                
                console.log('Response status:', res.status); // ← Debug log
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json(); // ← This is where it's failing
                setProducts(data);
            } catch (err) {
                console.error('Fetch error:', err); // ← Debug log
                setError(err.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="loading">Loading Products...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="logo">Account Hub</div>
                <nav>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/products" className="nav-link active">Products</Link>
                    <Link to="/settings" className="nav-link">Settings</Link>
                    <button onClick={logout} className="btn-outline">Logout</button>
                </nav>
            </header>

            <main className="container">
                <div className="products-header">
                    <h1 className="products-title">Products</h1>
                    <Link to="/products/new" className="btn-primary">
                        + Add Product
                    </Link>
                </div>

                <div className="products-grid">
                    {products.length === 0 ? (
                        <div className="empty-state">
                            <p>No products found. Add your first product!</p>
                            <Link to="/products/new" className="btn-primary">
                                Add Product
                            </Link>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className="product-card">
                                <div className="product-image-wrapper">
                                    <img 
                                        src={product.image || 'https://via.placeholder.com/300'} 
                                        alt={product.name}
                                        className="product-image"
                                    />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-category">{product.category}</p>
                                    <p className="product-price">${product.price}</p>
                                    <p className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                    </p>
                                    <Link to={`/products/${product._id}`} className="btn-primary" style={{ marginTop: '12px' }}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default Products;