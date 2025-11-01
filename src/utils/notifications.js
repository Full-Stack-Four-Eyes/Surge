import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Create a notification for application status change
 */
export async function notifyApplicationStatusChange(applicationId, applicantId, jobId, newStatus, jobTitle) {
  try {
    const statusMessages = {
      pending: 'Your application is being reviewed',
      shortlisted: 'Congratulations! You\'ve been shortlisted',
      accepted: 'Great news! Your application has been accepted',
      rejected: 'Your application status has been updated'
    }

    await addDoc(collection(db, 'notifications'), {
      userId: applicantId,
      type: 'application_status',
      message: `${statusMessages[newStatus]} for "${jobTitle}"`,
      applicationId,
      jobId,
      read: false,
      createdAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error creating status notification:', error)
  }
}

/**
 * Create a notification for new application (for job poster)
 */
export async function notifyNewApplication(applicationId, jobPosterId, jobId, applicantName, jobTitle) {
  try {
    console.log('Creating notification for job poster:', { 
      applicationId, 
      jobPosterId, 
      jobId, 
      applicantName, 
      jobTitle 
    })
    
    if (!jobPosterId) {
      throw new Error('jobPosterId is required to create notification')
    }
    
    const notificationData = {
      userId: jobPosterId,
      type: 'new_application',
      message: `${applicantName} applied to your job "${jobTitle}"`,
      applicationId,
      jobId,
      read: false,
      createdAt: serverTimestamp()
    }
    
    console.log('Notification data to be created:', notificationData)
    
    const notificationRef = await addDoc(collection(db, 'notifications'), notificationData)
    console.log('Notification created successfully with ID:', notificationRef.id)
    console.log('Notification userId:', jobPosterId)
    
    return notificationRef.id
  } catch (error) {
    console.error('Error creating new application notification:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    throw error // Re-throw to allow caller to handle
  }
}

/**
 * Get job title from jobId or application
 */
export async function getJobTitle(jobId) {
  try {
    const jobDoc = await getDoc(doc(db, 'jobs', jobId))
    if (jobDoc.exists()) {
      return jobDoc.data().title || 'Job'
    }
    // If job doesn't exist, check application for preserved job data
    return 'Job'
  } catch (error) {
    console.error('Error fetching job title:', error)
    return 'Job'
  }
}

/**
 * Get applicant name from userId
 */
export async function getApplicantName(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return userDoc.data().displayName || userDoc.data().email || 'Applicant'
    }
    return 'Applicant'
  } catch (error) {
    console.error('Error fetching applicant name:', error)
    return 'Applicant'
  }
}

