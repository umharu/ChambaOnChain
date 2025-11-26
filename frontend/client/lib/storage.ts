"use client"

// Local storage utilities for student profile and job applications
// This is a temporary solution until smart contracts are implemented

export interface StudentProfile {
  address: string
  description?: string
  github?: string
  linkedin?: string
  website?: string
  updatedAt: number
}

export interface JobApplication {
  id: string
  jobId: string
  studentAddress: string
  appliedAt: number
  status: "Applied" | "In Review" | "Accepted" | "Rejected"
}

// Student Profile Storage
export function getStudentProfile(address: string): StudentProfile | null {
  if (typeof window === "undefined") return null
  
  const key = `student_profile_${address.toLowerCase()}`
  const stored = localStorage.getItem(key)
  if (!stored) return null
  
  try {
    return JSON.parse(stored) as StudentProfile
  } catch {
    return null
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return
  
  const key = `student_profile_${profile.address.toLowerCase()}`
  const data = {
    ...profile,
    updatedAt: Date.now(),
  }
  localStorage.setItem(key, JSON.stringify(data))
}

// Job Applications Storage
export function getApplications(studentAddress: string): JobApplication[] {
  if (typeof window === "undefined") return []
  
  const key = `applications_${studentAddress.toLowerCase()}`
  const stored = localStorage.getItem(key)
  if (!stored) return []
  
  try {
    return JSON.parse(stored) as JobApplication[]
  } catch {
    return []
  }
}

export function saveApplication(application: JobApplication): void {
  if (typeof window === "undefined") return
  
  const studentAddress = application.studentAddress.toLowerCase()
  const applications = getApplications(studentAddress)
  
  // Check for duplicate
  const exists = applications.some(
    (app) => app.jobId === application.jobId && app.studentAddress.toLowerCase() === studentAddress
  )
  
  if (exists) {
    throw new Error("Ya has aplicado a este trabajo")
  }
  
  applications.push(application)
  const key = `applications_${studentAddress}`
  localStorage.setItem(key, JSON.stringify(applications))
}

export function hasAppliedToJob(studentAddress: string, jobId: string): boolean {
  const applications = getApplications(studentAddress)
  return applications.some(
    (app) => app.jobId === jobId && app.studentAddress.toLowerCase() === studentAddress.toLowerCase()
  )
}

export function updateApplicationStatus(
  studentAddress: string,
  applicationId: string,
  status: JobApplication["status"]
): void {
  if (typeof window === "undefined") return
  
  const applications = getApplications(studentAddress)
  const index = applications.findIndex((app) => app.id === applicationId)
  
  if (index !== -1) {
    applications[index].status = status
    const key = `applications_${studentAddress.toLowerCase()}`
    localStorage.setItem(key, JSON.stringify(applications))
  }
}

