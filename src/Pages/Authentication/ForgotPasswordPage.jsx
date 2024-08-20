import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSendingEmail(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showSuccessDialog();
    } catch (error) {
      showErrorDialog('Error', error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const showErrorDialog = (title, content) => {
    alert(`${title}: ${content}`);
  };

  const showSuccessDialog = () => {
    alert('Password Reset Email Sent. Please check your email.');
    navigate('/login');
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>←</button>
      <h1 style={titleStyle}>Forgot Password!</h1>
      <p style={instructionTextStyle}>Enter your email address to reset password</p>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputContainerStyle}>
          <i className="fas fa-envelope" style={iconStyle}></i>
          <input
            type="email"
            placeholder="E-mail"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          style={submitButtonStyle}
          disabled={isSendingEmail}
        >
          {isSendingEmail ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

// Styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  height: '100vh',
  justifyContent: 'center',
  backgroundColor: '#f0f0f0', // Updated background color
};

const backButtonStyle = {
  alignSelf: 'flex-start',
  marginBottom: '20px',
  fontSize: '20px',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  color: '#007bff',
};

const titleStyle = {
  fontSize: '25px',
  color: 'black',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '20px',
};

const instructionTextStyle = {
  fontSize: '14px', // Slightly increased font size
  color: 'black',
  textAlign: 'center',
  marginBottom: '20px',
};

const formStyle = {
  width: '100%',
  maxWidth: '400px',
  padding: '0 20px', // Added padding for form
};

const inputContainerStyle = {
  position: 'relative',
  marginBottom: '20px',
};

const iconStyle = {
  position: 'absolute',
  top: '50%',
  left: '10px',
  transform: 'translateY(-50%)',
  fontSize: '18px',
  color: '#aaa',
};

const inputStyle = {
  width: '100%',
  padding: '10px 10px 10px 35px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '16px',
  color: '#333',
};

const submitButtonStyle = {
  width: '100%',
  padding: '15px',
  borderRadius: '30px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
};
