import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';  // Import Font Awesome CSS

export default function SignUpPage() {
  const [formErrors, setFormErrors] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = (event) => {
    event.preventDefault();
    const errors = {};

    const form = event.target;
    
    // User Name validation
    if (!form.userName.value) {
      errors.userName = 'Please fill out this field.';
    }

    // Email validation
    if (!form.email.value) {
      errors.email = 'Please fill out this field.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email.value)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Phone Number validation
    if (!form.phoneNumber.value) {
      errors.phoneNumber = 'Please fill out this field.';
    } else if (!/^\d{10}$/.test(form.phoneNumber.value)) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number.';
    }

    // Password validation
    if (!form.password.value) {
      errors.password = 'Please fill out this field.';
    } else if (form.password.value.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    // Confirm Password validation
    if (!form.confirmPassword.value) {
      errors.confirmPassword = 'Please fill out this field.';
    } else if (form.confirmPassword.value !== form.password.value) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // If no errors, submit the form (e.g., call API)
      alert('Form submitted successfully!');
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

          .fade-in {
            animation: fadeIn 1.5s ease-in-out;
          }

          input::placeholder {
            color: black;
          }
          .error-message {
            color: white;
            font-size: 10px;
            margin-top: 0 px;  // Add proper margin for error messages
          }
        `}
      </style>

      <h1 style={{
        color: 'white',
        margin: 0,
        position: 'absolute',
        top: '40px',
        left: '480px',
        fontSize: '60px',
        fontWeight: 'bold',
        textAlign: 'left'
      }}>
        Sign Up
      </h1>

      <form onSubmit={validateForm} style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '130px',  // Add space between "Sign Up" text and input fields
        gap: '10px'  // Adjust gap to allow space for error messages
      }}>
        <div style={inputContainerStyle}>
          <i className="fas fa-user" style={iconStyle}></i>
          <input type="text" name="userName" placeholder="User Name" style={inputStyle} />
          {formErrors.userName && <div className="error-message">{formErrors.userName}</div>}
        </div>
        <div style={inputContainerStyle}>
          <i className="fas fa-envelope" style={iconStyle}></i>
          <input type="email" name="email" placeholder="Email" style={inputStyle} />
          {formErrors.email && <div className="error-message">{formErrors.email}</div>}
        </div>
        <div style={inputContainerStyle}>
          <i className="fas fa-phone" style={iconStyle}></i>
          <input 
            type="text" 
            name="phoneNumber" 
            placeholder="Phone Number" 
            style={inputStyle} 
            maxLength="10" 
            pattern="\d*" 
            onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
          />
          {formErrors.phoneNumber && <div className="error-message">{formErrors.phoneNumber}</div>}
        </div>
        <div style={inputContainerStyle}>
          <i className="fas fa-lock" style={iconStyle}></i>
          <input type="password" name="password" placeholder="Password" style={inputStyle} />
          {formErrors.password && <div className="error-message">{formErrors.password}</div>}
        </div>
        <div style={inputContainerStyle}>
          <i className="fas fa-lock" style={iconStyle}></i>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" style={inputStyle} />
          {formErrors.confirmPassword && <div className="error-message">{formErrors.confirmPassword}</div>}
        </div>

        <button type="submit" style={buttonStyle}>Sign Up</button>
        <p style={{ color: 'white', marginBottom: '20px' }}>If you already have an account <a href="/login" style={{ color: 'blue' }}>  Login</a></p>
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
