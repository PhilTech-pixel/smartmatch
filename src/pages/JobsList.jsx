// JobsList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { toast } from "react-hot-toast";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { CSVLink } from "react-csv";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch jobs
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Jobs"));
      const jobsData = querySnapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date(doc.data().createdAt).toISOString()
      }));
      setJobs(jobsData);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "Jobs", id));
      toast.success("Job deleted successfully!");
      await fetchJobs();
    } catch (error) {
      toast.error("Failed to delete job");
      setIsLoading(false);
    }
  };

  // Prepare data for CSV
  const csvData = jobs.map(job => ({
    "Job Title": job.job_title,
    "Company": job.job_company,
    "Location": job.job_location,
    "Salary": job.job_salary,
    "Type": job.job_type,
    "Description": job.job_description,
    "Posted Date": new Date(job.createdAt).toLocaleDateString()
  }));

  return (
    <div className="dashboard-container">
      {/* Hamburger Menu (same as in PostJob) */}
      <div style={{ position: "fixed", top: "2rem", left: "2.5rem", zIndex: 1000 }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              background: "#fff",
              border: "1.5px solid #1976d2",
              borderRadius: "8px", 
              padding: "0.7rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px 0 rgba(25, 118, 210, 0.10)",
              cursor: "pointer",
              transition: "background 0.2s",
              width: "44px",
              height: "44px",
            }}
            aria-label="Open menu"
          >
            <span style={{ display: "block", width: "22px", height: "3px", background: "#1976d2", borderRadius: "2px", marginBottom: "4px" }} />
            <span style={{ display: "block", width: "22px", height: "3px", background: "#1976d2", borderRadius: "2px", marginBottom: "4px" }} />
            <span style={{ display: "block", width: "22px", height: "3px", background: "#1976d2", borderRadius: "2px" }} />
          </button>
          {menuOpen && (
            <div style={{
              position: "absolute",
              left: 0,
              marginTop: "0.7rem",
              width: "180px",
              background: "#fff",
              border: "1.5px solid #e3e8ef",
              borderRadius: "14px",
              boxShadow: "0 8px 32px 0 rgba(25, 118, 210, 0.13)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/post-job");
                }}
                style={{
                  padding: "1rem 1.5rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  color: "#1976d2",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  cursor: "pointer",
                  borderBottom: "1px solid #e3e8ef",
                  transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#f1f5fb"}
                onMouseOut={e => e.currentTarget.style.background = "none"}
              >
                Post Job
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/alljobs");
                }}
                style={{
                  padding: "1rem 1.5rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  color: "#1976d2",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  cursor: "pointer",
                  borderBottom: "none",
                  transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#f1f5fb"}
                onMouseOut={e => e.currentTarget.style.background = "none"}
              >
                View Jobs
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="dashboard-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="dashboard-title">Posted Jobs</h2>
          <CSVLink 
            data={csvData} 
            filename={"jobs-data.csv"}
            className="download-button"
            style={{
              padding: "0.5rem 1rem",
              background: "#10b981",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Jobs List
          </CSVLink>
        </div>
        
        {isLoading && jobs.length === 0 ? (
          <div className="loading-indicator">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <p>No jobs posted yet.</p>
          </div>
        ) : (
          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div>
                    <h4 className="job-title">{job.job_title}</h4>
                    <p className="job-company">{job.job_company} • {job.job_location}</p>
                  </div>
                  <div className="job-meta">
                    <span className="job-salary">{job.job_salary}</span>
                    <span className="job-type">{job.job_type}</span>
                    <div className="job-date">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="job-description">{job.job_description}</p>
                <div className="job-actions">
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Logout Button (same as in PostJob) */}
      <button
        onClick={() => {
          auth.signOut();
          navigate("/login");
        }}
        style={{
          position: "fixed",
          top: "2rem",
          right: "2.5rem",
          background: "rgba(220,38,38,0.15)", 
          color: "#413d3dff",
          border: "none",
          borderRadius: "999px",
          padding: "0.75rem 2rem",
          fontWeight: 600,
          fontSize: "1.05rem",
          cursor: "pointer",
          boxShadow: "0 4px 16px 0 rgba(220,38,38,0.10)",
          transition: "background 0.2s, color 0.2s",
          zIndex: 1100,
          backdropFilter: "blur(2px)",
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = "#f65656ff";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = "rgba(222, 169, 169, 0.15)";
          e.currentTarget.style.color = "#676161ff";
        }}
      >
        Log Out
      </button>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: #f8fafc;
          padding: 2rem 1rem;
        }
        
        .dashboard-card {
          background: #fff;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .dashboard-title {
          color: #1e293b;
          margin: 0;
          font-size: 1.75rem;
          font-weight: 600;
        }
        
        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .job-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.25rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
          gap: 1rem;
        }
        
        .job-title {
          margin: 0;
          color: #1e293b;
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .job-company {
          margin: 0.25rem 0 0;
          color: #64748b;
          font-size: 0.875rem;
        }
        
        .job-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }
        
        .job-salary {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.875rem;
        }
        
        .job-type {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .job-date {
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .job-description {
          margin: 0.5rem 0 1rem;
          color: #475569;
          font-size: 0.9375rem;
          line-height: 1.5;
        }
        
        .job-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }
        
        .action-button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        
        .action-button.edit {
          background-color: #e0e7ff;
          color: #4f46e5;
        }
        
        .action-button.edit:hover {
          background-color: #c7d2fe;
        }
        
        .action-button.delete {
          background-color: #fee2e2;
          color: #dc2626;
        }
        
        .action-button.delete:hover {
          background-color: #fecaca;
        }
        
        .loading-indicator {
          padding: 1rem;
          text-align: center;
          color: #64748b;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px dashed #cbd5e1;
          color: #64748b;
          text-align: center;
        }
        
        .empty-icon {
          width: 48px;
          height: 48px;
          fill: #cbd5e1;
        }
      `}</style>
    </div>
  );
}