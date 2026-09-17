import {useEffect, useState} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    

    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try{
                const token = localStorage.getItem('token');

                if(!token){
                    throw new Error('You are not logged in. Please log in to edit products.');
                }

                const {data} = await axios.get(`${API_URL}/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProductName(data.name || '');
                setCategory(data.category || '');
                setProductDescription(data.description || '');
                setProductPrice(data.price || '');
                setProductImage(data.image || '');
                setStockQuantity(data.stock || '');
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);

                setError(
                    error.message?.data?.message ||
                    error.message ||
                    'Failed to load product'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
           
        try {
            const token = localStorage.getItem('token');
            if(!token){
                throw new Error('You are not logged in. Please log in to edit products.');
            }
            const {data} = await axios.put(`${API_URL}/api/products/${id}`, {
                name: productName,
                category,
                description: productDescription,
                price: productPrice,
                image: productImage,
                stock: stockQuantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            navigate('/my-products');
            

        } catch (error) {
            console.error('Error updating product:', error);
            setError(
                error.message?.data?.message ||
                error.message ||
                'Failed to update product'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
         <div className="create-container">
                    <div className="product-box">
                        <div className="header">
                            <h1>Edit Product</h1>
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
                                {loading ? 'Updating...' : 'Update Product'}
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
}

export default EditProduct;