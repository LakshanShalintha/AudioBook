import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth, db } from '../../firebase'; // Correct import path
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

export default function SignUpPage() {
  const [formErrors, setFormErrors] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // State for showing success modal

  const navigate = useNavigate(); // Initialize useNavigate

  const validateForm = async (event) => {
    event.preventDefault();
    const errors = {};

    const form = event.target;

    // Validation logic remains unchanged
    if (!form.userName.value) errors.userName = 'Please enter your first name.';
    if (!form.email.value) errors.email = 'Please enter a valid email address.';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email.value)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!form.phoneNumber.value) errors.phoneNumber = 'Please enter a valid phone number.';
    else if (!/^\d{10}$/.test(form.phoneNumber.value)) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number.';
    }
    if (!form.password.value) errors.password = 'Please enter a password.';
    else if (form.password.value.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }
    if (!form.confirmPassword.value) errors.confirmPassword = 'Please confirm your password.';
    else if (form.confirmPassword.value !== form.password.value) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email.value,
          form.password.value
        );

        await setDoc(doc(db, "users", userCredential.user.uid), {
          userName: form.userName.value,
          email: form.email.value,
          phoneNumber: form.phoneNumber.value,
        });

        setShowSuccess(true); // Show success modal
      } catch (e) {
        showErrorDialog('Sign up failed', cleanErrorMessage(e.message));
      }
    }
  };

  const cleanErrorMessage = (errorMessage) => {
    const prefixEnd = errorMessage.indexOf(']') + 1;
    if (prefixEnd > 0) {
      return errorMessage.substring(prefixEnd).trim();
    }
    return errorMessage;
  };

  const showErrorDialog = (title, content) => {
    alert(`${title}: ${content}`);
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    navigate('/welcome'); // Redirect to WelcomePage when OK is clicked
  };

  return (
    <div className="fade-in" style={containerStyle}>
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
            margin-top: 5px;
          }
        `}
      </style>

      <h1 style={titleStyle}>Sign Up</h1>
      <form onSubmit={validateForm} style={formStyle}>
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={inputStyle}
            type={showPassword ? 'text' : 'password'}
          />
          <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"} style={toggleIconStyle} onClick={() => setShowPassword(!showPassword)}></i>
          {formErrors.password && <div className="error-message">{formErrors.password}</div>}
        </div>
        <div style={inputContainerStyle}>
          <i className="fas fa-lock" style={iconStyle}></i>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            style={inputStyle}
            type={showConfirmPassword ? 'text' : 'password'}
          />
          <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"} style={toggleIconStyle} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
          {formErrors.confirmPassword && <div className="error-message">{formErrors.confirmPassword}</div>}
        </div>

        <button type="submit" style={buttonStyle}>Sign Up</button>
        <p style={loginTextStyle}>If you already have an account <a href="/login" style={loginLinkStyle}>Login</a></p>
      </form>

      {showSuccess && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={modalTitleStyle}>Sign Up Successful</h2>
            <p>Thank you for signing up!</p>
            <button onClick={closeSuccessModal} style={modalButtonStyle}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles

const containerStyle = {
  height: '100vh',
  background: 'linear-gradient(to bottom, #131313, #312E2E)',
  position: 'relative',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const titleStyle = {
  color: 'white',
  margin: '0',
  fontSize: '60px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '50px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '15px', 
  width: '100%',
  maxWidth: '550px',
};

const inputContainerStyle = {
  position: 'relative',
  width: '100%',
};

const inputStyle = {
  width: '100%',
  height: '50px',
  padding: '18px 18px 18px 45px',
  borderRadius: '20px',
  border: '1px solid #ddd',
  fontSize: '16px',
  backgroundColor: '#fff',
  color: 'black',
};

const iconStyle = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '18px',
  color: 'black',
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
  marginTop: '20px', 
};

const loginTextStyle = {
  color: 'white',
  marginTop: '20px',
};

const loginLinkStyle = {
  color: 'blue',
  textDecoration: 'underline',
};

const toggleIconStyle = {
  position: 'absolute',
  right: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  color: 'black',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
  width: '80%',
  maxWidth: '400px',
};

const modalTitleStyle = {
  margin: '0 0 20px 0',
  fontSize: '24px',
  color: 'green',
};

const modalButtonStyle = {
  backgroundColor: '#FFA500',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
};
