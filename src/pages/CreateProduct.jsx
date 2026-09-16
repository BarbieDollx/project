import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateProduct.css";

const CreateProduct = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const navigate = useNavigate();

    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: productName,
                    category,
                    description: productDescription,
                    price: Number(productPrice),
                    image: productImage,
                    stock: Number(stockQuantity),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create product');
            }

            // Success! Go back to products page
            navigate('/products');
        } catch (err) {
            setError(err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-container">
            <div className="product-box">
                <div className="header">
                    <h1>Create New Product</h1>
                    <Link to="/products">← Back to Products</Link>
                </div>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label>
                        Product Name:
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Enter product name"
                            required
                        />
                    </label>

                    <label>
                        Category:
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g., Electronics, Clothing..."
                            required
                        />
                    </label>

                    <label>
                        Price ($):
                        <input
                            type="number"
                            step="0.01"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </label>

                    <label>
                        Stock:
                        <input
                            type="number"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            placeholder="0"
                            required
                        />
                    </label>

                    <label>
                        Description:
                        <textarea
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Enter a detailed description..."
                            required
                        />
                    </label>

                    <label>
                        Image URL:
                        <input
                            type="text"
                            value={productImage}
                            onChange={(e) => setProductImage(e.target.value)}
                            placeholder="Enter image URL"
                            required
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/products')}
                        className="cancel"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;