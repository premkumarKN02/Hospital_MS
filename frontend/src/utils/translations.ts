export type Language = 'en' | 'ta';

export interface TranslationStrings {
  // Brand & Utility Bar
  openToday: string;
  emergencyNotice: string;
  callClinic: string;
  callReception: string;
  whatsAppDesk: string;
  timingsSummary: string;
  
  // Navigation
  navHome: string;
  navAbout: string;
  navDoctor: string;
  navServices: string;
  navTreatments: string;
  navFacilities: string;
  navWellness: string;
  navPatientGuide: string;
  navBlog: string;
  navFaq: string;
  navContact: string;
  navMore: string;

  // CTAs
  bookAppointment: string;
  bookVisit: string;
  healthTools: string;
  searchPlaceholder: string;
  trackBooking: string;
  insuranceGuide: string;

  // Footer / General
  allRightsReserved: string;
  quickLinks: string;
  clinicAddress: string;
  consultationHours: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    openToday: 'Open Today: 9:00 AM – 9:00 PM',
    emergencyNotice: 'Emergency: Dial 108 / 112',
    callClinic: 'Call Clinic',
    callReception: 'Call Reception',
    whatsAppDesk: 'WhatsApp Desk',
    timingsSummary: 'Mon–Sat: 09:00 AM–01:00 PM & 05:00 PM–09:00 PM | Sun: 09:30 AM–01:00 PM',
    
    navHome: 'Home',
    navAbout: 'About Clinic',
    navDoctor: 'Doctor Profile',
    navServices: 'Services',
    navTreatments: 'Treatments',
    navFacilities: 'Facilities',
    navWellness: 'Wellness Packages',
    navPatientGuide: 'Patient Guide',
    navBlog: 'Health Blog',
    navFaq: 'FAQ',
    navContact: 'Contact',
    navMore: 'More',

    bookAppointment: 'Book Appointment',
    bookVisit: 'Book Visit',
    healthTools: 'Health Calculators',
    searchPlaceholder: 'Search services, doctor, symptoms, tests...',
    trackBooking: 'Track Token / Booking',
    insuranceGuide: 'Insurance & Claims',

    allRightsReserved: 'All Rights Reserved. Sindhu Clinic.',
    quickLinks: 'Quick Links',
    clinicAddress: 'Clinic Address',
    consultationHours: 'Consultation Hours',
  },
  ta: {
    openToday: 'இன்று திறந்திருக்கும்: காலை 9:00 – இரவு 9:00',
    emergencyNotice: 'அவசர உதவி: 108 / 112 அழைக்கவும்',
    callClinic: 'கிளினிக் அழைப்பு',
    callReception: 'வரவேற்பறை அழைப்பு',
    whatsAppDesk: 'வாட்ஸ்அப் உதவி',
    timingsSummary: 'திங்கள்-சனி: காலை 09:00-01:00 & மாலை 05:00-09:00 | ஞாயிறு: 09:30-01:00',
    
    navHome: 'முகப்பு',
    navAbout: 'கிளினிக் பற்றி',
    navDoctor: 'மருத்துவர்',
    navServices: 'மருத்துவ சேவைகள்',
    navTreatments: 'சிகிச்சைகள்',
    navFacilities: 'உள் கட்டமைப்பு',
    navWellness: 'முழு உடல் பரிசோதனை',
    navPatientGuide: 'நோயாளி வழிகாட்டி',
    navBlog: 'மருத்துவக் குறிப்புகள்',
    navFaq: 'கேள்வி-பதில்',
    navContact: 'தொடர்புக்கு',
    navMore: 'மேலும்',

    bookAppointment: 'முன்பதிவு செய்',
    bookVisit: 'முன்பதிவு',
    healthTools: 'உடல்நலக் கணக்கீடுகள்',
    searchPlaceholder: 'சேவைகள், அறிகுறிகள், பரிசோதனைகளைத் தேடுக...',
    trackBooking: 'டோக்கன் சரிபார்',
    insuranceGuide: 'காப்பீடு & கிளைம் வழிகாட்டி',

    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. சிந்து கிளினிக்.',
    quickLinks: 'முக்கிய இணைப்புகள்',
    clinicAddress: 'கிளினிக் முகவரி',
    consultationHours: 'மருத்துவ ஆலோசனை நேரம்',
  },
};
