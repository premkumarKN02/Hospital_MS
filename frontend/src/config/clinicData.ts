import {
  Doctor,
  MedicalService,
  ConditionTreatment,
  ClinicFacility,
  HealthCheckupPackage,
  BlogPost,
  FAQItem,
  TestimonialItem
} from '../types';

/**
 * ============================================================================
 * SINDHU CLINIC - CENTRAL MASTER CONFIGURATION & PLACEHOLDERS
 * ============================================================================
 * All clinic parameters, doctor details, contact info, and schedules are managed
 * here. When the real clinic details are confirmed by the client, simply update
 * this single file. No hard-coded fragments exist elsewhere in the application.
 */

export const CLINIC_CONFIG = {
  name: 'Sindhu Clinic',
  tagline: 'Compassionate Care, Modern Medical Excellence',
  subheadline: 'Dedicated outpatient consultation, preventive health management, and personalized patient care in a comfortable, modern setting.',
  
  // Contact & Location (Connected Green-API Official WhatsApp)
  phoneDisplay: '+91 78715 58651',
  phoneCallValue: 'tel:+917871558651',
  whatsappDisplay: '+91 78715 58651',
  doctorWhatsappNumber: '917871558651',
  whatsappUrl: 'https://wa.me/917871558651?text=Hello%20Sindhu%20Hospital,%20I%20would%20like%20to%20inquire%20about%20a%20consultation%20appointment.',
  emailAddress: 'knpremkumar1@gmail.com',
  emailDisplay: 'knpremkumar1@gmail.com',
  
  // Physical Address Placeholders
  address: {
    line1: '[CLINIC ADDRESS LINE 1 - Building / Landmark Name]',
    line2: '[CLINIC ADDRESS LINE 2 - Street / Road / Area]',
    city: '[CITY, STATE - PIN CODE]',
    landmarkNote: 'Centrally located with convenient parking and wheelchair accessible ground-floor entrance.',
    mapsUrl: 'https://maps.google.com/?q=Sindhu+Clinic',
    mapsEmbedNote: '[GOOGLE MAPS EMBED - Replace with approved Clinic Google Maps iframe/embed link]'
  },

  // Operating Hours
  timings: {
    weekdayMorning: '09:00 AM – 01:00 PM',
    weekdayEvening: '05:00 PM – 09:00 PM',
    weekdays: 'Monday – Saturday',
    sunday: 'Morning Consultation (09:30 AM – 01:00 PM) / Prior Appointment Only',
    closedNote: 'Emergency cases are directed to affiliated tertiary centers. Outpatient clinic remains closed on public holidays unless emergency notice posted.',
    summary: 'Mon - Sat: 9:00 AM - 1:00 PM & 5:00 PM - 9:00 PM | Sun: 9:30 AM - 1:00 PM'
  },

  // Consultation Fees Placeholder
  consultationFee: {
    firstVisit: '[CONSULTATION FEE - Inquire at desk / Set by Clinic]',
    followUp: '[FOLLOW-UP FEE - Valid within 7 days]',
    mode: 'Cash, UPI, Credit/Debit Cards, QR Code accepted at billing desk.'
  },

  // Social Media Links (Placeholders)
  socialLinks: {
    facebook: 'https://facebook.com/sindhuclinic',
    instagram: 'https://instagram.com/sindhuclinic',
    linkedin: 'https://linkedin.com/company/sindhuclinic',
    twitter: 'https://twitter.com/sindhuclinic'
  },

  // Legal & Medical Disclaimers
  medicalDisclaimer: 'The medical information provided on this website is for general informational and educational purposes only. It is not intended as medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare professional regarding any medical condition or treatment plan.',
  emergencyNotice: 'If you or a loved one is experiencing a life-threatening medical emergency (e.g. acute chest pain, sudden breathlessness, severe trauma, stroke symptoms), please call 108 / 112 immediately or proceed to the nearest emergency trauma center.',
  placeholderNotice: 'Notice to Client: Highlighted brackets like [DOCTOR NAME] or [PHONE NUMBER] represent editable placeholders ready to be updated with confirmed clinic credentials.'
};

/**
 * Primary Doctor Profile (Scalable Array for Multi-Doctor future expansion)
 */
export const DOCTORS: Doctor[] = [
  {
    id: 'doc-primary',
    name: '[DOCTOR NAME - e.g. Dr. K. Sindhu]',
    qualifications: '[DOCTOR QUALIFICATION - e.g. MBBS, MD (General Medicine) / DNB]',
    specialization: '[DOCTOR SPECIALIZATION - e.g. Consultant Physician & Diabetologist]',
    registrationNumber: '[REGISTRATION DETAILS - e.g. State Medical Council Reg No. XXXXX]',
    experienceYears: '[YEARS OF CLINICAL EXPERIENCE - e.g. 12+ Years]',
    languages: ['[LANGUAGES SPOKEN - English, Tamil, Hindi, Telugu]'],
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    bio: 'A compassionate and clinically rigorous medical professional committed to holistic patient well-being, evidence-based diagnosis, and chronic disease management. With a dedicated focus on outpatient precision, our primary doctor emphasizes thorough listening, preventive screening, and patient education so families feel confident, informed, and cared for at every visit.',
    treatmentPhilosophy: 'Every patient is unique. We believe medical care should never be rushed. Combining attentive clinical observation with empathetic communication ensures accurate diagnoses, minimized unnecessary medications, and long-term vitality for every individual who walks through our doors.',
    consultationApproach: [
      'Comprehensive patient history review & attentive active listening',
      'Evidence-based clinical examination adhering to modern protocols',
      'Clear, jargon-free explanation of diagnoses and test results',
      'Personalized lifestyle, dietary, and preventive guidance alongside pharmacotherapy',
      'Structured follow-up timeline to monitor recovery and wellness metrics'
    ],
    areasOfExpertise: [
      'Adult General Medicine & Acute Illness Management',
      'Diabetes Mellitus & Metabolic Disorder Care',
      'Hypertension & Cardiovascular Risk Management',
      'Seasonal Fevers, Viral Illnesses & Infectious Diseases',
      'Preventive Health Screenings & Geriatric Care',
      'Respiratory Disorders & Asthma Consultation'
    ],
    availability: [
      { days: 'Monday to Saturday', timings: '09:00 AM – 01:00 PM (Morning Session)', note: 'Tokens distributed at reception' },
      { days: 'Monday to Saturday', timings: '05:00 PM – 09:00 PM (Evening Session)', note: 'Walk-ins & scheduled appointments' },
      { days: 'Sunday', timings: '09:30 AM – 01:00 PM', note: 'By prior appointment / urgent consultation' }
    ]
  }
];

/**
 * Comprehensive Medical Services (Editable Placeholders)
 */
export const MEDICAL_SERVICES: MedicalService[] = [
  {
    id: 'general-consultation',
    title: 'General Medical Consultation',
    category: 'Primary Care',
    shortDescription: 'Attentive, in-depth evaluation of acute and chronic health concerns by our consultant physician.',
    fullDescription: 'Comprehensive outpatient examination for acute ailments such as fevers, respiratory infections, bodily pains, gastrointestinal disturbances, and unspecific fatigue. Designed to provide accurate diagnostic direction and relief.',
    iconName: 'Stethoscope',
    keyBenefits: ['Detailed physical examination', 'Clear explanation of symptom causes', 'Minimal necessary medication approach'],
    targetAudience: 'Adults and families seeking primary medical guidance',
    preparationNote: 'Please carry any recent test reports and a list of current medications.',
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'diabetes-metabolic-care',
    title: 'Diabetes & Metabolic Care',
    category: 'Chronic Care',
    shortDescription: 'Personalized sugar level monitoring, HbA1c tracking, diet planning, and complication prevention.',
    fullDescription: 'Long-term glycemic management for Type 2 Diabetes, pre-diabetes, and related metabolic syndromes. We emphasize lifestyle modifications, targeted medication titration, and organ screening to prevent long-term complications.',
    iconName: 'Activity',
    keyBenefits: ['Regular glucose and HbA1c trend analysis', 'Customized dietary and physical activity advice', 'Screening recommendations for kidney, eye, and nerve health'],
    targetAudience: 'Individuals with elevated blood sugar or diagnosed diabetes',
    preparationNote: 'Fast for 8-10 hours if fasting blood glucose evaluation is scheduled.',
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hypertension-cardiac-risk',
    title: 'Hypertension & BP Management',
    category: 'Chronic Care',
    shortDescription: 'Thorough blood pressure evaluation, cardiovascular risk assessment, and long-term stabilization.',
    fullDescription: 'Evaluation of primary and secondary hypertension with baseline cardiovascular risk profiling. We help patients stabilize their blood pressure using a combination of safe medication and stress/sodium reduction strategies.',
    iconName: 'HeartPulse',
    keyBenefits: ['Serial BP monitoring protocol', 'Cardiovascular risk factor assessment', 'Continuous medication review to eliminate side effects'],
    targetAudience: 'Adults with elevated blood pressure or family history of heart disease',
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'preventive-health-screenings',
    title: 'Preventive Health Screenings',
    category: 'Wellness',
    shortDescription: 'Proactive health checks designed to identify silent health conditions before symptoms develop.',
    fullDescription: 'Periodic health audits tailored to your age, lifestyle, and medical history. Identifies silent conditions such as hyperlipidemia, early hypertension, liver function anomalies, and micronutrient deficiencies.',
    iconName: 'ShieldCheck',
    keyBenefits: ['Early detection of lifestyle illnesses', 'Baseline health benchmarking', 'Actionable wellness roadmaps'],
    targetAudience: 'Working professionals, middle-aged adults, and proactive individuals',
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'respiratory-seasonal-illness',
    title: 'Respiratory & Infection Care',
    category: 'Primary Care',
    shortDescription: 'Evaluation of seasonal coughs, allergies, asthma, bronchitis, and tropical viral fevers.',
    fullDescription: 'Prompt clinical diagnosis and treatment for flu-like illnesses, dengue, typhoid, viral fevers, allergic rhinitis, and wheezing. Focuses on safe recovery, hydration, and preventing respiratory distress.',
    iconName: 'Wind',
    keyBenefits: ['Rapid differential diagnosis', 'Evidence-based antibiotic stewardship', 'Nebulization & symptomatic relief support'],
    targetAudience: 'Patients suffering from acute respiratory or infectious symptoms',
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gastrointestinal-health',
    title: 'Digestive & Gastro Health',
    category: 'Primary Care',
    shortDescription: 'Relief and management for acidity, GERD, indigestion, gastritis, and irritable bowel issues.',
    fullDescription: 'Systematic investigation of chronic heartburn, abdominal discomfort, irregular bowel movements, and food intolerances. Recommends dietary interventions and therapeutic protocols for digestive comfort.',
    iconName: 'Utensils',
    keyBenefits: ['Identification of dietary triggers', 'Targeted antacid & gut motility therapies', 'Guidance on gut microbiome and hydration'],
    targetAudience: 'Anyone suffering from frequent abdominal discomfort or acid reflux',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'elderly-care-consultation',
    title: 'Geriatric & Senior Care',
    category: 'Specialized Care',
    shortDescription: 'Gentle, holistic outpatient care addressing age-related mobility, memory, and multi-medication needs.',
    fullDescription: 'Compassionate medical care tailored to senior citizens dealing with multiple co-morbidities. Focuses on polypharmacy reduction, fall prevention, joint comfort, cognitive well-being, and gentle nutrition.',
    iconName: 'Users',
    keyBenefits: ['Deprescribing review (avoiding drug interactions)', 'Compassionate, unhurried consultations', 'Coordination with family caregivers'],
    targetAudience: 'Senior citizens (60+ years) and their family caregivers',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'womens-basic-health',
    title: "Women's Wellness Consultation",
    category: 'Specialized Care',
    shortDescription: 'Consultations for anemia, thyroid screening, bone mineral density, and fatigue in women.',
    fullDescription: 'Confidential consultations addressing nutritional deficiencies, hormonal imbalances, chronic fatigue, vitamin D/calcium wellness, and preventive wellness checks across different stages of life.',
    iconName: 'UserCheck',
    keyBenefits: ['Screening for iron-deficiency anemia', 'Thyroid and metabolic health assessment', 'Bone health and menopause support guidance'],
    targetAudience: 'Women seeking primary health review and preventive screening',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'children-routine-care',
    title: "Paediatric Outpatient Advice",
    category: 'Primary Care',
    shortDescription: 'Common childhood infections, growth assessment, seasonal allergies, and nutritional guidance.',
    fullDescription: 'Primary outpatient evaluation for childhood ailments such as colds, fevers, tonsillitis, stomach bugs, and skin rashes. Gentle examination environment designed to keep young patients at ease.',
    iconName: 'Smile',
    keyBenefits: ['Child-friendly consultation environment', 'Growth & developmental milestone checks', 'Nutritional and immunity building advice'],
    targetAudience: 'Infants, toddlers, and school-age children',
    imageUrl: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'lifestyle-weight-counselling',
    title: 'Lifestyle & Wellness Counselling',
    category: 'Wellness',
    shortDescription: 'Physician-guided advice on weight management, stress reduction, sleep hygiene, and exercise.',
    fullDescription: 'Scientific, non-judgmental guidance on addressing lifestyle habits contributing to fatigue, metabolic slowdown, and weight gain. Focuses on sustainable nutritional habits rather than crash diets.',
    iconName: 'Sparkles',
    keyBenefits: ['Medically-backed habit transformation', 'Stress management strategies', 'Sustainable nutritional adjustments'],
    targetAudience: 'Individuals striving for better stamina, weight balance, and mental clarity',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'diagnostic-test-interpretation',
    title: 'Diagnostic Review & Second Opinion',
    category: 'Consultation',
    shortDescription: 'In-depth, jargon-free review of your existing lab reports, scans, and specialist recommendations.',
    fullDescription: 'Have lab tests or radiology reports that you need clearly explained? Our physician provides objective, patient-friendly reviews to help you understand your health numbers and next steps.',
    iconName: 'FileText',
    keyBenefits: ['Clear explanation of complex medical terms', 'Verification of test implications', 'Objective guidance on whether specialist care is needed'],
    targetAudience: 'Patients holding recent hospital or lab test results',
    imageUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'post-illness-followup',
    title: 'Post-Illness & Follow-up Care',
    category: 'Consultation',
    shortDescription: 'Structured review consultations to ensure complete recovery after viral illnesses or hospitalization.',
    fullDescription: 'Ensures that post-infection weakness, lingering coughs, and recovering organ function are properly supervised until the patient resumes normal daily life with full vigor.',
    iconName: 'CheckCircle2',
    keyBenefits: ['Monitoring recovery milestones', 'Tapering of acute medications', 'Rebuilding physical endurance safely'],
    targetAudience: 'Patients recovering from dengue, pneumonia, surgeries, or prolonged viral illness',
    imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800'
  }
];

/**
 * Treatments and Health Conditions (Placeholders with Safe Medical Language)
 */
export const HEALTH_CONDITIONS: ConditionTreatment[] = [
  {
    id: 'cond-fevers',
    name: 'Fevers & Tropical Infections',
    category: 'Infectious Diseases',
    overview: 'Sudden or lingering elevations in body temperature caused by viral, bacterial, or seasonal parasitic infections such as flu, dengue, or typhoid.',
    commonSymptoms: ['Temperature above 100°F', 'Chills and body aches', 'Headache and fatigue', 'Loss of appetite'],
    whenToConsult: [
      'Fever lasting more than 48 hours without relief',
      'Temperature reaching 103°F or higher',
      'Severe abdominal pain, persistent vomiting, or rash',
      'Difficulty breathing or extreme lethargy'
    ],
    clinicApproach: 'Clinical assessment, vital monitoring, focused blood investigations, hydration guidance, and prudent antimicrobial therapy only when indicated.',
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cond-diabetes',
    name: 'Type 2 Diabetes Mellitus',
    category: 'Metabolic Health',
    overview: 'A metabolic condition where the body cannot effectively utilize insulin, leading to persistent elevations in blood glucose levels.',
    commonSymptoms: ['Frequent urination, particularly at night', 'Excessive thirst and hunger', 'Unexplained weight loss or fatigue', 'Slow healing of cuts or sores'],
    whenToConsult: [
      'Fasting blood sugar repeatedly above 126 mg/dL',
      'Presence of blurred vision, numbness, or tingling in feet',
      'Recurrent skin or urinary infections',
      'Family history coupled with excessive thirst and exhaustion'
    ],
    clinicApproach: 'Comprehensive evaluation of HbA1c, personalized medication titration, dietary counseling, foot care inspection, and periodic organ screening schedule.',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cond-hypertension',
    name: 'High Blood Pressure (Hypertension)',
    category: 'Cardiovascular Care',
    overview: 'A silent condition where blood moves through blood vessels with consistently excessive force, gradually straining the heart and arteries.',
    commonSymptoms: ['Often asymptomatic ("silent condition")', 'Occasional morning headaches', 'Dizziness or light-headedness', 'Flushing or short breath with exertion'],
    whenToConsult: [
      'Blood pressure consistently measuring above 130/85 mmHg',
      'Sudden severe headache accompanied by visual disturbances',
      'Chest tightness, palpitations, or shortness of breath',
      'Routine annual checkup for anyone aged 30 and older'
    ],
    clinicApproach: 'Calibrated serial BP measurements, secondary hypertension screening, sodium/exercise counseling, and low-dose, cardioprotective pharmacotherapy.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cond-respiratory',
    name: 'Bronchial Asthma & Allergies',
    category: 'Respiratory Health',
    overview: 'Chronic inflammation of the airways making them prone to constriction, wheezing, and allergic reactivity to dust, pollen, or cold air.',
    commonSymptoms: ['Recurrent dry or productive cough', 'Wheezing sound while exhaling', 'Chest tightness during physical activity', 'Morning sneezing and nasal congestion'],
    whenToConsult: [
      'Cough persisting longer than 2 weeks',
      'Awakening at night with breathlessness',
      'Inhaler use providing reduced relief',
      'Breathlessness hindering normal talking or walking'
    ],
    clinicApproach: 'Chest auscultation, trigger identification, allergen avoidance guidance, correct inhaler technique training, and step-wise anti-inflammatory care.',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cond-digestive',
    name: 'Acid Peptic Disease & Gastritis',
    category: 'Gastroenterology',
    overview: 'Irritation, inflammation, or erosion of the stomach and esophageal lining triggered by excess acid, irregular meals, stress, or H. pylori.',
    commonSymptoms: ['Burning sensation in the chest or upper abdomen', 'Sour taste in mouth after meals (acid reflux)', 'Bloating and excessive burping', 'Nausea after eating spicy or oily food'],
    whenToConsult: [
      'Heartburn occurring more than twice a week',
      'Difficulty or pain when swallowing food',
      'Vomiting blood or dark black-colored stools (Seek urgent care)',
      'Unintended weight loss and persistent stomach pain'
    ],
    clinicApproach: 'Dietary diary review, lifestyle modifications, mucosal protectant agents, acid-suppression therapy, and H. pylori screening recommendations.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cond-thyroid',
    name: 'Thyroid Dysfunction (Hypothyroidism)',
    category: 'Endocrine Health',
    overview: 'Underactivity of the thyroid gland causing slowed metabolism, commonly seen in young and middle-aged adults, particularly women.',
    commonSymptoms: ['Unexplained weight gain despite normal diet', 'Severe lethargy, brain fog, and cold intolerance', 'Dry skin, brittle hair, and constipation', 'Irregular menstrual cycles'],
    whenToConsult: [
      'Chronic tiredness unhelped by adequate sleep',
      'Swelling in the neck or throat tightness',
      'Sudden unexplained weight swings',
      'Planning pregnancy with a family history of thyroid disorders'
    ],
    clinicApproach: 'Serum TSH/Free T4 correlation, body mass monitoring, precise hormone replacement titration, and routine periodic follow-up scheduling.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cond-anemia',
    name: 'Nutritional Anemia & Deficiencies',
    category: 'General Medicine',
    overview: 'Insufficient red blood cells or hemoglobin due to lack of dietary iron, Vitamin B12, or folate, causing reduced oxygen delivery to tissues.',
    commonSymptoms: ['Pale skin, brittle nails, and dizziness', 'Shortness of breath on mild climbing', 'Palpitations and cold hands/feet', 'Craving unusual non-food substances (pica)'],
    whenToConsult: [
      'Persistent exhaustion affecting daily work',
      'Frequent fainting spells or light-headedness',
      'Known heavy menstrual cycles with chronic fatigue',
      'Strict vegetarian/vegan diet without B12 supplementation'
    ],
    clinicApproach: 'Complete blood count analysis, serum ferritin and vitamin panel review, dietary re-engineering, and well-tolerated oral therapeutic supplementation.',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cond-joint-pain',
    name: 'Musculoskeletal Pain & Osteoarthritis',
    category: 'Orthopedic Wellness',
    overview: 'Age-related cartilage wear or posture-related strains affecting the knees, lower back, neck, and shoulder joints.',
    commonSymptoms: ['Stiffness after waking up lasting under 30 minutes', 'Knee creaking or pain on stairs', 'Aching lower back after prolonged sitting', 'Reduced joint range of motion'],
    whenToConsult: [
      'Inability to bear weight on the joint',
      'Warmth, redness, and rapid swelling in a joint',
      'Pain accompanied by fever or chills',
      'Numbness radiating down the legs or arms'
    ],
    clinicApproach: 'Joint mobility assessment, posture evaluation, safe non-steroidal analgesics, calcium/Vitamin D3 supplementation, and home strengthening exercises.',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800'
  }
];

/**
 * Modern Clinic Facilities (Realistic Outpatient Clinic Infrastructure)
 */
export const CLINIC_FACILITIES: ClinicFacility[] = [
  {
    id: 'fac-reception',
    title: 'Welcoming Reception & Lounge',
    shortDescription: 'A calm, hygienic, well-ventilated waiting lounge designed for patient comfort and orderly queue management.',
    details: [
      'Digital token distribution system to minimize waiting fatigue',
      'Comfortable seating with adequate physical spacing',
      'Clean drinking water and sanitized restroom facilities',
      'Helpful front desk staff to guide appointments and billing'
    ],
    iconName: 'Building2',
    badge: 'Patient Comfort',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fac-consultation',
    title: "Doctor's Private Consultation Suite",
    shortDescription: 'A quiet, sound-insulated consultation room ensuring 100% patient confidentiality and thorough physician interaction.',
    details: [
      'Dedicated acoustic privacy for confidential medical discussions',
      'Digitally integrated patient history display for continuity of care',
      'Ergonomic patient and family attendant seating',
      'Direct natural daylight and HEPA air purification'
    ],
    iconName: 'Stethoscope',
    badge: '100% Privacy',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fac-examination',
    title: 'Clinical Examination & Vitals Station',
    shortDescription: 'Dedicated physical examination area equipped with calibrated diagnostic tools and hygienic privacy curtains.',
    details: [
      'Calibrated digital & aneroid blood pressure monitors',
      'Medical examination couch with disposable protective sheets',
      'Precision weight scale, stadiometer, and BMI assessment tools',
      'Pulse oximeter, digital otoscope, and non-contact thermometers'
    ],
    iconName: 'Activity',
    badge: 'Accurate Vitals',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fac-hygiene',
    title: 'Infection Control & Hygiene Protocols',
    shortDescription: 'Rigorous daily sanitization routines and clinical disinfection standards matching modern healthcare requirements.',
    details: [
      'Continuous surface disinfection between patient visits',
      'Touchless hand sanitizing stations at all access points',
      'Certified biomedical waste segregation and disposal',
      'Strict single-use disposable consumable policy for gloves and sheets'
    ],
    iconName: 'ShieldCheck',
    badge: 'Safety First',
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fac-diagnostics-placeholder',
    title: 'Diagnostic Sample Desk [Partner Lab Support]',
    shortDescription: 'Convenient on-site collection desk for routine blood and urine tests supported by accredited laboratory partners.',
    details: [
      'On-site blood draw and urine collection for routine investigations',
      'Barcoded sample handling ensuring zero error tracking',
      'Digital report delivery directly via WhatsApp or Email',
      'Note: Specialized radiology (X-Ray/Scans) referred to accredited imaging centers'
    ],
    iconName: 'FileText',
    badge: 'Accredited Partners',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fac-pharmacy-placeholder',
    title: 'Dispensing & Medication Desk [If Applicable]',
    shortDescription: 'Essential prescription support desk for primary emergency medications and prescribed oral courses.',
    details: [
      'Dispensing of standard physician-prescribed oral formulations',
      'Temperature-controlled medication storage preserving drug efficacy',
      'Pharmacist guidance on dosage timings and potential dietary interactions',
      'Editable placeholder: Clinic will confirm active dispensing status'
    ],
    iconName: 'CheckCircle2',
    badge: 'Quality Formulations',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fac-accessibility',
    title: 'Accessibility & Barrier-Free Entry',
    shortDescription: 'Designed to ensure easy, dignified access for senior citizens, injured individuals, and wheelchair users.',
    details: [
      'Ground-floor entrance with gentle incline ramp',
      'Wide corridors accommodating standard wheelchairs and walkers',
      'Staff assistance available upon arrival for elderly patients',
      'Convenient drop-off zone right at the clinic entrance'
    ],
    iconName: 'HeartHandshake',
    badge: 'Accessible Care',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'
  }
];

/**
 * Preventive Health Checkup Packages (Editable Sample Packages)
 */
export const HEALTH_PACKAGES: HealthCheckupPackage[] = [
  {
    id: 'pkg-basic',
    name: 'Basic Health & Vitality Checkup [Sample]',
    tagline: 'Ideal for annual preventive screening for young adults and working professionals.',
    targetGroup: 'Adults aged 18 to 35 years',
    recommendedFrequency: 'Once every 12 to 18 months',
    samplePricePlaceholder: '[SAMPLE PACKAGE - Price set by Clinic]',
    includedTests: [
      'Doctor Consultation & Full Clinical Examination',
      'Complete Blood Count (CBC) with ESR',
      'Fasting Blood Glucose (Blood Sugar)',
      'Lipid Profile (Cholesterol, Triglycerides, HDL, LDL)',
      'Urine Routine & Microscopic Examination',
      'Blood Pressure, BMI & Body Composition Audit'
    ],
    benefits: [
      'Detects silent early-stage lifestyle risks',
      'Benchmarking personal baseline parameters',
      'Actionable nutrition guidance from physician'
    ],
    popular: false,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pkg-metabolic',
    name: 'Comprehensive Diabetic & Heart Wellness [Sample]',
    tagline: 'Thorough screening for individuals with sedentary lifestyle, family diabetes, or BP.',
    targetGroup: 'Adults aged 30+ with lifestyle or family risk',
    recommendedFrequency: 'Annually or as advised by physician',
    samplePricePlaceholder: '[SAMPLE PACKAGE - Price set by Clinic]',
    includedTests: [
      'Extended Consultation with Consultant Physician',
      'HbA1c (3-Month Average Glucose Level)',
      'Fasting & Post-Prandial Blood Sugar',
      'Complete Lipid Profile with Cardiac Risk Ratio',
      'Renal Function Test (Serum Creatinine, Blood Urea, Electrolytes)',
      'Liver Function Test (SGOT, SGPT, Bilirubin)',
      'Resting 12-Lead ECG (Coordinated via Partner Center)'
    ],
    benefits: [
      'In-depth metabolic risk assessment',
      'Early identification of organ stress',
      'Tailored long-term prevention strategy'
    ],
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pkg-senior',
    name: 'Senior Citizen Comprehensive Review [Sample]',
    tagline: 'Gentle, holistic evaluation focusing on cardiovascular, bone, and renal longevity for elders.',
    targetGroup: 'Seniors aged 55+ years',
    recommendedFrequency: 'Every 6 months',
    samplePricePlaceholder: '[SAMPLE PACKAGE - Price set by Clinic]',
    includedTests: [
      'Comprehensive Geriatric Consultation & Polypharmacy Review',
      'Complete Blood Count & Inflammatory Markers',
      'Serum Calcium, Phosphorus & Vitamin D3',
      'Serum Vitamin B12 Levels',
      'Kidney Function & Estimated GFR',
      'Liver & Thyroid (TSH) Profile',
      'Serial Blood Pressure & Fall-Risk Evaluation'
    ],
    benefits: [
      'Screening for bone density loss and joint fatigue',
      'Optimization of multiple ongoing medications',
      'Caregiver guidance on nutrition and hydration'
    ],
    popular: false,
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pkg-women',
    name: "Women's Wellness & Vitality Profile [Sample]",
    tagline: 'Focused on hormonal balance, thyroid health, bone nutrition, and iron stores in women.',
    targetGroup: 'Women of all age groups',
    recommendedFrequency: 'Annual health review',
    samplePricePlaceholder: '[SAMPLE PACKAGE - Price set by Clinic]',
    includedTests: [
      'Confidential Physician Consultation',
      'Complete Hemogram (Screening for Iron Deficiency)',
      'Serum Ferritin & Iron Studies',
      'Thyroid Stimulating Hormone (TSH)',
      'Serum Calcium & Vitamin D3',
      'Blood Sugar & Lipid Panel',
      'Lifestyle & Nutritional Counseling'
    ],
    benefits: [
      'Addresses unexplained chronic fatigue and hair fall',
      'Identifies subtle thyroid and metabolic slowdowns',
      'Strengthens bone health before menopause'
    ],
    popular: false,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  }
];

/**
 * Health Blog Articles (Educational, Medically Sound, Clearly Marked Demo)
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'understanding-blood-pressure-numbers',
    title: 'Understanding Your Blood Pressure: What Do the Numbers Really Mean?',
    category: 'Cardiovascular Health',
    author: '[DOCTOR NAME]',
    authorRole: 'Consultant Physician, Sindhu Clinic',
    publishedDate: 'September 2026',
    readTime: '4 min read',
    summary: 'High blood pressure is often called the silent killer because it rarely shows symptoms until damage is done. Learn how to interpret systolic and diastolic readings.',
    contentParagraphs: [
      'When your doctor slips a cuff around your arm and measures your blood pressure, you receive two numbers, such as 120/80 mmHg. The first number, systolic pressure, measures the pressure in your blood vessels when your heart beats. The second, diastolic pressure, measures the pressure when your heart rests between beats.',
      'A normal resting reading is typically below 120/80 mmHg. When readings consistently range between 130-139 systolic or 80-89 diastolic, it is classified as Stage 1 Hypertension. At this stage, your blood vessel walls are under continuous strain, which can quietly accelerate plaque formation.',
      'The good news is that early hypertension responds remarkably well to simple interventions: reducing dietary sodium, increasing potassium through fresh greens, brisk walking for 30 minutes daily, and maintaining restful sleep. Before starting lifelong medication, consulting your physician for serial monitoring ensures an accurate baseline.'
    ],
    keyTakeaways: [
      'Systolic is heart pumping pressure; Diastolic is heart resting pressure.',
      'A single elevated reading does not diagnose hypertension; serial measurements are needed.',
      'Cutting excess salt and walking daily can lower systolic BP by 5 to 8 points.'
    ],
    tags: ['Blood Pressure', 'Heart Health', 'Preventive Care', 'Lifestyle'],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blog-2',
    slug: 'pre-diabetes-reversal-action-plan',
    title: 'Diagnosed with Pre-Diabetes? How to Turn the Clock Back Early',
    category: 'Diabetes Care',
    author: '[DOCTOR NAME]',
    authorRole: 'Consultant Physician, Sindhu Clinic',
    publishedDate: 'August 2026',
    readTime: '5 min read',
    summary: 'Pre-diabetes is a critical golden window of opportunity. With targeted lifestyle adjustments, blood sugar levels can return to completely normal ranges.',
    contentParagraphs: [
      'Pre-diabetes means your blood glucose is higher than normal (an HbA1c between 5.7% and 6.4%), but not yet high enough to be classified as Type 2 diabetes. Most people experience zero symptoms during this phase, making routine annual blood checks vital.',
      'Insulin resistance develops when cells in your muscles, fat, and liver resist the action of insulin. The pancreas compensates by producing more insulin until it cannot keep up. Reversing this requires reducing the rapid influx of simple refined carbohydrates that trigger sharp insulin spikes.',
      'Simple steps make a massive impact: replacing white rice and refined flour with whole grains and legumes, consuming vegetables and protein before carbohydrates at meal times, and building lean muscle through resistance exercises. Many patients restore their HbA1c to normal within 3 to 6 months of disciplined lifestyle refinement.'
    ],
    keyTakeaways: [
      'Pre-diabetes has no obvious symptoms; HbA1c test is essential.',
      'Diet sequence matters: eat fiber and protein before starch.',
      'Building muscle improves glucose disposal independent of insulin.'
    ],
    tags: ['Diabetes', 'Metabolism', 'Diet & Nutrition', 'Preventive Care'],
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blog-3',
    slug: 'seasonal-viral-fevers-safe-home-care',
    title: 'Managing Seasonal Viral Fevers: When to Rest at Home vs. When to See a Doctor',
    category: 'General Health',
    author: '[DOCTOR NAME]',
    authorRole: 'Consultant Physician, Sindhu Clinic',
    publishedDate: 'July 2026',
    readTime: '4 min read',
    summary: 'Monsoons and seasonal shifts bring an influx of viral infections. Learn how to safely manage symptoms and recognize critical warning red flags.',
    contentParagraphs: [
      'During weather transitions, viral pathogens flourish. Most uncomplicated viral fevers run a self-limiting course of 3 to 5 days. During this time, the body uses elevated body temperature as a natural defense mechanism to inhibit viral replication.',
      'Self-medicating with antibiotics is one of the most common and dangerous errors. Antibiotics kill bacteria, not viruses. Indiscriminate antibiotic use disrupts gut flora and drives drug resistance. Instead, focus on oral rehydration solutions, light nourishing foods, lukewarm sponge baths, and paracetamol under clinical guidance.',
      'Watch closely for red flags: persistent vomiting, inability to retain liquids, severe headache with stiff neck, breathlessness, rash, or fever exceeding 72 hours. In such situations, prompt physician consultation and blood counts are essential to rule out dengue or malaria.'
    ],
    keyTakeaways: [
      'Antibiotics are ineffective against viral fevers and should never be self-administered.',
      'Hydration with electrolytes and fluids is the single most important recovery aid.',
      'Seek immediate medical review if fever persists past 3 days or causes severe vomiting.'
    ],
    tags: ['Fever', 'Infections', 'Antibiotic Awareness', 'First Aid'],
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blog-4',
    slug: 'sleep-hygiene-and-immunity',
    title: 'The Sleep-Immunity Axis: Why 7 Hours of Rest is Your Strongest Prescription',
    category: 'Lifestyle & Wellness',
    author: '[DOCTOR NAME]',
    authorRole: 'Consultant Physician, Sindhu Clinic',
    publishedDate: 'June 2026',
    readTime: '3 min read',
    summary: 'Modern living often treats sleep as an afterthought. Scientific evidence shows how quality sleep directly fuels antibody production and cellular repair.',
    contentParagraphs: [
      'While we sleep, our immune system releases proteins called cytokines, some of which help promote sleep and combat infection. Sleep deprivation decreases the production of these protective cytokines, leaving you more vulnerable to common infectious agents.',
      'Chronic sleep debt also stimulates the sustained release of cortisol, our primary stress hormone. Elevated cortisol suppresses white blood cell activity, drives systemic inflammation, and interferes with blood sugar regulation.',
      'Cultivating sleep hygiene begins hours before bedtime: dim indoor overhead lighting, avoid digital blue-light screens within 60 minutes of sleeping, keep the bedroom cool, and maintain a fixed wake-up time even on weekends to anchor your circadian rhythm.'
    ],
    keyTakeaways: [
      'Immune cells and antibodies regenerate predominantly during deep sleep cycles.',
      'Chronic sleep deprivation elevates baseline inflammation and blood pressure.',
      'A consistent sleep schedule is more effective than trying to catch up on weekends.'
    ],
    tags: ['Sleep Hygiene', 'Immunity', 'Mental Well-being', 'Stress Relief'],
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blog-5',
    slug: 'annual-health-checkup-importance',
    title: 'Why You Shouldn’t Wait for Symptoms: The Power of Annual Preventive Checks',
    category: 'Preventive Care',
    author: '[DOCTOR NAME]',
    authorRole: 'Consultant Physician, Sindhu Clinic',
    publishedDate: 'May 2026',
    readTime: '4 min read',
    summary: 'Many major non-communicable diseases develop silently over years. How proactive screening saves health, stress, and financial burden.',
    contentParagraphs: [
      'In medicine, the earliest stages of chronic conditions like atherosclerosis, fatty liver, diabetic nephropathy, and osteoporosis rarely produce pain. By the time a patient feels noticeable discomfort, significant tissue remodeling has already taken place.',
      'An annual health checkup provides an objective benchmark of your biomarkers. Comparing your blood counts, lipid ratios, and liver/kidney markers over consecutive years allows your physician to spot subtle negative trajectories before they become diseases.',
      'Preventive medicine is always more gentle, more affordable, and significantly more successful than curative crisis management. Schedule an annual review for yourself and your parents as a family health tradition.'
    ],
    keyTakeaways: [
      'Silent diseases do not cause pain in early, easily reversible stages.',
      'Year-over-year biomarker comparisons detect subtle downward trends early.',
      'An annual checkup is an investment in longevity and peace of mind.'
    ],
    tags: ['Preventive Medicine', 'Annual Checkup', 'Family Health'],
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blog-6',
    slug: 'gut-health-and-daily-nutrition',
    title: 'Taming Acidity & Bloating: A Physician’s Practical Guide to Digestive Harmony',
    category: 'Digestive Health',
    author: '[DOCTOR NAME]',
    authorRole: 'Consultant Physician, Sindhu Clinic',
    publishedDate: 'April 2026',
    readTime: '4 min read',
    summary: 'Frequent antacid popping merely masks symptoms. Understand the root triggers of acidity, indigestion, and altered gut motility.',
    contentParagraphs: [
      'Gastroesophageal reflux disease (GERD) and chronic gastritis are among the most frequent complaints encountered in outpatient practice. Modern rushed eating habits, prolonged fasting followed by heavy oily meals, and high caffeine intake are frequent culprits.',
      'While over-the-counter antacids offer temporary relief, overusing proton pump inhibitors can alter stomach acidity needed for calcium and B12 absorption. A physician can help determine whether your symptoms are caused by dietary patterns, H. pylori infection, or medication side-effects.',
      'Practical habits make a noticeable difference: eating meals at consistent times, chewing food thoroughly, avoiding lying down within 2 hours of dinner, and staying adequately hydrated throughout the day.'
    ],
    keyTakeaways: [
      'Long-term antacid overuse can impair vital mineral and vitamin absorption.',
      'Do not lie down immediately after dinner; leave a 2-hour buffer.',
      'Consult your doctor if heartburn is frequent or accompanied by swallowing difficulty.'
    ],
    tags: ['Digestive Health', 'Acidity', 'Nutrition', 'Lifestyle'],
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=800'
  }
];

/**
 * Frequently Asked Questions (Comprehensive, Realistic, Categorized)
 */
export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Appointments',
    question: 'How do I book an appointment at Sindhu Clinic?',
    answer: 'You can easily request an appointment online through our "Book Appointment" form, call our clinic reception during operational hours, or send us a WhatsApp message. Our staff will confirm your slot and timing promptly.'
  },
  {
    id: 'faq-2',
    category: 'Appointments',
    question: 'Are walk-in consultations accepted without a prior appointment?',
    answer: 'Yes, we welcome walk-in patients during morning and evening clinic hours. Walk-in tokens are allocated on a first-come, first-served basis. However, scheduling in advance is recommended to minimize your waiting time.'
  },
  {
    id: 'faq-3',
    category: 'Clinic Timings',
    question: 'What are the consultation hours of Sindhu Clinic?',
    answer: 'We operate Monday through Saturday in two sessions: Morning from 09:00 AM to 01:00 PM, and Evening from 05:00 PM to 09:00 PM. On Sundays, morning consultations take place from 09:30 AM to 01:00 PM (by prior appointment).'
  },
  {
    id: 'faq-4',
    category: 'Doctor',
    question: 'Who will examine me during the consultation?',
    answer: 'Your consultation will be personally conducted by our primary consultant physician [DOCTOR NAME - e.g. Dr. K. Sindhu]. We believe in unhurried, attentive listening and dedicated one-on-one medical evaluation.'
  },
  {
    id: 'faq-5',
    category: 'Consultation',
    question: 'What should I bring along for my first consultation?',
    answer: 'Please bring your previous medical records, past discharge summaries (if any), recent lab/radiology reports, and all current prescription strips/bottles so our physician can review your medication history accurately.'
  },
  {
    id: 'faq-6',
    category: 'Payments & Reports',
    question: 'What payment modes are accepted at the clinic?',
    answer: 'We accept Cash, UPI (Google Pay, PhonePe, Paytm), and major Debit/Credit cards at our reception billing counter.'
  },
  {
    id: 'faq-7',
    category: 'Consultation',
    question: 'What is the clinic policy regarding follow-up consultations?',
    answer: 'Follow-up consultations within a defined period (e.g., 7 days) for the same clinical episode are accommodated at nominal or follow-up rates. Inquire at our reception desk for exact details.'
  },
  {
    id: 'faq-8',
    category: 'Payments & Reports',
    question: 'How do I receive lab test results if samples were collected at the clinic?',
    answer: 'Routine blood and urine test reports handled through our accredited laboratory partners are delivered conveniently to your registered WhatsApp number or Email as soon as results are verified.'
  },
  {
    id: 'faq-9',
    category: 'Emergency',
    question: 'Does Sindhu Clinic handle acute medical emergencies (ICU / Trauma)?',
    answer: 'Sindhu Clinic is a dedicated outpatient clinic. While we provide primary emergency stabilization and nebulization, critical emergencies (such as acute heart attacks, strokes, or major trauma) require immediate care at a 24/7 tertiary hospital emergency department. Please call 108/112 in life-threatening situations.'
  },
  {
    id: 'faq-10',
    category: 'Clinic Timings',
    question: 'Is the clinic accessible for elderly patients or wheelchair users?',
    answer: 'Yes. Sindhu Clinic features ground-floor access with a gentle entrance ramp and wide corridors suitable for wheelchairs and walkers. Our reception staff is also happy to assist elderly patients upon arrival.'
  },
  {
    id: 'faq-11',
    category: 'Doctor',
    question: 'Can I consult the doctor online or via teleconsultation?',
    answer: 'Follow-up consultations and report reviews for established patients can be scheduled via video/phone consultation where clinically appropriate. Please contact reception to inquire about teleconsultation slots.'
  },
  {
    id: 'faq-12',
    category: 'Consultation',
    question: 'Are patient medical records kept private and confidential?',
    answer: 'Absolutely. We uphold strict medical confidentiality standards. Your consultation notes, diagnosis, and lab reports are shared only with you and authorized caregivers upon your consent.'
  }
];

/**
 * Sample Patient Testimonials (Strictly marked demo content to avoid fabricated claims)
 */
export const SAMPLE_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    patientName: 'R. K. Sharma [Sample Patient]',
    visitReason: 'General Health & Blood Pressure Consultation',
    comment: 'The doctor listened patiently to all my health issues without rushing. The clinic environment is exceptionally clean and comfortable. Clear explanations of tests gave me great confidence.',
    rating: 5,
    date: 'Verified Sample Feedback',
    isSamplePlaceholder: true,
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'test-2',
    patientName: 'Priya Mehra [Sample Patient]',
    visitReason: 'Diabetes & Lifestyle Management',
    comment: 'Unlike crowded clinics, the consultation here felt personal and thorough. The diet guidance and gradual medication adjustments have kept my blood sugar completely stable.',
    rating: 5,
    date: 'Verified Sample Feedback',
    isSamplePlaceholder: true,
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'test-3',
    patientName: 'V. Sundaram [Sample Patient]',
    visitReason: 'Geriatric Health Review for Parents',
    comment: 'Brought my elderly mother for a routine checkup. The ground floor ramp and gentle attitude of the doctor made the visit stress-free. Very grateful for such caring medical service.',
    rating: 5,
    date: 'Verified Sample Feedback',
    isSamplePlaceholder: true,
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800'
  }
];
