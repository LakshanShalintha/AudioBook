import React from 'react';

function WelcomePage() {
  const backgroundStyle = {
    position: 'relative', // Position relative to allow overlay positioning
    backgroundImage: `url('/images/Onboarding/Welcome_Page.jpeg')`, // Assuming the image is in the public folder
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Move content to the top
    alignItems: 'center',
    color: '#fff',
    textAlign: 'center',
    paddingTop: '80px', // Increased padding to move text down
  };

  const overlayStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black overlay with 50% opacity
    zIndex: 1, // Place the overlay on top of the background
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2, // Place the content on top of the overlay
  };

  const titleStyle = {
    fontSize: '70px', // Adjust the font size as needed
    marginBottom: '100px', // Reduced margin to decrease space between title and paragraph
    fontWeight: 'bold', // Make the text bold
    marginTop: '50px',
  };

  const welcomeTextStyle = {
    fontSize: '24px', // Adjust font size to match UI
    fontFamily: 'cursive', // Replace with the font you think matches your UI
    fontWeight: 'normal', // If your UI uses normal weight
    marginTop: '20px', // Adjust spacing as needed
  };

  const buttonStyle = {
    backgroundColor: 'white',
    color: 'black',
    padding: '16px 92px', // Adjust padding to make sure text doesn't wrap
    borderRadius: '9999px', // Full rounded corners
    fontSize: '18px',
    fontWeight: '500', // Medium font weight
    margin: '10px',
    maxWidth: '300px',
    width: 'auto', // Set to auto to fit the content
    textAlign: 'center',
    whiteSpace: 'nowrap', // Prevents text from wrapping
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}></div> {/* Overlay */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>AudiRAB</h1>
        <p style={welcomeTextStyle}>
          Welcome to AudiRAB!
        </p>
        <p style={welcomeTextStyle}>
          Join us and unlock a universe of captivating audiobooks.<br/> Sign in or create an account to 
          explore an endless library <br/> of stories, from timeless classics to modern masterpieces. 
          <br/>Begin your auditory adventure with us today!
        </p>
        <div style={{ marginTop: '80px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <button style={buttonStyle}>Sign Up</button>
          <button style={{ ...buttonStyle, backgroundColor: '#ff9800', color: 'white' }}>Log In</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
