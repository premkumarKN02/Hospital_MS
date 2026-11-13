import { CLINIC_CONFIG, DOCTORS, MEDICAL_SERVICES } from '../../config/clinicData';
import { PageRoute } from '../../types';

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn';

export interface LanguageConfig {
  code: SupportedLanguage;
  localeCode: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', localeCode: 'en-IN', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ta', localeCode: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', localeCode: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', localeCode: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', localeCode: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', localeCode: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

export interface AssistantResponse {
  text: string;
  spokenText?: string;
  commandExecuted?: string;
  actionButton?: {
    label: string;
    route?: PageRoute;
    externalUrl?: string;
    specialAction?: 'scroll-top' | 'scroll-bottom' | 'call' | 'whatsapp';
  };
  suggestedFollowUps?: string[];
}

/**
 * Detects website control commands from voice or text input
 */
export function detectWebsiteCommand(query: string): { route?: PageRoute; specialAction?: 'scroll-top' | 'scroll-bottom' | 'call' | 'whatsapp'; feedbackText: Record<SupportedLanguage, string> } | null {
  const q = query.toLowerCase().trim();

  // 1. Appointment Booking Navigation
  if (
    q.includes('book appointment') || q.includes('go to appointment') || q.includes('open booking') || q.includes('take appointment') ||
    q.includes('முன்பதிவு செய்') || q.includes('அப்பாயிண்ட்மென்ட்') || q.includes('appointment book pannu') || q.includes('slot book') ||
    q.includes('अपॉइंटमेंट बुक') || q.includes('बुकिंग खोलो') ||
    q.includes('అపాయింట్‌మెంట్') || q.includes('അപ്പോയിന്റ്മെന്റ്') || q.includes('ಅಪಾಯಿಂಟ್ಮೆಂಟ್')
  ) {
    return {
      route: 'appointments',
      feedbackText: {
        en: 'Navigating to Appointment Booking page right away!',
        ta: 'நிச்சயமாக! முன்பதிவு பக்கத்திற்கு அழைத்துச் செல்கிறேன்.',
        hi: 'जरूर! अपॉइंटमेंट बुकिंग पेज पर ले जा रहा हूँ।',
        te: 'తప్పకుండా! అపాయింట్‌మెంట్ బుకింగ్ పేజీకి తీసుకెళ్తున్నాను.',
        ml: 'തീർച്ചയായും! അപ്പോയിന്റ്മെന്റ് ബുക്കിംഗ് പേജിലേക്ക് പോകുന്നു.',
        kn: 'ಖಂಡಿತ! ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕಿಂಗ್ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 2. Doctor Profile Navigation
  if (
    q.includes('show doctor') || q.includes('view doctor') || q.includes('doctor profile') || q.includes('who is the doctor') ||
    q.includes('டாக்டர் விவரம்') || q.includes('மருத்துவர் பக்கம்') || q.includes('doctor profile kaattu') || q.includes('doctor pathi sollu') ||
    q.includes('डॉक्टर प्रोफाइल') || q.includes('डॉक्टर दिखाओ') ||
    q.includes('డాక్టర్ ప్రొఫైల్') || q.includes('ഡോക്ടറുടെ വിവരങ്ങൾ') || q.includes('ವೈದ್ಯರ ಪ್ರೊಫೈಲ್')
  ) {
    return {
      route: 'doctor',
      feedbackText: {
        en: 'Opening the Doctor Profile and consultation schedule.',
        ta: 'மருத்துவர் சுயவிவரப் பக்கத்தைத் திறக்கிறேன்.',
        hi: 'डॉक्टर प्रोफाइल और समय सारणी खोल रहा हूँ।',
        te: 'డాక్టర్ ప్రొఫైల్ పేజీని తెరుస్తున్నాను.',
        ml: 'ഡോക്ടറുടെ പ്രൊഫൈൽ പേജ് തുറക്കുന്നു.',
        kn: 'ವೈದ್ಯರ ಪ್ರೊಫೈಲ್ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 3. Medical Services Navigation
  if (
    q.includes('show services') || q.includes('view services') || q.includes('our services') || q.includes('medical services') ||
    q.includes('சேவைகள்') || q.includes('மருத்துவ சேவைகள்') || q.includes('services kaattu') ||
    q.includes('सेवाएं दिखाओ') || q.includes('मेडिकल सर्विसेज') ||
    q.includes('సేవలు చూడండి') || q.includes('സേവനങ്ങൾ കാണിക്കുക') || q.includes('ಸೇವೆಗಳನ್ನು ತೋರಿಸಿ')
  ) {
    return {
      route: 'services',
      feedbackText: {
        en: 'Taking you to our 12 Comprehensive Medical Services.',
        ta: 'எங்கள் 12 மருத்துவ சேவைகள் பக்கத்திற்கு அழைத்துச் செல்கிறேன்.',
        hi: 'हमारे 12 मेडिकल सर्विसेज पेज पर ले जा रहा हूँ।',
        te: 'మా 12 వైద్య సేవల పేజీకి తీసుకెళ్తున్నాను.',
        ml: 'ഞങ്ങളുടെ 12 മെഡിക്കൽ സേവനങ്ങളിലേക്ക് പോകുന്നു.',
        kn: 'ನಮ್ಮ 12 ವೈದ್ಯಕೀಯ ಸೇವೆಗಳ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 4. Treatments & Conditions Navigation
  if (
    q.includes('show treatments') || q.includes('view treatments') || q.includes('health conditions') ||
    q.includes('சிகிச்சைகள்') || q.includes('நோய்கள்') || q.includes('treatment kaattu') ||
    q.includes('इलाज दिखाओ') || q.includes('बीमारियों की जानकारी') ||
    q.includes('చికిత్సలు') || q.includes('ചികിത്സകൾ') || q.includes('ಚಿಕಿತ್ಸೆಗಳು')
  ) {
    return {
      route: 'treatments',
      feedbackText: {
        en: 'Opening Treatments & Health Conditions guide.',
        ta: 'சிகிச்சைகள் மற்றும் நோய்கள் வழிகாட்டி பக்கத்திற்குச் செல்கிறேன்.',
        hi: 'इलाज और स्वास्थ्य मार्गदर्शिका पेज खोल रहा हूँ।',
        te: 'చికిత్సల పేజీని తెరుస్తున్నాను.',
        ml: 'ചികിത്സകളുടെ ഗൈഡ് പേജ് തുറക്കുന്നു.',
        kn: 'ಚಿಕಿತ್ಸೆಗಳ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 5. Facilities Navigation
  if (
    q.includes('show facilities') || q.includes('clinic facilities') || q.includes('clinic photos') ||
    q.includes('வசதிகள்') || q.includes('கிளினிக் வசதி') || q.includes('facilities kaattu') ||
    q.includes('सुविधाएं दिखाओ') || q.includes('क्लीनिक की सुविधाएं') ||
    q.includes('సౌకర్యాలు') || q.includes('സൗകര്യങ്ങൾ') || q.includes('ಸೌಲಭ್ಯಗಳು')
  ) {
    return {
      route: 'facilities',
      feedbackText: {
        en: 'Taking you to the Clinic Facilities and infrastructure page.',
        ta: 'கிளினிக் வசதிகள் மற்றும் கட்டமைப்பு பக்கத்திற்கு அழைத்துச் செல்கிறேன்.',
        hi: 'क्लीनिक की सुविधाओं के पेज पर ले जा रहा हूँ।',
        te: 'క్లినిక్ సౌకర్యాల పేజీకి తీసుకెళ్తున్నాను.',
        ml: 'ക്ലിനിക്ക് സൗകര്യങ്ങളുടെ പേജിലേക്ക് പോകുന്നു.',
        kn: 'ಕ್ಲಿನಿಕ್ ಸೌಲಭ್ಯಗಳ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 6. Preventive Health Checkups / Wellness Navigation
  if (
    q.includes('health checkup') || q.includes('show packages') || q.includes('wellness packages') ||
    q.includes('பரிசோதனை பேக்கேஜ்') || q.includes('உடல் பரிசோதனை') || q.includes('checkup package') ||
    q.includes('हेल्थ चेकअप') || q.includes('पैकेज दिखाओ') ||
    q.includes('హెల్త్ చెకప్') || q.includes('ഹെൽത്ത് ചെക്കപ്പ്') || q.includes('ಆರೋಗ್ಯ ತಪಾಸಣೆ')
  ) {
    return {
      route: 'wellness',
      feedbackText: {
        en: 'Navigating to Preventive Health Checkups & Wellness packages.',
        ta: 'முன்னெச்சரிக்கை உடல் பரிசோதனை பேக்கேஜ்கள் பக்கத்திற்குச் செல்கிறேன்.',
        hi: 'हेल्थ चेकअप और वेलनेस पैकेज पेज खोल रहा हूँ।',
        te: 'హెల్త్ చెకప్ ప్యాకేజీల పేజీకి తీసుకెళ్తున్నాను.',
        ml: 'ഹെൽത്ത് ചെക്കപ്പ് പാക്കേജുകളിലേക്ക് പോകുന്നു.',
        kn: 'ಆರೋಗ್ಯ ತಪಾಸಣೆ ಪ್ಯಾಕೇಜ್‌ಗಳಿಗೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 7. Blog / Health Articles Navigation
  if (
    q.includes('show blog') || q.includes('health articles') || q.includes('health tips') || q.includes('read blog') ||
    q.includes('மருத்துவ குறிப்புகள்') || q.includes('கட்டுரைகள்') || q.includes('blog kaattu') ||
    q.includes('ब्लॉग दिखाओ') || q.includes('स्वास्थ्य टिप्स') ||
    q.includes('బ్లాగ్') || q.includes('ബ്ലോഗ്') || q.includes('ಆರೋಗ್ಯ ಸಲಹೆಗಳು')
  ) {
    return {
      route: 'blog',
      feedbackText: {
        en: 'Opening Health Articles & Resources blog.',
        ta: 'மருத்துவக் கட்டுரைகள் மற்றும் நல்வாழ்வு பக்கத்தைத் திறக்கிறேன்.',
        hi: 'स्वास्थ्य लेख और ब्लॉग पेज खोल रहा हूँ।',
        te: 'ఆరోగ్య వ్యాసాల పేజీకి తీసుకెళ్తున్నాను.',
        ml: 'ആരോഗ്യ ബ്ലോഗ് പേജിലേക്ക് പോകുന്നു.',
        kn: 'ಆರೋಗ್ಯ ಲೇಖನಗಳ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 8. FAQ Navigation
  if (
    q.includes('show faq') || q.includes('questions') || q.includes('frequently asked') ||
    q.includes('கேள்விகள்') || q.includes('சந்தேகங்கள்') || q.includes('faq kaattu') ||
    q.includes('सवाल जवाब') || q.includes('एफएक्यू दिखाओ') ||
    q.includes('ప్రశ్నలు') || q.includes('ചോദ്യങ്ങൾ') || q.includes('ಪ್ರಶ್ನೋತ್ತರ')
  ) {
    return {
      route: 'faq',
      feedbackText: {
        en: 'Taking you to Frequently Asked Questions.',
        ta: 'அடிக்கடி கேட்கப்படும் கேள்விகள் பக்கத்திற்கு அழைத்துச் செல்கிறேன்.',
        hi: 'अक्सर पूछे जाने वाले सवाल (FAQ) पेज पर ले जा रहा हूँ।',
        te: 'తరచుగా అడిగే ప్రశ్నల పేజీకి తీసుకెళ్తున్నాను.',
        ml: 'പതിവ് ചോദ്യങ്ങളുടെ പേജിലേക്ക് പോകുന്നു.',
        kn: 'ಆಗಾಗ್ಗೆ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 9. Contact & Directions Navigation
  if (
    q.includes('contact clinic') || q.includes('where is the clinic') || q.includes('show address') || q.includes('directions') || q.includes('map') ||
    q.includes('தொடர்பு கொள்ள') || q.includes('முகவரி காட்டு') || q.includes('எங்கு உள்ளது') || q.includes('enga irukku') ||
    q.includes('संपर्क करें') || q.includes('पता दिखाओ') || q.includes('कहाँ है') ||
    q.includes('సంప్రదించండి') || q.includes('ബന്ധപ്പെടുക') || q.includes('ಸಂಪರ್ಕಿಸಿ')
  ) {
    return {
      route: 'contact',
      feedbackText: {
        en: 'Opening Contact details, address, and Google Maps location.',
        ta: 'கிளினிக் முகவரி, தொலைபேசி மற்றும் வரைபடப் பக்கத்தைத் திறக்கிறேன்.',
        hi: 'क्लीनिक संपर्क विवरण, पता और मैप खोल रहा हूँ।',
        te: 'సంప్రదింపు వివరాలు మరియు మ్యాప్ పేజీని తెరుస్తున్నాను.',
        ml: 'വിലാസവും മാപ്പും ഉള്ള പേജ് തുറക്കുന്നു.',
        kn: 'ಸಂಪರ್ಕ ವಿವರಗಳು ಮತ್ತು ನಕ್ಷೆಯ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 10. Patient Info & Visit Guide Navigation
  if (
    q.includes('patient info') || q.includes('what to bring') || q.includes('visit guide') || q.includes('preparation') ||
    q.includes('நோயாளி தகவல்') || q.includes('என்ன கொண்டு வர வேண்டும்') || q.includes('guidelines') ||
    q.includes('मरीज की जानकारी') || q.includes('क्या लाना है') ||
    q.includes('రోగి సమాచారం') || q.includes('രോഗി വിവരങ്ങൾ') || q.includes('ರೋಗಿಯ ಮಾಹಿತಿ')
  ) {
    return {
      route: 'patient-info',
      feedbackText: {
        en: 'Taking you to Patient Visit Guide and preparation checklist.',
        ta: 'நோயாளி வருகை வழிகாட்டி மற்றும் சரிபார்ப்பு பட்டியலுக்குச் செல்கிறேன்.',
        hi: 'मरीज सहायता गाइड और तैयारी सूची पेज पर ले जा रहा हूँ।',
        te: 'రోగి మార్గదర్శకాల పేజీకి తీసుకెళ్తున్నాను.',
        ml: 'സന്ദർശന മാർഗ്ഗനിർദ്ദേശങ്ങളിലേക്ക് പോകുന്നു.',
        kn: 'ರೋಗಿಯ ಮಾರ್ಗದರ್ಶಿ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 11. Home Navigation
  if (
    q.includes('go to home') || q.includes('open home') || q.includes('homepage') ||
    q.includes('முகப்பு') || q.includes('வீட்டுப் பக்கம்') || q.includes('home page ku po') ||
    q.includes('होम पेज') || q.includes('शुरुआत') ||
    q.includes('హోమ్‌ పేజీ') || q.includes('ഹോം പേജ്') || q.includes('ಮುಖಪುಟ')
  ) {
    return {
      route: 'home',
      feedbackText: {
        en: 'Navigating back to Homepage.',
        ta: 'முகப்புப் பக்கத்திற்குத் திரும்புகிறேன்.',
        hi: 'होम पेज पर वापस ले जा रहा हूँ।',
        te: 'హోమ్‌ పేజీకి తిరిగి వెళ్తున్నాను.',
        ml: 'ഹോം പേജിലേക്ക് മടങ്ങുന്നു.',
        kn: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 12. Special Action: Scroll to Top
  if (
    q.includes('scroll to top') || q.includes('go to top') || q.includes('top of page') ||
    q.includes('மேலே செல்') || q.includes('மேலே போ') || q.includes('mela po') ||
    q.includes('ऊपर जाओ') || q.includes('పైకి వెళ్లండి') || q.includes('മുകളിലേക്ക്') || q.includes('ಮೇಲಕ್ಕೆ ಹೋಗಿ')
  ) {
    return {
      specialAction: 'scroll-top',
      feedbackText: {
        en: 'Scrolling smoothly to the top of the page.',
        ta: 'பக்கத்தின் உச்சிக்கு நகர்கிறேன்.',
        hi: 'पेज के सबसे ऊपर स्क्रॉल कर रहा हूँ।',
        te: 'పేజీ పైకి స్క్రోల్ చేస్తున్నాను.',
        ml: 'പേജിന്റെ മുകളിലേക്ക് സ്ക്രോൾ ചെയ്യുന്നു.',
        kn: 'ಪುಟದ ಮೇಲಕ್ಕೆ ಸ್ಕ್ರಾಲ್ ಮಾಡುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 13. Special Action: Call Clinic
  if (
    q.includes('call clinic') || q.includes('phone clinic') || q.includes('call doctor') || q.includes('dial number') ||
    q.includes('போன் பண்ணு') || q.includes('அழைப்பு செய்') || q.includes('call pannu') ||
    q.includes('कॉल करो') || q.includes('फोन लगाओ') ||
    q.includes('కాల్ చేయండి') || q.includes('വിളിക്കുക') || q.includes('ಕರೆ ಮಾಡಿ')
  ) {
    return {
      specialAction: 'call',
      feedbackText: {
        en: `Initiating call to Sindhu Clinic reception at ${CLINIC_CONFIG.phoneDisplay}.`,
        ta: `சிந்து கிளினிக் வரவேற்பறைக்கு (${CLINIC_CONFIG.phoneDisplay}) அழைப்பு விடுக்கிறேன்.`,
        hi: `सिंधु क्लीनिक रिसेप्शन (${CLINIC_CONFIG.phoneDisplay}) पर कॉल कनेक्ट कर रहा हूँ।`,
        te: `సింధు క్లినిక్ రిసెప్షన్‌కు కాల్ చేస్తున్నాను.`,
        ml: `സിന്ധു ക്ലിനിക്ക് റിസപ്ഷനിലേക്ക് വിളിക്കുന്നു.`,
        kn: `ಸಿಂಧು ಕ್ಲಿನಿಕ್ ರಿಸೆಪ್ಷನ್‌ಗೆ ಕರೆ ಮಾಡುತ್ತಿದ್ದೇನೆ.`
      }
    };
  }

  // 14. Special Action: WhatsApp Chat
  if (
    q.includes('open whatsapp') || q.includes('chat on whatsapp') || q.includes('send whatsapp') ||
    q.includes('வாட்ஸ்அப் திற') || q.includes('whatsapp open pannu') ||
    q.includes('व्हाट्सएप खोलो') || q.includes('వాట్సాప్') || q.includes('വാട്ട്സ്ആപ്പ്') || q.includes('ವಾಟ್ಸಾಪ್')
  ) {
    return {
      specialAction: 'whatsapp',
      feedbackText: {
        en: 'Opening official Sindhu Clinic WhatsApp desk chat.',
        ta: 'சிந்து கிளினிக் அதிகாரப்பூர்வ வாட்ஸ்அப் உரையாடலைத் திறக்கிறேன்.',
        hi: 'सिंधु क्लीनिक का आधिकारिक व्हाट्सएप चैट खोल रहा हूँ।',
        te: 'అధికారిక వాట్సాప్ డెస్క్‌ను తెరుస్తున్నాను.',
        ml: 'വാട്ട്സ്ആപ്പ് ഡെസ്ക് തുറക്കുന്നു.',
        kn: 'ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ಚಾಟ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  // 15. Hospital Enterprise Voice Commands
  if (
    q.includes('blood bank') || q.includes('blood stock') || q.includes('இரத்த வங்கி') || q.includes('blood bank open')
  ) {
    return {
      route: 'hms-bloodbank',
      feedbackText: {
        en: 'Opening the Blood Bank and Component Inventory ledger.',
        ta: 'இரத்த வங்கி மற்றும் ரத்தப் பகுதிப் பொருட்கள் பக்கத்திற்குச் செல்கிறேன்.',
        hi: 'ब्लड बैंक और कंपोनेंट इन्वेंटरी खोल रहा हूँ।',
        te: 'బ్లడ్ బ్యాంక్ పేజీని తెరుస్తున్నాను.',
        ml: 'ബ്ലഡ് ബാങ്ക് പേജ് തുറക്കുന്നു.',
        kn: 'ಬ್ಲಡ್ ಬ್ಯಾಂಕ್ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  if (
    q.includes('operation theatre') || q.includes('surgery') || q.includes('ot schedule') || q.includes('ஆபரேஷன் தியேட்டர்') || q.includes('அறுவை சிகிச்சை')
  ) {
    return {
      route: 'hms-ot',
      feedbackText: {
        en: 'Navigating to Operation Theatre & Surgical Suite management.',
        ta: 'அறுவை சிகிச்சை அரங்கம் மற்றும் ஓடி அட்டவணைப் பக்கத்திற்குச் செல்கிறேன்.',
        hi: 'ऑपरेशन थिएटर और सर्जरी शेड्यूल पेज खोल रहा हूँ।',
        te: 'ఆపరేషన్ థియేటర్ పేజీని తెరుస్తున్నాను.',
        ml: 'ഓപ്പറേഷൻ തിയേറ്റർ പേജിലേക്ക് പോകുന്നു.',
        kn: 'ಆಪರೇಷನ್ ಥಿಯೇಟರ್ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  if (
    q.includes('pathology') || q.includes('lab') || q.includes('laboratory') || q.includes('lis') || q.includes('பரிசோதனை கூடம்') || q.includes('லேப்')
  ) {
    return {
      route: 'hms-lis',
      feedbackText: {
        en: 'Opening Laboratory Information System (LIS) and pathology worklist.',
        ta: 'ஆய்வக தகவல் அமைப்பு (LIS) மற்றும் பரிசோதனை பணிப்பட்டியலைத் திறக்கிறேன்.',
        hi: 'पैथोलॉजी लैब और टेस्ट वर्कलिस्ट खोल रहा हूँ।',
        te: 'లాబొరేటరీ పేజీని తెరుస్తున్నాను.',
        ml: 'ലാബ് ഇൻഫർമേഷൻ സിസ്റ്റം തുറക്കുന്നു.',
        kn: 'ಪ್ರಯೋಗಾಲಯ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  if (
    q.includes('radiology') || q.includes('x-ray') || q.includes('ct scan') || q.includes('mri') || q.includes('படம் எடுத்தல்') || q.includes('எக்ஸ்ரே')
  ) {
    return {
      route: 'hms-ris',
      feedbackText: {
        en: 'Opening Radiology Information System (RIS) & PACS imaging hub.',
        ta: 'கதிரியக்கவியல் (RIS) மற்றும் இமேஜிங் மையத்திற்குச் செல்கிறேன்.',
        hi: 'रेडियोलॉजी और पीएसीएस इमेजिंग हब खोल रहा हूँ।',
        te: 'రేడియాలజీ పేజీని తెరుస్తున్నాను.',
        ml: 'റേഡിയോളജി സിസ്റ്റം തുറക്കുന്നു.',
        kn: 'ರೇಡಿಯಾಲಜಿ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  if (
    q.includes('emergency') || q.includes('trauma') || q.includes('ambulance') || q.includes('அவசர சிகிச்சை') || q.includes('ஆம்புலன்ஸ்')
  ) {
    return {
      route: 'hms-emergency',
      feedbackText: {
        en: 'Opening Emergency, Trauma Care & Ambulance Fleet hub.',
        ta: 'அவசர சிகிச்சை மற்றும் ஆம்புலன்ஸ் கண்காணிப்பு மையத்தைத் திறக்கிறேன்.',
        hi: 'इमरजेंसी, ट्रॉमा और एम्बुलेंस फ्लीट हब खोल रहा हूँ।',
        te: 'ఎమర్జెన్సీ మరియు అంబులెన్స్ పేజీని తెరుస్తున్నాను.',
        ml: 'എമർജൻസി കെയർ പേജ് തുറക്കുന്നു.',
        kn: 'ತುರ್ತು ಚಿಕಿತ್ಸಾ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  if (
    q.includes('pharmacy') || q.includes('medicine stock') || q.includes('மருந்து இருப்பு') || q.includes('மருந்தகம்') || q.includes('medicine')
  ) {
    return {
      route: 'erp-pharmacy',
      feedbackText: {
        en: 'Opening Pharmacy Inventory, GRN inflow, and drug formulary ledger.',
        ta: 'மருந்தக இருப்பு மற்றும் மருந்து வரவு-செலவு பதிவேட்டைத் திறக்கிறேன்.',
        hi: 'फार्मेसी इन्वेंटरी और दवा स्टॉक रजिस्टर खोल रहा हूँ।',
        te: 'ఫార్మసీ ఇన్వెంటరీ పేజీని తెరుస్తున్నాను.',
        ml: 'ഫാർമസി ഇൻവെന്ററി പേജ് തുറക്കുന്നു.',
        kn: 'ಫಾರ್ಮಸಿ ದಾಸ್ತಾನು ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  if (
    q.includes('payroll') || q.includes('salary') || q.includes('சம்பளம்') || q.includes('ஊதியம்')
  ) {
    return {
      route: 'hrms-payroll',
      feedbackText: {
        en: 'Navigating to Healthcare Payroll and compensation disbursement.',
        ta: 'மருத்துவமனை ஊழியர்கள் ஊதியப் பட்டியலுக்குச் செல்கிறேன்.',
        hi: 'हेल्थकेयर पेरोल और वेतन वितरण पेज खोल रहा हूँ।',
        te: 'పేరోల్ పేజీని తెరుస్తున్నాను.',
        ml: 'ശമ്പള മാനേജ്മെന്റ് പേജ് തുറക്കുന്നു.',
        kn: 'ವೇತನ ನಿರ್ವಹಣೆ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  if (
    q.includes('insurance') || q.includes('tpa') || q.includes('cashless') || q.includes('காப்பீடு') || q.includes('இன்சூரன்ஸ்')
  ) {
    return {
      route: 'erp-tpa-claims',
      feedbackText: {
        en: 'Opening TPA Cashless Insurance and Claims Management Desk.',
        ta: 'மருத்துவக் காப்பீடு மற்றும் கேஷ்லெஸ் அனுமதி மையத்தைத் திறக்கிறேன்.',
        hi: 'टीपीए इंश्योरेंस और कैशलेस क्लेम डेस्क खोल रहा हूँ।',
        te: 'ఇన్సూరెన్స్ క్లెయిమ్స్ పేజీని తెరుస్తున్నాను.',
        ml: 'ഇൻഷുറൻസ് ക്ലെയിംസ് പേജ് തുറക്കുന്നു.',
        kn: 'ವಿಮಾ ಕ್ಲೈಮ್ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  if (
    q.includes('incident') || q.includes('safety') || q.includes('விபத்து') || q.includes('பாதுகாப்பு அறிக்கை')
  ) {
    return {
      route: 'admin-incidents',
      feedbackText: {
        en: 'Opening Patient Safety Incident Reporting & CAPA desk.',
        ta: 'நோயாளி பாதுகாப்பு விபத்து பதிவு மற்றும் திருத்த நடவடிக்கை பக்கத்திற்குச் செல்கிறேன்.',
        hi: 'पेशेंट सेफ्टी इंसिडेंट और सीएपीए रिपोर्टिंग खोल रहा हूँ।',
        te: 'భద్రతా నివేదికల పేజీని తెరుస్తున్నాను.',
        ml: 'സുരക്ഷാ റിപ്പോർട്ടിംഗ് പേജ് തുറക്കുന്നു.',
        kn: 'ಸುರಕ್ಷತಾ ವರದಿ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.'
      }
    };
  }

  return null;
}

/**
 * Multilingual Q&A Generator supporting English, Tamil, Hindi, Telugu, Malayalam, and Kannada
 */
export function generateMultilingualAnswer(query: string, lang: SupportedLanguage): AssistantResponse {
  const q = query.toLowerCase();

  // First, check if the user is giving a website control command!
  const command = detectWebsiteCommand(query);
  if (command) {
    return {
      text: command.feedbackText[lang],
      spokenText: command.feedbackText[lang],
      commandExecuted: command.route ? `Opened: ${command.route}` : command.specialAction,
      actionButton: command.route ? {
        label: `Go to ${command.route.toUpperCase()} Page`,
        route: command.route
      } : command.specialAction === 'call' ? {
        label: `Call ${CLINIC_CONFIG.phoneDisplay}`,
        externalUrl: CLINIC_CONFIG.phoneCallValue
      } : command.specialAction === 'whatsapp' ? {
        label: 'Open WhatsApp Chat',
        externalUrl: CLINIC_CONFIG.whatsappUrl
      } : {
        label: 'Back to Top',
        specialAction: 'scroll-top'
      }
    };
  }

  // 1. Timings & Hours Query
  if (
    q.includes('time') || q.includes('timing') || q.includes('hour') || q.includes('open') || q.includes('sunday') ||
    q.includes('நேரம்') || q.includes('டைமிங்') || q.includes('neram') || q.includes('eppo open') || q.includes('eppothu') ||
    q.includes('समय') || q.includes('टाइम') || q.includes('कब खुलता') ||
    q.includes('సమయం') || q.includes('సమయాలు') || q.includes('സമയം') || q.includes('ಸಮಯ')
  ) {
    const responses: Record<SupportedLanguage, string> = {
      en: `Sindhu Clinic is open Monday to Saturday in two sessions: Morning (${CLINIC_CONFIG.timings.weekdayMorning}) and Evening (${CLINIC_CONFIG.timings.weekdayEvening}). On Sundays, we are open for morning consultations (${CLINIC_CONFIG.timings.sunday}).`,
      ta: `சிந்து கிளினிக் திங்கள் முதல் சனி வரை இரண்டு வேளைகளில் செயல்படுகிறது: காலை (${CLINIC_CONFIG.timings.weekdayMorning}) மற்றும் மாலை (${CLINIC_CONFIG.timings.weekdayEvening}). ஞாயிற்றுக்கிழமைகளில் காலை ஆலோசனை மட்டும் உண்டு (${CLINIC_CONFIG.timings.sunday}).`,
      hi: `सिंधु क्लीनिक सोमवार से शनिवार दो सत्रों में खुला रहता है: सुबह (${CLINIC_CONFIG.timings.weekdayMorning}) और शाम (${CLINIC_CONFIG.timings.weekdayEvening})। रविवार को केवल सुबह के समय परामर्श उपलब्ध है (${CLINIC_CONFIG.timings.sunday})।`,
      te: `సింధు క్లినిక్ సోమవారం నుండి శనివారం వరకు రెండు సెషన్లలో తెరిచి ఉంటుంది: ఉదయం (${CLINIC_CONFIG.timings.weekdayMorning}) మరియు సాయంత్రం (${CLINIC_CONFIG.timings.weekdayEvening}). ఆదివారం ఉదయం మాత్రమే అందుబాటులో ఉంటుంది.`,
      ml: `സിന്ധു ക്ലിനിക്ക് തിങ്കൾ മുതൽ ശനി വരെ രാവിലെയും (${CLINIC_CONFIG.timings.weekdayMorning}) വൈകുന്നേരവും (${CLINIC_CONFIG.timings.weekdayEvening}) പ്രവർത്തിക്കുന്നു. ഞായറാഴ്ച രാവിലെ മാത്രം.`,
      kn: `ಸಿಂಧು ಕ್ಲಿನಿಕ್ ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗೆ ಬೆಳಿಗ್ಗೆ (${CLINIC_CONFIG.timings.weekdayMorning}) ಮತ್ತು ಸಂಜೆ (${CLINIC_CONFIG.timings.weekdayEvening}) ತೆರೆದಿರುತ್ತದೆ. ಭಾನುವಾರ ಬೆಳಿಗ್ಗೆ ಮಾತ್ರ.`
    };

    return {
      text: responses[lang],
      spokenText: responses[lang],
      actionButton: {
        label: 'Book an Appointment',
        route: 'appointments'
      },
      suggestedFollowUps: [
        lang === 'ta' ? 'மருத்துவர் யார்?' : 'Who is the doctor?',
        lang === 'ta' ? 'கிளினிக் எங்குள்ளது?' : 'Where is the clinic located?',
        lang === 'ta' ? 'முன்பதிவு செய்வது எப்படி?' : 'How do I book an appointment?'
      ]
    };
  }

  // 2. Doctor Information Query
  if (
    q.includes('doctor') || q.includes('physician') || q.includes('qualification') || q.includes('experience') ||
    q.includes('மருத்துவர்') || q.includes('டாக்டர்') || q.includes('yaaru') || q.includes('doctor yaaru') ||
    q.includes('डॉक्टर') || q.includes('वैद्य') || q.includes('డాక్టర్') || q.includes('ഡോക്ടർ') || q.includes('ವೈದ್ಯರು')
  ) {
    const doc = DOCTORS[0];
    const responses: Record<SupportedLanguage, string> = {
      en: `Our primary consulting physician is ${doc.name} (${doc.qualifications}), specializing in ${doc.specialization} with ${doc.experienceYears} of clinical experience. The doctor emphasizes unhurried consultations and evidence-based care.`,
      ta: `எங்கள் முதன்மை மருத்துவர் ${doc.name} (${doc.qualifications}). இவர் ${doc.specialization} நிபுணர், ${doc.experienceYears} மருத்துவ அனுபவம் கொண்டவர். நோயாளிகளைப் பொறுமையுடன் கவனித்து ஆலோசனை வழங்குவார்.`,
      hi: `हमारे मुख्य परामर्श चिकित्सक ${doc.name} (${doc.qualifications}) हैं, जो ${doc.specialization} के विशेषज्ञ हैं और ${doc.experienceYears} का अनुभव रखते हैं। वे मरीजों को पूरा समय देकर सुनते हैं।`,
      te: `మా ప్రధాన కన్సల్టెంట్ ఫిజీషియన్ ${doc.name} (${doc.qualifications}), ${doc.specialization} నిపుణులు మరియు ${doc.experienceYears} అనుభవం కలిగి ఉన్నారు.`,
      ml: `ഞങ്ങളുടെ പ്രധാന ഫിസിഷ്യൻ ${doc.name} (${doc.qualifications}) ആണ്. ${doc.experienceYears} വർഷത്തെ പരിചയസമ്പന്നതയുണ്ട്.`,
      kn: `ನಮ್ಮ ಮುಖ್ಯ ಸಲಹಾ ವೈದ್ಯರು ${doc.name} (${doc.qualifications}), ${doc.experienceYears} ಕ್ಲಿನಿಕಲ್ ಅನುಭವ ಹೊಂದಿದ್ದಾರೆ.`
    };

    return {
      text: responses[lang],
      spokenText: responses[lang],
      actionButton: {
        label: 'View Doctor Profile',
        route: 'doctor'
      },
      suggestedFollowUps: [
        lang === 'ta' ? 'நேரம் என்ன?' : 'What are the consultation hours?',
        lang === 'ta' ? 'முன்பதிவு செய்' : 'Book consultation with doctor'
      ]
    };
  }

  // 3. Appointment Booking Query
  if (
    q.includes('appointment') || q.includes('book') || q.includes('slot') || q.includes('token') ||
    q.includes('முன்பதிவு') || q.includes('பதிவு') || q.includes('book panradhu') || q.includes('eppadi') ||
    q.includes('अपॉइंटमेंट') || q.includes('बुकिंग') || q.includes('అపాయింట్‌మెంట్') || q.includes('അപ്പോയിന്റ്മെന്റ്')
  ) {
    const responses: Record<SupportedLanguage, string> = {
      en: `You can easily request a consultation appointment online right on our website! Fill in the quick form with your contact details, and our front desk will confirm your slot. You can also book via WhatsApp.`,
      ta: `எங்கள் இணையதளத்தில் நீங்கள் எளிதாக முன்பதிவு செய்யலாம்! உங்கள் பெயர், தொலைபேசி எண் மற்றும் விரும்பிய தேதியைத் தேர்ந்தெடுத்து சமர்ப்பிக்கவும். வரவேற்பறை உடனடியாக உறுதி செய்யும். வாட்ஸ்அப் மூலமாகவும் பதிவு செய்யலாம்.`,
      hi: `आप हमारी वेबसाइट पर बहुत आसानी से अपॉइंटमेंट बुक कर सकते हैं! बस अपना नाम, फोन नंबर और तारीख दर्ज करें। रिसेप्शन से तुरंत पुष्टि मिल जाएगी।`,
      te: `మీరు మా వెబ్‌సైట్‌లో సులభంగా అపాయింట్‌మెంట్ బుక్ చేసుకోవచ్చు. పేరు, ఫోన్ నంబర్ ఇవ్వండి, మా డెస్క్ నిర్ధారిస్తుంది.`,
      ml: `ഞങ്ങളുടെ വെബ്സൈറ്റിൽ വളരെ എളുപ്പത്തിൽ അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യാം. വാട്ട്സ്ആപ്പ് വഴിയും ബുക്ക് ചെയ്യാം.`,
      kn: `ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ನೀವು ಸುಲಭವಾಗಿ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಬಹುದು. ವಾಟ್ಸಾಪ್ ಮೂಲಕವೂ ಸಾಧ್ಯವಿದೆ.`
    };

    return {
      text: responses[lang],
      spokenText: responses[lang],
      actionButton: {
        label: 'Go to Appointment Page',
        route: 'appointments'
      },
      suggestedFollowUps: [
        lang === 'ta' ? 'நேரம் என்ன?' : 'Clinic consultation timings?',
        lang === 'ta' ? 'வாட்ஸ்அப் மூலமாக தொடர்பு கொள்' : 'Chat on WhatsApp'
      ]
    };
  }

  // 4. Services / Diseases Query
  if (
    q.includes('service') || q.includes('treatment') || q.includes('fever') || q.includes('diabetes') || q.includes('bp') || q.includes('sugar') ||
    q.includes('சேவை') || q.includes('சிகிச்சை') || q.includes('காய்ச்சல்') || q.includes('சர்க்கரை') || q.includes('kaachal') || q.includes('maruthuvam') ||
    q.includes('सेवा') || q.includes('बुखार') || q.includes('डायबिटीज') || q.includes('సేవలు') || q.includes('സേവനങ്ങൾ')
  ) {
    const responses: Record<SupportedLanguage, string> = {
      en: `Sindhu Clinic offers 12 clinical services: General Consultation, Diabetes & Metabolic Care, Hypertension Management, Preventive Health Screenings, Seasonal Infection Care, Senior Care, and Women's Health.`,
      ta: `சிந்து கிளினிக் 12 சிறப்பு சேவைகளை வழங்குகிறது: பொது மருத்துவம், சர்க்கரை நோய் மேலாண்மை, உயர் இரத்த அழுத்த சிகிச்சை, காய்ச்சல் மற்றும் பருவகால தொற்றுகள், முதியோர் நலம் மற்றும் முழு உடல் பரிசோதனை.`,
      hi: `सिंधु क्लीनिक 12 स्वास्थ्य सेवाएं प्रदान करता है: सामान्य परामर्श, मधुमेह (शुगर) देखभाल, उच्च रक्तचाप, मौसमी बुखार और संक्रमण, वरिष्ठ नागरिक देखभाल और प्रिवेंटिव हेल्थ चेकअप।`,
      te: `సింధు క్లినిక్ జనరల్ కన్సల్టేషన్, డయాబెటిస్, బీపీ, జ్వరాలు మరియు ప్రివెంటివ్ హెల్త్ చెకప్ సహా 12 సేవలను అందిస్తుంది.`,
      ml: `ജനറൽ കൺസൾട്ടേഷൻ, പ്രമേഹം, പ്രഷർ, പനി, സീനിയർ കെയർ എന്നിവയുൾപ്പെടെ 12 മെഡിക്കൽ സേവനങ്ങൾ ലഭ്യമാണ്.`,
      kn: `ಜನರಲ್ ಕನ್ಸಲ್ಟೇಶನ್, ಮಧುಮೇಹ, ಬಿಪಿ, ಜ್ವರ ಮತ್ತು ತಪಾಸಣೆ ಸೇರಿದಂತೆ 12 ಸೇವೆಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.`
    };

    return {
      text: responses[lang],
      spokenText: responses[lang],
      actionButton: {
        label: '🩺 Explore All 12 Services',
        route: 'services'
      },
      suggestedFollowUps: [
        lang === 'ta' ? 'முன்பதிவு செய்' : 'Book a consultation',
        lang === 'ta' ? 'ரத்த பரிசோதனை உண்டா?' : 'Do you offer blood tests?'
      ]
    };
  }

  // 5. Location / Address Query
  if (
    q.includes('location') || q.includes('address') || q.includes('where') || q.includes('map') ||
    q.includes('இடம்') || q.includes('முகவரி') || q.includes('எங்கே') || q.includes('enga irukku') || q.includes('edam') ||
    q.includes('कहाँ') || q.includes('पता') || q.includes('లొకేషన్') || q.includes('സ്ഥലം')
  ) {
    const responses: Record<SupportedLanguage, string> = {
      en: `Sindhu Clinic is situated at ${CLINIC_CONFIG.address.line1}, ${CLINIC_CONFIG.address.line2}, ${CLINIC_CONFIG.address.city}. We feature ground-floor wheelchair ramp access and dedicated parking.`,
      ta: `சிந்து கிளினிக் அமைவிடம்: ${CLINIC_CONFIG.address.line1}, ${CLINIC_CONFIG.address.line2}, ${CLINIC_CONFIG.address.city}. தரைதளத்தில் சக்கர நாற்காலி சாய்தள வசதி மற்றும் வாகன நிறுத்துமிடம் உள்ளது.`,
      hi: `सिंधु क्लीनिक ${CLINIC_CONFIG.address.line1}, ${CLINIC_CONFIG.address.line2}, ${CLINIC_CONFIG.address.city} में स्थित है। यहाँ व्हीलचेयर रैंप और पार्किंग सुविधा उपलब्ध है।`,
      te: `సింధు క్లినిక్ ${CLINIC_CONFIG.address.city} లో ఉంది. వీల్‌చైర్ ర్యాంప్ మరియు పార్కింగ్ సదుపాయం ఉంది.`,
      ml: `സിന്ധു ക്ലിനിക്ക് ${CLINIC_CONFIG.address.city} ൽ സ്ഥിതി ചെയ്യുന്നു. വീൽചെയർ റാംപും പാർക്കിംഗും ഉണ്ട്.`,
      kn: `ಸಿಂಧು ಕ್ಲಿನಿಕ್ ${CLINIC_CONFIG.address.city} ನಲ್ಲಿದೆ. ಗಾಲಿಕುರ್ಚಿ ಇಳಿಜಾರು ಮತ್ತು ಪಾರ್ಕಿಂಗ್ ಇದೆ.`
    };

    return {
      text: responses[lang],
      spokenText: responses[lang],
      actionButton: {
        label: 'Open Contact & Map Page',
        route: 'contact'
      },
      suggestedFollowUps: [
        lang === 'ta' ? 'போன் பண்ணு' : 'Call reception now',
        lang === 'ta' ? 'நேரம் என்ன?' : 'Clinic consultation timings?'
      ]
    };
  }

  // 6. Blood tests / Diagnostics Query
  if (
    q.includes('blood') || q.includes('test') || q.includes('lab') || q.includes('diagnostic') ||
    q.includes('ரத்த பரிசோதனை') || q.includes('லேப்') || q.includes('டெஸ்ட்') || q.includes('blood test irukka') ||
    q.includes('खून की जांच') || q.includes('लैब') || q.includes('బ్లడ్ టెస్ట్')
  ) {
    const responses: Record<SupportedLanguage, string> = {
      en: `Yes! We provide on-site sample collection for routine blood and urine investigations supported by accredited partner laboratories. Reports are conveniently delivered to your WhatsApp or Email.`,
      ta: `ஆம்! அங்கீகரிக்கப்பட்ட ஆய்வகங்களின் ஆதரவுடன் இரத்த மற்றும் சிறுநீர் மாதிரி சேகரிப்பு எங்கள் கிளினிக்கில் செய்யப்படுகிறது. பரிசோதனை முடிவுகள் வாட்ஸ்அப் அல்லது மின்னஞ்சல் மூலம் நேரடியாக அனுப்பப்படும்.`,
      hi: `हाँ! हमारे यहाँ नियमित रक्त और यूरिन जांच के लिए सैंपल कलेक्शन सुविधा उपलब्ध है। रिपोर्ट सीधे आपके व्हाट्सएप या ईमेल पर भेजी जाती है।`,
      te: `అవును! రక్త మరియు మూత్ర పరీక్షల కోసం ఆన్-సైట్ శాంపిల్ కలెక్షన్ ఉంది. రిపోర్టులు వాట్సాప్‌లో పంపబడతాయి.`,
      ml: `അതെ! രക്തപരിശോധനകൾക്കായി സാമ്പിൾ കളക്ഷൻ സൗകര്യമുണ്ട്. റിപ്പോർട്ടുകൾ വാട്ട്സ്ആപ്പിൽ ലഭിക്കും.`,
      kn: `ಹೌದು! ರಕ್ತ ಮತ್ತು ಮೂತ್ರ ಪರೀಕ್ಷೆಗಳ ಸ್ಯಾಂಪಲ್ ಕಲೆಕ್ಷನ್ ಇದೆ. ವರದಿಗಳನ್ನು ವಾಟ್ಸಾಪ್‌ಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.`
    };

    return {
      text: responses[lang],
      spokenText: responses[lang],
      actionButton: {
        label: 'View Clinic Facilities',
        route: 'facilities'
      }
    };
  }

  // 7. General Fallback
  const fallbacks: Record<SupportedLanguage, string> = {
    en: `I am here to help you! You can ask me about doctor availability, timings, services, or give voice commands like "Book appointment", "Show doctor", or "Call clinic".`,
    ta: `உங்களுக்கு உதவ நான் தயாராக உள்ளேன்! நீங்கள் "முன்பதிவு செய்", "டாக்டர் விவரம்", "நேரம் என்ன?", "சேவைகள் காட்டு" அல்லது "போன் பண்ணு" என்று குரல் மூலமாகவோ தட்டச்சு செய்தோ இணையதளத்தைக் கட்டுப்படுத்தலாம்.`,
    hi: `मैं आपकी मदद के लिए यहाँ हूँ! आप मुझसे क्लीनिक के समय, डॉक्टर या सेवाओं के बारे में पूछ सकते हैं, या "अपॉइंटमेंट बुक करो", "डॉक्टर दिखाओ" जैसे वॉयस कमांड दे सकते हैं।`,
    te: `నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను! అపాయింట్‌మెంట్, డాక్టర్, సమయాల గురించి అడగవచ్చు.`,
    ml: `നിങ്ങളെ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്! സമയം, ഡോക്ടർ, സേവനങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.`,
    kn: `ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಾನಿದ್ದೇನೆ! ಅಪಾಯಿಂಟ್ಮೆಂಟ್, ವೈದ್ಯರು, ಸಮಯದ ಬಗ್ಗೆ ಕೇಳಬಹುದು.`
  };

  return {
    text: fallbacks[lang],
    spokenText: fallbacks[lang],
    actionButton: {
      label: lang === 'ta' ? 'முன்பதிவு பக்கத்திற்குச் செல்' : 'Book an Appointment',
      route: 'appointments'
    },
    suggestedFollowUps: [
      lang === 'ta' ? 'நேரம் என்ன?' : 'What are the consultation hours?',
      lang === 'ta' ? 'டாக்டர் யார்?' : 'Who is the doctor?',
      lang === 'ta' ? 'முன்பதிவு செய்' : 'Book an appointment',
      lang === 'ta' ? 'சேவைகள் காட்டு' : 'Show all services'
    ]
  };
}
