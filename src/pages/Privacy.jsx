import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Privacy.css'

export default function Privacy() {
  return (
    <div className="privacy-page">
      <Navbar />
      
      <div className="privacy-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="hero-subtitle">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <section className="privacy-content">
        <div className="container">
          <div className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Email address, display name, password (encrypted), and profile information.</li>
              <li><strong>Profile Information:</strong> Bio, skills, interests, location, experience level, preferred job types, and resume/CV if uploaded.</li>
              <li><strong>Job Applications:</strong> Cover letters, resumes, and application status information.</li>
              <li><strong>Communication Data:</strong> Messages sent through our platform.</li>
              <li><strong>Usage Data:</strong> Jobs viewed, applications submitted, bookmarks, and interactions with our platform.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our services, including job matching and recommendations.</li>
              <li>Facilitate connections between job seekers and job posters.</li>
              <li>Send you notifications about applications, messages, and relevant opportunities.</li>
              <li>Personalize your experience with tailored job recommendations.</li>
              <li>Analyze usage patterns to improve our platform.</li>
              <li>Respond to your inquiries and provide customer support.</li>
              <li>Ensure platform security and prevent fraud.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>3. Information Sharing</h2>
            <p>We respect your privacy and do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>With Other Users:</strong> Your profile information is visible to other CampusConnect users to facilitate connections and opportunities.</li>
              <li><strong>Job Applications:</strong> When you apply for a job, your application (including resume and cover letter) is shared with the job poster.</li>
              <li><strong>Service Providers:</strong> We may share information with trusted service providers who assist us in operating our platform (e.g., hosting, analytics).</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, your information may be transferred to the new entity.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. 
              This includes encryption of sensitive data, secure authentication, and regular security assessments. 
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="privacy-section">
            <h2>5. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal information.</li>
              <li><strong>Update:</strong> Modify your profile and account information at any time.</li>
              <li><strong>Delete:</strong> Request deletion of your account and associated data.</li>
              <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications.</li>
              <li><strong>Portability:</strong> Request your data in a portable format.</li>
            </ul>
            <p>To exercise these rights, please contact us at support@atrons.net.</p>
          </div>

          <div className="privacy-section">
            <h2>6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
              and provide personalized content. You can control cookies through your browser settings, 
              though this may affect some functionality of our platform.
            </p>
          </div>

          <div className="privacy-section">
            <h2>7. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites. We are not responsible for the privacy 
              practices of these external sites. We encourage you to review their privacy policies before 
              providing any information.
            </p>
          </div>

          <div className="privacy-section">
            <h2>8. Children's Privacy</h2>
            <p>
              CampusConnect is intended for students and individuals 13 years or older. We do not knowingly 
              collect personal information from children under 13. If we become aware that we have collected 
              such information, we will take steps to delete it promptly.
            </p>
          </div>

          <div className="privacy-section">
            <h2>9. International Users</h2>
            <p>
              If you are accessing CampusConnect from outside the jurisdiction where our servers are located, 
              please note that your information may be transferred to and stored in that jurisdiction. 
              By using our platform, you consent to such transfer.
            </p>
          </div>

          <div className="privacy-section">
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last updated" date. Your continued use 
              of the platform after such changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="privacy-section">
            <h2>11. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> support@atrons.net</p>
              <p><strong>Subject:</strong> Privacy Policy Inquiry</p>
            </div>
          </div>

          <div className="privacy-cta">
            <h2>Questions About Your Privacy?</h2>
            <p>We're here to help. Contact us if you have any questions or concerns.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-large">
                Contact Us
              </Link>
              <Link to="/faq" className="btn btn-secondary btn-large">
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

