import React, { useState, useEffect } from 'react';
import NavBar from '../../Common_Parts/Common/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faStar, faUser, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp from Firestore

function Reviews({ userName }) {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const reviewsCollectionRef = collection(db, 'Reviews');

  const [items, setItems] = useState([]);
  const [comment, setComment] = useState('');
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [visibleComments, setVisibleComments] = useState(4); // Only show 4 comments initially
  const [showReplyPopup, setShowReplyPopup] = useState(null); // Track which comment is being replied to
  const [replyText, setReplyText] = useState(''); // Track reply text
  const [totalReviews, setTotalReviews] = useState(0); // Track total reviews count
  const [averageRating, setAverageRating] = useState(0); // Track average rating
  const [visibleReplies, setVisibleReplies] = useState({}); // Track visibility of replies

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const q = query(reviewsCollectionRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      likes: Array.isArray(doc.data().likes) ? doc.data().likes : [],
      dislikes: Array.isArray(doc.data().dislikes) ? doc.data().dislikes : [],
      replies: Array.isArray(doc.data().replies) ? doc.data().replies : [], // Ensure replies is an array
    }));

    setItems(reviews);
    setTotalReviews(reviews.length); // Set the total reviews count
    calculateAverageRating(reviews); // Calculate and set the average rating
  };

  const handleReplySubmit = async (id) => {
    const reviewDocRef = doc(db, 'Reviews', id);
    const item = items.find((item) => item.id === id);

    if (!item) {
      console.error('Item not found');
      return;
    }

    const currentDate = Timestamp.now(); // Use Firestore's Timestamp

    const updatedItem = {
      ...item,
      replies: [...item.replies, { text: replyText, name: userName || 'NLSP', timestamp: currentDate }],
    };

    try {
      await updateDoc(reviewDocRef, {
        replies: updatedItem.replies,
      });

      setItems(items.map(item => (item.id === id ? updatedItem : item)));
      setReplyText('');
      setShowReplyPopup(null); // Close the reply popup after sending the reply
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = totalRating / reviews.length;
    setAverageRating(average.toFixed(1)); // Set the average rating rounded to 1 decimal place
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handlePublishClick = () => {
    if (comment.trim()) {
      setShowRatingPopup(true);
    }
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleRatingSubmit = async () => {
    const newCommentItem = {
      name: userName || 'Shalintha',
      rating: selectedRating,
      description: comment,
      timestamp: new Date(),
      likes: [],
      dislikes: [],
      replies: [], // Initialize replies as an empty array
    };

    try {
      await addDoc(reviewsCollectionRef, newCommentItem);
      fetchReviews(); // Refresh the reviews after adding the new comment
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    setComment('');
    setSelectedRating(0);
    setShowRatingPopup(false);
  };

  const handleIconClick = async (id, type) => {
    if (!userId) {
      console.error('User must be logged in to like/dislike');
      return;
    }

    const reviewDocRef = doc(db, 'Reviews', id);
    const item = items.find((item) => item.id === id);
    if (!item) {
      console.error('Item not found');
      return;
    }

    let updatedItem = { ...item };

    if (type === 'like') {
      if (Array.isArray(item.likes) && item.likes.includes(userId)) {
        updatedItem.likes = item.likes.filter((uid) => uid !== userId);
      } else {
        updatedItem.likes = Array.isArray(item.likes) ? [...item.likes, userId] : [userId];
        updatedItem.dislikes = Array.isArray(item.dislikes) ? item.dislikes.filter((uid) => uid !== userId) : [];
      }
    } else if (type === 'dislike') {
      if (Array.isArray(item.dislikes) && item.dislikes.includes(userId)) {
        updatedItem.dislikes = item.dislikes.filter((uid) => uid !== userId);
      } else {
        updatedItem.dislikes = Array.isArray(item.dislikes) ? [...item.dislikes, userId] : [userId];
        updatedItem.likes = Array.isArray(item.likes) ? item.likes.filter((uid) => uid !== userId) : [];
      }
    }

    try {
      await updateDoc(reviewDocRef, {
        likes: updatedItem.likes,
        dislikes: updatedItem.dislikes,
      });

      setItems(items.map(item => (item.id === id ? updatedItem : item)));
      calculateAverageRating(items); // Recalculate average rating after likes/dislikes
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleReplyClick = (id) => {
    setShowReplyPopup(showReplyPopup === id ? null : id);
    setReplyText('');

    // Toggle visibility of replies
    setVisibleReplies((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleDeleteClick = async (id) => {
    try {
      const reviewDocRef = doc(db, 'Reviews', id);
      await deleteDoc(reviewDocRef);

      setItems(items.filter(item => item.id !== id)); // Remove the deleted item from state
      setTotalReviews(totalReviews - 1); // Update the total reviews count
      calculateAverageRating(items.filter(item => item.id !== id)); // Recalculate average rating after deletion
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col relative overflow-y-auto">
      <NavBar hideSearch={true} />

      <div className="flex-grow p-4 flex justify-center items-center">
        <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-4xl mt-24">
          <div className="flex justify-between">
            <div>
              <div className="text-6xl font-bold text-gray-800">Reviews</div>
              <div className="text-3xl text-gray-900 mt-4">Total Reviews</div>
              <div className="text-5xl font-bold text-gray-900 mt-2">{totalReviews}</div> {/* Display total reviews */}
              <div className="text-sm text-gray-600 mt-2">Growth on Reviews in this year</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">Average Rating</div>
              <div className="text-4xl font-bold text-gray-900">{averageRating}</div> {/* Display average rating */}
              <div className="flex justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={`${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-400'} text-xl`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-2">Average rating on this year</div>
            </div>
          </div>

          <div className="mt-8">
            <textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={handleCommentChange}
              className="w-full p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 resize-none overflow-hidden"
              rows="1"
            />
            <button
              onClick={handlePublishClick}
              className="mt-2 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-blue-600"
            >
              Publish
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-8">
            {items.slice(0, visibleComments).map((item) => (
              <div className="bg-gray-800 rounded-lg flex flex-col p-4" key={item.id}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 flex items-center justify-center bg-gray-300 rounded-lg">
                      <FontAwesomeIcon icon={faUser} className="text-gray-600 text-4xl" />
                    </div>
                    <div className="text-white mt-2">{item.name}</div>
                    <div className="flex justify-start mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={`${i < item.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(item.timestamp.seconds * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between ml-4 flex-grow relative">
                    <div className="text-gray-300">{item.description}</div>
                    <div className="flex justify-end space-x-4 mt-auto">
                      {item.replies.length > 0 && (
                        <span className="text-white text-sm">
                          {item.replies.length}
                        </span>
                      )}
                      <button 
                        className="text-white text-sm hover:underline"
                        onClick={() => handleReplyClick(item.id)}
                      >
                        {visibleReplies[item.id] ? "Hide Replies" : "Reply"}
                      </button>
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        className={`cursor-pointer text-xl ${
                          Array.isArray(item.likes) && item.likes.includes(userId) ? 'text-2xl text-blue-500' : 'text-gray-500'
                        }`}
                        onClick={() => handleIconClick(item.id, 'like')}
                      />
                      <span className="text-white">{item.likes.length || 0}</span>
                      <FontAwesomeIcon
                        icon={faThumbsDown}
                        className={`cursor-pointer text-xl ${
                          Array.isArray(item.dislikes) && item.dislikes.includes(userId) ? 'text-2xl text-red-500' : 'text-gray-500'
                        }`}
                        onClick={() => handleIconClick(item.id, 'dislike')}
                      />
                      <span className="text-white">{item.dislikes.length || 0}</span>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="cursor-pointer text-xl text-gray-500 hover:text-red-500"
                        onClick={() => handleDeleteClick(item.id)}
                      />
                    </div>

                    {/* Reply Popup */}
                    {showReplyPopup === item.id && (
                      <div className="absolute mt-32 ml-4 left-0 bg-white rounded-lg shadow-lg p-2 flex items-center">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          className="resize-none p-2 rounded-lg border-2 h-9 border-gray-300"
                          rows="1"
                        />
                        <button
                          onClick={() => handleReplySubmit(item.id)}
                          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </div>
                    )}

                    {/* Display Replies */}
                    {visibleReplies[item.id] && item.replies && item.replies.length > 0 && (
                      <div className="mt-12">
                        <h4 className="text-white text-[12px] mb-2 ml-72">Replies:</h4>
                        {item.replies.map((reply, index) => (
                          <div key={index} className="bg-gray-700 p-2 rounded-lg mb-2 ml-72 h-9">
                            <div className="flex items-center text-[10px] text-gray-200"> 
                              <span className="font-bold">{reply.name}:</span>
                              <span className="ml-2 text-gray-300">{reply.text}</span>
                            </div>
                            <div className="text-[7px] text-gray-400"> 
                              {reply.timestamp.toDate().toLocaleDateString()} {/* Convert Firestore Timestamp to Date */}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}

            {visibleComments < items.length && (
              <button
                onClick={() => setVisibleComments((prev) => prev + 3)}
                className="mt-4 px-4 py-2 ml-80 mr-80 bg-orange-400 text-white rounded-lg hover:bg-gray-600"
              >
                More...
              </button>
            )}
          </div>
        </div>
      </div>

      {showRatingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Rate your experience</h2>
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className={`text-4xl cursor-pointer ${
                    i < selectedRating ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                  onClick={() => handleRatingClick(i + 1)}
                />
              ))}
            </div>
            <button
              onClick={handleRatingSubmit}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews;
