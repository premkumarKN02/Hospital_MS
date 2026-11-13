export interface Doctor {
  id: string;
  name: string;
  qualifications: string;
  specialization: string;
  registrationNumber: string;
  experienceYears: string;
  languages: string[];
  photoUrl: string;
  bio: string;
  treatmentPhilosophy: string;
  consultationApproach: string[];
  areasOfExpertise: string[];
  availability: {
    days: string;
    timings: string;
    note?: string;
  }[];
}

export interface MedicalService {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  keyBenefits: string[];
  targetAudience: string;
  preparationNote?: string;
  isPopular?: boolean;
  imageUrl?: string;
}

export interface ConditionTreatment {
  id: string;
  name: string;
  category: string;
  overview: string;
  commonSymptoms: string[];
  whenToConsult: string[];
  clinicApproach: string;
  imageUrl?: string;
}

export interface ClinicFacility {
  id: string;
  title: string;
  shortDescription: string;
  details: string[];
  iconName: string;
  badge?: string;
  imageUrl?: string;
}

export interface HealthCheckupPackage {
  id: string;
  name: string;
  tagline: string;
  targetGroup: string;
  recommendedFrequency: string;
  samplePricePlaceholder: string;
  includedTests: string[];
  benefits: string[];
  popular?: boolean;
  imageUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  publishedDate: string;
  readTime: string;
  summary: string;
  contentParagraphs: string[];
  keyTakeaways: string[];
  tags: string[];
  imageUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Appointments' | 'Consultation' | 'Clinic Timings' | 'Doctor' | 'Payments & Reports' | 'Emergency';
}

export interface TestimonialItem {
  id: string;
  patientName: string;
  visitReason: string;
  comment: string;
  rating: number;
  date: string;
  isSamplePlaceholder: boolean;
  imageUrl?: string;
}

export interface AppointmentFormData {
  fullName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: string;
  doctorId: string;
  reasonForVisit: string;
  preferredContactMethods: ('WhatsApp' | 'Phone' | 'Email')[];
  termsAccepted: boolean;
}

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export type PageRoute = 
  | 'landing'
  | 'home' 
  | 'about' 
  | 'doctor' 
  | 'services' 
  | 'treatments' 
  | 'facilities' 
  | 'appointments' 
  | 'wellness' 
  | 'blog' 
  | 'faq' 
  | 'contact' 
  | 'patient-info'
  | 'staff-login'
  | 'patient-login'
  | 'patient-register'
  | 'admin-dashboard'
  | 'patient-dashboard'
  | 'patient-list'
  | 'appointment-list'
  | 'staff-list'
  | 'doctor-list'
  | 'my-appointments'
  | 'my-records'
  | 'book-appointment'
  | 'hms-opd'
  | 'hms-ipd'
  | 'crm-pipeline'
  | 'crm-feedback'
  | 'erp-pharmacy'
  | 'erp-billing'
  | 'hrms-roster'
  | 'hrms-leaves'
  | 'hms-ot'
  | 'hms-lis'
  | 'hms-ris'
  | 'hms-bloodbank'
  | 'hms-emergency'
  | 'erp-tpa-claims'
  | 'erp-procurement'
  | 'erp-biomedical'
  | 'erp-cssd-infection'
  | 'erp-finance'
  | 'hrms-payroll'
  | 'hrms-credentialing'
  | 'crm-health-packages'
  | 'crm-referrals'
  | 'admin-incidents'
  | 'admin-compliance'
  | 'doctor-radar'
  | 'not-found';
