import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import NavBar from '../Common/NavBar';

function LiteratureFiction() {
  const navigate = useNavigate();
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const topItems = [
    { name: 'Romance', path: '/Romance' },
    { name: 'Kids & Family', path: '/Kids_Family' },
    { name: 'Biographies & Memories', path: '/Biographies_Memories' },
    { name: 'Personal Growth', path: '/Personal_Growth' },
  ];

  const fetchPdfs = async () => {
    const storage = getStorage();
    const folderRef = ref(storage, 'gs://audirab-44b07.appspot.com/Categories/Literature & Flection');
    const res = await listAll(folderRef);
    const files = await Promise.all(
      res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          url: url,
        };
      })
    );
    setPdfFiles(files);
    setLoading(false); // Set loading to false after fetching PDFs
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const openPdfViewer = (pdf) => {
    navigate('/pdf-viewer', {
      state: { pdfUrl: pdf.url, story: pdf.name.replace('.pdf', '') },
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      <NavBar hideSearch={true} />
      
      {/* Top grid items */}
      <div className="flex justify-center mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-2">
          {topItems.map((item, index) => (
            <div 
              key={index} 
              className="w-[180px] h-[40px] flex justify-center items-center p-4 bg-orange-300 rounded-lg text-black cursor-pointer mt-32 font-bold"
            >
              <span 
                className="truncate w-full text-center cursor-pointer"
                onClick={() => handleNavigation(item.path)}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Page title */}
      <h1 className="text-center text-4xl mt-8 font-bold">Literature & Fiction</h1>

      {/* PDF grid items */}
      <div className="flex-grow flex justify-center items-center">
        <div className="max-w-5xl w-full">
          {loading ? (
            <div className="text-center text-xl">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 justify-center mt-8 px-4">
              {pdfFiles.map((pdf, index) => (
                <div 
                  key={index} 
                  className="w-full h-[100px] flex justify-center items-center p-4 bg-blue-950 rounded-lg text-white relative cursor-pointer"
                  onClick={() => openPdfViewer(pdf)}
                >
                  <span className="truncate w-full text-center">
                    {pdf.name.replace('.pdf', '')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-auto">
        {/* Your Footer component goes here */}
      </footer>
    </div>
  );
}

export default LiteratureFiction;
