import React, { useState } from 'react';
import NavBar from '../../Common_Parts/Common/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faStar, faUser } from '@fortawesome/free-solid-svg-icons';

function Reviews() {
  const items = [
    {
      id: 1,
      name: 'John Doe',
      rating: 4,
      description: 'John is a great reviewer with detailed insights into the products he reviews.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: 5,
      description: 'Jane provides thorough and honest reviews, always helpful to potential buyers.',
    },
    {
      id: 3,
      name: 'Michael Brown',
      rating: 3,
      description: 'Michael’s reviews are straightforward and to the point.',
    },
    {
      id: 4,
      name: 'Emily Davis',
      rating: 4,
      description: 'Emily focuses on the usability aspects of the products she reviews.',
    },
    {
      id: 5,
      name: 'William Johnson',
      rating: 2,
      description: 'William’s reviews are concise but sometimes lack depth.',
    },
  ];

  const [selected, setSelected] = useState({});

  const handleIconClick = (id, type) => {
    setSelected((prevSelected) => ({
      ...prevSelected,
      [id]: type,
    }));
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col relative overflow-y-auto">
      <NavBar hideSearch={true} />

      <div className="flex-grow p-4 flex justify-center items-center">
        <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-4xl mt-40 relative">
          {/* Container for "Reviews" Text and "Average Rating" */}
          <div className="absolute top-4 left-4 flex justify-between w-full pr-12">
            <div>
              <div className="text-6xl font-bold text-gray-800 ml-8">Reviews</div>
              <div className="text-3xl text-gray-900 mt-12 ml-8">Total Reviews</div>
              <div className="text-6xl font-bold text-gray-900 mt-3 ml-8">2K</div>
              <div className="text-0.5xl text-gray-600 mt-4 ml-8">Growth on Reviews in this year</div>
            </div>
            {/* "Average Rating" Section */}
            <div className="text-center mt-12">
              <div className="text-lg font-bold text-gray-800">Average Rating</div>
              <div className="text-4xl font-bold text-gray-900">4.0</div>
              <div className="flex justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={`${i < 4 ? 'text-yellow-400' : 'text-gray-400'} text-xl`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-2">Average rating on this year</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mt-64">
            {items.map((item, index) => (
              <div className={`bg-gray-700 h-auto rounded-lg flex p-4 ${index > 0 ? 'mt-4' : ''}`} key={item.id}>
                <div className="flex-shrink-0">
                  <div className="h-32 w-32 flex items-center justify-center bg-gray-300 rounded-lg">
                    <FontAwesomeIcon icon={faUser} className="text-gray-600 text-4xl" />
                  </div>
                  <div className="text-white mt-2">{item.name}</div>
                  <div className="flex justify-start mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={`text-yellow-400 ${i < item.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between ml-4 flex-grow">
                  <div className="text-gray-300 mt-2">{item.description}</div>
                  <div className="flex justify-end space-x-4 mt-auto">
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      className={`cursor-pointer text-xl ${
                        selected[item.id] === 'like' ? 'text-2xl text-green-500' : 'text-gray-500'
                      }`}
                      onClick={() => handleIconClick(item.id, 'like')}
                    />
                    <FontAwesomeIcon
                      icon={faThumbsDown}
                      className={`cursor-pointer text-xl ${
                        selected[item.id] === 'dislike' ? 'text-2xl text-red-500' : 'text-gray-500'
                      }`}
                      onClick={() => handleIconClick(item.id, 'dislike')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
