import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  // Fetch pending applications
  const fetchApplications = async () => {
    const querySnapshot = await getDocs(collection(db, "Applications"));
    const pending = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((app) => app.approved === false);
    setApplications(pending);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Approve application
  const handleApprove = async (id) => {
    await updateDoc(doc(db, "Applications", id), { approved: true });
    fetchApplications();
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
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
        <Link to="/approved" className="profile-link">
          <button className="profilebutton">Approved Applications</button>
        </Link>
        
        <h2 style={{ color: "#1976d2", marginBottom: "1.5rem", textAlign: "center" }}>
          Pending Job Applications
        </h2>
        
        {applications.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center" }}>No pending applications.</p>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: "1px solid #e3e3e3",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                background: "#f5f6fa",
              }}
            >
              <div>
                <strong>Job:</strong> {app.jobTitle}
              </div>
              <div>
                <strong>Applicant Name:</strong> {app.applicantName}
              </div>
              <div>
                <strong>Applicant Email:</strong> {app.applicantEmail}
              </div>
              <button
                onClick={() => handleApprove(app.id)}
                style={{
                  marginTop: "0.7rem",
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.3rem",
                  padding: "0.5rem 1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseOver={e => (e.currentTarget.style.background = "#125ea2")}
                onMouseOut={e => (e.currentTarget.style.background = "#1976d2")}
              >
                Approve
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}