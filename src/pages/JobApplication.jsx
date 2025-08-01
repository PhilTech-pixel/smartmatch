import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function JobApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch job details when component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDocRef = doc(db, "Jobs", jobId);
        const jobDoc = await getDoc(jobDocRef);
        
        if (!jobDoc.exists()) {
          toast.error("Job not found!");
          navigate("/jobs");
          return;
        }
        
        setJobTitle(jobDoc.data().job_title || "Unknown Job");
      } catch (error) {
        console.error("Error fetching job details: ", error);
        toast.error("Failed to load job details");
        navigate("/jobs");
      }
    };

    fetchJobDetails();
  }, [jobId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to apply.");
      navigate("/login");
      return;
    }

    if (!name || !coverLetter) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "Applications"), {
        Application_Job_Id: jobId,
        Application_Job_Title: jobTitle,
        Application_User_Id: user.uid,
        Application_User_Name: name,
        Application_User_Email: user.email,
        Application_coverLetter: coverLetter,
        Application_appliedAt: new Date(),
        Application_status: "pending",
        Application_approved: false,
      });

      toast.success("Application submitted successfully!");
      navigate("/jobs");
    } catch (error) {
      console.error("Error submitting application: ", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-container">
      <form onSubmit={handleSubmit} className="application-form">
        <h2>Apply for: {jobTitle}</h2>
        <p className="subtitle">Please fill in your details to apply</p>
        
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="coverLetter">Cover Letter</label>
          <textarea
            id="coverLetter"
            placeholder="Explain why you're a good fit for this position..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
            rows={6}
          />
        </div>
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      <style jsx>{`
        .application-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          padding: 2rem;
        }
        
        .application-form {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
        }
        
        .application-form h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        .subtitle {
          color: #7f8c8d;
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
        }
        
        .form-group textarea {
          min-height: 150px;
          resize: vertical;
        }
        
        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .submit-btn:hover {
          background-color: #2980b9;
        }
        
        .submit-btn:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}