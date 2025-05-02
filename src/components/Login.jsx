import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { Userlogin } from "../Api/auth";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      return;
    }
    
    const data = {
      "email": credentials.email,
      "password": credentials.password
    }    

    try {
      setLoading(true);
      setError('');
      const response = await Userlogin(data);
      console.log("from login",response);
    
      if (response && response.data.status) {
        // Store token or user data in localStorage if needed
        localStorage.setItem('isLoggedIn', 'true');
        // localStorage.setItem('token', response.data.token);
        navigate('/verify-otp', {state: { response : response.data }});
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Login failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>HRM System</h1>
          <p>Login to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-footer">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="signup-section">
            <p>New to HRM System?</p>
            <button
              type="button"
              className="signup-button"
              onClick={handleSignupClick}
              disabled={loading}
            >
              Create an Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
