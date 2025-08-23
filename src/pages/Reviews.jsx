import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaDownload } from "react-icons/fa";
import { CSVLink } from "react-csv";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviewsWithWorkerNames = async () => {
    try {
      setLoading(true);
      // 1. Get all profiles
      const profileSnapshot = await getDocs(collection(db, "Profile"));
      const profiles = {};
      profileSnapshot.forEach(doc => {
        const data = doc.data();
        profiles[data.PROFILE_User_id] = data.Profile_name;
      });

      // 2. Get all reviews
      const reviewSnapshot = await getDocs(collection(db, "Reviews"));
      const reviewList = reviewSnapshot.docs.map(doc => {
        const review = doc.data();
        return {
          id: doc.id,
          ...review,
          workerName: profiles[review.Review_User_UID] || "Unknown Worker"
        };
      });

      setReviews(reviewList);
      setError(null);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsWithWorkerNames();
  }, []);

  // Prepare CSV data
  const csvData = reviews.map(review => ({
    "Comment": review.Review_Comment || "N/A",
    "Rating": review.Review_Rating || "N/A",
    "Worker Name": review.workerName || "N/A",
    "Job ID": review.Review_JobID || "N/A",
    "Reviewed At": review.Review_CreatedAt?.toDate?.()?.toLocaleString() || "N/A"
  }));

  return (
    <div className="reviews-container">
      <div className="reviews-card">
        <div className="header-actions">
          <h2 className="reviews-title">User Reviews</h2>
          
          {reviews.length > 0 && (
            <CSVLink 
              data={csvData} 
              filename={"reviews.csv"}
              className="download-button"
            >
              <FaDownload className="download-icon" />
              Download Reviews
            </CSVLink>
          )}
        </div>
        
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchReviewsWithWorkerNames} className="retry-button">
              Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <p className="no-reviews">No reviews found.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-details">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <p><strong>Worker:</strong> {review.Review_WorkerName}</p>
                      <p><strong>Job ID:</strong> {review.Review_JobId}</p>
                    </div>
                    <div className="review-rating">
                      <span className="text-warning">
                        {"⭐".repeat(review.Review_Rating)}
                      </span>
                      <span className="rating-text">{review.Review_Rating}/5</span>
                    </div>
                  </div>
                  
                  <div className="review-comment">
                    <p><strong>Comment:</strong> {review.Review_Comment}</p>
                  </div>
                  
                  <div className="review-footer">
                    <p className="review-date">
                      {review.Review_CreatedAt?.toDate().toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .reviews-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f7fa;
          padding: 2rem;
        }
        
        .reviews-card {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 800px;
        }
        
        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .download-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
        }
        
        .download-button:hover {
          background: #1565c0;
        }
        
        .download-icon {
          font-size: 0.9rem;
        }
        
        .reviews-title {
          color: #2c3e50;
          margin: 0;
          font-size: 1.8rem;
        }
        
        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
        }
        
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          text-align: center;
          padding: 1rem;
          color: #e74c3c;
        }
        
        .retry-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .no-reviews {
          text-align: center;
          color: #7f8c8d;
          padding: 1rem;
        }
        
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .review-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.25rem;
          background: #f8f9fa;
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .reviewer-info p {
          margin: 0.25rem 0;
          color: #2c3e50;
        }
        
        .review-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .rating-text {
          color: #f39c12;
          font-weight: bold;
        }
        
        .review-comment {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          border-left: 4px solid #3498db;
        }
        
        .review-comment p {
          margin: 0;
          color: #34495e;
          line-height: 1.5;
        }
        
        .review-footer {
          border-top: 1px solid #e0e0e0;
          padding-top: 0.75rem;
        }
        
        .review-date {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        @media (max-width: 600px) {
          .reviews-container {
            padding: 1rem;
          }
          
          .reviews-card {
            padding: 1.5rem;
          }
          
          .header-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .reviews-title {
            text-align: center;
          }
          
          .download-button {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}