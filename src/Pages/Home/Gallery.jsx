import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../../Common_Parts/Common/NavBar'; // Ensure correct import path
import Footer from '../../Common_Parts/Common/Footer'; // Ensure correct import path
import { FaHeart } from 'react-icons/fa';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, onSnapshot, updateDoc, setDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Gallery() {
  const [favorites, setFavorites] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [filteredPdfFiles, setFilteredPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true); // Introduce a loading state
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
        
        // Set up a real-time listener to sync favorites across devices
        return onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setFavorites(docSnap.data().pdfUrls || []);
          }
        });
      }
    };

    const initializeGallery = async () => {
      const storage = getStorage();
      const rootRef = ref(storage, 'gs://audirab-44b07.appspot.com');
      const allPdfs = await fetchPdfs(rootRef);
      setPdfFiles(allPdfs);
      setLoading(false); // Set loading to false after PDFs are fetched
      listenToFavorites(); // Listen to real-time updates
    };

    initializeGallery();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchTerm = query.get('search')?.toLowerCase() || ''; // Convert search term to lowercase

    const filteredPdfs = pdfFiles.filter(pdf => 
      pdf.name.toLowerCase().includes(searchTerm) // Match the letter in the PDF name
    );
    setFilteredPdfFiles(filteredPdfs);
  }, [pdfFiles, location.search]); // Re-run the effect when pdfFiles or location.search changes

  const toggleFavorite = async (pdf) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, `favorites/${user.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const isFavorite = docSnap.data().pdfUrls.includes(pdf.name);

        if (isFavorite) {
          // Remove from favorites
          await updateDoc(docRef, {
            pdfUrls: arrayRemove(pdf.name)
          });
          setFavorites((prevFavorites) =>
            prevFavorites.filter((favorite) => favorite !== pdf.name)
          );
        } else {
          // Add to favorites
          await updateDoc(docRef, {
            pdfUrls: arrayUnion(pdf.name)
          });
          setFavorites((prevFavorites) => [...prevFavorites, pdf.name]);
        }
      } else {
        // If the document doesn't exist, create it and add the first favorite
        await setDoc(docRef, {
          pdfUrls: [pdf.name]
        });
        setFavorites([pdf.name]);
      }
    }
  };

  const handlePdfClick = (pdf) => {
    const queryString = new URLSearchParams({ pdfUrl: pdf.url, story: pdf.name }).toString();
    navigate(`/pdf-viewer?${queryString}`);
  };
  

  const formatPdfName = (pdfName) => {
    return pdfName.split('/').pop().replace('.pdf', '');
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Include NavBar at the top */}
      <NavBar />

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
              style={{ marginTop: '130px' }} 
            >
              {filteredPdfFiles.map((pdf) => (
                <div 
                  key={pdf.name} 
                  className="w-full h-[100px] flex justify-center items-center p-4 bg-blue-950 rounded-lg text-white relative cursor-pointer"
                  onClick={() => handlePdfClick(pdf)} // Open PDF on click
                >
                  <a href="#!" className="truncate w-full text-center">
                    {formatPdfName(pdf.name)}
                  </a>
                  <FaHeart 
                    className={`absolute top-2 right-2 cursor-pointer ${
                      favorites.includes(pdf.name) ? 'text-red-500' : 'text-gray-400'
                    }`}
                    onClick={(e) => { 
                      e.stopPropagation(); // Prevent the click event from propagating to the parent div
                      toggleFavorite(pdf); 
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Include Footer at the bottom */}
      <Footer />
    </div>
  );
}

export default Gallery;
