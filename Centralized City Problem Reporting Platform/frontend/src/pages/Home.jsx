import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

function Home() {
  return (
    <>
      
      <header className="site-header">
        <div className="brand">Centralized City Problem Reporting Platform</div>
        <Link to="/login" className="btn">
          Get Started / Login
        </Link>
      </header>

      
      <main>
        <section className="hero">
          <h1>Report City Issues Faster · Track Progress · Make Your Neighborhood Better</h1>
          <p>
            A centralized, multi-category platform that empowers citizens to report non-emergency problems — from potholes and waste to streetlights and graffiti — directly to the right department, with real-time tracking and transparency.
          </p>
          <Link
            to="/login"
            className="btn"
            style={{ fontSize: '1.1rem', padding: '14px 32px' }}
          >
            Report an Issue Now
          </Link>
        </section>

        
        <h2 className="section-title">Why Use Our Platform?</h2>
        <div className="features-grid">
          <div className="card">
            <h3>Instant Reporting</h3>
            <p>
              Submit issues in seconds with photos, location auto-tagging and category selection — no more long phone calls or office visits.
            </p>
          </div>
          <div className="card">
            <h3>Real-Time Tracking</h3>
            <p>
              Follow your report's journey: Submitted → Assigned → In Progress → Resolved, with status updates and estimated resolution time.
            </p>
          </div>
          <div className="card">
            <h3>Multi-Category Coverage</h3>
            <p>
              One platform for all common city problems: roads, sanitation, lighting, water, public spaces, illegal dumping and more.
            </p>
          </div>
          <div className="card">
            <h3>Transparent & Efficient</h3>
            <p>
              Reduces duplicates, prioritizes urgent issues, and gives city officials powerful insights to allocate resources better.
            </p>
          </div>
        </div>

       
        <h2 className="section-title">How It Works</h2>
        <div className="how-it-works">
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div>
                <strong>Choose Category & Location</strong><br />
                Select the issue type and let the platform auto-detect your location (or pin it manually).
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div>
                <strong>Add Details & Proof</strong><br />
                Upload photos/videos, describe the problem — the more details, the faster it gets resolved.
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div>
                <strong>Submit & Track</strong><br />
                Your report goes directly to the responsible department. Track progress anytime in your dashboard.
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div>
                <strong>See the Change</strong><br />
                Get notified when it's fixed — contribute to a cleaner, safer city together.
              </div>
            </div>
          </div>
        </div>

       
        <h2 className="section-title">Common Issue Categories</h2>
        <div className="categories-grid">
          <div className="card">
            <h3>Roads & Infrastructure</h3>
            <p>Potholes, damaged sidewalks, broken curbs, flooding</p>
          </div>
          <div className="card">
            <h3>Sanitation & Waste</h3>
            <p>Overflowing bins, uncollected garbage, illegal dumping</p>
          </div>
          <div className="card">
            <h3>Street Lighting & Utilities</h3>
            <p>Non-working streetlights, water leaks, power outages</p>
          </div>
          <div className="card">
            <h3>Public Spaces</h3>
            <p>Graffiti, damaged parks, broken benches, stray animals</p>
          </div>
        </div>
      </main>

     
      <footer>
        © 2026 Centralized City Problem Reporting Platform. Empowering Citizens · Building Better Cities.
      </footer>
    </>
  );
}

export default Home;