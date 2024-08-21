import React from 'react';
import NavBar from '../../Common_Parts/Common/NavBar';
import Footer from '../../Common_Parts/Common/Footer';

function About() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col relative overflow-y-auto">
      <NavBar hideSearch={true} />
      
      <div className="flex flex-1 relative z-10 items-start justify-between pl-16 pr-16 mt-52 ml-24">
        {/* Gray circle wrapper around the girl image */}
        <div
          className="flex items-center justify-center bg-gray-500"
          style={{
            width: '420px', // Set width of the large circle
            height: '420px', // Set height of the large circle
            borderRadius: '50%', // Make the container a circle
            zIndex: '20', // Ensure it's above other elements
          }}
        >
          {/* Girl image inside the gray circle */}
          <img
            src="/images/Onboarding/onboard01.webp" // Your girl image /images/About/Gril.webp
            alt="Logo"
            className="w-full h-auto"
            style={{
              borderRadius: '50%', // Ensure the image itself is also circular
            }}
          />
        </div>

        {/* Text content on the right side */}
        <div className="flex flex-col justify-start mt-32 ml-16 mr-40">
          <h1 className="text-white text-8xl -mt-32">About</h1>
          <p className="text-white text-3xl max-w-lg mt-16">Welcome to AudiRAB</p>
          <p className="text-white text-xl max-w-lg mt-4">
            At AudiRAB, we believe that stories should be accessible to everyone,
            anywhere, anytime. Whether you're on the go, winding down at the end of the day, 
            or just looking to immerse yourself in a captivating tale, our platform brings the world of literature to your ears.
          </p>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="flex flex-1 relative z-10 items-start justify-between pl-16 pr-16 mt-20">
        {/* Our Mission text on the left */}
        <div className="flex flex-col justify-start max-w-lg mt-32 ml-32">
          <p className="text-white text-4xl">Our Mission</p>
          <p className="text-white text-xl mt-4" style={{ textAlign: 'justify' }}>
            Our mission is simple: to make reading more accessible and enjoyable for everyone.
            We know that life can get busy, and sometimes finding the time to sit down with a good book isn't easy. 
            That's why we've created AudiRAB to help you enjoy your favorite books no matter where you are or what you're doing.
          </p>
        </div>

        {/* Image on the right */}
        <div className="flex items-center justify-center mt-24 mr-52">
          <img
            src="/images/About/Gril.webp" // The image you want to display on the right
            alt="Our Mission"
            className="w-80 h-80 object-cover rounded-full"
          />
        </div>
      </div>

      {/* Why Choose Us? and Join Us on Our Journey Sections */}
      <div className="flex flex-1 relative z-10 items-start justify-between pl-16 pr-16 mt-20">
        {/* Why Choose Us? text on the left */}
        <div className="flex flex-col justify-start max-w-lg mt-32 ml-24">
          <p className="text-white text-4xl">Why Choose Us?</p>
          <p className="text-white text-xl mt-4" style={{ textAlign: 'justify' }}>
            AudiRAB isn't just another audiobook app. It's a community of book lovers who understand the power of storytelling.
            We work with top publishers and narrators to bring you high-quality audio experiences. 
            Plus, our platform is constantly evolving, with new features and books added regularly, so there’s always something new to discover.
          </p>
        </div>

        {/* Join Us on Our Journey text on the right */}
        <div className="flex flex-col justify-start max-w-lg mt-32 ml-16 mr-24">
          <p className="text-white text-4xl">Join Us on Our Journey</p>
          <p className="text-white text-xl mt-4" style={{ textAlign: 'justify' }}>
            Whether you're a lifelong reader or new to audiobooks, AudiRAB is here to enhance your reading experience.
            Dive into a world of stories, and let your imagination soar with every word.
          </p>
        </div>
      </div>

      {/* Bottom Centered Text */}
      <div className="flex justify-center items-center mt-16">
        <p className="text-white text-2xl">Thank you for choosing AudiRAB. Happy listening!</p>
      </div>

      <Footer />
    </div>
  );
}

export default About;
