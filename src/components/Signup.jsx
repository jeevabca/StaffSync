import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import { Role } from '../constant/constant';
import { SignUp } from '../Api/auth';
import { useMutation } from '@tanstack/react-query';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: Role.None,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const signupMutation = useMutation({
    mutationFn: (userData) => SignUp(userData),
    onSuccess: (data) => {
      console.log('Registration successful:', data);
      if (data.status) {
        alert('Account created successfully! Please login.');
        navigate('/login');
      } else {
        console.log('Registration failed:', data);
        setError(data.message || 'Registration failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    },  
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const userData = {
      name: formData.firstName + formData.lastName ,
      email: formData.email,
      password: formData.password,
      role: Number(formData.role)
    };

    signupMutation.mutate(userData);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>HRM System</h1>
          <p>Create a new account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              {Object.entries(Role).map(([roleName, roleValue]) => (
                <option key={roleValue} value={roleValue}>
                  {roleName}
                </option>
              ))}
            </select>
          </div>
          
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button type="submit" className="signup-button" disabled={signupMutation.isPending}> {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}</button>
          
          <div className="login-link">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </form>
      </div>  
    </div>
  );
};

export default Signup;