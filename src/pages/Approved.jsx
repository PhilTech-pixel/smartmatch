import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";

import { collection, getDocs, doc, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";


export default function Approved() {
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeReviewForm, setActiveReviewForm] = useState(null);

  // Fetch approved applications
  const fetchApprovedApplications = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Applications"));
      const approved = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((app) => app.approved === true);
      setApprovedApplications(approved);
    } catch (error) {
      console.error("Error fetching applications:", error);
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
    if (!review || !review.rating || !review.comment) {
      alert("Please provide both a rating and comment");
      return;
    }

    try {
      await addDoc(collection(db, "Reviews"), {
        clientId: auth.currentUser.uid,
        comment: review.comment,
        rating: parseFloat(review.rating),
        workerId: approvedApplications.find(app => app.id === applicationId).applicantId,
        jobId: applicationId,
        createdAt: new Date()
      });
      
      setReviews(prev => ({ ...prev, [applicationId]: { ...prev[applicationId], submitted: true } }));
      setActiveReviewForm(null);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
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
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh"
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "90vh",
      padding: "2rem",
      background: "#f5f7fa"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "2rem"
      }}>
        <h2 style={{
          color: "#2c3e50",
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span style={{ color: "#1976d2" }}>✓</span> Approved Applications
        </h2>

        {approvedApplications.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            color: "#7f8c8d"
          }}>
            No approved applications found.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem"
          }}>
            {approvedApplications.map((app) => (
              <div key={app.id} style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "1.5rem",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                position: "relative"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem"
                }}>
                  <h3 style={{
                    margin: "0",
                    color: "#2c3e50",
                    fontSize: "1.2rem"
                  }}>{app.jobTitle}</h3>
                  <span style={{
                    background: "#e3f2fd",
                    color: "#1976d2",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>Approved</span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem"
                  }}>
                    <span style={{
                      width: "100px",
                      color: "#7f8c8d",
                      fontSize: "0.9rem"
                    }}>Applicant:</span>
                    <span>{app.applicantName}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem"
                  }}>
                    <span style={{
                      width: "100px",
                      color: "#7f8c8d",
                      fontSize: "0.9rem"
                    }}>Email:</span>
                    <span>{app.applicantEmail}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <span style={{
                      width: "100px",
                      color: "#7f8c8d",
                      fontSize: "0.9rem"
                    }}>Date Approved:</span>
                    <span>{new Date(app.approvedAt?.toDate()).toLocaleDateString()}</span>
                  </div>
                </div>

                {reviews[app.id]?.submitted ? (
                  <div style={{
                    background: "#e8f5e9",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    marginTop: "1rem",
                    color: "#2e7d32"
                  }}>
                    ✓ Review submitted
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveReviewForm(activeReviewForm === app.id ? null : app.id)}
                      style={{
                        background: activeReviewForm === app.id ? "#f5f5f5" : "#1976d2",
                        color: activeReviewForm === app.id ? "#333" : "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        transition: "all 0.2s",
                        marginTop: "1rem"
                      }}
                    >
                      {activeReviewForm === app.id ? "Cancel Review" : "Add Review"}
                    </button>

                    {activeReviewForm === app.id && (
                      <div style={{ marginTop: "1.5rem" }}>
                        <h4 style={{
                          margin: "0 0 1rem 0",
                          fontSize: "1rem",
                          color: "#2c3e50"
                        }}>Leave a Review</h4>
                        
                        <div style={{ marginBottom: "1rem" }}>
                          <label style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            color: "#7f8c8d",
                            fontSize: "0.9rem"
                          }}>Rating (1-5)</label>
                          <select
                            value={reviews[app.id]?.rating || ""}
                            onChange={(e) => handleReviewChange(app.id, "rating", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "0.9rem"
                            }}
                          >
                            <option value="">Select rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </select>
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                          <label style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            color: "#7f8c8d",
                            fontSize: "0.9rem"
                          }}>Comments</label>
                          <textarea
                            value={reviews[app.id]?.comment || ""}
                            onChange={(e) => handleReviewChange(app.id, "comment", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              minHeight: "80px",
                              fontSize: "0.9rem"
                            }}
                            placeholder="Share your experience working with this professional..."
                          />
                        </div>

                        <button
                          onClick={() => handleReviewSubmit(app.id)}
                          style={{
                            background: "#4caf50",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            transition: "background 0.2s",
                            width: "100%"
                          }}
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
    </div>
  );
}