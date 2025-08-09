import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const logOutUser = () => {
    auth.signOut().then(() => {
      setUser(null);
      console.log("User logged out successfully");
    }).catch((error) => { 
      console.error("Error logging out: ", error);
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Jobs"));
        const jobsList = [];
        querySnapshot.forEach((doc) => {
          jobsList.push({ id: doc.id, ...doc.data() });
        });
        setJobs(jobsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Hero Section with Overlay */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "60vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2c3e50",
        }}
      >
        
        {/* Navigation Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "flex-end",
            padding: "2rem",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            {user ? (
              <div>
              <Link
                onClick={logOutUser}
                style={{
                    color: "white",
                    fontWeight: "600",
                    textDecoration: "none",
                    padding: "0.7rem 1.5rem",
                    marginRight: "1rem",
                    borderRadius: "30px",
                    fontSize: "1rem",
                    background: "rgba(234, 71, 71, 0.2)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                LogOut
              </Link>

              <Link
                to="/profile"
                style={{
                  color: "white",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "30px",
                  fontSize: "1rem",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Profile
              </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    color: "white",
                    fontWeight: "600",
                    textDecoration: "none",
                    padding: "0.7rem 1.5rem",
                    borderRadius: "30px",
                    fontSize: "1rem",
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    color: "#1976d2",
                    fontWeight: "600",
                    textDecoration: "none",
                    padding: "0.7rem 1.5rem",
                    borderRadius: "30px",
                    fontSize: "1rem",
                    background: "white",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#f0f0f0";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0,0,0,0.1)";
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Hero Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            color: "white",
            padding: "2rem",
            maxWidth: "800px",
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            Welcome to Smartmatch
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: "300",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            Connect with opportunities that match your skills and ambitions
          </p>
          <Link
            to="/register"
            style={{
              display: "inline-block",
              padding: "1rem 2.5rem",
              background: "#1976d2",
              color: "white",
              borderRadius: "30px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "1.1rem",
              boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
              transition: "all 0.3s ease",
              marginTop: "1rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#1565c0";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(25, 118, 210, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#1976d2";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(25, 118, 210, 0.4)";
            }}
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Job Listings Section */}
      <div
        style={{
          width: "100%",
          padding: "4rem 2rem",
          background: "white",
          transform: "translateY(-50px)",
          borderRadius: "30px 30px 0 0",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: "600",
              color: "#2c3e50",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Latest Job Opportunities
          </h2>
          <p
            style={{
              color: "#7f8c8d",
              fontSize: "1.1rem",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Find your perfect match from our curated list of opportunities
          </p>
          
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "5px solid #f3f3f3",
                  borderTop: "5px solid #1976d2",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            </div>
          ) : jobs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                background: "#f9f9f9",
                borderRadius: "15px",
              }}
            >
              <p style={{ fontSize: "1.2rem", color: "#7f8c8d" }}>
                No job listings available at the moment. Check back later!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "2rem",
              }}
            >
              {jobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    background: "white",
                    padding: "2rem",
                    borderRadius: "15px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                    borderTop: "4px solid #1976d2",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 15px rgba(0,0,0,0.05)";
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      color: "#2c3e50",
                      marginTop: "0",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {job.job_title}
                  </h3>
                  <p
                    style={{
                      color: "#1976d2",
                      fontWeight: "500",
                      marginBottom: "1rem",
                    }}
                  >
                    {job.job_company}
                  </p>
                  
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.8rem",
                    }}
                  >
                    <span
                      style={{
                        marginRight: "0.5rem",
                        color: "#7f8c8d",
                      }}
                    >
                      📍
                    </span>
                    <span style={{ color: "#34495e" }}>{job.job_location}</span>
                  </div>
                  
                  {job.job_salary && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.8rem",
                      }}
                    >
                      <span
                        style={{
                          marginRight: "0.5rem",
                          color: "#7f8c8d",
                        }}
                      >
                        💰
                      </span>
                      <span style={{ color: "#34495e" }}>{job.job_salary}</span>
                    </div>
                  )}
                  
                  <div
                    style={{
                      marginTop: "1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        background: "#e3f2fd",
                        color: "#1976d2",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      {job.job_type || "Available"}
                    </span>
                    
                    <Link
                      to={`/jobs/${job.id}`}
                      style={{
                        color: "#1976d2",
                        fontWeight: "600",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = "#0d47a1";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = "#1976d2";
                      }}
                    >
                      View Details
                      <span style={{ marginLeft: "0.3rem" }}>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          padding: "2rem",
          background: "#2c3e50",
          color: "white",
          textAlign: "center",
        }}
      >
        <p>© {new Date().getFullYear()} Smartmatch. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Home;