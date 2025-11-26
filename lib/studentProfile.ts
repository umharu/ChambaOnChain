"use client"

/**
 * Student Profile Storage Utility
 * 
 * Manages student profile data (description, links) in localStorage.
 * In the future, this can be replaced with smart contract integration.
 */

export interface StudentProfile {
  address: string
  description?: string
  github?: string
  linkedin?: string
  portfolio?: string
  email?: string
  updatedAt?: number
}

/**
 * Get student profile
 */
export function getStudentProfile(address: string): StudentProfile | null {
  if (typeof window === "undefined") return null
  
  try {
    const stored = localStorage.getItem(`profile_${address}`)
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error loading profile:", error)
    return null
  }
}

/**
 * Save student profile
 */
export function saveStudentProfile(profile: StudentProfile): boolean {
  if (typeof window === "undefined") return false
  
  try {
    const profileWithTimestamp = {
      ...profile,
      updatedAt: Date.now()
    }
    localStorage.setItem(`profile_${profile.address}`, JSON.stringify(profileWithTimestamp))
    return true
  } catch (error) {
    console.error("Error saving profile:", error)
    return false
  }
}

/**
 * Update student profile (merges with existing)
 */
export function updateStudentProfile(address: string, updates: Partial<StudentProfile>): boolean {
  const existing = getStudentProfile(address) || { address }
  const updated = { ...existing, ...updates, address }
  return saveStudentProfile(updated)
}


