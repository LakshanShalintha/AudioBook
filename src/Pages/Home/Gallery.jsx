import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../../Common_Parts/Common/NavBar'; 
import Footer from '../../Common_Parts/Common/Footer'; 
import { FaHeart, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, onSnapshot, updateDoc, setDoc, getDoc, collection, getDocs, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Gallery() {
  const [favorites, setFavorites] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [filteredPdfFiles, setFilteredPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [dislikeCounts, setDislikeCounts] = useState({});
  const auth = getAuth();
  const db = getFirestore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPdfs = async (folderRef) => {
      const storage = getStorage();
      let pdfs = [];

      try {
        const res = await listAll(folderRef);
        const files = await Promise.all(res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const fileName = itemRef.name.toLowerCase();
          if (fileName.endsWith('.pdf')) {
            return { name: itemRef.fullPath, url };
          }
          return null;
        }));

        pdfs = [...pdfs, ...files.filter(file => file !== null)];
        const subfolders = await Promise.all(res.prefixes.map((subfolderRef) => fetchPdfs(subfolderRef)));
        pdfs = [...pdfs, ...subfolders.flat()];

        return pdfs;
      } catch (error) {
        console.error("Error fetching PDFs from Firebase Storage:", error);
        return [];
      }
    };

    const listenToFavorites = () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, `favorites/${user.uid}`);
        
        return onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setFavorites(docSnap.data().pdfUrls || []);
          }
        });
      }
    };

    const fetchLikesAndDislikes = async () => {
      const likesDocRef = doc(db, 'global_likes_dislikes', 'likesDislikes');
      const docSnap = await getDoc(likesDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setLikeCounts(data.likeCounts || {});
        setDislikeCounts(data.dislikeCounts || {});
      } else {
        setLikeCounts({});
        setDislikeCounts({});
      }
    };

    const fetchUserLikesDislikes = async () => {
      const user = auth.currentUser;

      if (user) {
        const userLikesRef = collection(db, `users/${user.uid}/likesDislikes`);
        const snapshot = await getDocs(userLikesRef);

        let userLikes = {};
        let userDislikes = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.liked) {
            userLikes[doc.id] = true;
          }
          if (data.disliked) {
            userDislikes[doc.id] = true;
          }
        });

        setLikes(userLikes);
        setDislikes(userDislikes);
      }
    };

    const initializeGallery = async () => {
      const storage = getStorage();
      const rootRef = ref(storage, 'gs://audirab-44b07.appspot.com');
      const allPdfs = await fetchPdfs(rootRef);
      setPdfFiles(allPdfs);
      setLoading(false);
      listenToFavorites();
      await fetchLikesAndDislikes();
      await fetchUserLikesDislikes();
    };

    initializeGallery();
  }, [auth]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchTerm = query.get('search')?.toLowerCase() || '';

    const filteredPdfs = pdfFiles.filter(pdf => 
      pdf.name.toLowerCase().includes(searchTerm)
    );
    setFilteredPdfFiles(filteredPdfs);
  }, [pdfFiles, location.search]);

  const toggleFavorite = async (pdf) => {
    const user = auth.currentUser;
    if (!user) return; // Ensure user is logged in

    const docRef = doc(db, `favorites/${user.uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const isFavorite = docSnap.data().pdfUrls.includes(pdf.name);

      if (isFavorite) {
        await updateDoc(docRef, {
          pdfUrls: arrayRemove(pdf.name)
        });
        setFavorites((prevFavorites) =>
          prevFavorites.filter((favorite) => favorite !== pdf.name)
        );
      } else {
        await updateDoc(docRef, {
          pdfUrls: arrayUnion(pdf.name)
        });
        setFavorites((prevFavorites) => [...prevFavorites, pdf.name]);
      }
    } else {
      await setDoc(docRef, {
        pdfUrls: [pdf.name]
      });
      setFavorites([pdf.name]);
    }
  };

  const toggleLike = async (pdf) => {
    const user = auth.currentUser;
    if (!user) return; // Ensure user is logged in

    const likesDocRef = doc(db, 'global_likes_dislikes', 'likesDislikes');
    const userDocRef = doc(db, `users/${user.uid}/likesDislikes`, pdf.name);

    try {
      const likesDocSnap = await getDoc(likesDocRef);
      const userDocSnap = await getDoc(userDocRef);

      let newLikeCounts = { ...likeCounts };
      let newDislikeCounts = { ...dislikeCounts };
      let userLikes = { ...likes };
      let userDislikes = { ...dislikes };

      if (userLikes[pdf.name]) {
        // Remove like
        delete userLikes[pdf.name];
        newLikeCounts[pdf.name] = (newLikeCounts[pdf.name] || 1) - 1;
        await updateDoc(userDocRef, { liked: false });
      } else {
        // Add like
        userLikes[pdf.name] = true;
        delete userDislikes[pdf.name];
        newLikeCounts[pdf.name] = (newLikeCounts[pdf.name] || 0) + 1;
        newDislikeCounts[pdf.name] = Math.max((newDislikeCounts[pdf.name] || 1) - 1, 0);
        await setDoc(userDocRef, { liked: true });
      }

      await updateDoc(likesDocRef, {
        likeCounts: newLikeCounts,
        dislikeCounts: newDislikeCounts,
      });

      setLikes(userLikes);
      setDislikes(userDislikes);
      setLikeCounts(newLikeCounts);
      setDislikeCounts(newDislikeCounts);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleDislike = async (pdf) => {
    const user = auth.currentUser;
    if (!user) return; // Ensure user is logged in

    const likesDocRef = doc(db, 'global_likes_dislikes', 'likesDislikes');
    const userDocRef = doc(db, `users/${user.uid}/likesDislikes`, pdf.name);

    try {
      const likesDocSnap = await getDoc(likesDocRef);
      const userDocSnap = await getDoc(userDocRef);

      let newLikeCounts = { ...likeCounts };
      let newDislikeCounts = { ...dislikeCounts };
      let userLikes = { ...likes };
      let userDislikes = { ...dislikes };

      if (userDislikes[pdf.name]) {
        // Remove dislike
        delete userDislikes[pdf.name];
        newDislikeCounts[pdf.name] = (newDislikeCounts[pdf.name] || 1) - 1;
        await updateDoc(userDocRef, { disliked: false });
      } else {
        // Add dislike
        userDislikes[pdf.name] = true;
        delete userLikes[pdf.name];
        newDislikeCounts[pdf.name] = (newDislikeCounts[pdf.name] || 0) + 1;
        newLikeCounts[pdf.name] = Math.max((newLikeCounts[pdf.name] || 1) - 1, 0);
        await setDoc(userDocRef, { disliked: true });
      }

      await updateDoc(likesDocRef, {
        likeCounts: newLikeCounts,
        dislikeCounts: newDislikeCounts,
      });

      setLikes(userLikes);
      setDislikes(userDislikes);
      setLikeCounts(newLikeCounts);
      setDislikeCounts(newDislikeCounts);
    } catch (error) {
      console.error("Error toggling dislike:", error);
    }
  };

  const handlePdfClick = (pdf) => {
    const queryString = new URLSearchParams({ pdfUrl: pdf.url, story: pdf.name }).toString();
    navigate(`/pdf-viewer?${queryString}`);
  };

  const handleFavoriteButtonClick = () => {
    navigate('/favorite');
  };

  const formatPdfName = (pdfName) => {
    return pdfName.split('/').pop().replace('.pdf', '');
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <NavBar />

      <div className="font-bold mt-36 ml-64">
        <h1 className="text-white text-5xl">
          Gallery
        </h1>
      </div>

      <div className="fixed top-0 right-0 mt-36 mr-32">
        <button 
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={handleFavoriteButtonClick}
        >
          Favorite
        </button>
      </div>

      <div className="p-4 flex-grow flex justify-center items-center">
        <div className="max-w-5xl w-full">
          {loading ? (
            <div className="text-white text-center">
              Loading...
            </div>
          ) : filteredPdfFiles.length === 0 ? (
            <div className="text-white text-center">
              No PDF available
            </div>
          ) : (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 justify-center"
              style={{ marginTop: '40px' }} 
            >
              {filteredPdfFiles.map((pdf) => (
                <div 
                  key={pdf.name} 
                  className="w-full h-[100px] flex justify-center items-center p-4 bg-blue-950 rounded-lg text-orange-200 relative cursor-pointer"
                  onClick={() => handlePdfClick(pdf)}
                >
                  <a href="#!" className="truncate w-full text-center" style={{ fontSize: '24px' }}> 
                    {formatPdfName(pdf.name)}
                  </a>

                  <FaHeart 
                    className={`absolute top-2 right-2 cursor-pointer ${
                    favorites.includes(pdf.name) ? 'text-red-500' : 'text-gray-100'
                    }`}
                    onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleFavorite(pdf); 
                    }}
                    style={{ fontSize: '20px' }} // Adjust the font size as needed
                  />

                  <div className="absolute bottom-2 left-2 flex space-x-2 items-center">
                    <FaThumbsUp 
                      className={`cursor-pointer text-1xs ${
                        likes[pdf.name] ? 'text-blue-600' : 'text-gray-400'
                      }`}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleLike(pdf); 
                      }}
                    />
                    <span className="text-white text-xs">
                      {likeCounts[pdf.name] || 0}
                    </span>
                    <FaThumbsDown 
                      className={`cursor-pointer text-1xs ${
                        dislikes[pdf.name] ? 'text-red-400' : 'text-gray-400'
                      }`}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleDislike(pdf); 
                      }}
                    />
                    <span className="text-white text-xs">
                      {dislikeCounts[pdf.name] || 0}
                    </span>
                  </div>
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

export default Gallery;
