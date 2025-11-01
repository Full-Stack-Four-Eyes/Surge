import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-badge">
            🎓 Trusted by 1000+ Students
          </div>
          <h1 className="hero-title">
            Connect. Collaborate. <span className="gradient-text">Succeed.</span>
          </h1>
          <p className="hero-subtitle">
            CampusConnect is your gateway to discovering talent and opportunities on campus.
            Whether you're looking for collaborators, job opportunities, or team members for your next big project.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary btn-large">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Login
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">1,000+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Opportunities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">1,000+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-value">500+</div>
              <div className="stat-label">Job Opportunities</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🤝</div>
              <div className="stat-value">300+</div>
              <div className="stat-label">Successful Matches</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">4.9/5</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why CampusConnect?</h2>
          <p className="section-subtitle">
            Everything you need to connect, collaborate, and succeed - all in one platform.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Talent Discovery</h3>
              <p>Find the perfect match for your projects with our intelligent matching system that learns from your preferences.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Opportunity Hub</h3>
              <p>Browse through part-time jobs, startup gigs, academic projects, and competitions all in one place.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Connect with students across campus for meaningful collaborations and team building.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Track your applications and manage opportunities with powerful analytics and insights.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Communicate instantly with potential collaborators or employers through our built-in messaging system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Match Score</h3>
              <p>Get personalized match scores to find the best opportunities tailored to your skills and interests.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Students Say</h2>
          <p className="section-subtitle">
            Join thousands of students who are already connecting and succeeding together.
          </p>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "CampusConnect helped me find an amazing team for our hackathon project. 
                The matching algorithm is spot-on!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💻</div>
                <div className="author-info">
                  <div className="author-name">Ahsan Siddique</div>
                  <div className="author-role">Computer Science Student</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "I found my dream part-time job through CampusConnect. The platform is 
                intuitive and the real-time chat feature is a game-changer."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍💼</div>
                <div className="author-info">
                  <div className="author-name">Ateeb Khaid</div>
                  <div className="author-role">Business Major</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "As a startup founder, CampusConnect gave me access to talented students 
                I never would have found otherwise. Highly recommend!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍🎓</div>
                <div className="author-info">
                  <div className="author-name">Laiba Badar</div>
                  <div className="author-role">Entrepreneur</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Join hundreds of students connecting through opportunities</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary btn-large">
              Create Your Account
            </Link>
            <Link to="/about" className="btn btn-secondary btn-large">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

