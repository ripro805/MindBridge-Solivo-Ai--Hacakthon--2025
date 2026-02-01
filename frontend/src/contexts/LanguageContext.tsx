import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.checkin': 'Check-in',
    'nav.dashboard': 'Dashboard',
    'nav.support': 'Support',
    'nav.admin': 'Admin',
    'nav.settings': 'Settings',
    'nav.signout': 'Sign Out',
    
    // Landing
    'landing.title': 'MindBridge',
    'landing.subtitle': 'Your Private Mental Wellness Companion',
    'landing.description': 'AI-powered early detection and support for mental health, designed with privacy and cultural sensitivity for Bangladesh.',
    'landing.getStarted': 'Get Started',
    'landing.learnMore': 'Learn More',
    'landing.features.title': 'Features',
    'landing.features.private': 'Privacy First',
    'landing.features.private.desc': 'Your data stays yours. On-device processing, encrypted storage, and full control over your information.',
    'landing.features.multimodal': 'Multimodal Check-ins',
    'landing.features.multimodal.desc': 'Express yourself through text journaling, voice recordings, or optional video check-ins.',
    'landing.features.insights': 'Personalized Insights',
    'landing.features.insights.desc': 'Track your mood trends over time with simple, actionable insights and support resources.',
    'landing.features.bilingual': 'Bilingual Support',
    'landing.features.bilingual.desc': 'Full support in Bangla and English, with culturally relevant content and guidance.',
    
    // Auth
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.phone': 'Phone',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.haveAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.consent.title': 'Privacy & Consent',
    'auth.consent.welcome': 'Welcome to MindBridge',
    'auth.consent.description': 'Before you begin, please review and accept our privacy practices.',
    'auth.consent.point1': 'Your data is encrypted and stored securely',
    'auth.consent.point2': 'You can delete your data at any time',
    'auth.consent.point3': 'Video recordings are never stored on servers',
    'auth.consent.point4': 'We do not share your personal information',
    'auth.consent.optional': 'Optional: Help improve our AI models by sharing anonymous, aggregated data',
    'auth.consent.accept': 'I Accept & Continue',
    'auth.consent.decline': 'Decline',
    'auth.consent.disclaimer': 'This app is not a substitute for professional medical advice, diagnosis, or treatment.',
    
    // Check-in
    'checkin.title': 'Daily Check-in',
    'checkin.subtitle': 'How are you feeling today?',
    'checkin.quick': '1-Minute Check-in',
    'checkin.text.title': 'Journal Entry',
    'checkin.text.placeholder': 'Write about your day, feelings, or anything on your mind...',
    'checkin.text.short': 'Short Mode',
    'checkin.text.long': 'Long Mode',
    'checkin.voice.title': 'Voice Check-in',
    'checkin.voice.subtitle': 'Record up to 90 seconds',
    'checkin.voice.start': 'Start Recording',
    'checkin.voice.stop': 'Stop Recording',
    'checkin.voice.transcript': 'Transcript will appear here...',
    'checkin.video.title': 'Video Expression (Optional)',
    'checkin.video.subtitle': 'Record a 30-second video',
    'checkin.video.privacy': 'Videos are analyzed on your device and never stored on servers',
    'checkin.video.start': 'Start Video',
    'checkin.video.stop': 'Stop Video',
    'checkin.submit': 'Submit Check-in',
    'checkin.submitting': 'Analyzing...',
    'checkin.success': 'Check-in submitted successfully!',
    'checkin.ondevice': 'Use On-Device Processing',
    
    // Dashboard
    'dashboard.title': 'Your Dashboard',
    'dashboard.currentScore': 'Current Wellness Score',
    'dashboard.riskLevel': 'Risk Level',
    'dashboard.risk.low': 'Low',
    'dashboard.risk.medium': 'Medium',
    'dashboard.risk.high': 'High',
    'dashboard.trends': 'Mood Trends',
    'dashboard.days7': 'Last 7 Days',
    'dashboard.days30': 'Last 30 Days',
    'dashboard.timeline': 'Recent Check-ins',
    'dashboard.noData': 'No check-ins yet. Start your first check-in to see your dashboard.',
    
    // Support
    'support.title': 'Support & Resources',
    'support.immediate': 'Immediate Support',
    'support.breathing.title': 'Breathing Exercise',
    'support.breathing.desc': 'Take a moment to calm your mind',
    'support.breathing.start': 'Start Exercise',
    'support.mindfulness.title': 'Guided Mindfulness',
    'support.mindfulness.desc': '5-minute guided meditation',
    'support.mindfulness.start': 'Begin',
    'support.helplines.title': 'Get Professional Help',
    'support.helplines.national': 'National Mental Health Helpline',
    'support.helplines.kaan': 'Kaan Pete Roi (Listening Service)',
    'support.helplines.shuni': 'Shuni.org Crisis Support',
    'support.teleconsult': 'Schedule Teleconsultation',
    'support.emergency': 'In case of emergency, please call 999 or visit your nearest hospital.',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.metrics': 'Pilot Metrics',
    'admin.activeUsers': 'Active Users',
    'admin.totalCheckins': 'Total Check-ins',
    'admin.flaggedUsers': 'Flagged for Follow-up',
    'admin.cohortTrends': 'Cohort Trends',
    'admin.anonymous': 'All data is aggregated and anonymous',
    
    // Settings
    'settings.title': 'Settings',
    'settings.privacy': 'Privacy & Data',
    'settings.dataSharing': 'Share Anonymous Data',
    'settings.dataSharing.desc': 'Help improve our AI models',
    'settings.exportData': 'Export My Data',
    'settings.deleteData': 'Delete All My Data',
    'settings.language': 'Language',
    'settings.signout': 'Sign Out',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.checkin': 'চেক-ইন',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.support': 'সহায়তা',
    'nav.admin': 'অ্যাডমিন',
    'nav.settings': 'সেটিংস',
    'nav.signout': 'সাইন আউট',
    
    // Landing
    'landing.title': 'মাইন্ডব্রিজ',
    'landing.subtitle': 'আপনার ব্যক্তিগত মানসিক স্বাস্থ্য সহায়ক',
    'landing.description': 'গোপনীয়তা এবং সাংস্কৃতিক সংবেদনশীলতার সাথে বাংলাদেশের জন্য ডিজাইন করা AI-চালিত প্রাথমিক সনাক্তকরণ এবং মানসিক স্বাস্থ্য সহায়তা।',
    'landing.getStarted': 'শুরু করুন',
    'landing.learnMore': 'আরও জানুন',
    'landing.features.title': 'বৈশিষ্ট্য',
    'landing.features.private': 'গোপনীয়তা প্রথম',
    'landing.features.private.desc': 'আপনার তথ্য আপনার থাকে। ডিভাইসে প্রসেসিং, এনক্রিপ্ট করা স্টোরেজ এবং আপনার তথ্যের সম্পূর্ণ নিয়ন্ত্রণ।',
    'landing.features.multimodal': 'মাল্টিমোডাল চেক-ইন',
    'landing.features.multimodal.desc': 'টেক্সট জার্নালিং, ভয়েস রেকর্ডিং বা ঐচ্ছিক ভিডিও চেক-ইনের মাধ্যমে নিজেকে প্রকাশ করুন।',
    'landing.features.insights': 'ব্যক্তিগত অন্তর্দৃষ্টি',
    'landing.features.insights.desc': 'সহজ, কার্যকরী অন্তর্দৃষ্টি এবং সহায়তা সম্পদের সাথে সময়ের সাথে আপনার মেজাজের প্রবণতা ট্র্যাক করুন।',
    'landing.features.bilingual': 'দ্বিভাষিক সহায়তা',
    'landing.features.bilingual.desc': 'সাংস্কৃতিকভাবে প্রাসঙ্গিক বিষয়বস্তু এবং নির্দেশনা সহ বাংলা এবং ইংরেজিতে সম্পূর্ণ সহায়তা।',
    
    // Auth
    'auth.signin': 'সাইন ইন',
    'auth.signup': 'সাইন আপ',
    'auth.email': 'ইমেইল',
    'auth.phone': 'ফোন',
    'auth.password': 'পাসওয়ার্ড',
    'auth.confirmPassword': 'পাসওয়ার্ড নিশ্চিত করুন',
    'auth.haveAccount': 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
    'auth.noAccount': 'অ্যাকাউন্ট নেই?',
    'auth.consent.title': 'গোপনীয়তা এবং সম্মতি',
    'auth.consent.welcome': 'মাইন্ডব্রিজে স্বাগতম',
    'auth.consent.description': 'শুরু করার আগে, আমাদের গোপনীয়তা অনুশীলন পর্যালোচনা এবং গ্রহণ করুন।',
    'auth.consent.point1': 'আপনার ডেটা এনক্রিপ্ট করা এবং নিরাপদে সংরক্ষিত',
    'auth.consent.point2': 'আপনি যে কোনো সময় আপনার ডেটা মুছে ফেলতে পারেন',
    'auth.consent.point3': 'ভিডিও রেকর্ডিং কখনো সার্ভারে সংরক্ষণ করা হয় না',
    'auth.consent.point4': 'আমরা আপনার ব্যক্তিগত তথ্য শেয়ার করি না',
    'auth.consent.optional': 'ঐচ্ছিক: বেনামী, একত্রিত ডেটা শেয়ার করে আমাদের AI মডেল উন্নত করতে সাহায্য করুন',
    'auth.consent.accept': 'আমি গ্রহণ করি এবং চালিয়ে যাই',
    'auth.consent.decline': 'প্রত্যাখ্যান',
    'auth.consent.disclaimer': 'এই অ্যাপ্লিকেশন পেশাদার চিকিৎসা পরামর্শ, নির্ণয় বা চিকিৎসার বিকল্প নয়।',
    
    // Check-in
    'checkin.title': 'দৈনিক চেক-ইন',
    'checkin.subtitle': 'আজ আপনার মন কেমন?',
    'checkin.quick': '১-মিনিট চেক-ইন',
    'checkin.text.title': 'জার্নাল এন্ট্রি',
    'checkin.text.placeholder': 'আপনার দিন, অনুভূতি বা মনে যা কিছু আছে তা লিখুন...',
    'checkin.text.short': 'সংক্ষিপ্ত মোড',
    'checkin.text.long': 'দীর্ঘ মোড',
    'checkin.voice.title': 'ভয়েস চেক-ইন',
    'checkin.voice.subtitle': '৯০ সেকেন্ড পর্যন্ত রেকর্ড করুন',
    'checkin.voice.start': 'রেকর্ডিং শুরু করুন',
    'checkin.voice.stop': 'রেকর্ডিং বন্ধ করুন',
    'checkin.voice.transcript': 'ট্রান্সক্রিপ্ট এখানে দেখা যাবে...',
    'checkin.video.title': 'ভিডিও এক্সপ্রেশন (ঐচ্ছিক)',
    'checkin.video.subtitle': '৩০-সেকেন্ডের একটি ভিডিও রেকর্ড করুন',
    'checkin.video.privacy': 'ভিডিওগুলি আপনার ডিভাইসে বিশ্লেষণ করা হয় এবং কখনও সার্ভারে সংরক্ষণ করা হয় না',
    'checkin.video.start': 'ভিডিও শুরু করুন',
    'checkin.video.stop': 'ভিডিও বন্ধ করুন',
    'checkin.submit': 'চেক-ইন জমা দিন',
    'checkin.submitting': 'বিশ্লেষণ করা হচ্ছে...',
    'checkin.success': 'চেক-ইন সফলভাবে জমা দেওয়া হয়েছে!',
    'checkin.ondevice': 'ডিভাইসে প্রসেসিং ব্যবহার করুন',
    
    // Dashboard
    'dashboard.title': 'আপনার ড্যাশবোর্ড',
    'dashboard.currentScore': 'বর্তমান সুস্থতা স্কোর',
    'dashboard.riskLevel': 'ঝুঁকি স্তর',
    'dashboard.risk.low': 'কম',
    'dashboard.risk.medium': 'মাঝারি',
    'dashboard.risk.high': 'উচ্চ',
    'dashboard.trends': 'মেজাজের প্রবণতা',
    'dashboard.days7': 'শেষ ৭ দিন',
    'dashboard.days30': 'শেষ ৩০ দিন',
    'dashboard.timeline': 'সাম্প্রতিক চেক-ইন',
    'dashboard.noData': 'এখনো কোনো চেক-ইন নেই। আপনার ড্যাশবোর্ড দেখতে প্রথম চেক-ইন শুরু করুন।',
    
    // Support
    'support.title': 'সহায়তা এবং সম্পদ',
    'support.immediate': 'তাৎক্ষণিক সহায়তা',
    'support.breathing.title': 'শ্বাস-প্রশ্বাসের ব্যায়াম',
    'support.breathing.desc': 'আপনার মনকে শান্ত করতে একটু সময় নিন',
    'support.breathing.start': 'ব্যায়াম শুরু করুন',
    'support.mindfulness.title': 'গাইডেড মাইন্ডফুলনেস',
    'support.mindfulness.desc': '৫-মিনিট গাইডেড মেডিটেশন',
    'support.mindfulness.start': 'শুরু করুন',
    'support.helplines.title': 'পেশাদার সাহায্য পান',
    'support.helplines.national': 'জাতীয় মানসিক স্বাস্থ্য হেল্পলাইন',
    'support.helplines.kaan': 'কান পেতে রই (শ্রবণ সেবা)',
    'support.helplines.shuni': 'শুনি.অর্গ সংকট সহায়তা',
    'support.teleconsult': 'টেলিকনসালটেশন সময়সূচী করুন',
    'support.emergency': 'জরুরী অবস্থায়, অনুগ্রহ করে ৯৯৯ কল করুন বা আপনার নিকটতম হাসপাতালে যান।',
    
    // Admin
    'admin.title': 'অ্যাডমিন ড্যাশবোর্ড',
    'admin.metrics': 'পাইলট মেট্রিক্স',
    'admin.activeUsers': 'সক্রিয় ব্যবহারকারী',
    'admin.totalCheckins': 'মোট চেক-ইন',
    'admin.flaggedUsers': 'ফলো-আপের জন্য ফ্ল্যাগ করা',
    'admin.cohortTrends': 'কোহর্ট ট্রেন্ডস',
    'admin.anonymous': 'সমস্ত ডেটা সমষ্টিগত এবং বেনামী',
    
    // Settings
    'settings.title': 'সেটিংস',
    'settings.privacy': 'গোপনীয়তা এবং ডেটা',
    'settings.dataSharing': 'বেনামী ডেটা শেয়ার করুন',
    'settings.dataSharing.desc': 'আমাদের AI মডেল উন্নত করতে সাহায্য করুন',
    'settings.exportData': 'আমার ডেটা রপ্তানি করুন',
    'settings.deleteData': 'আমার সমস্ত ডেটা মুছুন',
    'settings.language': 'ভাষা',
    'settings.signout': 'সাইন আউট',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('mindbridge-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('mindbridge-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
