import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function Approved() {
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeReviewForm, setActiveReviewForm] = useState(null);

  // Fetch approved applications
  const fetchApprovedApplications = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Applications"));
      const appsData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Filter for approved applications
      const approvedApps = appsData.filter(app => app.Application_approved === true);
      setApprovedApplications(approvedApps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedApplications();
  }, []);

  // Handle review submission
  const handleReviewSubmit = async (applicationId) => {
    const review = reviews[applicationId];
    if (!review?.rating || !review?.comment) {
      toast.error("Please provide both a rating and comment");
      return;
    }

    try {
      const application = approvedApplications.find(app => app.id === applicationId);
      
      await addDoc(collection(db, "Reviews"), {
        Review_ClientId: auth.currentUser?.uid,
        Review_Comment: review.comment,
        Review_Rating: parseFloat(review.rating),
        Review_WorkerId: application.Application_User_Id,
        Review_WorkerName: application.Application_User_Name, // Added applicant name
        Review_JobId: application.Application_Job_Id,
        Review_JobTitle: application.Application_Job_Title,
        Review_CreatedAt: new Date()
      });
      
      setReviews(prev => ({ 
        ...prev, 
        [applicationId]: { ...prev[applicationId], submitted: true } 
      }));
      setActiveReviewForm(null);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const handleReviewChange = (applicationId, field, value) => {
    setReviews(prev => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="approved-applications-container">
      <div className="approved-applications-card">
        <h2 className="approved-applications-title">
          <span className="checkmark">✓</span> Approved Applications
        </h2>

        {approvedApplications.length === 0 ? (
          <div className="no-applications">
            No approved applications found.
          </div>
        ) : (
          <div className="applications-grid">
            {approvedApplications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <h3>{app.Application_Job_Title || "Untitled Job"}</h3>
                  <span className="approved-badge">Approved</span>
                </div>

                <div className="application-details">
                  <div className="detail-row">
                    <span className="detail-label">Applicant:</span>
                    <span>{app.Application_User_Name || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span>{app.Application_User_Email || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date Approved:</span>
                    <span>
                      {app.Application_processedAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                    </span>
                  </div>
                </div>

                {reviews[app.id]?.submitted ? (
                  <div className="review-submitted">
                    ✓ Review submitted
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveReviewForm(activeReviewForm === app.id ? null : app.id)}
                      className={`review-toggle-btn ${
                        activeReviewForm === app.id ? "cancel" : ""
                      }`}
                    >
                      {activeReviewForm === app.id ? "Cancel Review" : "Add Review"}
                    </button>

                    {activeReviewForm === app.id && (
                      <div className="review-form">
                        <h4>Leave a Review for {app.Application_User_Name}</h4>
                        
                        <div className="form-group">
                          <label>Rating (1-5)</label>
                          <select
                            value={reviews[app.id]?.rating || ""}
                            onChange={(e) => handleReviewChange(app.id, "rating", e.target.value)}
                          >
                            <option value="">Select rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Comments</label>
                          <textarea
                            value={reviews[app.id]?.comment || ""}
                            onChange={(e) => handleReviewChange(app.id, "comment", e.target.value)}
                            placeholder={`Share your experience working with ${app.Application_User_Name}...`}
                          />
                        </div>

                        <button
                          onClick={() => handleReviewSubmit(app.id)}
                          className="submit-review-btn"
                        >
                          Submit Review
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .approved-applications-container {
          min-height: 100vh;
          padding: 2rem;
          background: #f5f7fa;
        }
        
        .approved-applications-card {
          max-width: 1200px;
          margin: 0 auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 2rem;
        }
        
        .approved-applications-title {
          color: #2c3e50;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .checkmark {
          color: #1976d2;
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80vh;
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
        
        .no-applications {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
        }
        
        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .application-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .application-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .application-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.2rem;
        }
        
        .approved-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .application-details {
          margin-bottom: 1rem;
        }
        
        .detail-row {
          display: flex;
          margin-bottom: 0.5rem;
        }
        
        .detail-label {
          width: 120px;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .review-toggle-btn {
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          margin-top: 1rem;
          width: 100%;
        }
        
        .review-toggle-btn.cancel {
          background: #f5f5f5;
          color: #333;
        }
        
        .review-toggle-btn:hover {
          opacity: 0.9;
        }
        
        .review-form {
          margin-top: 1.5rem;
        }
        
        .review-form h4 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #2c3e50;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }
        
        .submit-review-btn {
          background: #4caf50;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.2s;
          width: 100%;
        }
        
        .submit-review-btn:hover {
          background: #3e8e41;
        }
        
        .review-submitted {
          background: #e8f5e9;
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: 1rem;
          color: #2e7d32;
          text-align: center;
        }
      `}</style>
    </div>
  );
}