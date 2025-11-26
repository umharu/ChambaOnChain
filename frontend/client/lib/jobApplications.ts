"use client"

/**
 * Job Application Storage Utility
 * 
 * Manages job applications in localStorage for now.
 * In the future, this can be replaced with smart contract integration.
 */

export interface Job {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
  location?: string
  salary?: string
  type?: string // "Full-time", "Part-time", "Internship", etc.
}

export interface Application {
  id: string
  jobId: string
  studentAddress: string
  appliedAt: number // timestamp
  status: "Applied" | "In Review" | "Accepted" | "Rejected"
  job?: Job // Optional: include job details
}

// Mock job data - in production, this would come from a smart contract or API
export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Desarrollador Web3 Junior",
    company: "Blockchain Solutions",
    description: "Buscamos un desarrollador junior apasionado por Web3 y blockchain. Trabajarás en proyectos descentralizados usando Solidity y React.",
    requirements: [
      "Conocimientos básicos de Solidity",
      "Experiencia con React/Next.js",
      "Interés en blockchain y Web3",
      "Portfolio con proyectos demostrables"
    ],
    location: "Remoto",
    salary: "$800 - $1200",
    type: "Full-time"
  },
  {
    id: "job-2",
    title: "Frontend Developer",
    company: "Tech Startup",
    description: "Únete a nuestro equipo para construir interfaces modernas y atractivas. Buscamos alguien con pasión por el diseño y la experiencia de usuario.",
    requirements: [
      "Experiencia con React/TypeScript",
      "Conocimientos de Tailwind CSS",
      "Portfolio de proyectos",
      "Buenas habilidades de comunicación"
    ],
    location: "Híbrido",
    salary: "$1000 - $1500",
    type: "Full-time"
  },
  {
    id: "job-3",
    title: "Intern - Blockchain Developer",
    company: "Crypto Labs",
    description: "Oportunidad de internado para estudiantes que quieren aprender sobre desarrollo blockchain. Trabajarás con mentores experimentados.",
    requirements: [
      "Estudiante activo",
      "Interés en blockchain",
      "Disponibilidad para aprender",
      "Portfolio básico"
    ],
    location: "Remoto",
    salary: "$400 - $600",
    type: "Internship"
  },
  {
    id: "job-4",
    title: "Full Stack Developer",
    company: "Digital Agency",
    description: "Desarrollador full stack para trabajar en proyectos diversos. Stack: Node.js, React, PostgreSQL.",
    requirements: [
      "Experiencia con Node.js",
      "Conocimientos de bases de datos",
      "Experiencia con React",
      "Portfolio completo"
    ],
    location: "Presencial",
    salary: "$1200 - $1800",
    type: "Full-time"
  },
  {
    id: "job-5",
    title: "UI/UX Designer",
    company: "Design Studio",
    description: "Diseñador creativo para trabajar en interfaces de usuario modernas. Buscamos alguien con buen ojo para el diseño.",
    requirements: [
      "Portfolio de diseño",
      "Conocimientos de Figma",
      "Experiencia con diseño de interfaces",
      "Creatividad y atención al detalle"
    ],
    location: "Remoto",
    salary: "$900 - $1300",
    type: "Part-time"
  }
]

/**
 * Get all applications for a student
 */
export function getStudentApplications(studentAddress: string): Application[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(`applications_${studentAddress}`)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error loading applications:", error)
    return []
  }
}

/**
 * Check if student has already applied to a job
 */
export function hasApplied(studentAddress: string, jobId: string): boolean {
  const applications = getStudentApplications(studentAddress)
  return applications.some(app => app.jobId === jobId)
}

/**
 * Apply to a job
 * Returns true if successful, false if already applied
 */
export function applyToJob(studentAddress: string, job: Job): boolean {
  if (typeof window === "undefined") return false
  
  // Check if already applied
  if (hasApplied(studentAddress, job.id)) {
    return false
  }
  
  // Create new application
  const application: Application = {
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    jobId: job.id,
    studentAddress,
    appliedAt: Date.now(),
    status: "Applied",
    job: job
  }
  
  // Get existing applications
  const applications = getStudentApplications(studentAddress)
  
  // Add new application
  applications.push(application)
  
  // Save to localStorage
  try {
    localStorage.setItem(`applications_${studentAddress}`, JSON.stringify(applications))
    return true
  } catch (error) {
    console.error("Error saving application:", error)
    return false
  }
}

/**
 * Get all jobs
 * In the future, this would fetch from a smart contract or API
 */
export function getAllJobs(): Job[] {
  return MOCK_JOBS
}

/**
 * Get a job by ID
 */
export function getJobById(jobId: string): Job | undefined {
  return MOCK_JOBS.find(job => job.id === jobId)
}

/**
 * Get applications with job details
 */
export function getApplicationsWithJobs(studentAddress: string): Application[] {
  const applications = getStudentApplications(studentAddress)
  return applications.map(app => ({
    ...app,
    job: app.job || getJobById(app.jobId)
  })).filter(app => app.job !== undefined) as Application[]
}


