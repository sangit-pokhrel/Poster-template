/** Service ads: thesis, proposal, data analysis, publication, editing, assignments. */
import type { AdCategory, AdContent, AdDefinition, AdKind } from '../../types/template';

const ad = (category: AdCategory) => (id: string, name: string, kind: AdKind, content: AdContent): AdDefinition => ({ id, name, category, kind, content });

/* ------------------------------------------------------------------ */
/* Thesis & Dissertation                                               */
/* ------------------------------------------------------------------ */

const thesis = ad('thesis');

export const THESIS: AdDefinition[] = [
  thesis('thesis-support', 'Thesis Writing Support', 'hero', {
    eyebrow: 'Thesis support',
    heading: 'Finish your thesis with *expert guidance*',
    sub: 'Bachelor, Master’s & MPhil — from topic to final defence.',
    cta: 'Book a free consultation',
    photo: 'notes',
  }),
  thesis('thesis-services', 'Complete Thesis Services', 'services', {
    eyebrow: 'What we do',
    heading: 'Everything your *thesis* needs',
    items: [
      { icon: 'target', title: 'Topic selection', text: 'Researchable, relevant and approved faster.' },
      { icon: 'book', title: 'Literature review', text: 'Structured, synthesised and properly cited.' },
      { icon: 'flask', title: 'Methodology', text: 'Design, sampling and tools that hold up.' },
      { icon: 'bars', title: 'Data analysis', text: 'SPSS, R, STATA or NVivo with clear output.' },
      { icon: 'pen', title: 'Writing & editing', text: 'Chapters that read clearly and flow.' },
      { icon: 'shield', title: 'Plagiarism check', text: 'Turnitin report before you submit.' },
    ],
    cta: 'Start your thesis',
  }),
  thesis('thesis-chapters', 'Chapter-by-Chapter Help', 'steps', {
    eyebrow: 'How it works',
    heading: 'Your thesis, *one chapter* at a time',
    items: [
      { icon: 'chat', title: 'Share your topic & guidelines', text: 'Send your university format and supervisor notes.' },
      { icon: 'list', title: 'Get a clear chapter plan', text: 'Timeline and outline agreed before writing starts.' },
      { icon: 'pen', title: 'Review drafts as we write', text: 'Unlimited feedback rounds on every chapter.' },
      { icon: 'checkCircle', title: 'Submit with confidence', text: 'Formatted, referenced and plagiarism-checked.' },
    ],
    cta: 'Plan my thesis',
  }),
  thesis('thesis-deadline', 'Submission Deadline Alert', 'deadline', {
    eyebrow: 'Submission deadline',
    number: '15',
    numberLabel: 'Days left',
    heading: 'Thesis submission window is *closing soon*',
    sub: 'Still stuck on analysis or formatting? We can help this week.',
    cta: 'Get urgent help',
  }),
  thesis('thesis-checklist', 'Before You Submit Checklist', 'checklist', {
    eyebrow: 'Final check',
    heading: 'Is your thesis *ready to submit?*',
    bullets: ['Title, abstract and keywords finalised', 'APA / university formatting applied', 'All sources cited and referenced', 'Plagiarism below the required limit', 'Supervisor approval signed'],
    cta: 'Get a final review',
    photo: 'desk',
  }),
  thesis('thesis-defense', 'Viva / Defence Preparation', 'hero', {
    eyebrow: 'Viva preparation',
    heading: 'Walk into your *defence* ready',
    sub: 'Mock viva, slide design and the 25 questions examiners always ask.',
    cta: 'Book a mock viva',
    badge: 'NEW',
    photo: 'seminar',
  }),
  thesis('thesis-mphil-phd', 'MPhil & PhD Dissertations', 'announcement', {
    eyebrow: 'Now accepting',
    heading: 'MPhil & PhD *dissertation* mentoring',
    body: 'One-to-one guidance from experienced researchers for proposals, methodology, analysis and journal-ready chapters.',
    sub: 'Limited seats each month',
    cta: 'Apply for mentoring',
  }),
  thesis('thesis-stuck', 'Stuck on Your Thesis?', 'compare', {
    eyebrow: 'Sound familiar?',
    heading: 'Stuck on your thesis? *We get it.*',
    compare: {
      leftTitle: 'Going it alone',
      left: ['Weeks lost choosing a topic', 'Unclear methodology', 'Confusing SPSS output', 'Last-minute formatting panic'],
      rightTitle: 'With {brand}',
      right: ['Topic approved in days', 'A method that fits', 'Results explained simply', 'Submission-ready files'],
    },
    cta: 'Get unstuck today',
  }),
  thesis('thesis-results', 'Theses Completed', 'stat', {
    eyebrow: 'Our track record',
    number: '500+',
    numberLabel: 'Theses guided',
    heading: 'Students across Nepal trust us with their *research*',
    items: [
      { icon: 'school', title: '40+', text: 'Universities & colleges' },
      { icon: 'star', title: '4.9★', text: 'Average rating' },
      { icon: 'clock', title: '98%', text: 'On-time delivery' },
    ],
  }),
  thesis('thesis-contact', 'Talk to a Thesis Mentor', 'contact', {
    eyebrow: 'Free consultation',
    heading: 'Talk to a *thesis mentor* today',
    sub: 'Tell us your topic — we reply within an hour.',
    items: [
      { icon: 'chat', title: 'Message our Facebook page' },
      { icon: 'phone', title: 'Call / WhatsApp {phone}' },
      { icon: 'pin', title: 'Visit us in Kathmandu' },
    ],
    cta: 'Message us now',
    photo: 'mountains',
  }),
];

/* ------------------------------------------------------------------ */
/* Research Proposal                                                   */
/* ------------------------------------------------------------------ */

const proposal = ad('proposal');

export const PROPOSAL: AdDefinition[] = [
  proposal('proposal-writing', 'Research Proposal Writing', 'hero', {
    eyebrow: 'Research proposals',
    heading: 'Get your proposal *approved first time*',
    sub: 'Clear problem statement, objectives and a method your committee will accept.',
    cta: 'Write my proposal',
    photo: 'writing',
  }),
  proposal('proposal-structure', 'Proposal Structure', 'steps', {
    eyebrow: 'Proposal blueprint',
    heading: 'A winning proposal in *4 parts*',
    items: [
      { icon: 'target', title: 'Problem & objectives', text: 'A focused gap your study will fill.' },
      { icon: 'book', title: 'Literature & framework', text: 'The theory that frames your questions.' },
      { icon: 'flask', title: 'Methodology', text: 'Design, sample, tools and analysis plan.' },
      { icon: 'calendar', title: 'Timeline & budget', text: 'Realistic Gantt chart and costs.' },
    ],
    cta: 'Start my proposal',
  }),
  proposal('proposal-topics', 'Topic Selection Help', 'services', {
    eyebrow: 'Topic selection',
    heading: 'Find a research topic that *works*',
    items: [
      { icon: 'search', title: 'Gap analysis', text: 'What recent studies have missed.' },
      { icon: 'bulb', title: '3 tailored topics', text: 'Matched to your field and interest.' },
      { icon: 'checkCircle', title: 'Feasibility check', text: 'Data access, time and scope.' },
      { icon: 'doc', title: 'Concept note', text: 'One page to share with your supervisor.' },
    ],
    cta: 'Get topic ideas',
  }),
  proposal('proposal-mistakes', 'Proposal Mistakes', 'tip', {
    eyebrow: 'Proposal tip',
    number: '05',
    heading: 'Mistakes that get proposals *rejected*',
    bullets: ['Objectives that don’t match the questions', 'A literature review with no clear gap', 'Sampling that can’t answer the question', 'No ethics or consent plan', 'Unrealistic timeline'],
  }),
  proposal('proposal-deadline', 'Proposal Defence Soon', 'deadline', {
    eyebrow: 'Proposal defence',
    number: '7',
    numberLabel: 'Days to go',
    heading: 'Proposal defence *next week?*',
    sub: 'Slides, rehearsal and committee Q&A — sorted in 48 hours.',
    cta: 'Prepare my defence',
  }),
  proposal('proposal-grant', 'Grant & Funding Proposals', 'announcement', {
    eyebrow: 'New service',
    heading: 'Grant & *funding proposals*',
    body: 'UGC, NAST and international research grants — we help you write proposals that reviewers score highly.',
    sub: 'For faculty, researchers and NGOs',
    cta: 'Discuss your grant',
  }),
  proposal('proposal-checklist', 'Proposal Checklist', 'checklist', {
    eyebrow: 'Before you submit',
    heading: 'Proposal *checklist*',
    bullets: ['Clear, specific research title', 'SMART objectives', 'Operational definitions', 'Sample size justified', 'References in APA 7th'],
    cta: 'Review my proposal',
    photo: 'notes',
  }),
];

/* ------------------------------------------------------------------ */
/* Data Analysis                                                       */
/* ------------------------------------------------------------------ */

const analysis = ad('analysis');

export const ANALYSIS: AdDefinition[] = [
  analysis('analysis-spss', 'SPSS Data Analysis', 'hero', {
    eyebrow: 'Data analysis',
    heading: 'SPSS analysis, *explained simply*',
    sub: 'Descriptives, t-tests, ANOVA, regression — with tables written up for your thesis.',
    cta: 'Send your data',
    photo: 'analytics',
  }),
  analysis('analysis-tools', 'Analysis Tools We Use', 'services', {
    eyebrow: 'Our toolkit',
    heading: 'Every *statistics tool* you need',
    items: [
      { icon: 'bars', title: 'SPSS', text: 'Surveys, tests and regression.' },
      { icon: 'code', title: 'R & Python', text: 'Advanced models and visualisation.' },
      { icon: 'trend', title: 'STATA & EViews', text: 'Econometrics and time series.' },
      { icon: 'layers', title: 'AMOS & SmartPLS', text: 'SEM and path analysis.' },
      { icon: 'chat', title: 'NVivo', text: 'Qualitative coding and themes.' },
      { icon: 'pie', title: 'Excel dashboards', text: 'Clean charts for reports.' },
    ],
    cta: 'Get a quote',
  }),
  analysis('analysis-process', 'From Raw Data to Results', 'steps', {
    eyebrow: 'Our process',
    heading: 'From raw data to *results chapter*',
    items: [
      { icon: 'doc', title: 'Clean & code', text: 'Missing values, outliers and variable coding.' },
      { icon: 'bars', title: 'Run the right tests', text: 'Chosen for your design and hypotheses.' },
      { icon: 'pen', title: 'Write the interpretation', text: 'APA tables with plain-language meaning.' },
    ],
    cta: 'Analyse my data',
  }),
  analysis('analysis-sem', 'SEM & Advanced Models', 'announcement', {
    eyebrow: 'Advanced analysis',
    heading: 'SEM, *mediation & moderation* made clear',
    body: 'Structural equation modelling in AMOS or SmartPLS with model fit, path diagrams and write-up ready for journals.',
    sub: 'Master’s, MPhil and PhD research',
    cta: 'Book an analyst',
  }),
  analysis('analysis-qualitative', 'Qualitative Analysis', 'services', {
    eyebrow: 'Qualitative research',
    heading: 'Turn interviews into *clear themes*',
    items: [
      { icon: 'mic', title: 'Transcription', text: 'Nepali & English interviews.' },
      { icon: 'translate', title: 'Translation', text: 'Accurate Nepali → English.' },
      { icon: 'layers', title: 'Thematic coding', text: 'NVivo or manual coding.' },
      { icon: 'doc', title: 'Findings chapter', text: 'Themes with quotations.' },
    ],
    cta: 'Discuss your study',
  }),
  analysis('analysis-mistakes', 'Stats Mistakes', 'tip', {
    eyebrow: 'Stats tip',
    number: '03',
    heading: 'Check these before running *any test*',
    bullets: ['Is your data normally distributed?', 'Are your groups independent?', 'Is the sample big enough for the test?'],
  }),
  analysis('analysis-express', '48-Hour Analysis', 'offer', {
    eyebrow: 'Express service',
    heading: 'Results in *48 hours*',
    badge: '48h',
    price: 'Rs 3,999',
    oldPrice: 'Standard delivery 5–7 days',
    bullets: ['Up to 10 variables', 'APA tables & charts', 'Written interpretation'],
    cta: 'Order express',
    photo: 'analytics',
  }),
  analysis('analysis-questionnaire', 'Questionnaire Design', 'checklist', {
    eyebrow: 'Survey design',
    heading: 'Build a questionnaire that *works*',
    bullets: ['Validated scales & Likert items', 'Pilot test & reliability (Cronbach’s α)', 'Google Forms / KoBo setup', 'Sample size calculation'],
    cta: 'Design my survey',
    photo: 'online',
  }),
  analysis('analysis-count', 'Datasets Analysed', 'stat', {
    eyebrow: 'By the numbers',
    number: '1,200+',
    numberLabel: 'Datasets analysed',
    heading: 'Accurate analysis, *explained in plain words*',
    items: [
      { icon: 'bars', title: '15+', text: 'Statistical tools' },
      { icon: 'clock', title: '48h', text: 'Express turnaround' },
      { icon: 'refresh', title: 'Free', text: 'Revisions included' },
    ],
  }),
];

/* ------------------------------------------------------------------ */
/* Publication & Journals                                              */
/* ------------------------------------------------------------------ */

const publication = ad('publication');

export const PUBLICATION: AdDefinition[] = [
  publication('pub-journal', 'Journal Publication Support', 'hero', {
    eyebrow: 'Publication support',
    heading: 'Publish in *peer-reviewed* journals',
    sub: 'Manuscript preparation, journal selection and response to reviewers.',
    cta: 'Publish my paper',
    photo: 'reader',
  }),
  publication('pub-journey', 'Thesis to Journal Article', 'steps', {
    eyebrow: 'From thesis to paper',
    heading: 'Turn your thesis into a *journal article*',
    items: [
      { icon: 'doc', title: 'Condense & restructure', text: 'IMRaD format, 5,000–7,000 words.' },
      { icon: 'search', title: 'Pick the right journal', text: 'Scope, indexing and fees checked.' },
      { icon: 'pen', title: 'Polish & format', text: 'Author guidelines and cover letter.' },
      { icon: 'chat', title: 'Handle reviews', text: 'Point-by-point responses.' },
    ],
    cta: 'Start publishing',
  }),
  publication('pub-scopus', 'Scopus & WoS Indexed', 'announcement', {
    eyebrow: 'Indexed journals',
    heading: 'Target *Scopus & Web of Science* journals',
    body: 'We shortlist genuine indexed journals for your field — and help you avoid predatory publishers.',
    sub: 'Journal list delivered in 24 hours',
    cta: 'Get my journal list',
  }),
  publication('pub-predatory', 'Avoid Predatory Journals', 'tip', {
    eyebrow: 'Publishing tip',
    number: '04',
    heading: 'Signs of a *predatory journal*',
    bullets: ['Guaranteed acceptance in days', 'Fake or missing impact factor', 'Spam emails inviting your paper', 'Editorial board you can’t verify'],
  }),
  publication('pub-services', 'Publication Services', 'services', {
    eyebrow: 'Publication services',
    heading: 'Everything to get your paper *accepted*',
    items: [
      { icon: 'search', title: 'Journal selection', text: 'Indexed, in-scope, affordable.' },
      { icon: 'pen', title: 'Manuscript editing', text: 'Academic English and flow.' },
      { icon: 'doc', title: 'Formatting', text: 'Journal template and references.' },
      { icon: 'mail', title: 'Cover letter', text: 'Written for the editor.' },
      { icon: 'chat', title: 'Reviewer response', text: 'Clear rebuttal letters.' },
      { icon: 'award', title: 'Conference papers', text: 'Abstracts and full papers.' },
    ],
    cta: 'Talk to an editor',
  }),
  publication('pub-accepted', 'Papers Accepted', 'stat', {
    eyebrow: 'Publication record',
    number: '150+',
    numberLabel: 'Papers accepted',
    heading: 'Research by our clients in *national & international* journals',
    items: [
      { icon: 'globe', title: '60+', text: 'International journals' },
      { icon: 'award', title: 'Q1–Q4', text: 'Scopus quartiles' },
      { icon: 'users', title: '20+', text: 'Disciplines' },
    ],
  }),
  publication('pub-review', 'Paper Accepted Testimonial', 'testimonial', {
    eyebrow: 'Published!',
    quote: '“My first paper was accepted in a Scopus journal after *two rounds* of review. Their reviewer responses were excellent.”',
    person: { name: 'Dr. Anish Karki', role: 'Assistant Professor, Kathmandu University', photo: 'portraitMan2' },
    number: '★★★★★',
  }),
  publication('pub-conference', 'Conference Paper Support', 'event', {
    badge: 'Call for papers',
    heading: 'Submit to the *national research conference*',
    number: '30',
    numberLabel: 'Nov',
    when: 'Abstract deadline · 30 November',
    where: 'Kathmandu · Hybrid',
    person: { name: 'Our editorial team', role: 'Abstract review & full-paper formatting', photo: 'portraitWoman2' },
    cta: 'Prepare my abstract',
  }),
  publication('pub-rejected', 'Paper Rejected?', 'compare', {
    eyebrow: 'Rejected again?',
    heading: 'Turn a *rejection* into an acceptance',
    compare: {
      leftTitle: 'Common reasons',
      left: ['Out of the journal’s scope', 'Weak novelty statement', 'Poor English', 'Formatting ignored'],
      rightTitle: 'What we fix',
      right: ['Better-fit journal', 'Sharper contribution', 'Professional editing', 'Guidelines followed'],
    },
    cta: 'Resubmit with us',
  }),
];

/* ------------------------------------------------------------------ */
/* Editing & Plagiarism                                                */
/* ------------------------------------------------------------------ */

const editing = ad('editing');

export const EDITING: AdDefinition[] = [
  editing('edit-proofreading', 'Academic Proofreading', 'hero', {
    eyebrow: 'Proofreading',
    heading: 'Polished English, *zero errors*',
    sub: 'Grammar, clarity and academic tone — track changes included.',
    cta: 'Proofread my work',
    photo: 'notes',
  }),
  editing('edit-turnitin', 'Turnitin Plagiarism Check', 'offer', {
    eyebrow: 'Plagiarism check',
    heading: 'Official *Turnitin report* in 1 hour',
    badge: '1 HR',
    price: 'Rs 499',
    oldPrice: 'Per document · up to 20,000 words',
    bullets: ['Similarity report PDF', 'No repository storage', 'Guidance on reducing %'],
    cta: 'Check my file',
    photo: 'laptop',
  }),
  editing('edit-reduction', 'Plagiarism Reduction', 'compare', {
    eyebrow: 'Similarity too high?',
    heading: 'From *35%* to under *10%*',
    compare: {
      leftTitle: 'Before',
      left: ['Copied sentences', 'Missing citations', 'Over-quoted sources', 'Rejected by college'],
      rightTitle: 'After',
      right: ['Rewritten in your voice', 'Every source cited', 'Balanced quotations', 'Accepted first time'],
    },
    cta: 'Reduce my similarity',
  }),
  editing('edit-formatting', 'APA Formatting', 'checklist', {
    eyebrow: 'APA 7th edition',
    heading: 'Perfect *formatting*, every page',
    bullets: ['Title page & headings', 'In-text citations & reference list', 'Tables and figures numbered', 'Table of contents & page numbers', 'University template applied'],
    cta: 'Format my document',
    photo: 'books',
  }),
  editing('edit-services', 'Editing Services', 'services', {
    eyebrow: 'Editing services',
    heading: 'Writing that reads *like a pro*',
    items: [
      { icon: 'pen', title: 'Proofreading', text: 'Grammar and spelling.' },
      { icon: 'refresh', title: 'Paraphrasing', text: 'Original wording, same meaning.' },
      { icon: 'shield', title: 'Plagiarism check', text: 'Turnitin with report.' },
      { icon: 'list', title: 'Referencing', text: 'APA, Harvard, IEEE, MLA.' },
    ],
    cta: 'Send your document',
  }),
  editing('edit-citation-tip', 'Citation Tip', 'tip', {
    eyebrow: 'Referencing tip',
    number: '02',
    heading: 'Stop losing marks on *citations*',
    body: 'Cite every idea you did not create — not just direct quotes. Paraphrased ideas, figures, statistics and definitions all need an in-text citation and a matching reference.',
  }),
  editing('edit-urgent', '24-Hour Editing', 'deadline', {
    eyebrow: 'Urgent editing',
    number: '24',
    numberLabel: 'Hour turnaround',
    heading: 'Deadline tomorrow? *We’re on it.*',
    sub: 'Priority proofreading for theses, reports and papers.',
    cta: 'Order urgent editing',
  }),
  editing('edit-review', 'Editing Testimonial', 'testimonial', {
    eyebrow: 'Happy student',
    quote: '“My similarity dropped from 31% to *7%* and the English finally sounded academic. Submitted without a single correction.”',
    person: { name: 'Priya Adhikari', role: 'MBA, Pokhara University', photo: 'portraitWoman' },
  }),
];

/* ------------------------------------------------------------------ */
/* Assignments & Reports                                               */
/* ------------------------------------------------------------------ */

const assignments = ad('assignments');

export const ASSIGNMENTS: AdDefinition[] = [
  assignments('assign-help', 'Assignment Help', 'hero', {
    eyebrow: 'Assignment help',
    heading: 'Assignments done *right, on time*',
    sub: 'Essays, case studies and lab reports — Bachelor to Master’s.',
    cta: 'Get assignment help',
    photo: 'studying',
  }),
  assignments('assign-internship', 'Internship Report', 'services', {
    eyebrow: 'Internship reports',
    heading: 'Internship report, *start to finish*',
    items: [
      { icon: 'briefcase', title: 'Organisation profile', text: 'History, structure and SWOT.' },
      { icon: 'list', title: 'Activities & learning', text: 'What you did, told well.' },
      { icon: 'bars', title: 'Analysis', text: 'Financial or operational data.' },
      { icon: 'doc', title: 'Formatting', text: 'University guidelines applied.' },
    ],
    cta: 'Start my report',
  }),
  assignments('assign-project', 'Project Report', 'steps', {
    eyebrow: 'Project reports',
    heading: 'A project report in *3 steps*',
    items: [
      { icon: 'chat', title: 'Share your project brief', text: 'Topic, guidelines and deadline.' },
      { icon: 'pen', title: 'We draft every section', text: 'Introduction to recommendations.' },
      { icon: 'checkCircle', title: 'Review and submit', text: 'Unlimited revisions included.' },
    ],
    cta: 'Order my report',
  }),
  assignments('assign-case-study', 'Case Study Analysis', 'announcement', {
    eyebrow: 'Case studies',
    heading: 'Case study *analysis* that scores',
    body: 'SWOT, PESTLE, Porter’s Five Forces and clear recommendations — structured the way your examiner expects.',
    sub: 'BBA · MBA · BBS · MBS',
    cta: 'Get case study help',
  }),
  assignments('assign-deadline', 'Assignment Due Soon', 'deadline', {
    eyebrow: 'Due soon?',
    number: '2',
    numberLabel: 'Days left',
    heading: 'Assignment due this week? *Relax.*',
    sub: 'Well-researched, referenced and plagiarism-free.',
    cta: 'Get it done',
  }),
  assignments('assign-types', 'We Write Every Type', 'checklist', {
    eyebrow: 'All assignment types',
    heading: 'Whatever your *brief*, we cover it',
    bullets: ['Essays & reflective writing', 'Lab & field reports', 'Presentations & PPT', 'Business plans', 'Literature reviews'],
    cta: 'Send your brief',
    photo: 'laptop',
  }),
  assignments('assign-offer', 'Student Assignment Offer', 'offer', {
    eyebrow: 'Student offer',
    heading: 'First assignment *20% off*',
    badge: '20%\nOFF',
    price: 'Rs 999+',
    oldPrice: 'Price depends on length & level',
    bullets: ['Original, referenced work', 'Free revisions', 'On-time delivery'],
    cta: 'Claim my discount',
    photo: 'students',
  }),
  assignments('assign-review', 'Assignment Testimonial', 'testimonial', {
    eyebrow: 'Student review',
    quote: '“Got an *A* on my case study. The analysis was clear and they explained every part so I could present it confidently.”',
    person: { name: 'Rohan Shrestha', role: 'BBA, Tribhuvan University', photo: 'portraitMan' },
  }),
];
