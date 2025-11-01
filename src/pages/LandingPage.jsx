import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Connect. Collaborate. <span className="gradient-text">Succeed.</span>
          </h1>
          <p className="hero-subtitle">
            CampusConnect is your gateway to discovering talent and opportunities on campus.
            Whether you're looking for collaborators, job opportunities, or team members for your next big project.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why CampusConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Talent Discovery</h3>
              <p>Find the perfect match for your projects with our intelligent matching system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Opportunity Hub</h3>
              <p>Browse through part-time jobs, startup gigs, academic projects, and competitions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Connect with students across campus for meaningful collaborations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Track your applications and manage opportunities with powerful analytics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Communicate instantly with potential collaborators or employers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Match Score</h3>
              <p>Get personalized match scores to find the best opportunities for you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Join hundreds of students connecting through opportunities</p>
          <Link to="/signup" className="btn btn-primary btn-large">
            Create Your Account
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 CampusConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

