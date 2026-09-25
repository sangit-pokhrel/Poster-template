/** Growth ads: study abroad, training, offers, trust, tips & engagement, brand & contact. */
import type { AdCategory, AdContent, AdDefinition, AdKind } from '../../types/template';

const ad = (category: AdCategory) => (id: string, name: string, kind: AdKind, content: AdContent): AdDefinition => ({ id, name, category, kind, content });

/* ------------------------------------------------------------------ */
/* Study Abroad & Scholarships                                         */
/* ------------------------------------------------------------------ */

const abroad = ad('abroad');

export const ABROAD: AdDefinition[] = [
  abroad('abroad-sop', 'SOP Writing', 'hero', {
    eyebrow: 'Study abroad',
    heading: 'An *SOP* that gets you admitted',
    sub: 'Personal, specific and tailored to every university you apply to.',
    cta: 'Write my SOP',
    photo: 'travel',
  }),
  abroad('abroad-documents', 'Application Documents', 'services', {
    eyebrow: 'Application kit',
    heading: 'Every document your *application* needs',
    items: [
      { icon: 'pen', title: 'SOP & personal statement', text: 'Your story, told convincingly.' },
      { icon: 'mail', title: 'Recommendation letters', text: 'LOR drafts for your referees.' },
      { icon: 'doc', title: 'Academic CV', text: 'Europass & research CVs.' },
      { icon: 'award', title: 'Scholarship essays', text: 'Fully funded applications.' },
      { icon: 'flask', title: 'Research proposals', text: 'For PhD & MPhil admissions.' },
      { icon: 'chat', title: 'Interview prep', text: 'Mock interviews & feedback.' },
    ],
    cta: 'Start my application',
  }),
  abroad('abroad-scholarship', 'Fully Funded Scholarship', 'announcement', {
    eyebrow: 'Scholarship alert',
    heading: '*Fully funded* scholarships now open',
    body: 'Erasmus Mundus, DAAD, MEXT, Chevening and more — tuition, stipend and travel covered. We help you prepare a winning application.',
    sub: 'Free eligibility check this week',
    cta: 'Check my eligibility',
  }),
  abroad('abroad-deadline', 'Scholarship Deadline', 'deadline', {
    eyebrow: 'Scholarship deadline',
    number: '10',
    numberLabel: 'Days left',
    heading: 'Applications close in *10 days*',
    sub: 'SOP, CV and LORs reviewed within 48 hours.',
    cta: 'Apply before it closes',
  }),
  abroad('abroad-steps', 'Admission Roadmap', 'steps', {
    eyebrow: 'Admission roadmap',
    heading: 'Your path to a *foreign university*',
    items: [
      { icon: 'search', title: 'Shortlist universities', text: 'Programmes that match your profile.' },
      { icon: 'pen', title: 'Prepare documents', text: 'SOP, CV, LORs and transcripts.' },
      { icon: 'plane', title: 'Apply & get admitted', text: 'Submission, interviews and offers.' },
    ],
    cta: 'Plan my admission',
  }),
  abroad('abroad-checklist', 'Application Checklist', 'checklist', {
    eyebrow: 'Don’t miss a thing',
    heading: 'Study abroad *checklist*',
    bullets: ['IELTS / TOEFL / Duolingo score', 'SOP tailored to each programme', '2–3 recommendation letters', 'Academic CV', 'Transcripts & certificates'],
    cta: 'Review my documents',
    photo: 'campus',
  }),
  abroad('abroad-success', 'Admission Success Story', 'testimonial', {
    eyebrow: 'Admitted!',
    quote: '“I got into a *fully funded Master’s in Germany*. My SOP went through five drafts and every one got better.”',
    person: { name: 'Sujata Tamang', role: 'MSc Data Science, Germany', photo: 'portraitWoman2' },
  }),
  abroad('abroad-sop-tip', 'SOP Tip', 'tip', {
    eyebrow: 'SOP tip',
    number: '06',
    heading: 'Open your SOP with a *moment*, not a quote',
    body: 'Admissions committees read hundreds of SOPs that start with famous quotes. Start with a specific moment that sparked your interest — then connect it to the programme.',
  }),
  abroad('abroad-admits', 'Admits This Year', 'stat', {
    eyebrow: 'This year',
    number: '85',
    numberLabel: 'Students admitted abroad',
    heading: 'From Nepal to universities *worldwide*',
    items: [
      { icon: 'globe', title: '12', text: 'Countries' },
      { icon: 'award', title: '30+', text: 'Scholarships won' },
      { icon: 'school', title: '60+', text: 'Universities' },
    ],
  }),
];

/* ------------------------------------------------------------------ */
/* Workshops & Training                                                */
/* ------------------------------------------------------------------ */

const training = ad('training');

export const TRAINING: AdDefinition[] = [
  training('train-webinar', 'Free Webinar', 'event', {
    badge: 'Free webinar',
    heading: 'How to write a *literature review* that flows',
    number: '12',
    numberLabel: 'Oct',
    when: 'Saturday · 7:00 PM (NPT)',
    where: 'Live on Zoom',
    person: { name: 'Dr. Ramesh Adhikari', role: 'Research methodology trainer', photo: 'portraitMan' },
    cta: 'Register free',
  }),
  training('train-spss', 'SPSS Training', 'hero', {
    eyebrow: 'Hands-on training',
    heading: 'Master *SPSS* in 5 weekends',
    sub: 'Data entry to regression — with your own thesis data.',
    cta: 'Enroll now',
    badge: 'NEW',
    photo: 'online',
  }),
  training('train-course', 'Research Methodology Course', 'services', {
    eyebrow: 'Online course',
    heading: 'Research methodology, *made practical*',
    items: [
      { icon: 'target', title: 'Research design', text: 'Qual, quant & mixed methods.' },
      { icon: 'users', title: 'Sampling', text: 'Size, technique and bias.' },
      { icon: 'list', title: 'Questionnaires', text: 'Scales, validity, reliability.' },
      { icon: 'bars', title: 'Analysis basics', text: 'Choose the right test.' },
    ],
    cta: 'Join the course',
  }),
  training('train-workshop', 'Thesis Writing Workshop', 'event', {
    badge: 'Workshop',
    heading: 'Thesis writing *bootcamp* weekend',
    number: '26',
    numberLabel: 'Oct',
    when: 'Sat–Sun · 10 AM – 4 PM',
    where: 'Kathmandu · limited seats',
    person: { name: 'Senior research mentors', role: 'Proposal to final chapter in 2 days', photo: 'portraitWoman2' },
    cta: 'Book my seat',
  }),
  training('train-seats', 'Seats Filling Fast', 'deadline', {
    eyebrow: 'Registration closing',
    number: '8',
    numberLabel: 'Seats left',
    heading: 'Research methods batch starts *Sunday*',
    sub: 'Live classes · recordings · certificate',
    cta: 'Reserve my seat',
  }),
  training('train-curriculum', 'Course Curriculum', 'steps', {
    eyebrow: '4-week curriculum',
    heading: 'What you’ll learn in *4 weeks*',
    items: [
      { icon: 'book', title: 'Week 1 · Research basics', text: 'Problems, questions and objectives.' },
      { icon: 'flask', title: 'Week 2 · Methodology', text: 'Design, sampling and tools.' },
      { icon: 'bars', title: 'Week 3 · Data analysis', text: 'SPSS hands-on sessions.' },
      { icon: 'pen', title: 'Week 4 · Academic writing', text: 'Chapters, citations, publishing.' },
    ],
    cta: 'Enroll today',
  }),
  training('train-certificate', 'Certified Course', 'checklist', {
    eyebrow: 'What’s included',
    heading: 'Learn, practise, *get certified*',
    bullets: ['Live interactive classes', 'Lifetime access to recordings', 'Practice datasets & templates', 'Certificate of completion', 'Private support group'],
    cta: 'Join the next batch',
    photo: 'seminar',
  }),
  training('train-review', 'Training Testimonial', 'testimonial', {
    eyebrow: 'Course review',
    quote: '“I finally understand *which test to use and why*. I analysed my entire thesis dataset myself after the course.”',
    person: { name: 'Bikash Gurung', role: 'MPH student, BPKIHS', photo: 'portraitMan2' },
  }),
];

/* ------------------------------------------------------------------ */
/* Offers & Packages                                                   */
/* ------------------------------------------------------------------ */

const offers = ad('offers');

export const OFFERS: AdDefinition[] = [
  offers('offer-dashain', 'Dashain Offer', 'offer', {
    eyebrow: 'Dashain special',
    heading: 'Dashain offer on *all services*',
    badge: '25%\nOFF',
    price: 'From Rs 2,999',
    oldPrice: 'Valid until Tihar',
    bullets: ['Thesis & proposal writing', 'Data analysis', 'Editing & plagiarism check'],
    cta: 'Claim Dashain offer',
    photo: 'mountains',
  }),
  offers('offer-tihar', 'Tihar Festive Deal', 'offer', {
    eyebrow: 'Tihar festive deal',
    heading: 'Light up your *research* this Tihar',
    badge: '30%\nOFF',
    price: 'From Rs 2,799',
    oldPrice: 'On bookings made during Tihar',
    bullets: ['Free Turnitin report', 'Priority delivery', 'Free consultation call'],
    cta: 'Book with discount',
    photo: 'coffee',
  }),
  offers('offer-package', 'Complete Thesis Package', 'offer', {
    eyebrow: 'Best value',
    heading: 'Complete *thesis package*',
    badge: 'SAVE\n40%',
    price: 'Rs 24,999',
    oldPrice: 'Worth Rs 41,000 separately',
    bullets: ['Proposal + all chapters', 'SPSS / NVivo analysis', 'Plagiarism report & formatting', 'Defence slides'],
    cta: 'Get the package',
    photo: 'graduation',
  }),
  offers('offer-student', 'Student Discount', 'offer', {
    eyebrow: 'Student discount',
    heading: 'Show your *student ID*, save 15%',
    badge: '15%\nOFF',
    price: 'From Rs 849',
    oldPrice: 'Valid for Bachelor’s students',
    bullets: ['Assignments & reports', 'Internship reports', 'Presentations'],
    cta: 'Claim student discount',
    photo: 'students',
  }),
  offers('offer-referral', 'Refer a Friend', 'announcement', {
    eyebrow: 'Refer & earn',
    heading: 'Refer a friend, *both get Rs 500 off*',
    body: 'Share {brand} with a classmate. When they book any service, you both get Rs 500 off your next order.',
    sub: 'No limit on referrals',
    cta: 'Share with a friend',
  }),
  offers('offer-free-consult', 'Free Consultation', 'hero', {
    eyebrow: 'Free for this week',
    heading: 'Free *30-minute* research consultation',
    sub: 'Topic, method or analysis questions — ask an expert, no obligation.',
    cta: 'Book my free call',
    badge: 'FREE',
    photo: 'handshake',
  }),
  offers('offer-flash', 'Flash Sale', 'deadline', {
    eyebrow: 'Flash sale',
    number: '48',
    numberLabel: 'Hours only',
    heading: '*Half price* on proofreading & formatting',
    sub: 'Book before the timer runs out.',
    cta: 'Grab the deal',
  }),
  offers('offer-plans', 'Service Plans', 'compare', {
    eyebrow: 'Choose your plan',
    heading: 'Pick the help *you need*',
    compare: {
      leftTitle: 'Basic · Rs 4,999',
      left: ['Proposal review', 'Formatting', 'Turnitin report', 'Email support'],
      rightTitle: 'Premium · Rs 14,999',
      right: ['Full chapter guidance', 'Data analysis', 'Unlimited revisions', 'Mentor calls'],
    },
    cta: 'Choose a plan',
  }),
  offers('offer-new-year', 'New Year Offer', 'hero', {
    eyebrow: 'Naya Barsha 2083',
    heading: 'New year, *new research goals*',
    sub: 'Start your thesis this month with 20% off every service.',
    cta: 'Start the year right',
    badge: '20%\nOFF',
    photo: 'coffee',
  }),
];

/* ------------------------------------------------------------------ */
/* Reviews & Results                                                   */
/* ------------------------------------------------------------------ */

const trust = ad('trust');

export const TRUST: AdDefinition[] = [
  trust('trust-review-1', 'Student Review', 'testimonial', {
    eyebrow: 'Student review',
    quote: '“They helped me *finish my thesis in six weeks* when I had almost given up. Clear, patient and always on time.”',
    person: { name: 'Aarav Shrestha', role: 'MSc Microbiology, Tribhuvan University', photo: 'portraitMan' },
  }),
  trust('trust-review-2', 'Researcher Review', 'testimonial', {
    eyebrow: 'Researcher review',
    quote: '“Their SEM analysis was *journal-ready*. The reviewers accepted our model without a single change.”',
    person: { name: 'Dr. Sarita Joshi', role: 'Public health researcher', photo: 'portraitWoman' },
  }),
  trust('trust-numbers', 'Our Impact', 'stat', {
    eyebrow: 'Our impact',
    number: '2,000+',
    numberLabel: 'Students helped',
    heading: 'Trusted by students and researchers *across Nepal*',
    items: [
      { icon: 'star', title: '4.9★', text: 'Facebook rating' },
      { icon: 'award', title: '150+', text: 'Papers published' },
      { icon: 'clock', title: '5 yrs', text: 'Experience' },
    ],
  }),
  trust('trust-why', 'Why Choose Us', 'services', {
    eyebrow: 'Why {brand}',
    heading: 'Why students *choose us*',
    items: [
      { icon: 'users', title: 'PhD-level experts', text: 'Researchers in every field.' },
      { icon: 'lock', title: '100% confidential', text: 'Your work stays yours.' },
      { icon: 'shield', title: 'Plagiarism-free', text: 'Turnitin report included.' },
      { icon: 'refresh', title: 'Free revisions', text: 'Until you are satisfied.' },
      { icon: 'clock', title: 'On-time delivery', text: 'Deadlines are sacred.' },
      { icon: 'chat', title: '24/7 support', text: 'Reply within the hour.' },
    ],
    cta: 'Work with us',
  }),
  trust('trust-guarantee', 'Our Guarantee', 'checklist', {
    eyebrow: 'Our promise',
    heading: 'Our *guarantee* to every student',
    bullets: ['Original work, every time', 'Confidential & secure', 'Deadline met or money back', 'Unlimited revisions', 'Expert in your subject'],
    cta: 'Get started safely',
    photo: 'handshake',
  }),
  trust('trust-before-after', 'Before & After', 'compare', {
    eyebrow: 'Real results',
    heading: 'What changes when *you work with us*',
    compare: {
      leftTitle: 'Before',
      left: ['Rejected proposal', '32% similarity', 'Confusing analysis', 'Missed deadline'],
      rightTitle: 'After',
      right: ['Approved first time', 'Under 10% similarity', 'Clear findings', 'Submitted early'],
    },
    cta: 'Get these results',
  }),
  trust('trust-graduated', 'Congratulations Graduates', 'announcement', {
    eyebrow: 'Congratulations',
    heading: 'Congratulations to our *2083 graduates*',
    body: 'Proud of every student who defended, published and graduated with {brand} this year. Your hard work paid off.',
    sub: 'Tag a graduate below 🎓',
    cta: 'Celebrate with us',
  }),
  trust('trust-rating', '5-Star Rated', 'hero', {
    eyebrow: 'Rated 4.9 on Facebook',
    heading: 'Hundreds of *5-star* reviews',
    sub: 'See why students recommend {brand} to their friends.',
    cta: 'Read our reviews',
    badge: '★ 4.9',
    photo: 'graduationSky',
  }),
];

/* ------------------------------------------------------------------ */
/* Tips & Engagement                                                   */
/* ------------------------------------------------------------------ */

const tips = ad('tips');

export const TIPS: AdDefinition[] = [
  tips('tip-literature', 'Literature Review Tip', 'tip', {
    eyebrow: 'Thesis tip',
    number: '01',
    heading: 'Write your literature review like a *conversation*',
    body: 'Group studies by theme, not by author. Show where researchers agree, where they disagree — and where the gap for your study begins.',
  }),
  tips('tip-abstract', 'Abstract Tip', 'tip', {
    eyebrow: 'Writing tip',
    number: '02',
    heading: 'The *5-sentence* abstract formula',
    bullets: ['Context: why the topic matters', 'Gap: what is unknown', 'Method: what you did', 'Result: what you found', 'Impact: why it matters'],
  }),
  tips('tip-productivity', 'Productivity Tip', 'tip', {
    eyebrow: 'Productivity tip',
    number: '03',
    heading: 'Write *300 words* a day',
    body: 'A 15,000-word thesis is just 50 days of 300 words. Small daily progress beats weekend marathons — and your supervisor will notice.',
  }),
  tips('tip-sampling', 'Sampling Tip', 'tip', {
    eyebrow: 'Methods tip',
    number: '04',
    heading: 'How big should your *sample* be?',
    bullets: ['Use Cochran’s or Yamane’s formula', 'Add 10% for non-response', 'Justify it in your methodology', 'Qualitative: stop at saturation'],
  }),
  tips('tip-quote-einstein', 'Research Quote', 'quote', {
    quote: 'If we knew what it was we were doing, it would not be called *research*, would it?',
    author: 'Albert Einstein',
    sub: 'Keep going — confusion is part of the process.',
  }),
  tips('tip-quote-motivation', 'Motivation Quote', 'quote', {
    quote: 'A thesis is never finished. It is *submitted*.',
    author: 'Every graduate student',
    sub: 'Done is better than perfect. We can help you get there.',
  }),
  tips('tip-myths', 'Research Myths', 'compare', {
    eyebrow: 'Myth vs fact',
    heading: 'Research myths, *busted*',
    compare: {
      leftTitle: 'Myth',
      left: ['More pages = better marks', 'Quotes show good research', 'Big samples are always better', 'Write the intro first'],
      rightTitle: 'Fact',
      right: ['Clarity wins marks', 'Your analysis matters more', 'Right sample beats big sample', 'Write the intro last'],
    },
    cta: 'Follow for more tips',
  }),
  tips('tip-tools', 'Free Research Tools', 'services', {
    eyebrow: 'Save this post',
    heading: 'Free tools every *researcher* needs',
    items: [
      { icon: 'book', title: 'Zotero', text: 'Free reference manager.' },
      { icon: 'search', title: 'Google Scholar', text: 'Find papers & citations.' },
      { icon: 'globe', title: 'Research Rabbit', text: 'Map related studies.' },
      { icon: 'pen', title: 'Grammarly', text: 'Catch grammar slips.' },
    ],
    cta: 'Follow for more',
  }),
  tips('tip-exam-season', 'Thesis Season Reminder', 'announcement', {
    eyebrow: 'Reminder',
    heading: 'Thesis season is here — *start early*',
    body: 'Most students lose 3–4 weeks at the start choosing a topic. Book a free topic session and start writing this week.',
    sub: 'Free topic sessions every Friday',
    cta: 'Book a topic session',
  }),
];

/* ------------------------------------------------------------------ */
/* Brand & Contact                                                     */
/* ------------------------------------------------------------------ */

const brand = ad('brand');

export const BRAND: AdDefinition[] = [
  brand('brand-contact', 'Contact Us', 'contact', {
    eyebrow: 'Contact us',
    heading: 'We’re here to *help you research*',
    sub: 'Reach us any time — we usually reply within an hour.',
    items: [
      { icon: 'phone', title: 'Call / WhatsApp {phone}' },
      { icon: 'mail', title: 'Email {email}' },
      { icon: 'chat', title: 'Message our Facebook page' },
    ],
    cta: 'Say hello',
    photo: 'mountains',
  }),
  brand('brand-intro', 'About Us', 'hero', {
    eyebrow: 'Meet {brand}',
    heading: 'Your *research partner* from proposal to publication',
    sub: '{tagline}',
    cta: 'Learn more',
    photo: 'team',
  }),
  brand('brand-hiring', 'We Are Hiring', 'announcement', {
    eyebrow: 'We’re hiring',
    heading: 'Join our team of *research writers*',
    body: 'Looking for Master’s and MPhil graduates in management, health, social science and IT who love academic writing. Remote & part-time roles available.',
    sub: 'Send your CV by 30 Kartik',
    cta: 'Apply now',
  }),
  brand('brand-open', 'Now Open Everyday', 'contact', {
    eyebrow: 'Always open',
    heading: 'Open *7 days a week*',
    sub: 'Morning, evening or weekend — talk to a mentor when it suits you.',
    items: [
      { icon: 'clock', title: 'Sun–Sat · 8 AM – 8 PM' },
      { icon: 'pin', title: 'Kathmandu, Nepal' },
      { icon: 'globe', title: 'Online across Nepal & abroad' },
    ],
    cta: 'Book an appointment',
    photo: 'mountains',
  }),
  brand('brand-process', 'How We Work', 'steps', {
    eyebrow: 'How we work',
    heading: 'Getting help is *this simple*',
    items: [
      { icon: 'chat', title: 'Message us your requirement', text: 'Topic, level and deadline.' },
      { icon: 'money', title: 'Get a fair quote', text: 'Transparent pricing, no hidden fees.' },
      { icon: 'pen', title: 'We work, you review', text: 'Regular updates and drafts.' },
      { icon: 'checkCircle', title: 'Receive final files', text: 'Plus free revisions.' },
    ],
    cta: 'Message us',
  }),
  brand('brand-followers', 'Thank You Followers', 'stat', {
    eyebrow: 'Thank you',
    number: '10K',
    numberLabel: 'Followers & growing',
    heading: 'Thank you for learning *with us*',
    items: [
      { icon: 'heart', title: '10K', text: 'Followers' },
      { icon: 'chat', title: '5K+', text: 'Questions answered' },
      { icon: 'star', title: '4.9', text: 'Page rating' },
    ],
  }),
];
