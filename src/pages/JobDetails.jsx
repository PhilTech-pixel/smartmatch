import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "Jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job:", error);
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = () => {
    navigate(`/apply/${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="error-container">
        <h2>Job Not Found</h2>
        <p>The job you're looking for doesn't exist or may have been removed.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <div className="job-details-card">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Back to Jobs
        </button>

        <div className="job-header">
          <h1>{job.title}</h1>
          <p className="company-name">{job.company || "Company not specified"}</p>
        </div>

        <div className="job-meta">
          {job.location && (
            <div className="meta-item">
              <FaMapMarkerAlt className="meta-icon" />
              <span>{job.location}</span>
            </div>
          )}
          {job.salary && (
            <div className="meta-item">
              <FaMoneyBillWave className="meta-icon" />
              <span>{job.salary}</span>
            </div>
          )}
          {job.type && (
            <div className="meta-item">
              <FaClock className="meta-icon" />
              <span>{job.type}</span>
            </div>
          )}
        </div>

        <div className="job-content">
          <div className="section">
            <h3>Job Description</h3>
            <p>{job.description || "No description provided."}</p>
          </div>

          {job.responsibilities && (
            <div className="section">
              <h3>Responsibilities</h3>
              <ul>
                {job.responsibilities.split('\n').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && (
            <div className="section">
              <h3>Requirements</h3>
              <ul>
                {job.requirements.split('\n').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="apply-section">
          {applied ? (
            <div className="applied-message">
              <FaCheckCircle className="success-icon" />
              <span>Application Submitted!</span>
              <p>We've received your application for this position.</p>
            </div>
          ) : (
            <button onClick={handleSubmit} className="apply-button">
              Apply For This Position
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// CSS Styles (can be in a separate file or styled-components)
const styles = `
  .job-details-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .job-details-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 800px;
    padding: 2.5rem;
    position: relative;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #4a6bdf;
    font-size: 1rem;
    cursor: pointer;
    margin-bottom: 1.5rem;
    transition: color 0.2s;
  }

  .back-button:hover {
    color: #3a56c4;
  }

  .job-header {
    margin-bottom: 1.5rem;
  }

  .job-header h1 {
    font-size: 2rem;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
  }

  .company-name {
    font-size: 1.2rem;
    color: #7f8c8d;
    font-weight: 500;
  }

  .job-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #555;
    font-size: 0.95rem;
  }

  .meta-icon {
    color: #4a6bdf;
  }

  .job-content {
    margin-bottom: 2rem;
  }

  .section {
    margin-bottom: 2rem;
  }

  .section h3 {
    color: #2c3e50;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    position: relative;
    padding-left: 1rem;
  }

  .section h3::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: #4a6bdf;
    border-radius: 2px;
  }

  .section p {
    color: #555;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .section ul {
    padding-left: 1.5rem;
    color: #555;
  }

  .section li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .apply-section {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .apply-button {
    background: #4a6bdf;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    max-width: 300px;
  }

  .apply-button:hover {
    background: #3a56c4;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 107, 223, 0.3);
  }

  .applied-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: #27ae60;
    padding: 1.5rem;
    border: 1px solid #d5f5e3;
    background: #f0fdf4;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .success-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .applied-message p {
    color: #555;
    margin: 0;
    font-size: 0.9rem;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 1rem;
  }

  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #4a6bdf;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  .error-container {
    max-width: 500px;
    margin: 3rem auto;
    padding: 2rem;
    text-align: center;
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }

  .error-container h2 {
    color: #e74c3c;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject styles
const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);