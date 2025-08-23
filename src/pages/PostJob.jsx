import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { toast } from "react-hot-toast";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function PostJob() {
  // --- STATE VARIABLES ---
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState("");
  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // --- REDIRECT IF NOT LOGGED IN ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // --- FETCH JOBS (Read) ---
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Jobs"));
      setJobs(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // --- CREATE OR UPDATE JOB ---
  const handleSubmit = async () => {
    if (!title || !desc || !company || !location || !salary || !type) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "Jobs", editId), { 
          job_title: title, 
          job_description: desc,
          job_company: company,
          job_location: location,
          job_salary: salary,
          job_type: type,
        });
        toast.success("Job updated successfully!");
        setEditId(null);
      } else {
        await addDoc(collection(db, "Jobs"), {
          job_title: title, 
          job_description: desc,
          job_company: company,
          job_location: location,
          job_salary: salary,
          job_type: type,
          createdAt: new Date(),
        });
        toast.success("Job posted successfully!");
      }
      setTitle("");
      setDesc("");
      setCompany("");
      setLocation("");
      setSalary("");
      setType("");
      await fetchJobs();
    } catch (error) {
      toast.error("Operation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- EDIT JOB ---
  const handleEdit = (job) => {
    setEditId(job.id);
    setTitle(job.job_title);
    setDesc(job.job_description);
    setCompany(job.job_company);
    setLocation(job.job_location);
    setSalary(job.job_salary);
    setType(job.job_type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- DELETE JOB ---
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

  return (
    <div className="dashboard-container">
      {/* Hamburger Dropdown Menu in Corner */}
      <div style={{
        position: "fixed",
        top: "2rem",
        left: "2.5rem",
        zIndex: 1000,
      }}>
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
            {/* Hamburger Icon */}
            <span style={{
              display: "block",
              width: "22px",
              height: "3px",
              background: "#1976d2",
              borderRadius: "2px",
              marginBottom: "4px"
            }} />
            <span style={{
              display: "block",
              width: "22px",
              height: "3px",
              background: "#1976d2",
              borderRadius: "2px",
              marginBottom: "4px"
            }} />
            <span style={{
              display: "block",
              width: "22px",
              height: "3px",
              background: "#1976d2",
              borderRadius: "2px"
            }} />
          </button>
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                left: 0, // changed from right to left
                marginTop: "0.7rem",
                width: "180px",
                background: "#fff",
                border: "1.5px solid #e3e8ef",
                borderRadius: "14px",
                boxShadow: "0 8px 32px 0 rgba(25, 118, 210, 0.13)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
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
                  navigate("/applications");
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
                Applications
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
                View All Jobs
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/reviews");
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
                Reviews
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="dashboard-card">
        <h2 className="dashboard-title">Post a new job</h2>
        
        <div className="form-section">
          <div className="input-group">
            <label htmlFor="job-title">Job Title</label>
            <input
              id="job-title"
              type="text"
              placeholder="Enter job title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="job-desc">Job Description</label>
            <textarea
              id="job-desc"
              placeholder="Enter job description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="input-group">
            <label htmlFor="job-company">Company</label>
            <input
              id="job-company"
              type="text"
              placeholder="Enter company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="job-location">Location</label>
            <input
              id="job-location"
              type="text"
              placeholder="Enter job location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="job-salary">Salary</label>
            <input
              id="job-salary"
              type="text"
              placeholder="Enter job salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="job-type">Job Type</label>
            <input
              id="job-type"
              type="text"
              placeholder="e.g., Full-time, Part-time"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-input"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`submit-button ${editId ? "update" : "create"}`}
          >
            {isLoading ? (
              <span className="button-loader"></span>
            ) : editId ? (
              "Update Job"
            ) : (
              "Post Job"
            )}
          </button>
        </div>
        
        <div className="jobs-section">
          <h3 className="section-title">Posted Jobs</h3>
          
          {isLoading && jobs.length === 0 ? (
            <div className="loading-indicator">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <p>No jobs posted yet. Create your first job!</p>
            </div>
          ) : (
            <div className="jobs-list">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h4 className="job-title">{job.job_title}</h4>
                    <div className="job-date">
                      {new Date(job.createdAt?.seconds * 1000 || job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="job-description">{job.job_description}</p>
                  <div className="job-actions">
                    <button
                      onClick={() => handleEdit(job)}
                      className="action-button edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="action-button delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={() => {
          // Add your logout logic here (e.g., auth.signOut())
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
          text-align: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 1rem;
          background: #fff;
          color: #1e293b;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        .submit-button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .submit-button.create {
          background-color: #4f46e5;
          color: white;
        }
        
        .submit-button.update {
          background-color: #10b981;
          color: white;
        }
        
        .submit-button:hover {
          opacity: 0.9;
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .jobs-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .section-title {
          color: #1e293b;
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
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
        }
        
        .job-title {
          margin: 0;
          color: #1e293b;
          fontSize: 1.125rem;
          fontWeight: 600;
        }
        
        .job-date {
          fontSize: 0.75rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          borderRadius: 4px;
        }
        
        .job-description {
          margin: 0.5rem 0 1rem;
          color: #475569;
          fontSize: 0.9375rem;
          lineHeight: 1.5;
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
      `}</style>
    </div>
  );
}