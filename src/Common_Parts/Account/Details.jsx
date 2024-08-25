import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

function Details({ onUpdateName, imageUrl }) {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setNameInput(userData.name || '');
            setEmailInput(userData.email || '');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [currentUser, db]);

  const handleSave = async () => {
    if (!currentUser) {
      console.error("User is not logged in.");
      setMessage('User is not logged in.');
      setMessageType('error');
      return;
    }

    const trimmedEmail = emailInput.trim().toLowerCase();
    const normalizedLoggedInEmail = currentUser.email.toLowerCase();

    if (trimmedEmail !== normalizedLoggedInEmail) {
      setMessage('The entered email does not match!');
      setMessageType('error');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          name: nameInput,
          email: emailInput,
        },
        { merge: true }
      );
      setMessage('Profile updated successfully!');
      setMessageType('success');
      if (onUpdateName && typeof onUpdateName === 'function') {
        onUpdateName(nameInput);
      }
      navigate('/profile');
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage('An error occurred while saving the profile.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      {/* Profile Picture Section */}
      <div className="relative mb-8">
        <img
          src={imageUrl || '/images/Onboarding/onboard01.webp'}  // Use the provided image path here
          alt="Profile"
          className="rounded-full w-32 h-32 border-4 border-white object-cover"
        />
      </div>

      {/* Name Input */}
      <div className="w-full max-w-md bg-white rounded-full flex items-center mb-6 px-4 py-2 shadow-md">
        <FaUser className="text-gray-600 mr-3" />
        <input
          type="text"
          placeholder="Name"
          className="w-full bg-transparent focus:outline-none"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
      </div>

      {/* Email Input */}
      <div className="w-full max-w-md bg-white rounded-full flex items-center mb-8 px-4 py-2 shadow-md">
        <FaEnvelope className="text-gray-600 mr-3" />
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-transparent focus:outline-none"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-orange-500 text-white py-2 px-8 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-300"
      >
        Save
      </button>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-4 rounded text-white ${messageType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Details;
