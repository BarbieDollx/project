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
        <div className="dashboard">
                       <header className="dashboard-header">
                           <div className="logo">Account Hub</div>
                           <nav>
                               <Link to="/dashboard" className="nav-link">Dashboard</Link>
                              <Link to="/my-products" className="nav-link active">My Products</Link>
                               <Link to="/products" className="nav-link">Products</Link>
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
           
                           <div className="products-grid">
                               {products.length === 0 ? (
                                   <div className="empty-state">
                                       <p>No products found. Add your first product!</p>
                                       <Link to="/create-product" className="btn-primary">
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

export default EditProduct;