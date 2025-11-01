import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Terms.css'

export default function Terms() {
  return (
    <div className="terms-page">
      <Navbar />
      
      <div className="terms-hero">
        <div className="container">
          <h1>Terms of Service</h1>
          <p className="hero-subtitle">
            Please read these terms carefully before using CampusConnect.
          </p>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <section className="terms-content">
        <div className="container">
          <div className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using CampusConnect, you agree to be bound by these Terms of Service 
              and our Privacy Policy. If you do not agree to these terms, please do not use our platform. 
              These terms apply to all users of CampusConnect.
            </p>
          </div>

          <div className="terms-section">
            <h2>2. Description of Service</h2>
            <p>
              CampusConnect is a platform that connects students with opportunities, including job 
              postings, academic projects, collaboration opportunities, and team searches. We provide 
              matching services, communication tools, and analytics to facilitate these connections.
            </p>
          </div>

          <div className="terms-section">
            <h2>3. User Accounts</h2>
            <p>To use CampusConnect, you must:</p>
            <ul>
              <li>Be at least 13 years of age.</li>
              <li>Provide accurate and complete information when creating your account.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
              <li>Be responsible for all activities under your account.</li>
            </ul>
            <p>
              You are responsible for maintaining the confidentiality of your account password 
              and for all activities that occur under your account.
            </p>
          </div>

          <div className="terms-section">
            <h2>4. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Post false, misleading, or fraudulent information.</li>
              <li>Harass, abuse, or harm other users.</li>
              <li>Violate any applicable laws or regulations.</li>
              <li>Infringe on intellectual property rights of others.</li>
              <li>Upload malicious code, viruses, or harmful software.</li>
              <li>Spam, phish, or engage in any fraudulent activity.</li>
              <li>Impersonate others or provide false identity information.</li>
              <li>Collect or harvest personal information from other users.</li>
              <li>Interfere with or disrupt the platform's functionality.</li>
              <li>Use the platform for any illegal or unauthorized purpose.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>5. Job Postings and Applications</h2>
            <p>
              CampusConnect facilitates connections between job seekers and job posters. We are not 
              responsible for the accuracy of job postings, the qualifications of applicants, or 
              the outcomes of any applications or hiring decisions.
            </p>
            <ul>
              <li><strong>Job Posters:</strong> You are responsible for the accuracy of your job postings, 
              fair hiring practices, and communication with applicants.</li>
              <li><strong>Job Seekers:</strong> You are responsible for the accuracy of your applications, 
              resume, and qualifications. CampusConnect is not responsible for hiring decisions.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>6. Intellectual Property</h2>
            <p>
              All content on CampusConnect, including text, graphics, logos, and software, is the 
              property of CampusConnect or its licensors and is protected by copyright and other 
              intellectual property laws.
            </p>
            <p>
              By posting content on CampusConnect, you grant us a non-exclusive, worldwide, 
              royalty-free license to use, display, and distribute your content in connection with 
              operating and promoting the platform.
            </p>
          </div>

          <div className="terms-section">
            <h2>7. User Content</h2>
            <p>
              You retain ownership of content you post on CampusConnect. However, by posting content, 
              you represent that you have the right to do so and that your content does not violate 
              any third-party rights.
            </p>
            <p>We reserve the right to remove any content that violates these terms or is otherwise 
            objectionable at our sole discretion.</p>
          </div>

          <div className="terms-section">
            <h2>8. Prohibited Content</h2>
            <p>You may not post content that:</p>
            <ul>
              <li>Is illegal, harmful, or violates applicable laws.</li>
              <li>Contains hate speech, discrimination, or harassment.</li>
              <li>Is pornographic, sexually explicit, or offensive.</li>
              <li>Infringes on intellectual property rights.</li>
              <li>Contains personal information of others without consent.</li>
              <li>Is spam, advertising, or promotional material without authorization.</li>
              <li>Contains viruses or malicious code.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>9. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how 
              we collect, use, and protect your information. By using CampusConnect, you consent to 
              the collection and use of information as described in our Privacy Policy.
            </p>
          </div>

          <div className="terms-section">
            <h2>10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of 
              these terms or for any other reason at our sole discretion. You may also delete your 
              account at any time from your Profile settings.
            </p>
            <p>
              Upon termination, your right to use CampusConnect will immediately cease. We may delete 
              your account and content, though some information may be retained as required by law.
            </p>
          </div>

          <div className="terms-section">
            <h2>11. Disclaimers</h2>
            <p>
              CampusConnect is provided "as is" and "as available" without warranties of any kind, 
              either express or implied. We do not guarantee:
            </p>
            <ul>
              <li>The accuracy, completeness, or reliability of any content or information on the platform.</li>
              <li>That the platform will be uninterrupted, secure, or error-free.</li>
              <li>That any defects will be corrected.</li>
              <li>The outcomes of job applications or hiring decisions.</li>
            </ul>
            <p>
              We are not responsible for any damages resulting from your use of or inability to use 
              CampusConnect, including but not limited to direct, indirect, incidental, or consequential damages.
            </p>
          </div>

          <div className="terms-section">
            <h2>12. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, CampusConnect and its affiliates shall not be 
              liable for any indirect, incidental, special, consequential, or punitive damages, or any 
              loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, 
              use, goodwill, or other intangible losses resulting from your use of the platform.
            </p>
          </div>

          <div className="terms-section">
            <h2>13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless CampusConnect, its affiliates, and their 
              officers, directors, employees, and agents from any claims, damages, losses, liabilities, 
              and expenses (including legal fees) arising from your use of the platform, violation of 
              these terms, or infringement of any rights of another.
            </p>
          </div>

          <div className="terms-section">
            <h2>14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify you 
              of any material changes by posting the updated terms on this page and updating the 
              "Last updated" date. Your continued use of CampusConnect after such changes constitutes 
              acceptance of the updated terms.
            </p>
          </div>

          <div className="terms-section">
            <h2>15. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with applicable 
              laws, without regard to conflict of law principles. Any disputes arising from these terms 
              or your use of CampusConnect shall be resolved through appropriate legal channels.
            </p>
          </div>

          <div className="terms-section">
            <h2>16. Contact Information</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> support@atrons.net</p>
              <p><strong>Subject:</strong> Terms of Service Inquiry</p>
            </div>
          </div>

          <div className="terms-cta">
            <h2>Have Questions About Our Terms?</h2>
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

