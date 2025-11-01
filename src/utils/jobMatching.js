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

// Recommendation ranking algorithm
export function rankJobs(jobs, userProfile) {
  return jobs
    .map(job => ({
      ...job,
      matchScore: calculateMatchScore(job, userProfile)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
}

