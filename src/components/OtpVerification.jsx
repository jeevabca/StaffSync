import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/OtpVerification.css';
import { OtpVerify } from '../Api/auth';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
  const location = useLocation();
  const routeData = location.state.response

  

  useEffect(() => {
    // Focus on first input when component mounts
    inputRefs[0].current.focus();
    
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Move to next input if current input is filled
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus on the last input
      inputRefs[5].current.focus();
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    
    const otpValue = otp.join('');
    
    // Validate OTP
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    const data = {
        "email": routeData.email,
        "otp": otpValue,
        "otpId": routeData.otpId
      }
    
    try {
      setLoading(true);
      setError('');
      
      const otpResponse = await OtpVerify(data);
      console.log("otpResponse",otpResponse);
      
      
      
      if(otpResponse && otpResponse.data.status) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      
       
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard');
      }     
    } catch (error) {
      setError('OTP verification failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Here you would make an API call to resend OTP
      console.log('Resending OTP');
      
      // Reset timer
      setTimer(60);
      
      // Start countdown again
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      
    } catch (error) {
      setError('Failed to resend OTP: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-header">
          <h1>Verify Your Account</h1>
          <p>We've sent a 6-digit OTP to your email</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : null}
                ref={inputRefs[index]}
                className="otp-input"
                required
              />
            ))}
          </div>
          
          <button 
            type="submit" 
            className="verify-button" 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <div className="resend-section">
            <p>
              Didn't receive the code?{' '}
              <button
                type="button"
                className={`resend-button ${timer > 0 ? 'disabled' : ''}`}
                onClick={handleResendOtp}
                disabled={timer > 0 || loading}
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;