
import { Doctor } from "@/types/doctor";

export const doctorsList: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Psychiatrist",
    languages: ["English", "Hindi", "Telugu"],
    availability: "Mon, Wed, Fri (10 AM - 4 PM)",
    image: "/placeholder.svg",
    rating: 4.8,
    bio: "Specializes in anxiety, depression, and stress management with 10+ years of experience."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Clinical Psychologist",
    languages: ["English", "Mandarin", "Cantonese"],
    availability: "Tue, Thu (9 AM - 6 PM), Sat (9 AM - 1 PM)",
    image: "/placeholder.svg",
    rating: 4.6,
    bio: "Expert in cognitive behavioral therapy with special focus on trauma and PTSD."
  },
  {
    id: 3,
    name: "Dr. Sarah Johnson",
    specialization: "Therapist",
    languages: ["English", "Spanish", "French"],
    availability: "Mon-Fri (12 PM - 8 PM)",
    image: "/placeholder.svg",
    rating: 4.9,
    bio: "Specializes in relationship counseling, grief therapy, and mindfulness techniques."
  },
  {
    id: 4,
    name: "Dr. Rajesh Kumar",
    specialization: "Neuropsychiatrist",
    languages: ["English", "Hindi", "Bengali", "Telugu"],
    availability: "Wed-Sun (10 AM - 5 PM)",
    image: "/placeholder.svg",
    rating: 4.7,
    bio: "Focuses on treating anxiety disorders, OCD, and neurological conditions affecting mental health."
  },
];
