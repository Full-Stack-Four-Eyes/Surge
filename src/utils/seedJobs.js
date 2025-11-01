// Sample jobs data for CampusConnect
// These jobs are designed to test:
// - Match score algorithm (diverse skills/interests)
// - Job filtering and search
// - Recommendations
// - All job types

import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

export const sampleJobs = [
  // Academic Projects
  {
    title: "Machine Learning Research Assistant",
    description: "Looking for a student to assist with research on neural networks for computer vision applications. Will work on data preprocessing, model training, and paper writing. Great opportunity for students interested in AI/ML research.",
    type: "Academic Projects",
    location: "Computer Science Building, Room 301",
    requiredSkills: ["Python", "Machine Learning", "TensorFlow", "Deep Learning", "Research"],
    tags: ["research", "AI", "academic", "part-time"],
    experienceLevel: "intermediate",
    deadline: "2024-12-15",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Mobile App Development for Campus Events",
    description: "Team needed to develop a cross-platform mobile app for managing campus events. Will use React Native. This is a semester-long academic project with potential to become a real campus tool.",
    type: "Academic Projects",
    location: "Engineering Building",
    requiredSkills: ["React Native", "JavaScript", "Mobile Development", "Firebase"],
    tags: ["mobile", "academic", "team-project"],
    experienceLevel: "intermediate",
    deadline: "2024-11-30",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Data Science Project - Campus Analytics",
    description: "Collaborate on analyzing campus data to improve student services. Need someone with experience in data visualization and statistical analysis. Will present findings at end of semester.",
    type: "Academic Projects",
    location: "Virtual/Remote",
    requiredSkills: ["Python", "Data Analysis", "Pandas", "Statistics", "Visualization"],
    tags: ["data-science", "research", "remote", "academic"],
    experienceLevel: "beginner",
    deadline: "2024-12-01",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },

  // Startup/Collaborations
  {
    title: "Co-Founder for EdTech Startup",
    description: "Looking for a technical co-founder for an education technology startup. We're building a platform to connect tutors and students. Need someone passionate about education and technology. Equity-based opportunity.",
    type: "Startup/Collaborations",
    location: "Innovation Hub",
    requiredSkills: ["React", "Node.js", "MongoDB", "Entrepreneurship", "Full-stack"],
    tags: ["startup", "equity", "co-founder", "education-tech"],
    experienceLevel: "advanced",
    deadline: "2024-12-20",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "UI/UX Designer for Social Media App",
    description: "Early-stage social media startup looking for a talented designer to create beautiful, intuitive interfaces. Must have experience with Figma and modern design principles. Part-time collaboration.",
    type: "Startup/Collaborations",
    location: "Remote",
    requiredSkills: ["Figma", "UI/UX Design", "Prototyping", "User Research"],
    tags: ["design", "startup", "remote", "social-media"],
    experienceLevel: "intermediate",
    deadline: "2024-11-25",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Backend Developer - Food Delivery Platform",
    description: "Join our team building a campus food delivery app. Need someone with experience in REST APIs, database design, and cloud services. Great portfolio project with real-world impact.",
    type: "Startup/Collaborations",
    location: "Tech Startup Incubator",
    requiredSkills: ["Node.js", "Express", "PostgreSQL", "AWS", "REST APIs"],
    tags: ["backend", "startup", "food-tech", "API"],
    experienceLevel: "intermediate",
    deadline: "2024-12-10",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Blockchain Developer for NFT Marketplace",
    description: "Building a sustainable NFT marketplace focused on digital art. Need a developer with Solidity and Web3 experience. This is a passion project with potential for growth.",
    type: "Startup/Collaborations",
    location: "Virtual",
    requiredSkills: ["Solidity", "Web3", "Blockchain", "Ethereum", "Smart Contracts"],
    tags: ["blockchain", "Web3", "NFT", "crypto"],
    experienceLevel: "advanced",
    deadline: "2024-12-05",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },

  // Part-time Jobs
  {
    title: "Part-time Web Developer - University Website",
    description: "The university needs a part-time developer to maintain and update the official website. Work 15-20 hours per week. Flexible schedule around classes. Great opportunity to work on real projects.",
    type: "Part-time Jobs",
    location: "IT Department, Admin Building",
    requiredSkills: ["HTML", "CSS", "JavaScript", "WordPress", "PHP"],
    tags: ["part-time", "on-campus", "flexible", "web-development"],
    experienceLevel: "intermediate",
    deadline: "2024-11-20",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Tutor - Computer Science Fundamentals",
    description: "Looking for a patient and knowledgeable tutor to help students with introductory programming courses. Must be available 10-15 hours per week. Competitive hourly rate.",
    type: "Part-time Jobs",
    location: "Library, Tutoring Center",
    requiredSkills: ["Teaching", "Communication", "Python", "Java", "Data Structures"],
    tags: ["tutoring", "education", "on-campus", "part-time"],
    experienceLevel: "intermediate",
    deadline: "2024-11-22",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Social Media Manager - Campus Organization",
    description: "Campus club needs a creative student to manage social media accounts (Instagram, Twitter, LinkedIn). Create content, schedule posts, engage with followers. 5-10 hours/week.",
    type: "Part-time Jobs",
    location: "Student Center",
    requiredSkills: ["Social Media", "Content Creation", "Canva", "Marketing", "Communication"],
    tags: ["social-media", "marketing", "part-time", "creative"],
    experienceLevel: "beginner",
    deadline: "2024-11-18",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "IT Support Assistant",
    description: "Help desk position assisting students and faculty with technical issues. Provide friendly customer service while solving tech problems. Flexible hours, great for resume building.",
    type: "Part-time Jobs",
    location: "IT Support Office",
    requiredSkills: ["Troubleshooting", "Customer Service", "Windows", "MacOS", "Networking"],
    tags: ["IT-support", "customer-service", "on-campus", "part-time"],
    experienceLevel: "beginner",
    deadline: "2024-11-25",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Content Writer - Tech Blog",
    description: "Campus tech blog needs writers to create articles about programming, tech trends, and student projects. Write 2-3 articles per week. Perfect for students passionate about writing and technology.",
    type: "Part-time Jobs",
    location: "Remote",
    requiredSkills: ["Writing", "Technical Writing", "Research", "SEO", "Content Strategy"],
    tags: ["writing", "content", "remote", "tech-blog"],
    experienceLevel: "beginner",
    deadline: "2024-11-28",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },

  // Competitions/Hackathons
  {
    title: "Hackathon Team - AI Innovation Challenge",
    description: "Forming a team for the upcoming AI Innovation Hackathon. Need developers and designers to build an AI-powered solution in 48 hours. Winner gets prize money and mentorship opportunities.",
    type: "Competitions/Hackathons",
    location: "Engineering Building, Hackathon Hall",
    requiredSkills: ["Python", "Machine Learning", "React", "Fast API", "Teamwork"],
    tags: ["hackathon", "AI", "competition", "team"],
    experienceLevel: "intermediate",
    deadline: "2024-11-15",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Mobile App Competition - Team Members Wanted",
    description: "Join our team for the National Mobile App Development Competition. We need a frontend developer, backend developer, and UI/UX designer. Practice sessions start next week.",
    type: "Competitions/Hackathons",
    location: "Virtual Meetings",
    requiredSkills: ["React Native", "Node.js", "UI Design", "Team Collaboration"],
    tags: ["competition", "mobile", "team", "national"],
    experienceLevel: "intermediate",
    deadline: "2024-11-12",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Cybersecurity CTF Team Formation",
    description: "Looking for team members for Capture The Flag competition. Need people with knowledge in web security, cryptography, reverse engineering. Great learning experience!",
    type: "Competitions/Hackathons",
    location: "Cybersecurity Lab",
    requiredSkills: ["Cybersecurity", "Networking", "Linux", "Problem Solving"],
    tags: ["CTF", "security", "competition", "team"],
    experienceLevel: "intermediate",
    deadline: "2024-11-20",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Data Science Competition - Kaggle Team",
    description: "Join our team for an upcoming Kaggle competition. We're focusing on time series forecasting. Need someone with experience in pandas, scikit-learn, and time series analysis.",
    type: "Competitions/Hackathons",
    location: "Online",
    requiredSkills: ["Python", "Pandas", "Scikit-learn", "Data Analysis", "Time Series"],
    tags: ["Kaggle", "data-science", "competition", "online"],
    experienceLevel: "advanced",
    deadline: "2024-11-18",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },

  // Team Search
  {
    title: "Capstone Project Team - IoT Smart Home System",
    description: "Forming a team for senior capstone project. Building a complete IoT smart home management system with mobile app and web dashboard. Need hardware, software, and design team members.",
    type: "Team Search",
    location: "Engineering Building, Lab 205",
    requiredSkills: ["IoT", "Embedded Systems", "React", "Node.js", "Hardware"],
    tags: ["capstone", "IoT", "team-project", "senior"],
    experienceLevel: "advanced",
    deadline: "2024-11-30",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Open Source Contributors - Campus Tools Project",
    description: "Building open-source tools for campus community. Looking for contributors in various areas: frontend, backend, design, documentation. Great for building portfolio and contributing to community.",
    type: "Team Search",
    location: "Virtual/Remote",
    requiredSkills: ["Git", "Open Source", "Collaboration", "Documentation"],
    tags: ["open-source", "community", "collaboration", "portfolio"],
    experienceLevel: "beginner",
    deadline: "2024-12-31",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Game Development Team - 2D Platformer",
    description: "Forming a team to develop an indie 2D platformer game. Need game developers, artists, musicians, and game designers. This is a passion project with potential for publication.",
    type: "Team Search",
    location: "Game Development Lab",
    requiredSkills: ["Unity", "C#", "Game Design", "2D Art", "Music"],
    tags: ["game-dev", "unity", "creative", "team"],
    experienceLevel: "intermediate",
    deadline: "2024-12-15",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "VR/AR Development Project - Educational Content",
    description: "Creating educational VR experiences for university courses. Need developers with Unity and VR experience, plus 3D modelers and educators. This could become a funded research project.",
    type: "Team Search",
    location: "VR Lab, Science Building",
    requiredSkills: ["Unity", "VR Development", "3D Modeling", "C#", "Educational Technology"],
    tags: ["VR", "AR", "education", "research", "3D"],
    experienceLevel: "advanced",
    deadline: "2024-12-01",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  },
  {
    title: "Full-Stack Development Team - E-commerce Platform",
    description: "Building a complete e-commerce platform from scratch. Need frontend, backend, and DevOps team members. Great learning opportunity and portfolio project. Agile methodology.",
    type: "Team Search",
    location: "Software Engineering Lab",
    requiredSkills: ["React", "Node.js", "PostgreSQL", "Docker", "Full-stack"],
    tags: ["full-stack", "e-commerce", "team", "portfolio"],
    experienceLevel: "intermediate",
    deadline: "2024-12-10",
    status: "published",
    isFilled: false,
    views: 0,
    applications: 0
  }
]

// Function to seed jobs into Firestore
export async function seedJobs(userId) {
  if (!userId) {
    console.error('User ID is required to seed jobs')
    return
  }

  try {
    console.log('Starting to seed jobs...')
    const jobsCollection = collection(db, 'jobs')
    
    for (const job of sampleJobs) {
      const jobWithMetadata = {
        ...job,
        postedBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await addDoc(jobsCollection, jobWithMetadata)
      console.log(`✓ Added: ${job.title}`)
    }
    
    console.log(`✅ Successfully seeded ${sampleJobs.length} jobs!`)
    return { success: true, count: sampleJobs.length }
  } catch (error) {
    console.error('Error seeding jobs:', error)
    return { success: false, error: error.message }
  }
}

// Export for use in components
export default { sampleJobs, seedJobs }

