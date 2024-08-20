import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { getAuth, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Setting() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      // Re-authenticate the user
      await signInWithEmailAndPassword(auth, currentUser.email, password);

      // Delete the account
      await deleteUser(currentUser);
      setMessage('The account was deleted successfully.');
      setMessageType('success');
      setShowPasswordPopup(false);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage('Error deleting account. Please ensure your password is correct.');
      setMessageType('error');
      setShowPasswordPopup(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessPopup(false);
    navigate('/welcome'); // Redirect to the welcome page
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-white text-xl font-semibold mb-8">Manage Account</h1>

      {/* Current Email Input */}
      <div className="w-full max-w-md bg-white rounded-full flex items-center mb-4 px-4 py-2 shadow-md">
        <FaEnvelope className="text-gray-600 mr-3" />
        <input
          type="email"
          placeholder="Enter current email"
          className="w-full bg-transparent focus:outline-none"
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
        />
      </div>

      {/* New Email Input */}
      <div className="w-full max-w-md bg-white rounded-full flex items-center mb-8 px-4 py-2 shadow-md">
        <FaEnvelope className="text-gray-600 mr-3" />
        <input
          type="email"
          placeholder="Enter new email"
          className="w-full bg-transparent focus:outline-none"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
      </div>

      {/* Save Email Button */}
      <button
        className="bg-orange-500 text-white py-2 px-8 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-300 mb-8"
      >
        Save Email
      </button>

      {/* Delete Account Button */}
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="border-2 border-red-500 text-red-500 py-2 px-8 rounded-full font-semibold shadow-md hover:bg-red-500 hover:text-white transition duration-300"
      >
        Delete Account
      </button>

      {/* Delete Account Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-gray-900 text-lg font-semibold mb-4">Are you sure you want to delete your account?</h2>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:bg-gray-600 transition duration-300"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setShowPasswordPopup(true);
                }}
                className="bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:bg-red-600 transition duration-300"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Popup for Deleting Account */}
      {showPasswordPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-gray-900 text-lg font-semibold mb-4">Enter Your Password</h2>
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-200 p-2 rounded mb-4 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:bg-red-600 transition duration-300"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Success Popup after Account Deletion */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-gray-900 text-lg font-semibold mb-4">The account was deleted successfully.</h2>
            <button
              onClick={handleSuccessOk}
              className="bg-orange-500 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-4 rounded text-white ${messageType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
