import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '@fortawesome/fontawesome-free/css/all.min.css';  // Import Font Awesome CSS

export default function LogInPage() {
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); // Initialize navigate hook

  const validateForm = (event) => {
    event.preventDefault();
    const errors = {};

    const form = event.target;

    // Email validation
    if (!form.email.value) {
      errors.email = 'Please fill out this field.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email.value)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Password validation
    if (!form.password.value) {
      errors.password = 'Please fill out this field.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // If no errors, navigate to the Home Page
      navigate('/home'); // Redirect to Home Page
    }
  };

  return (
    <div className="fade-in" style={{
      height: '100vh',
      background: 'linear-gradient(to bottom, #131313, #312E2E)',
      position: 'relative',
      padding: '20px'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .fade-in {
            animation: fadeIn 1.5s ease-in-out;
          }

          .slide-up {
            animation: slideUp 1.5s ease-in-out;
          }

          input::placeholder {
            color: black;
          }
          .error-message {
            color: white;
            font-size: 10px;
            margin-top: 0px;
          }
        `}
      </style>

      <h1 className="slide-up" style={{
        color: 'white',
        margin: 0,
        position: 'absolute',
        top: '80px',
        left: '480px',
        fontSize: '65px',
        fontWeight: 'bold',
        textAlign: 'left'
      }}>
        Log In
      </h1>

      <form onSubmit={validateForm} className="slide-up" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '190px',
        gap: '10px'
      }}>
        <div style={inputContainerStyle}>
          <i className="fas fa-envelope" style={iconStyle}></i>
          <input type="email" name="email" placeholder="Email" style={inputStyle} />
          {formErrors.email && <div className="error-message">{formErrors.email}</div>}
        </div>
        <div style={inputContainerStyle}>
          <i className="fas fa-lock" style={iconStyle}></i>
          <input type="password" name="password" placeholder="Password" style={inputStyle} />
          {formErrors.password && <div className="error-message">{formErrors.password}</div>}
        </div>

        <div className="slide-up" style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '550px',
          marginBottom: '20px',
          color: 'white'
        }}>
          <div>
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe" style={{ marginLeft: '8px', color: 'white' }}>Remember Me</label>
          </div>
          <a href="/forgot-password" style={{ color: 'red', textDecoration: 'none' }}>Forgot Password?</a>
        </div>

        <button type="submit" className="slide-up" style={buttonStyle}>Log In</button>
        <p className="slide-up" style={{ color: 'white', marginBottom: '20px' }}>Don't have an account? <a href="/signup" style={{ color: 'blue' }}>Sign Up</a></p>

        <div className="slide-up" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '550px',
          margin: '10px 0',
          color: 'white'
        }}>
          <hr style={{ width: '45%' }} />
          <span style={{ margin: '0 10px' }}>or</span>
          <hr style={{ width: '45%' }} />
        </div>

        <div className="slide-up" style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
          <i className="fab fa-google" style={{ ...socialIconStyle, fontSize: '35px' }}></i>
          <i className="fab fa-facebook" style={{ ...socialIconStyle, fontSize: '35px' }}></i>
        </div>
      </form>
    </div>
  );
}

const inputContainerStyle = {
  position: 'relative',
  width: '550px',
  marginBottom: '20px',  // Ensure space below each input for error messages
};

const inputStyle = {
  width: '100%',
  height: '50px',  // Set the height of the input fields
  padding: '18px 18px 18px 45px',  // Adjust padding to make room for the icon
  borderRadius: '20px',
  border: '1px solid #ddd',
  fontSize: '16px',
  backgroundColor: '#fff',
  color: 'black'  // Set input text color to black
};

const iconStyle = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '18px',
  color: 'black'  // Set icon color to black
};

const buttonStyle = {
  width: '350px',
  padding: '18px',
  borderRadius: '55px',
  backgroundColor: '#FFA500',
  border: 'none',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
};

const socialIconStyle = {
  color: 'white',
  cursor: 'pointer'
};
