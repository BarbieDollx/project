import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Products from './pages/Products';
import './App.css';
import CreateProduct from './pages/CreateProduct';
import MyProducts from './pages/MyProducts';
import EditProduct from './pages/EditProduct';
import Cart from './pages/Cart';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
         <Route
           path="/login"
           element={
             <PublicRoute>
               <Login />
             </PublicRoute>
           }
         /> 
         <Route
           path="/dashboard"
           element={
             <ProtectedRoute>
               <Dashboard />
             </ProtectedRoute>
           }
         />
         <Route
           path="/settings"
           element={
             <ProtectedRoute>
               <Settings />
             </ProtectedRoute>
           }
         />
          <Route
           path="/products"
           element={
             <ProtectedRoute>
               <Products />
             </ProtectedRoute>
           }
         />
          <Route
           path="/create-product"
           element={
             <ProtectedRoute>
               <CreateProduct />
             </ProtectedRoute>
           }
         />
         <Route
           path="/my-products"
           element={
             <ProtectedRoute>
               <MyProducts />
             </ProtectedRoute>
           }
         />
         <Route
           path="/products/edit/:id"
           element={
             <ProtectedRoute>
               <EditProduct />
             </ProtectedRoute>
           }
         />
         <Route
         path='/cart'
         element={
          <ProtectedRoute>
            <Cart/>
          </ProtectedRoute>
         }
         />
         <Route path="/" element={<Navigate to="/login" replace />} />
         <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;