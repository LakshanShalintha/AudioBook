import React from 'react';
import { useNavigate } from 'react-router-dom'; 

function WelcomePage() {
  const navigate = useNavigate(); 

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogIn = () => {
    navigate('/login');
  };

  const backgroundStyle = {
    position: 'relative',
    backgroundImage: `url('/images/Onboarding/Welcome_Page.jpeg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    textAlign: 'center',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1,
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    padding: '20px',
  };

  const titleStyle = {
    fontSize: '70px',
    marginBottom: '50px',
    fontWeight: 'bold',
  };

  const welcomeTextStyle = {
    fontSize: '24px',
    fontFamily: 'cursive',
    fontWeight: 'normal',
    marginTop: '20px',
  };

  const buttonStyle = {
    backgroundColor: 'white',
    color: 'black',
    padding: '16px 92px',
    borderRadius: '9999px',
    fontSize: '18px',
    fontWeight: '500',
    margin: '10px',
    maxWidth: '300px',
    width: 'auto',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}></div> {/* Overlay */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>AudiRAB</h1>
        <p style={welcomeTextStyle}>Welcome to AudiRAB!</p>
        <p style={welcomeTextStyle}>
          Join us and unlock a universe of captivating audiobooks.<br/> 
          Sign in or create an account to explore an endless library <br/> 
          of stories, from timeless classics to modern masterpieces.<br/>
          Begin your auditory adventure with us today!
        </p>
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <button style={buttonStyle} onClick={handleSignUp}>Sign Up</button>
          <button style={{ ...buttonStyle, backgroundColor: '#ff9800', color: 'white' }} onClick={handleLogIn}>Log In</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
