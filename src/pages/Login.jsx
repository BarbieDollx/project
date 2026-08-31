import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import {useAuth} from "../context/AuthContext"

const Login = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
   
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
     const {login} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    

    try {
        await login(email, password)
          navigate('/dashboard');
        } catch (err){
             setError(err.message || 'Login failed. Please try again.');
        }finally{
            setLoading(false);
        }
    }


   return (
        <div className="login-container">
            <div className="login-box">
                <h1>Welcome Back</h1>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <label htmlFor="email">Email</label> 
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="signup-link">
                    <Link to="/signup">Don't have an account? Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;