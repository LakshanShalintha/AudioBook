import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

function Password() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleChangePassword = async () => {
    if (!currentUser) {
      setMessage('User is not logged in.');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      setMessageType('error');
      return;
    }

    try {
      // Re-authenticate the user
      const credential = signInWithEmailAndPassword(auth, currentUser.email, currentPassword);
      await credential;

      // Update the password
      await updatePassword(currentUser, newPassword);
      setMessage('Password changed successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Error changing password. Please ensure your current password is correct.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-white text-xl font-semibold mb-8">Change Password</h1>

      {/* Current Password Input */}
      <div className="w-full max-w-md bg-white rounded-full flex items-center mb-4 px-4 py-2 shadow-md">
        <FaLock className="text-gray-600 mr-3" />
        <input
          type="password"
          placeholder="Enter current password"
          className="w-full bg-transparent focus:outline-none"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      {/* New Password Input */}
      <div className="w-full max-w-md bg-white rounded-full flex items-center mb-4 px-4 py-2 shadow-md">
        <FaLock className="text-gray-600 mr-3" />
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full bg-transparent focus:outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      {/* Confirm New Password Input */}
      <div className="w-full max-w-md bg-white rounded-full flex items-center mb-8 px-4 py-2 shadow-md">
        <FaLock className="text-gray-600 mr-3" />
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full bg-transparent focus:outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Change Password Button */}
      <button
        onClick={handleChangePassword}
        className="bg-orange-500 text-white py-2 px-8 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-300"
      >
        Change Password
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

export default Password;
