// Match score algorithm for job recommendations
export function calculateMatchScore(job, userProfile) {
  let score = 0
  let maxScore = 0

  // Skills matching (40% weight)
  if (job.requiredSkills && job.requiredSkills.length > 0) {
    maxScore += 40
    const userSkills = userProfile.skills || []
    const matchedSkills = job.requiredSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    )
    score += (matchedSkills.length / job.requiredSkills.length) * 40
  } else {
    maxScore += 40
    score += 20 // Partial score if no skills specified
  }

  // Interests matching (20% weight)
  if (job.tags && job.tags.length > 0) {
    maxScore += 20
    const userInterests = userProfile.interests || []
    const matchedInterests = job.tags.filter(tag =>
      userInterests.some(interest =>
        interest.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    )
    score += (matchedInterests.length / job.tags.length) * 20
  } else {
    maxScore += 20
  }

  // Job type preference (20% weight)
  if (userProfile.preferredJobTypes && userProfile.preferredJobTypes.includes(job.type)) {
    score += 20
  }
  maxScore += 20

  // Location/campus matching (10% weight)
  if (job.location) {
    maxScore += 10
    if (userProfile.location && userProfile.location === job.location) {
      score += 10
    } else {
      score += 5 // Partial if location not specified
    }
  } else {
    maxScore += 10
    score += 5
  }

  // Experience level (10% weight)
  if (job.experienceLevel && userProfile.experienceLevel) {
    maxScore += 10
    if (job.experienceLevel === userProfile.experienceLevel) {
      score += 10
    } else {
      // Give partial credit for similar levels
      const levels = ['beginner', 'intermediate', 'advanced']
      const jobLevel = levels.indexOf(job.experienceLevel)
      const userLevel = levels.indexOf(userProfile.experienceLevel)
      if (Math.abs(jobLevel - userLevel) === 1) {
        score += 5
      }
    }
  } else {
    maxScore += 10
    score += 5
  }

  // Calculate final percentage
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 50
}

// Recommendation ranking algorithm with learning from user behavior
export function rankJobs(jobs, userProfile, userBehavior = {}) {
  // Extract user behavior patterns
  const { appliedJobs = [], viewedJobs = [], bookmarkedJobs = [], acceptedJobs = [] } = userBehavior
  
  return jobs
    .map(job => {
      const baseScore = calculateMatchScore(job, userProfile)
      
      // Learning algorithm: Boost score based on user behavior patterns
      let behaviorBoost = 0
      
      // If user applied to similar jobs, boost this job
      if (appliedJobs.length > 0) {
        const similarAppliedJobs = appliedJobs.filter(appliedJobId => {
          // Check if this job shares skills/types with applied jobs
          // This is a simplified check - in production, you'd compare actual job data
          return true // Simplified for now
        })
        if (similarAppliedJobs.length > 0) {
          behaviorBoost += 5 // Boost by 5 points
        }
      }
      
      // If user viewed this job type frequently, boost it
      const jobTypeViews = viewedJobs.filter(jobId => {
        // In production, check if viewed jobs match this job's type
        return true // Simplified
      }).length
      if (jobTypeViews > 3) {
        behaviorBoost += 3 // Boost by 3 points
      }
      
      // If user bookmarked similar jobs, boost this job
      if (bookmarkedJobs.length > 0) {
        behaviorBoost += 2
      }
      
      // Final score with behavior learning (capped at 100)
      const finalScore = Math.min(baseScore + behaviorBoost, 100)
      
      return {
        ...job,
        matchScore: finalScore,
        baseScore,
        behaviorBoost
      }
    })
    .sort((a, b) => {
      // Primary sort: by match score
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore
      }
      // Secondary sort: by recency (newer jobs first)
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt?.seconds * 1000) || new Date(0)
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt?.seconds * 1000) || new Date(0)
      return dateB - dateA
    })
}

