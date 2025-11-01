import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LandingPage.css'

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef(null)
  const autoScrollRef = useRef(null)
  const isManualScroll = useRef(false)

  const features = [
    {
      id: 1,
      icon: '🔁',
      title: 'Dual Role System',
      description: 'Switch between Talent Finder and Seeker anytime.'
    },
    {
      id: 2,
      icon: '🎯',
      title: 'Smart Match Score',
      description: 'Instantly know how well your skills fit each post.'
    },
    {
      id: 3,
      icon: '💬',
      title: 'Real-time Chat',
      description: 'Collaborate instantly without leaving the platform.'
    },
    {
      id: 4,
      icon: '🗂️',
      title: 'Application Tracking',
      description: 'See every stage of your applied opportunities.'
    },
    {
      id: 5,
      icon: '🧑‍💻',
      title: 'Profile Builder',
      description: 'Showcase your skills, projects, and resume in one place.'
    },
    {
      id: 6,
      icon: '📊',
      title: 'Post Analytics',
      description: 'Track views, applicants, and engagement stats.'
    }
  ]


  // Calculate slide width
  const getSlideWidth = () => {
    if (sliderRef.current && sliderRef.current.children.length > 0) {
      const slide = sliderRef.current.children[0]
      const style = window.getComputedStyle(slide)
      const margin = parseFloat(style.marginRight) || 0
      return slide.offsetWidth + margin
    }
    return 350 + 32
  }

  // Auto-scroll functionality - only restart when manual scroll ends
  useEffect(() => {
    // Don't start if manual scroll is active
    if (isManualScroll.current) return
    
    // Clear any existing auto-scroll
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
    
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (sliderRef.current && !isManualScroll.current) {
          setCurrentSlide(prev => {
            const next = (prev + 1) % features.length
            // Use setTimeout to avoid state update during scroll
            setTimeout(() => {
              scrollToSlide(next, false)
            }, 50)
            return next
          })
        }
      }, 3000)
    }

    startAutoScroll()

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
        autoScrollRef.current = null
      }
    }
  }, [features.length])

  const scrollToSlide = (index, isManual = true) => {
    if (!sliderRef.current) return
    
    // Ensure index is within bounds
    const safeIndex = Math.max(0, Math.min(index, features.length - 1))
    
    // Temporarily disable scroll listener to prevent interference
    if (isManual) {
      isManualScroll.current = true
    }
    
    // Use a slight delay to ensure DOM measurements are accurate
    setTimeout(() => {
      if (!sliderRef.current) return
      
      const slideWidth = getSlideWidth()
      
      // Calculate target scroll position based on slide index
      let targetScroll = safeIndex * slideWidth
      
      // Get container dimensions
      const containerWidth = sliderRef.current.clientWidth
      const totalWidth = sliderRef.current.scrollWidth
      
      // Calculate maximum possible scroll
      const maxScroll = Math.max(0, totalWidth - containerWidth)
      
      // For the last few slides, ensure we scroll to the end if needed
      // This handles cases where slides don't fully fill the container
      if (safeIndex >= features.length - 1) {
        targetScroll = maxScroll
      } else {
        targetScroll = Math.min(targetScroll, maxScroll)
      }
      
      // Ensure we don't scroll to negative values
      targetScroll = Math.max(0, targetScroll)
      
      sliderRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
      
      // Update state
      setCurrentSlide(safeIndex)
      
      if (isManual) {
        resetAutoScroll()
      } else {
        // Re-enable auto-scroll tracking after auto-scroll completes
        setTimeout(() => {
          isManualScroll.current = false
        }, 600)
      }
    }, 50)
  }

  const nextSlide = () => {
    if (currentSlide < features.length - 1) {
      scrollToSlide(currentSlide + 1, true)
    } else {
      // Loop back to start
      scrollToSlide(0, true)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      scrollToSlide(currentSlide - 1, true)
    } else {
      // Loop to end
      scrollToSlide(features.length - 1, true)
    }
  }

  const resetAutoScroll = () => {
    isManualScroll.current = true

    // Clear existing auto-scroll
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }

    // Restart auto-scroll after user inactivity
    setTimeout(() => {
      isManualScroll.current = false
      // The useEffect will restart auto-scroll when isManualScroll becomes false
      // We trigger a re-render by updating a dummy state or force restart
      if (!autoScrollRef.current && sliderRef.current) {
        const startAutoScroll = () => {
          autoScrollRef.current = setInterval(() => {
            if (sliderRef.current && !isManualScroll.current) {
              setCurrentSlide(prev => {
                const next = (prev + 1) % features.length
                setTimeout(() => scrollToSlide(next, false), 50)
                return next
              })
            }
          }, 3000)
        }
        startAutoScroll()
      }
    }, 5000)
  }

  const handleScroll = () => {
    // Only update slide index on automatic scroll, not manual
    if (sliderRef.current && !isManualScroll.current) {
      const slideWidth = getSlideWidth()
      const scrollPosition = sliderRef.current.scrollLeft
      const newSlide = Math.min(Math.round(scrollPosition / slideWidth), features.length - 1)
      setCurrentSlide(newSlide)
    }
  }

  const handleManualScrollStart = () => {
    isManualScroll.current = true
    resetAutoScroll()
  }

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section - Integrated Custom Design */}
      <section className="hero hero-custom">
        <div className="hero-background"></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Connect, Collaborate &
              <span className="highlight"> Thrive</span> on Campus
            </h1>
            <p className="hero-subtitle">
              Your all-in-one platform for campus life — connect with peers, discover events,
              join clubs, and make the most of your university experience.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="hero-btn primary">
                Get Started
              </Link>
              <Link to="/about" className="hero-btn secondary">
                Learn More
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Students Connected</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Opportunities</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Campuses</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="main-illustration">
              <div className="logo-container">
                <img src="/hero-logo.png" alt="CampusConnect Logo" className="hero-logo" onError={(e) => { e.target.src = '/favicon.ico'; }} />
              </div>
              <div className="floating-card card-1">💼 Opportunities</div>
              <div className="floating-card card-2">🎯 Match Score</div>
              <div className="floating-card card-3">📊 Analytics</div>
              <div className="floating-card card-4">💬 Messaging</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Slider Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Platform Features</h2>
            <p className="features-subtitle">
              Everything you need to connect, collaborate, and thrive on campus
            </p>
          </div>

          <div className="features-controls">
            <button
              className="nav-btn prev-btn"
              onClick={prevSlide}
              aria-label="Previous feature"
            >
              ←
            </button>

            <div className="slide-indicators">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => scrollToSlide(index, true)}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="nav-btn next-btn"
              onClick={nextSlide}
              aria-label="Next feature"
            >
              →
            </button>
          </div>

          <div className="features-slider-container">
            <div
              className="features-slider"
              ref={sliderRef}
              onScroll={handleScroll}
              onTouchStart={handleManualScrollStart}
              onMouseDown={handleManualScrollStart}
              onWheel={handleManualScrollStart}
            >
              {features.map((feature) => (
                <div key={feature.id} className="feature-card-slider">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Existing Stats Section */}
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

      {/* Existing Testimonials */}
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

      {/* CTA Section */}
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
