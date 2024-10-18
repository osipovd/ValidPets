import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import BusinessInfo from './BusinessInfo';
import EditResponseForm from './EditResponseForm';

const BusinessDetails = () => {
  const [business, setBusiness] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [sortedReviews, setSortedReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [editingResponseId, setEditingResponseId] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [flaggedReviews, setFlaggedReviews] = useState([]);
  const [softDeletedReviews, setSoftDeletedReviews] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem('userId'), 10);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/businesses/${id}`);
        if (!response.data || response.data.soft_deleted) {
          navigate('/');
        } else {
          setBusiness(response.data);
        }
      } catch (error) {
        navigate('/');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/business/${id}`);
        setReviews(response.data);
        setSortedReviews(response.data);

        if (response.data.length > 0) {
          const totalRating = response.data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(totalRating / response.data.length);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error.response ? error.response.data : error.message);
      }
    };

    const fetchSoftDeletedReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/soft-deleted/business/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSoftDeletedReviews(response.data);
      } catch (error) {
        console.error('Error fetching soft-deleted reviews:', error.response ? error.response.data : error.message);
      }
    };

    const checkIfLiked = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/interactions/business/${id}/is-liked`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(response.data.liked);
      } catch (error) {
        console.error('Error checking if business is liked:', error.response ? error.response.data : error.message);
      }
    };

    const fetchFlaggedReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/flag-reviews/my-cases`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFlaggedReviews(response.data);
      } catch (error) {
        console.error('Error fetching flagged reviews:', error.response ? error.response.data : error.message);
      }
    };

    fetchBusinessDetails();
    fetchReviews();
    fetchSoftDeletedReviews();
    if (token) {
      checkIfLiked();
      fetchFlaggedReviews();
    }
  }, [id, navigate, userId, token]);

  useEffect(() => {
    sortReviews(sortOption);
  }, [reviews, sortOption]);

  const handleLike = async () => {
    try {
      await axios.post('http://localhost:5000/api/interactions/like-business', {
        business_id: id,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking business:', error.response ? error.response.data : error.message);
    }
  };

  const handleResponseUpdate = (reviewId, updatedResponse) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId ? { ...review, response: updatedResponse } : review
      )
    );
    setEditingResponseId(null);
  };

  const handleNewReview = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/business/${id}`);
      setReviews(response.data);
      setSortedReviews(response.data);

      if (response.data.length > 0) {
        const totalRating = response.data.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRating / response.data.length);
      }
    } catch (error) {
      console.error('Error fetching updated reviews:', error.response ? error.response.data : error.message);
    }
  };

  const sortReviews = (option) => {
    let sorted = [...reviews];
    if (option === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (option === 'oldest') {
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (option === 'highest') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (option === 'lowest') {
      sorted.sort((a, b) => a.rating - b.rating);
    }
    setSortedReviews(sorted);
  };

  const isReviewFlagged = (reviewId) => {
    return flaggedReviews.some(flag => flag.review_id === reviewId);
  };

  const hasUserLeftReview = () => {
    const userLeftReview = reviews.some(review => review.user_id === userId);
    const userSoftDeletedReview = softDeletedReviews.some(review => review.user_id === userId);
    return userLeftReview || userSoftDeletedReview;
  };

  if (!business) {
    return <p>Loading...</p>;
  }

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '20px auto',
  };

  const headingStyle = {
    color: '#3b5998',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const sortStyle = {
    marginBottom: '20px',
  };

  const reviewStyle = {
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
    marginBottom: '10px',
  };

  const buttonStyle = {
    backgroundColor: '#3b5998',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    marginRight: '10px',
  };

  const heartContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      <BusinessInfo business={{ ...business, averageRating: averageRating.toFixed(1) }} />
      <div style={heartContainerStyle}>
        <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <FaHeart color={isLiked ? 'red' : 'grey'} size={30} />
        </button>
      </div>
      <div style={sortStyle}>
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="newest">Newest to Oldest</option>
          <option value="oldest">Oldest to Newest</option>
          <option value="highest">Highest Rating to Lowest Rating</option>
          <option value="lowest">Lowest Rating to Highest Rating</option>
        </select>
      </div>
      <h2 style={headingStyle}>Reviews</h2>
      {sortedReviews.length === 0 && <p>No reviews yet.</p>}
      {sortedReviews.map(review => (
        <div key={review.id} style={reviewStyle}>
          <p><strong>Rating:</strong> {review.rating}</p>
          <p><strong>Comment:</strong> {review.comment}</p>
          <p><strong>Reviewer:</strong> {review.user_full_name}</p>
          <p><strong>Reviewed on:</strong> {new Date(review.created_at).toLocaleString()}</p>
          <p><strong>Response from owner:</strong> {review.response || 'No response yet'}</p>
          {business.user_id === userId && !review.response && (
            <Link to={`/business/${id}/respond-review/${review.id}`}>
              <button style={buttonStyle}>Respond to Review</button>
            </Link>
          )}
          {business.user_id === userId && review.response && (
            editingResponseId === review.id ? (
              <EditResponseForm
                reviewId={review.id}
                initialResponse={review.response}
                onResponseSubmit={(updatedResponse) => handleResponseUpdate(review.id, updatedResponse)}
              />
            ) : (
              <button onClick={() => setEditingResponseId(review.id)} style={buttonStyle}>Edit Response</button>
            )
          )}
          {business.user_id === userId && !isReviewFlagged(review.id) && (
            <Link to={`/flag-review/${id}/${review.id}`}>
              <button style={buttonStyle}>Flag for Admin Review</button>
            </Link>
          )}
        </div>
      ))}
      {token && !hasUserLeftReview() && userId !== business.user_id && (
        <Link to={`/business/${id}/leave-review`}>
          <button onClick={() => handleNewReview()} style={buttonStyle}>Leave a Review</button>
        </Link>
      )}
    </div>
  );
};

export default BusinessDetails;

