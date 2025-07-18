import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FaBriefcase, FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Jobs"));
        const jobsData = querySnapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setJobs(jobsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading job listings...</p>
      </div>
    );
  }

  return (
    <div className="job-listings-container">
      <Link to="/profile" className="profile-link">
         <button className="profilebutton">Profile</button>
        </Link>
     
      <div className="job-listings-header">
        <h1>
          <FaBriefcase className="header-icon" />
          Current Job Openings
        </h1>
        <p className="subtitle">Find your next career opportunity</p>
        
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs by title, company or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="job-listings-content">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs-found">
            {searchTerm ? (
              <>
                <h3>No jobs found matching your search</h3>
                <p>Try different keywords or check back later for new postings</p>
              </>
            ) : (
              <>
                <h3>No jobs posted yet</h3>
                <p>Check back soon for new opportunities</p>
              </>
            )}
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id} className="job-card-link">
                <div className="job-card">
                  <div className="job-card-header">
                    <h3>{job.title}</h3>
                    {job.company && <p className="company">{job.company}</p>}
                  </div>
                  
                  {job.description && (
                    <p className="job-description">
                      {job.description.length > 120 
                        ? `${job.description.substring(0, 120)}...` 
                        : job.description}
                    </p>
                  )}
                  
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
                  
                  <div className="view-details">
                    View Details <span className="arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// CSS Styles
const styles = `
  .job-listings-container {
    min-height: 100vh;
    padding: 2rem 1rem;
    background: #f8f9fa;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .job-listings-header {
    max-width: 1200px;
    margin: 0 auto 2rem;
    text-align: center;
  }

  .job-listings-header h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    margin-bottom: 0.5rem;
  }

  .header-icon {
    color: #4a6bdf;
  }

  .subtitle {
    color: #7f8c8d;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .search-container {
    position: relative;
    max-width: 700px;
    margin: 0 auto;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
  }

  .search-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 1px solid #ddd;
    border-radius: 50px;
    font-size: 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #4a6bdf;
    box-shadow: 0 2px 15px rgba(74, 107, 223, 0.2);
  }

  .job-listings-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .job-card-link {
    text-decoration: none;
    color: inherit;
  }

  .job-card {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #eee;
  }

  .job-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    border-color: #4a6bdf;
  }

  .job-card-header {
    margin-bottom: 1rem;
  }

  .job-card h3 {
    color: #2c3e50;
    margin: 0 0 0.3rem 0;
    font-size: 1.3rem;
  }

  .company {
    color: #4a6bdf;
    font-weight: 500;
    margin: 0;
    font-size: 0.95rem;
  }

  .job-description {
    color: #555;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }

  .job-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #555;
    font-size: 0.9rem;
  }

  .meta-icon {
    color: #4a6bdf;
    font-size: 0.8rem;
  }

  .view-details {
    color: #4a6bdf;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: auto;
  }

  .arrow {
    margin-left: 0.5rem;
    transition: transform 0.2s;
  }

  .job-card:hover .arrow {
    transform: translateX(3px);
  }

  .no-jobs-found {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }

  .no-jobs-found h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .no-jobs-found p {
    color: #7f8c8d;
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

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject styles
const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);