// Profile Score Algorithm - Demonstrates algorithmic thinking
// Calculates a comprehensive profile completeness and quality score

export function calculateProfileScore(userData) {
  if (!userData) return 0

  let score = 0
  let maxScore = 0
  const weights = {
    basicInfo: 20,
    skills: 25,
    interests: 15,
    bio: 15,
    experience: 15,
    profilePic: 10
  }

  // 1. Basic Information (20 points)
  maxScore += weights.basicInfo
  let basicInfoScore = 0
  if (userData.displayName && userData.displayName.trim()) basicInfoScore += 5
  if (userData.email) basicInfoScore += 5
  if (userData.location && userData.location.trim()) basicInfoScore += 5
  if (userData.role && (userData.role === 'finder' || userData.role === 'seeker')) basicInfoScore += 5
  score += basicInfoScore

  // 2. Skills Section (25 points)
  maxScore += weights.skills
  const skills = userData.skills || []
  if (skills.length === 0) {
    score += 0
  } else if (skills.length >= 1 && skills.length <= 3) {
    score += 15
  } else if (skills.length >= 4 && skills.length <= 7) {
    score += 20
  } else {
    score += 25 // 8+ skills = full points
  }

  // 3. Interests Section (15 points)
  maxScore += weights.interests
  const interests = userData.interests || []
  if (interests.length === 0) {
    score += 0
  } else if (interests.length >= 1 && interests.length <= 2) {
    score += 8
  } else if (interests.length >= 3 && interests.length <= 5) {
    score += 12
  } else {
    score += 15 // 6+ interests = full points
  }

  // 4. Bio/Description (15 points)
  maxScore += weights.bio
  const bio = userData.bio || ''
  const bioLength = bio.trim().length
  if (bioLength === 0) {
    score += 0
  } else if (bioLength >= 1 && bioLength < 50) {
    score += 5
  } else if (bioLength >= 50 && bioLength < 150) {
    score += 10
  } else {
    score += 15 // 150+ characters = full points
  }

  // 5. Experience Level (15 points)
  maxScore += weights.experience
  if (userData.experienceLevel) {
    // Experience level specified
    const levels = ['beginner', 'intermediate', 'advanced']
    const levelIndex = levels.indexOf(userData.experienceLevel)
    if (levelIndex >= 0) {
      score += 15
    }
  } else {
    // Check if experience can be inferred from skills count
    const skillCount = skills.length
    if (skillCount >= 5) {
      score += 10 // Likely intermediate+
    } else if (skillCount >= 2) {
      score += 5 // Likely beginner+
    }
  }

  // 6. Profile Picture (10 points)
  maxScore += weights.profilePic
  if (userData.profilePictureUrl) {
    score += 10
  }

  // Calculate final percentage score
  const finalScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

  // Determine profile quality tier
  let qualityTier = 'Incomplete'
  if (finalScore >= 90) qualityTier = 'Excellent'
  else if (finalScore >= 75) qualityTier = 'Very Good'
  else if (finalScore >= 60) qualityTier = 'Good'
  else if (finalScore >= 40) qualityTier = 'Fair'
  else if (finalScore >= 20) qualityTier = 'Basic'

  // Get improvement suggestions
  const suggestions = getImprovementSuggestions(userData, finalScore)

  return {
    score: finalScore,
    qualityTier,
    breakdown: {
      basicInfo: Math.round((basicInfoScore / weights.basicInfo) * 100),
      skills: Math.round((Math.min(skills.length, 8) / 8) * 100),
      interests: Math.round((Math.min(interests.length, 6) / 6) * 100),
      bio: Math.round((Math.min(bioLength, 150) / 150) * 100),
      experience: userData.experienceLevel ? 100 : Math.min((skills.length / 5) * 100, 67),
      profilePic: userData.profilePictureUrl ? 100 : 0
    },
    suggestions
  }
}

function getImprovementSuggestions(userData, score) {
  const suggestions = []

  if (!userData.skills || userData.skills.length < 3) {
    suggestions.push('Add at least 3 skills to improve your profile')
  }

  if (!userData.interests || userData.interests.length < 2) {
    suggestions.push('Add interests to get better job recommendations')
  }

  if (!userData.bio || userData.bio.trim().length < 50) {
    suggestions.push('Write a longer bio (50+ characters) to describe yourself')
  }

  if (!userData.location) {
    suggestions.push('Add your location to match with nearby opportunities')
  }

  if (!userData.profilePictureUrl) {
    suggestions.push('Add a profile picture to make your profile stand out')
  }

  if (score < 60) {
    suggestions.push('Complete more profile sections to improve your profile score')
  }

  return suggestions
}

// Calculate match quality score between user and job
export function calculateMatchQualityScore(userData, job) {
  if (!userData || !job) return 0

  let matchPoints = 0
  let maxPoints = 0

  // Skills matching (weighted by relevance)
  if (job.requiredSkills && job.requiredSkills.length > 0) {
    maxPoints += 40
    const userSkills = (userData.skills || []).map(s => s.toLowerCase())
    const matchedSkills = job.requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill)
      )
    )
    matchPoints += (matchedSkills.length / job.requiredSkills.length) * 40
  }

  // Experience level matching
  if (job.experienceLevel && userData.experienceLevel) {
    maxPoints += 20
    if (job.experienceLevel === userData.experienceLevel) {
      matchPoints += 20
    } else {
      const levels = ['beginner', 'intermediate', 'advanced']
      const jobIdx = levels.indexOf(job.experienceLevel)
      const userIdx = levels.indexOf(userData.experienceLevel)
      if (Math.abs(jobIdx - userIdx) === 1) {
        matchPoints += 10 // Adjacent levels
      }
    }
  }

  // Interests/Tags matching
  if (job.tags && job.tags.length > 0) {
    maxPoints += 20
    const userInterests = (userData.interests || []).map(i => i.toLowerCase())
    const matchedTags = job.tags.filter(tag => 
      userInterests.some(interest => 
        interest.includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(interest)
      )
    )
    matchPoints += (matchedTags.length / job.tags.length) * 20
  }

  // Location matching
  if (job.location && userData.location) {
    maxPoints += 20
    if (job.location.toLowerCase() === userData.location.toLowerCase()) {
      matchPoints += 20
    }
  }

  return maxPoints > 0 ? Math.round((matchPoints / maxPoints) * 100) : 0
}

