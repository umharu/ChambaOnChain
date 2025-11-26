"use client"

// Mock job data - In production, this would come from a smart contract or API
export interface Job {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
  location?: string
  type?: "Full-time" | "Part-time" | "Contract" | "Internship"
  salary?: string
  postedAt: number
}

// Mock job listings data
export const mockJobs: Job[] = [
  {
    id: "job-1",
    title: "Desarrollador Web3 Junior",
    company: "Blockchain Solutions",
    description: "Buscamos un desarrollador junior apasionado por Web3 y blockchain para unirse a nuestro equipo. Trabajarás en proyectos descentralizados y aprenderás de los mejores.",
    requirements: [
      "Conocimientos básicos de Solidity",
      "Experiencia con JavaScript/TypeScript",
      "Interés en blockchain y Web3",
      "Buenas habilidades de comunicación"
    ],
    location: "Remoto",
    type: "Full-time",
    salary: "$800 - $1200 USD/mes",
    postedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
  },
  {
    id: "job-2",
    title: "Frontend Developer React",
    company: "TechStart Inc",
    description: "Oportunidad para desarrollador frontend con React. Trabajarás en aplicaciones modernas y tendrás la oportunidad de crecer profesionalmente.",
    requirements: [
      "Experiencia con React y Next.js",
      "Conocimientos de TypeScript",
      "Portfolio con proyectos demostrables"
    ],
    location: "Híbrido",
    type: "Full-time",
    salary: "$1000 - $1500 USD/mes",
    postedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
  },
  {
    id: "job-3",
    title: "Intern - Desarrollo Blockchain",
    company: "Crypto Ventures",
    description: "Programa de internado para estudiantes que quieren aprender sobre desarrollo blockchain. Mentoreo personalizado y proyectos reales.",
    requirements: [
      "Estudiante activo",
      "Conocimientos básicos de programación",
      "Curiosidad por blockchain"
    ],
    location: "Remoto",
    type: "Internship",
    salary: "$400 - $600 USD/mes",
    postedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
  },
  {
    id: "job-4",
    title: "Smart Contract Developer",
    company: "DeFi Labs",
    description: "Desarrollador de smart contracts con experiencia en Solidity. Trabajarás en protocolos DeFi innovadores.",
    requirements: [
      "Experiencia sólida en Solidity",
      "Conocimientos de seguridad de smart contracts",
      "Portfolio de contratos desplegados"
    ],
    location: "Remoto",
    type: "Contract",
    salary: "$2000 - $3000 USD/mes",
    postedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
  },
  {
    id: "job-5",
    title: "Full Stack Developer",
    company: "Web3 Studio",
    description: "Desarrollador full stack para proyectos Web3. Stack: React, Node.js, Solidity, IPFS.",
    requirements: [
      "Experiencia full stack",
      "Conocimientos de Web3",
      "Trabajo en equipo"
    ],
    location: "Remoto",
    type: "Full-time",
    salary: "$1500 - $2000 USD/mes",
    postedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
  },
]

// Get all jobs
export function getAllJobs(): Job[] {
  return mockJobs
}

// Get job by ID
export function getJobById(id: string): Job | undefined {
  return mockJobs.find((job) => job.id === id)
}

// Filter jobs by search term
export function searchJobs(searchTerm: string): Job[] {
  if (!searchTerm.trim()) return mockJobs
  
  const term = searchTerm.toLowerCase()
  return mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term) ||
      job.requirements.some((req) => req.toLowerCase().includes(term))
  )
}

// Filter jobs by type
export function filterJobsByType(type: Job["type"] | "All"): Job[] {
  if (type === "All") return mockJobs
  return mockJobs.filter((job) => job.type === type)
}

