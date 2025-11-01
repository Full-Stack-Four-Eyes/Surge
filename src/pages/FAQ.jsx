import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './FAQ.css'

export default function FAQ() {
  return (
    <div className="faq-page">
      <Navbar />
      
      <div className="faq-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p className="hero-subtitle">
            Find answers to common questions about CampusConnect
          </p>
        </div>
      </div>

      <section className="faq-content">
        <div className="container">
          <div className="faq-categories">
            <div className="faq-category">
              <h2>Getting Started</h2>
              <div className="faq-items">
                <div className="faq-item">
                  <h3>How do I create an account?</h3>
                  <p>
                    Simply click the "Get Started" button on our homepage and follow the 
                    registration process. You'll need your university email address. You can 
                    also sign up using Google or GitHub for faster registration.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Is CampusConnect free to use?</h3>
                  <p>
                    Yes! CampusConnect is completely free for all students. There are no 
                    hidden fees or premium subscriptions required. We believe in making 
                    opportunities accessible to everyone.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>What information do I need to provide?</h3>
                  <p>
                    To get the best experience, we recommend completing your profile with 
                    your skills, interests, location, experience level, and preferred job types. 
                    This helps our matching algorithm find the most relevant opportunities for you.
                  </p>
                </div>
              </div>
            </div>

            <div className="faq-category">
              <h2>Matching & Recommendations</h2>
              <div className="faq-items">
                <div className="faq-item">
                  <h3>How does the matching algorithm work?</h3>
                  <p>
                    Our algorithm considers your skills, interests, experience level, and 
                    past behavior (jobs you've viewed, applied to, or bookmarked) to match 
                    you with relevant opportunities. The more complete your profile, the 
                    better the matches!
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Why am I not seeing recommendations?</h3>
                  <p>
                    Recommendations are personalized based on your profile. Make sure you've 
                    completed your profile with at least your skills, interests, and preferred 
                    job types. The algorithm learns from your activity, so start browsing and 
                    applying to see better recommendations.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Can I change my preferences?</h3>
                  <p>
                    Yes! You can update your skills, interests, and preferred job types at any 
                    time from your Profile page. Changes will immediately affect your job 
                    recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="faq-category">
              <h2>Posting Opportunities</h2>
              <div className="faq-items">
                <div className="faq-item">
                  <h3>Can I post opportunities as a student?</h3>
                  <p>
                    Absolutely! You can switch to "Finder" mode to post jobs, projects, or 
                    collaboration opportunities. Whether you're looking for team members for 
                    a hackathon, collaborators for a startup, or participants for an academic 
                    project, CampusConnect is the place.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Can I save a job post as a draft?</h3>
                  <p>
                    Yes! When creating a job post, you can save it as a draft and publish it 
                    later. This is useful if you want to work on it over time or schedule it 
                    for later.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>How do I manage applications?</h3>
                  <p>
                    In your Finder Dashboard, you can view all applicants for each job, 
                    track their status (Pending, Shortlisted, Rejected, Accepted), and 
                    communicate with them through our built-in chat system.
                  </p>
                </div>
              </div>
            </div>

            <div className="faq-category">
              <h2>Applications & Communication</h2>
              <div className="faq-items">
                <div className="faq-item">
                  <h3>How do I apply for a job?</h3>
                  <p>
                    Browse jobs in the Seeker Dashboard, click on a job that interests you, 
                    and click "Apply Now". You'll need to provide a cover letter and optionally 
                    upload your resume/CV.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Can I track my application status?</h3>
                  <p>
                    Yes! In the "My Applications" tab of your Seeker Dashboard, you can see 
                    all your applications and their current status (Pending, Shortlisted, 
                    Rejected, or Accepted).
                  </p>
                </div>
                <div className="faq-item">
                  <h3>How do I contact job posters?</h3>
                  <p>
                    You can message job posters directly from the job detail page. Click 
                    "Message Poster" to start a conversation. All messages are real-time 
                    and stored securely.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>What file formats are accepted for resumes?</h3>
                  <p>
                    We accept PDF, DOC, and DOCX files. Maximum file size is 10MB. Make sure 
                    your resume is clear and up-to-date.
                  </p>
                </div>
              </div>
            </div>

            <div className="faq-category">
              <h2>Privacy & Security</h2>
              <div className="faq-items">
                <div className="faq-item">
                  <h3>Is my personal information secure?</h3>
                  <p>
                    Yes, we take privacy and security seriously. Your data is encrypted and 
                    stored securely. We never share your personal information with third parties 
                    without your consent. See our Privacy Policy for more details.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Who can see my profile?</h3>
                  <p>
                    Your profile information is visible to other CampusConnect users, which 
                    helps with matching and opportunities. However, sensitive information like 
                    your email is only visible when you choose to share it through direct messages.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Can I delete my account?</h3>
                  <p>
                    Yes, you can delete your account at any time from your Profile settings. 
                    This will permanently remove your data from our system. Please contact 
                    us at support@atrons.net if you need assistance.
                  </p>
                </div>
              </div>
            </div>

            <div className="faq-category">
              <h2>Technical Support</h2>
              <div className="faq-items">
                <div className="faq-item">
                  <h3>I'm having trouble logging in</h3>
                  <p>
                    Make sure you're using the correct email and password. If you've forgotten 
                    your password, use the "Forgot Password" link on the login page. If problems 
                    persist, contact us at support@atrons.net.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>The site is not loading properly</h3>
                  <p>
                    Try clearing your browser cache and cookies, or try a different browser. 
                    Make sure JavaScript is enabled. If the issue continues, let us know and 
                    we'll help troubleshoot.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>How do I report a problem or bug?</h3>
                  <p>
                    We'd love to hear from you! Contact us at support@atrons.net with details 
                    about the issue, including your browser, device, and steps to reproduce 
                    the problem.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="faq-cta">
            <h2>Still have questions?</h2>
            <p>We're here to help! Contact us and we'll get back to you as soon as possible.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">
                Contact Us
              </Link>
              <Link to="/about" className="btn btn-secondary btn-large">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

