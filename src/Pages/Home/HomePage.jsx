import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Common_Parts/Common/NavBar';
import Footer from '../../Common_Parts/Common/Footer';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const allResults = [
      'Example Result 1',
      'Example Result 2',
      'Example Result 3',
    ];
    const filtered = allResults.filter(result =>
      result.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(`/gallery?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (category) => {
    if (category === 'Literature & Fiction') {
      navigate('/Literature_Fiction');
    } else if (category === 'Romance') {
      navigate('/Romance');
    } else if (category === 'Kids & Family') {
      navigate('/Kids_Family');
    } else if (category === 'Biographies & Memories') {
      navigate('/Biographies_Memories');
    } else if (category === 'Personal Growth') {
      navigate('/Personal_Growth');
    } else {
      navigate(`/gallery?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex flex-col bg-[#000000]">
      <NavBar hideSearch={true} /> {/* Pass hideSearch prop to hide the search icon */}

      <div className="relative flex flex-col lg:flex-row items-center justify-between text-left py-20 px-6" 
        style={{ backgroundImage: `url(/images/Home/image.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="lg:w-1/2 flex flex-col justify-center lg:text-left text-center lg:items-start items-center">
          <h1 className="text-white text-[32px] md:text-[40px] lg:text-[56px] font-bold mb-4 ml-16">
            Unlock Your <br/>Imagination
          </h1>
          <p className="text-white text-[16px] md:text-[18px] lg:text-[22px] mb-8 ml-16">
            Dive into a world of stories, knowledge, and inspiration with AudiRAB.
            Whether you're on the go or relaxing at home, our audiobooks and podcasts are here to entertain and enlighten you.
          </p>
        </div>

        <div className="lg:w-1/2 flex flex-wrap justify-center lg:justify-end items-center relative mt-10 lg:mt-0 mr-32">
          <div className="flex flex-wrap justify-center lg:justify-end items-center">
            <img src="/images/Home/Angle_Layout/Clock.jpg" alt="book1" className="w-[96px] h-[96px] lg:w-[128px] lg:h-[128px] m-4 shadow-custom transform -rotate-12 animate-big-float animate-float-delay-1" />
            <img src="/images/Home/Angle_Layout/Fantasy.webp" alt="book2" className="w-[144px] h-[144px] lg:w-[176px] lg:h-[176px] m-4 shadow-custom transform -rotate-12 animate-big-float animate-float-delay-2" />
            <img src="/images/Home/Angle_Layout/Adventures.jpg" alt="book3" className="w-[96px] h-[96px] lg:w-[128px] lg:h-[128px] m-4 shadow-custom transform -rotate-12 animate-big-float animate-float-delay-3" />
          </div>
          <div className="flex flex-wrap justify-center lg:justify-end items-center mt-4">
            <img src="/images/Home/Angle_Layout/Sherlock_Homes.jpg" alt="book5" className="w-[144px] h-[144px] lg:w-[176px] lg:h-[176px] m-4 shadow-custom transform -rotate-12 animate-big-float animate-float-delay-4" />
            <img src="/images/Home/Angle_Layout/Thriller.jpg" alt="book6" className="w-[96px] h-[96px] lg:w-[128px] lg:h-[128px] m-4 shadow-custom transform -rotate-12 animate-big-float animate-float-delay-5" />
            <img src="/images/Home/Angle_Layout/Mystery.jpg" alt="book4" className="w-[96px] h-[96px] lg:w-[128px] lg:h-[128px] m-4 shadow-custom transform -rotate-12 animate-big-float animate-float-delay-6" />
          </div>
        </div>
      </div>

      {searchTerm && (
        <div className="p-4">
          <h2 className="text-white text-[28px] mb-4">Search Results</h2>
          <ul className="text-white">
            {filteredResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col justify-start items-center pt-10 flex-grow">
        <div className="bg-gradient-to-r from-[#112233] to-[#000000] py-20 px-4 md:px-20 lg:px-60 mt-16 text-center">
          <h1 className="text-white text-[28px] md:text-[36px] lg:text-[48px] font-bold mb-12 mt-4">
            Explore New Horizons
          </h1>
          <p className="text-white text-[16px] md:text-[20px] lg:text-[24px] mb-8">
            Whether you're seeking epic adventures, self-improvement tips, <br />or captivating tales, AudiRAB has something for everyone.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="w-full h-[160px] bg-[#152238] rounded-lg flex items-center justify-between p-4 shadow-lg cursor-pointer"
              onClick={() => handleCategoryClick('All Categories')}>
              <span className="text-white text-lg font-bold">All Categories</span>
            </div>
            <div className="w-full h-[160px] bg-[#152238] rounded-lg flex items-center justify-between p-4 shadow-lg cursor-pointer"
              onClick={() => handleCategoryClick('Literature & Fiction')}>
              <span className="text-white text-lg font-bold">Literature & Fiction</span>
              <img src="/images/Home/Explore/Literature & Fiction.webp" alt="Literature & Fiction" className="w-[64px] h-[64px] rounded-full shadow-lg" />
            </div>
            <div className="w-full h-[160px] bg-[#152238] rounded-lg flex items-center justify-between p-4 shadow-lg cursor-pointer"
              onClick={() => handleCategoryClick('Romance')}>
              <span className="text-white text-lg font-bold">Romance</span>
              <img src="/images/Home/Explore/Romance.webp" alt="Romance" className="w-[64px] h-[64px] rounded-full shadow-lg" />
            </div>
            <div className="w-full h-[160px] bg-[#152238] rounded-lg flex items-center justify-between p-4 shadow-lg cursor-pointer"
              onClick={() => handleCategoryClick('Kids & Family')}>
              <span className="text-white text-lg font-bold">Kids & Family</span>
              <img src="/images/Home/Explore/Kids & Family.webp" alt="Kids" className="w-[64px] h-[64px] rounded-full shadow-lg" />
            </div>
            <div className="w-full h-[160px] bg-[#152238] rounded-lg flex items-center justify-between p-4 shadow-lg cursor-pointer"
              onClick={() => handleCategoryClick('Biographies & Memories')}>
              <span className="text-white text-lg font-bold">Biographies & Memories</span>
              <img src="/images/Home/Explore/Biographies & Memoirs.webp" alt="Biographies & Memoirs" className="w-[64px] h-[64px] rounded-full shadow-lg" />
            </div>
            <div className="w-full h-[160px] bg-[#152238] rounded-lg flex items-center justify-between p-4 shadow-lg cursor-pointer"
              onClick={() => handleCategoryClick('Personal Growth')}>
              <span className="text-white text-lg font-bold">Personal Growth</span>
              <img src="/images/Home/Explore/Personal Growth.webp" alt="Personal Development" className="w-[64px] h-[64px] rounded-full shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Other sections of your homepage */}

     


      <div className="bg-gradient-to-r from-[#000000] to-[#112233] py-20 px-6 mt-16 text-center overflow-hidden">
        <h2 className="text-white text-[28px] md:text-[36px] lg:text-[48px] font-bold mb-6">
          Exclusively on AudiRAB
        </h2>
        <p className="text-white text-[16px] md:text-[18px] lg:text-[22px] mb-12">
          Discover exclusive audiobooks and original content, <br />crafted to elevate your listening experience.
        </p>
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-right">
            <img src="/images/HomeStories/Alone.jpeg" alt="AudiRAB 1" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/DLB.jpeg" alt="AudiRAB 2" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/HAS.jpeg" alt="AudiRAB 3" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/AudiRAB/Tree.webp" alt="AudiRAB 4" className="w-[100px] h-[150px] lg:w-[130px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/Hell.jpeg" alt="AudiRAB 5" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/history.jpeg" alt="AudiRAB 6" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/IOE.jpeg" alt="AudiRAB 7" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/Killer.jpeg" alt="AudiRAB 8" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/lincon.jpeg" alt="AudiRAB 9" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/love.jpeg" alt="AudiRAB 10" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/magic.jpeg" alt="AudiRAB 11" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/Ghost.webp" alt="AudiRAB 12" className="w-[100px] h-[150px] lg:w-[120px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/Matilda.jpeg" alt="AudiRAB 13" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/Memory.jpeg" alt="AudiRAB 14" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/monstrous.jpg" alt="AudiRAB 15" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/World.webp" alt="AudiRAB 16" className="w-[110px] h-[150px] lg:w-[120px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/motivate.jpg" alt="AudiRAB 17" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/prince.jpeg" alt="AudiRAB 18" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/Stories/Sophie.png" alt="AudiRAB 19" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/Soul.jpg" alt="AudiRAB 20" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/The Moon.png" alt="AudiRAB 21" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/The past is rising.jpeg" alt="AudiRAB 22" className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/TLW.jpeg" alt="AudiRAB 23" className="w-[150px] h-[100px] lg:w-[120px] lg:h-[200px] mx-4 shadow-custom" />
            <img src="/images/Home/Stories/Sea.webp" alt="AudiRAB 24" className="w-[100px] h-[150px] lg:w-[120px] lg:h-[200px] mx-4 shadow-custom" />

            
          </div>
        </div>
      </div>

      <Footer className="mt-auto" />

      {/* Inline CSS for shadow effect */}
      <style>
        {`
          .shadow-custom {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 6px 6px rgba(0, 0, 0, 0.3);
          }

          @keyframes scroll-right {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0%);
            }
          }

          .animate-scroll-right {
            display: flex;
            animation: scroll-right 30s linear infinite;
          }

          @keyframes float {
            0% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-30px) rotate(15deg);
            }
            100% {
              transform: translateY(0px) rotate(0deg);
            }
          }

          .animate-big-float {
            animation: float 4s ease-in-out infinite;
          }

          .animate-float-delay-1 {
            animation-delay: 0.2s;
          }

          .animate-float-delay-2 {
            animation-delay: 0.4s;
          }

          .animate-float-delay-3 {
            animation-delay: 0.6s;
          }

          .animate-float-delay-4 {
            animation-delay: 0.8s;
          }

          .animate-float-delay-5 {
            animation-delay: 1s;
          }

          .animate-float-delay-6 {
            animation-delay: 1.2s;
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;
