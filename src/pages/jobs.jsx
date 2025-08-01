import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FaBriefcase, FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaDownload } from "react-icons/fa";
import { CSVLink } from "react-csv";
import "./JobListings.css";

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
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date(doc.data().createdAt).toISOString()
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
    job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.job_description && job.job_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.job_company && job.job_company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Prepare CSV data
  const csvData = filteredJobs.map(job => ({
    "Job Title": job.job_title,
    "Company": job.job_company,
    "Location": job.job_location,
    "Salary": job.job_salary,
    "Type": job.job_type,
    "Description": job.job_description,
    "Posted Date": new Date(job.createdAt).toLocaleDateString()
  }));

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
      <div className="header-buttons">
        <Link to="/profile" className="profile-link">
          <button className="profile-button">Profile</button>
        </Link>
        
        {filteredJobs.length > 0 && (
          <CSVLink 
            data={csvData} 
            filename={"job-listings.csv"}
            className="download-button"
          >
            <FaDownload className="download-icon" />
            Download Jobs List
          </CSVLink>
        )}
      </div>
     
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
                    <h3>{job.job_title}</h3>
                    {job.job_company && <p className="company">{job.job_company}</p>}
                  </div>
                  
                  {job.job_description && (
                    <p className="job-description">
                      {job.job_description.length > 120 
                        ? `${job.job_description.substring(0, 120)}...` 
                        : job.job_description}
                    </p>
                  )}
                  
                  <div className="job-meta">
                    {job.job_location && (
                      <div className="meta-item">
                        <FaMapMarkerAlt className="meta-icon" />
                        <span>{job.job_location}</span>
                      </div>
                    )}
                    {job.job_salary && (
                      <div className="meta-item">
                        <FaMoneyBillWave className="meta-icon" />
                        <span>{job.job_salary}</span>
                      </div>
                    )}
                    {job.job_type && (
                      <div className="meta-item">
                        <FaClock className="meta-icon" />
                        <span>{job.job_type}</span>
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