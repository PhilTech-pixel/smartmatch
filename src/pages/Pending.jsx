import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function Pending() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch user's applications
  const fetchUserApplications = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please sign in to view your applications");
        return;
      }

      const q = query(
        collection(db, "Applications"),
        where("Application_User_Id", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const appsData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      setApplications(appsData);
      calculateStats(appsData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load your applications");
    } finally {
      setLoading(false);
    }
  };

  // Calculate application statistics
  const calculateStats = (apps) => {
    const stats = {
      total: apps.length,
      pending: apps.filter(app => app.Application_approved === false && app.Application_status === "pending").length,
      approved: apps.filter(app => app.Application_approved === true).length,
      rejected: apps.filter(app => app.Application_status === "rejected").length
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchUserApplications();
  }, []);

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return timestamp.toDate ? timestamp.toDate().toLocaleDateString() : new Date(timestamp).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // Get status badge class
  const getStatusClass = (application) => {
    if (application.Application_status === "rejected") return "status-rejected";
    if (application.Application_approved) return "status-approved";
    return "status-pending";
  };

  // Get status text
  const getStatusText = (application) => {
    if (application.Application_status === "rejected") return "Rejected";
    if (application.Application_approved) return "Approved";
    return "Pending";
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">My Applications</h1>
        
        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <h3>Total Applications</h3>
            <div className="stat-number">{stats.total}</div>
          </div>
          
          <div className="stat-card pending">
            <h3>Pending</h3>
            <div className="stat-number">{stats.pending}</div>
          </div>
          
          <div className="stat-card approved">
            <h3>Approved</h3>
            <div className="stat-number">{stats.approved}</div>
          </div>
          
          <div className="stat-card rejected">
            <h3>Rejected</h3>
            <div className="stat-number">{stats.rejected}</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="applications-section">
          <h2 className="section-title">Application History</h2>
          
          {applications.length === 0 ? (
            <div className="no-applications">
              <p>You haven't submitted any applications yet.</p>
              <button className="browse-jobs-btn">Browse Jobs</button>
            </div>
          ) : (
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="application-header">
                    <h3>{app.Application_Job_Title || "Untitled Position"}</h3>
                    <span className={`status-badge ${getStatusClass(app)}`}>
                      {getStatusText(app)}
                    </span>
                  </div>
                  
                  <div className="application-details">
                    <div className="detail-row">
                      <span className="detail-label">Applied on:</span>
                      <span>{formatDate(app.Application_appliedAt)}</span>
                    </div>
                    
                    {app.Application_coverLetter && (
                      <div className="detail-row">
                        <span className="detail-label">Cover Letter:</span>
                        <span className="cover-letter-preview">
                          {app.Application_coverLetter.substring(0, 100)}
                          {app.Application_coverLetter.length > 100 ? '...' : ''}
                        </span>
                      </div>
                    )}
                    
                    {app.Application_processedAt && (
                      <div className="detail-row">
                        <span className="detail-label">Processed on:</span>
                        <span>{formatDate(app.Application_processedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          padding: 6rem 1rem 2rem;
          background: #f5f7fa;
        }
        
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .dashboard-title {
          color: #2c3e50;
          margin-bottom: 2rem;
          text-align: center;
          font-size: 2.2rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .stat-card {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          text-align: center;
          border-top: 4px solid #3498db;
        }
        
        .stat-card.total {
          border-top-color: #3498db;
        }
        
        .stat-card.pending {
          border-top-color: #f39c12;
        }
        
        .stat-card.approved {
          border-top-color: #2ecc71;
        }
        
        .stat-card.rejected {
          border-top-color: #e74c3c;
        }
        
        .stat-card h3 {
          margin: 0 0 1rem 0;
          color: #7f8c8d;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .applications-section {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .section-title {
          color: #2c3e50;
          margin: 0 0 1.5rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .no-applications {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
        }
        
        .browse-jobs-btn {
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          transition: background 0.2s;
        }
        
        .browse-jobs-btn:hover {
          background: #2980b9;
        }
        
        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .application-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          background: #fafafa;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .application-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .application-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .application-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.3rem;
        }
        
        .status-badge {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .status-pending {
          background: #fff3cd;
          color: #856404;
        }
        
        .status-approved {
          background: #d4edda;
          color: #155724;
        }
        
        .status-rejected {
          background: #f8d7da;
          color: #721c24;
        }
        
        .application-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .detail-row {
          display: flex;
          gap: 0.5rem;
        }
        
        .detail-label {
          font-weight: 500;
          color: #7f8c8d;
          min-width: 120px;
        }
        
        .cover-letter-preview {
          color: #5f6368;
          font-style: italic;
        }
        
        .loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          gap: 1rem;
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
        
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 5rem 1rem 1rem;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .application-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .detail-row {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}