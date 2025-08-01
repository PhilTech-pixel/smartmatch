import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Applications"));
      const appsData = querySnapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Filter for pending applications
      const pendingApps = appsData.filter(app => app.Application_approved === false);
      setApplications(pendingApps);
      setError(null);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications");
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Approve application
  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "Applications", id), { 
        Application_approved: true,
        Application_status: "approved",
        Application_processedAt: new Date()
      });
      toast.success("Application approved successfully!");
      fetchApplications(); // Refresh the list
    } catch (err) {
      console.error("Error approving application:", err);
      toast.error("Failed to approve application");
    }
  };

  return (
    <div className="applications-container">
      <div className="applications-card">
        <Link to="/approved" className="approved-apps-link">
          <button className="approved-apps-button">
            View Approved Applications
          </button>
        </Link>
        
        <h2 className="applications-title">Pending Job Applications</h2>
        
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchApplications} className="retry-button">
              Retry
            </button>
          </div>
        ) : applications.length === 0 ? (
          <p className="no-applications">No pending applications found.</p>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-details">
                  <p><strong>Job:</strong> {app.Application_Job_Title || "N/A"}</p>
                  <p><strong>Applicant:</strong> {app.Application_User_Name || "N/A"}</p>
                  <p><strong>Email:</strong> {app.Application_User_Email || "N/A"}</p>
                  {app.Application_coverLetter && (
                    <details className="cover-letter-details">
                      <summary>View Cover Letter</summary>
                      <p>{app.Application_coverLetter}</p>
                    </details>
                  )}
                </div>
                <button
                  onClick={() => handleApprove(app.id)}
                  className="approve-button"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .applications-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f7fa;
          padding: 2rem;
        }
        
        .applications-card {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 800px;
        }
        
        .approved-apps-link {
          display: block;
          margin-bottom: 1.5rem;
          text-decoration: none;
        }
        
        .approved-apps-button {
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .approved-apps-button:hover {
          background: #3e8e41;
        }
        
        .applications-title {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          text-align: center;
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
        
        .no-applications {
          text-align: center;
          color: #7f8c8d;
          padding: 1rem;
        }
        
        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .application-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f9fa;
        }
        
        .application-details {
          flex: 1;
        }
        
        .application-details p {
          margin: 0.5rem 0;
          color: #2c3e50;
        }
        
        .cover-letter-details {
          margin-top: 0.5rem;
          color: #7f8c8d;
          cursor: pointer;
        }
        
        .cover-letter-details p {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #fff;
          border-radius: 4px;
          border: 1px solid #eee;
        }
        
        .approve-button {
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          margin-left: 1rem;
        }
        
        .approve-button:hover {
          background: #2980b9;
        }
      `}</style>
    </div>
  );
}