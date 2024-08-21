import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import NavBar from '../../Common_Parts/Common/NavBar'; 
import Footer from '../../Common_Parts/Common/Footer'; 
import { FaHeart } from 'react-icons/fa';
import { getFirestore, doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage methods

function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage(); // Initialize storage
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const listenToFavorites = () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, `favorites/${user.uid}`);

        // Set up a real-time listener to sync favorites across devices
        return onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setFavorites(docSnap.data().pdfUrls || []);
          }
        });
      }
    };

    listenToFavorites(); // Listen to real-time updates
  }, [auth, db]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchTerm = query.get('search')?.toLowerCase() || ''; // Convert search term to lowercase

    const filtered = favorites.filter(pdfName =>
      pdfName.toLowerCase().includes(searchTerm) // Match the search term in the PDF name
    );
    setFilteredFavorites(filtered);
  }, [favorites, location.search]); // Re-run the effect when favorites or location.search changes

  const removeFavorite = async (pdfName) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, `favorites/${user.uid}`);
      await updateDoc(docRef, {
        pdfUrls: arrayRemove(pdfName)
      });
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite !== pdfName)
      );
    }
  };

  const formatPdfName = (pdfName) => {
    return pdfName.split('/').pop().replace('.pdf', '');
  };

  const handlePdfClick = async (pdfName) => {
    try {
      const pdfRef = ref(storage, pdfName);
      const pdfUrl = await getDownloadURL(pdfRef);

      navigate('/pdf-viewer', { state: { pdfUrl, story: pdfName } });
    } catch (error) {
      console.error("Error opening PDF:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <NavBar />

      <div className="fixed font-bold top-0 left-0 mt-36 ml-64">
        <h1 className="text-white text-6xl">
        Favorite
        </h1>
      </div>

      <div className="p-4 flex-grow flex justify-center items-center">
        <div className="max-w-5xl w-full">
          {filteredFavorites.length === 0 ? (
            <div className="text-white text-center">
              No PDF available
            </div>
          ) : (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 justify-center"
              style={{ marginTop: '130px' }} 
            >
              {filteredFavorites.map((pdfName) => (
                <div 
                  key={pdfName} 
                  className="w-full h-[100px] flex justify-center items-center p-4 bg-blue-950 rounded-lg text-white relative cursor-pointer"
                  onClick={() => handlePdfClick(pdfName)} // Handle PDF click
                >
                  <span className="truncate">{formatPdfName(pdfName)}</span>
                  <FaHeart 
                    className="absolute top-2 right-2 cursor-pointer text-red-500"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering PDF click when removing favorite
                      removeFavorite(pdfName);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Favorite;
