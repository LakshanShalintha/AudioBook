import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaUserCog } from 'react-icons/fa'; // Import necessary icons
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Common_Parts/Common/NavBar';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytes } from 'firebase/storage';

function Profile() {
  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [email, setEmail] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
      loadUserProfile();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');

        const cachedImageUrl = sessionStorage.getItem('profileImage');
        if (cachedImageUrl) {
          setSelectedImage(cachedImageUrl);
          setLoadingImage(false);
        } else {
          const storageRef = ref(storage, `uploads/${currentUser.uid}/`);
          const listResponse = await listAll(storageRef);

          if (listResponse.items.length > 0) {
            const itemsWithMetadata = await Promise.all(
              listResponse.items.map(async (item) => {
                const metadata = await getMetadata(item);
                return { item, lastModified: metadata.updated || metadata.timeCreated };
              })
            );

            itemsWithMetadata.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

            const latestItem = itemsWithMetadata[0].item;
            const downloadURL = await getDownloadURL(latestItem);

            const cacheBustedURL = `${downloadURL}?timestamp=${new Date().getTime()}`;
            setSelectedImage(cacheBustedURL);
            sessionStorage.setItem('profileImage', cacheBustedURL);
          } else {
            console.log('No images found in the folder');
          }
          setLoadingImage(false);
        }
      } else {
        console.log('No user profile found');
        setLoadingImage(false);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoadingImage(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const storageRef = ref(storage, `uploads/${currentUser.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        const cacheBustedURL = `${downloadURL}?timestamp=${new Date().getTime()}`;

        setSelectedImage(cacheBustedURL);
        sessionStorage.setItem('profileImage', cacheBustedURL);
        await saveUserProfile(cacheBustedURL);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const saveUserProfile = async (imageUrl) => {
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          name,
          email: currentUser.email,
          imageUrl: `uploads/${currentUser.uid}/${imageUrl.split('/').pop()}`, 
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/welcome');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNo = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center">
      <NavBar hideSearch={true} profileImage={selectedImage} /> {/* Pass profileImage prop */}
      <div
        className="w-full bg-cover bg-center h-48"
        style={{ backgroundImage: 'url(https://source.unsplash.com/random)' }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative mt-60">
            {loadingImage ? (
              <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse"></div>
            ) : (
              <img
                src={selectedImage || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="rounded-full w-32 h-32 border-4 border-white object-cover"
              />
            )}
            <label className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer">
              <FaUser className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <p className="text-white mt-2 text-xl">{name}</p>
        </div>
      </div>

      <div className="w-full max-w-lg bg-white shadow-md rounded-lg mt-28 p-4">
        <h2 className="text-blue-500 text-lg mb-4 text-center">Account Settings</h2>
        <div className="space-y-4">
          <div
            className="flex items-center space-x-4 p-6 bg-gray-200 rounded-lg h-20 w-full cursor-pointer"
            onClick={() => navigate('/details')}
          >
            <FaUser className="text-gray-600 text-xl" />
            <div>
              <p className="text-gray-800 font-semibold text-lg">Profile</p>
              <p className="text-gray-600">Manage profile</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-4 p-6 bg-gray-200 rounded-lg h-20 w-full cursor-pointer"
            onClick={() => navigate('/password')}
          >
            <FaLock className="text-gray-600 text-xl" />
            <div>
              <p className="text-gray-800 font-semibold text-lg">Password</p>
              <p className="text-gray-600">Change Password</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-4 p-6 bg-gray-200 rounded-lg h-20 w-full cursor-pointer"
            onClick={() => navigate('/setting')}
          >
            <FaUserCog className="text-gray-600 text-xl" />
            <div>
              <p className="text-gray-800 font-semibold text-lg">Account</p>
              <p className="text-gray-600">Manage your account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 mb-10">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="bg-orange-500 text-white py-2 px-8 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-300"
        >
          Log Out
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-28">
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-lg font-semibold mb-4">Do you want to logout the account?</h2>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleNo}
                className="bg-gray-500 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:bg-gray-600 transition duration-300"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:bg-red-600 transition duration-300"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
