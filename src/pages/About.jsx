import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './About.css'

export default function About() {
  return (
    <div className="about-page">
      <Navbar />
      
      <div className="about-hero">
        <div className="container">
          <h1>About CampusConnect</h1>
          <p className="hero-subtitle">
            Empowering students to connect, collaborate, and create meaningful opportunities together.
          </p>
        </div>
      </div>

      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                CampusConnect was born from a simple idea: making it easier for students to find 
                opportunities and connect with like-minded peers. We believe that collaboration 
                is the key to success, and every student should have easy access to projects, 
                jobs, and partnerships that align with their skills and interests.
              </p>
              <p>
                Our platform uses intelligent matching algorithms to connect students with 
                opportunities that truly matter to them. Whether you're looking for a coding partner 
                for a hackathon, a teammate for a startup, or a part-time job opportunity, 
                CampusConnect helps you find it.
              </p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                🎓
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>We believe in the power of working together to achieve greater things.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Transparency</h3>
              <p>Clear communication and honest interactions build trust and stronger connections.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3>Innovation</h3>
              <p>We continuously improve our platform to better serve our community.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Empowerment</h3>
              <p>Every student deserves access to opportunities that help them grow.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Community</h3>
              <p>Building a supportive network where students can thrive together.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⭐</div>
              <h3>Excellence</h3>
              <p>We strive for excellence in every feature and interaction on our platform.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-features">
        <div className="container">
          <h2 className="section-title">What Makes Us Different</h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <div className="feature-content">
                <h3>Intelligent Matching</h3>
                <p>
                  Our advanced algorithm matches students with opportunities based on skills, 
                  interests, and past behavior, ensuring relevant connections every time.
                </p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">02</div>
              <div className="feature-content">
                <h3>Real-time Communication</h3>
                <p>
                  Built-in chat functionality lets you connect instantly with potential 
                  collaborators or employers without leaving the platform.
                </p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">03</div>
              <div className="feature-content">
                <h3>Comprehensive Analytics</h3>
                <p>
                  Track your applications, monitor job views, and gain insights into 
                  what opportunities are working best for you.
                </p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-number">04</div>
              <div className="feature-content">
                <h3>Diverse Opportunities</h3>
                <p>
                  From academic projects to startup collaborations, part-time jobs to 
                  hackathons - find everything you need in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <h2>Ready to Join Our Community?</h2>
          <p>Start connecting with opportunities and fellow students today!</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-large">
              Contact Us
            </Link>
            <a href="https://students.atrons.net/webpages/aboutus" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-large">
              Learn More About Our Team
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

