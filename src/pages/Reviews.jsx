import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  const fetchReviewsWithWorkerNames = async () => {
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
  };

  useEffect(() => {
    fetchReviewsWithWorkerNames();
  }, []);

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
        padding: "2rem 0",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)",
          minWidth: "340px",
          maxWidth: "95vw",
          width: "100%",
        }}
      >
        <h2 style={{ color: "#e65100", marginBottom: "1.5rem", textAlign: "center" }}>
          User Reviews
        </h2>

        {reviews.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center" }}>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #e3e3e3",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                background: "#fefefe",
              }}
            >
              <div><strong>Comment:</strong> {review.Review_Comment}</div>
              <div><strong>Rating:</strong> ⭐ {review.Review_Rating}/5</div>
              <div><strong>Worker Name:</strong> {review.workerName}</div>
              <div><strong>Job ID:</strong> {review.Review_Job_ID}</div>
              <div>
                <strong>Reviewed At:</strong>{" "}
                {review.createdAt?.toDate().toLocaleString() || "N/A"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
