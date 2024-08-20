import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function LogInPage() {
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const remember = localStorage.getItem('rememberMe') === 'true';
    if (remember && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const errors = {};

    if (!email) {
      errors.email = 'Please fill out this field.';
    }
    if (!password) {
      errors.password = 'Please fill out this field.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMe', true);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.setItem('rememberMe', false);
      }

      navigate('/home');
    } catch (error) {
      handleError(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName,
      });

      navigate('/home');
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    let message = '';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Invalid Email or Password';
        break;
      default:
        message = 'Invalid Email or Password!';
    }

    setErrorMessage(message);
  };

  const closePopup = () => {
    setErrorMessage('');
  };

  return (
    <div className="fade-in" style={containerStyle}>
      <h1 className="slide-up" style={titleStyle}>Log In</h1>

      {errorMessage && (
        <div style={popupStyle}>
          <div style={popupContentStyle}>
            <span style={closeButtonStyle} onClick={closePopup}>&times;</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="slide-up" style={formStyle}>
        <div style={inputContainerStyle}>
          <i className="fas fa-envelope" style={iconStyle}></i>
          <input
            type="email"
            placeholder="Email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {formErrors.email && <div className="error-message">{formErrors.email}</div>}
        </div>
        <div style={inputContainerStyle}>
          <i className="fas fa-lock" style={iconStyle}></i>
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {formErrors.password && <div className="error-message">{formErrors.password}</div>}
        </div>

        <div style={rememberMeContainerStyle}>
          <div>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe" style={{ marginLeft: '8px', color: 'white' }}>Remember Me</label>
          </div>
          <a href="/forgot-password" style={forgotPasswordStyle}>Forgot Password?</a>
        </div>

        <button type="submit" className="slide-up" style={buttonStyle}>Log In</button>
        <p className="slide-up" style={signUpTextStyle}>Don't have an account? <a href="/signup" style={signUpLinkStyle}>Sign Up</a></p>

        <div className="slide-up" style={separatorStyle}>
          <hr style={hrStyle} />
          <span style={{ margin: '0 10px' }}>or</span>
          <hr style={hrStyle} />
        </div>

        <div className="slide-up" style={socialContainerStyle}>
          <i className="fab fa-google" onClick={handleGoogleLogin} style={{ ...socialIconStyle, fontSize: '35px' }}></i>
          <i className="fab fa-facebook" style={{ ...socialIconStyle, fontSize: '35px' }}></i>
        </div>
      </form>
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
  fontSize: '65px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '60px',
};

const popupStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: '1000',
};

const popupContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
  position: 'relative',
  width: '80%',
  maxWidth: '400px',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  cursor: 'pointer',
  fontSize: '20px',
  color: '#000',
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

const rememberMeContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  color: 'white',
  marginBottom: '20px',
};

const forgotPasswordStyle = {
  color: 'red',
  textDecoration: 'none',
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

const signUpTextStyle = {
  color: 'white',
  marginTop: '20px',
};

const signUpLinkStyle = {
  color: 'blue',
  textDecoration: 'underline',
};

const separatorStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  margin: '20px 0',
  color: 'white',
};

const hrStyle = {
  width: '45%',
};

const socialContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
};

const socialIconStyle = {
  color: 'white',
  cursor: 'pointer',
};


