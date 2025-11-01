import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    }, 1000)
  }

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-hero">
        <div className="container">
          <h1>Get In Touch</h1>
          <p className="hero-subtitle">
            Have questions, suggestions, or need support? We'd love to hear from you!
          </p>
        </div>
      </div>

      <section className="contact-content">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p className="info-description">
                Reach out to us through any of the channels below. We typically respond 
                within 24 hours.
              </p>

              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div className="info-content">
                    <h3>Email</h3>
                    <p>support@atrons.net</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div className="info-content">
                    <h3>Location</h3>
                    <p>University Campus</p>
                    <p>Available Worldwide</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">⏰</div>
                  <div className="info-content">
                    <h3>Response Time</h3>
                    <p>Within 24 hours</p>
                    <p>Monday - Friday</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon" aria-label="Facebook">📘</a>
                  <a href="#" className="social-icon" aria-label="Twitter">🐦</a>
                  <a href="#" className="social-icon" aria-label="LinkedIn">💼</a>
                  <a href="#" className="social-icon" aria-label="Instagram">📷</a>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2>Send Us a Message</h2>
              
              {submitted && (
                <div className="success-message">
                  ✅ Thank you! Your message has been sent. We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={submitting || submitted}
                >
                  {submitting ? 'Sending...' : submitted ? 'Sent!' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I create an account?</h3>
              <p>
                Simply click the "Get Started" button on our homepage and follow the 
                registration process. You'll need your university email address.
              </p>
            </div>
            <div className="faq-item">
              <h3>Is CampusConnect free to use?</h3>
              <p>
                Yes! CampusConnect is completely free for all students. There are no 
                hidden fees or premium subscriptions required.
              </p>
            </div>
            <div className="faq-item">
              <h3>How does the matching algorithm work?</h3>
              <p>
                Our algorithm considers your skills, interests, experience level, and 
                past behavior to match you with relevant opportunities.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I post opportunities as a student?</h3>
              <p>
                Absolutely! You can switch to "Finder" mode to post jobs, projects, or 
                collaboration opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

