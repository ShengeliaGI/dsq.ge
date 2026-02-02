import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AuthScreen from './components/AuthScreen'
import TopNav from './components/TopNav'
import VacanciesPage from './components/VacanciesPage'
import CompanyPage from './components/CompanyPage'
import TestPage from './components/TestPage'
import CvListPage from './components/CvListPage'
import CvFormPage from './components/CvFormPage'
import AdminPage from './components/AdminPage'
import HomePage from './components/HomePage'
import ProfilePage from './components/ProfilePage'
import MessagesPage from './components/MessagesPage'
import TestsPage from './components/TestsPage'
import {
  TEST_DURATION_SECONDS,
  generateManualQuestionSets,
  generateQuestionSets,
  normalizeManualQuestions,
} from './utils/testUtils'

const JOB_TYPE_LABELS = {
  en: {
    'Frontend Developer': 'Frontend Developer',
    'Backend Engineer': 'Backend Engineer',
    'Fullstack Developer': 'Fullstack Developer',
    'UI/UX Designer': 'UI/UX Designer',
    'Mobile Developer': 'Mobile Developer',
    'DevOps Engineer': 'DevOps Engineer',
    'QA Engineer': 'QA Engineer',
    'Data Analyst': 'Data Analyst',
    'Product Manager': 'Product Manager',
    Cybersecurity: 'Cybersecurity',
    'Administration / Management': 'Administration / Management',
    'Finance / Accounting / Statistics': 'Finance / Accounting / Statistics',
    Sales: 'Sales',
    'PR / Marketing': 'PR / Marketing',
    'General Technical Staff': 'General Technical Staff',
    'Logistics / Transportation / Distribution':
      'Logistics / Transportation / Distribution',
    'Construction / Repair': 'Construction / Repair',
    Cleaning: 'Cleaning',
    'Security / Safety': 'Security / Safety',
    'IT / Programming': 'IT / Programming',
    'Media / Design / Publishing': 'Media / Design / Publishing',
    Education: 'Education',
    Legal: 'Legal',
    'Healthcare / Pharmacy': 'Healthcare / Pharmacy',
    'Beauty / Fashion': 'Beauty / Fashion',
    'Food Service (HoReCa)': 'Food Service (HoReCa)',
    Other: 'Other',
  },
  ka: {
    'Frontend Developer': 'ფრონტენდ დეველოპერი',
    'Backend Engineer': 'ბექენდ ინჟინერი',
    'Fullstack Developer': 'ფულსტეკ დეველოპერი',
    'UI/UX Designer': 'UI/UX დიზაინერი',
    'Mobile Developer': 'მობაილ დეველოპერი',
    'DevOps Engineer': 'DevOps ინჟინერი',
    'QA Engineer': 'QA ინჟინერი',
    'Data Analyst': 'დეტა ანალიტიკოსი',
    'Product Manager': 'პროდუქტის მენეჯერი',
    Cybersecurity: 'კიბერუსაფრთხოება',
    'Administration / Management': 'ადმინისტრაცია / მენეჯმენტი',
    'Finance / Accounting / Statistics': 'ფინანსები / ბუღალტერია / სტატისტიკა',
    Sales: 'გაყიდვები',
    'PR / Marketing': 'PR / მარკეტინგი',
    'General Technical Staff': 'ტექნიკური პერსონალი',
    'Logistics / Transportation / Distribution':
      'ლოგისტიკა / ტრანსპორტირება / დისტრიბუცია',
    'Construction / Repair': 'მშენებლობა / რემონტი',
    Cleaning: 'დასუფთავება',
    'Security / Safety': 'უსაფრთხოება / დაცვა',
    'IT / Programming': 'IT / პროგრამირება',
    'Media / Design / Publishing': 'მედია / დიზაინი / გამომცემლობა',
    Education: 'განათლება',
    Legal: 'იურიდიული',
    'Healthcare / Pharmacy': 'ჯანმრთელობა / ფარმაცია',
    'Beauty / Fashion': 'სილამაზე / მოდა',
    'Food Service (HoReCa)': 'კვება (HoReCa)',
    Other: 'სხვა',
  },
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.vacancies': 'Open vacancies',
    'nav.tests': 'Tests',
    'nav.profile': 'Profile',
    'nav.messages': 'Messages',
    'nav.cvs': 'CVs',
    'nav.company': 'Company',
    'nav.companyMode': 'Company mode',
    'nav.applicantMode': 'Applicant mode',
    'nav.admin': 'Admin panel',
    'nav.login': 'Log in',
    'nav.register': 'Register',
    'nav.toggle': 'Toggle navigation',
    'nav.switchToEnglish': 'Switch to English',
    'nav.switchToGeorgian': 'Switch to Georgian',

    'home.title': 'Hire fast. Apply smarter.',
    'home.subtitle':
      'A talent marketplace with guided tests, clear hiring stages, and built-in messaging between companies and applicants.',
    'home.explore': 'Explore vacancies',
    'home.viewProfile': 'View profile',
    'home.register': 'Register',
    'home.howItWorks': 'How it works',
    'home.step1': 'Browse vacancies and learn how the platform works.',
    'home.step2': 'Applicants take a 15-question multiple-choice test.',
    'home.step3': 'Companies review results and move candidates to next stages.',
    'home.step4': 'Messages and notifications keep everyone aligned.',
    'home.quickLinksTitle': 'Quick links',
    'home.quickLinksDesc': 'Jump to profile, open vacancies, tests, and messages.',
    'home.trackerTitle': 'Application tracker',
    'home.trackerDesc': 'See submitted, pending, interview, and accepted stages.',
    'home.messagingTitle': 'Messaging portal',
    'home.messagingDesc': 'Chat with companies as soon as you are accepted.',

    'vacancies.eyebrow': 'Vacancies',
    'vacancies.title': 'Explore open roles',
    'vacancies.subtitle': 'Tap a role to start the multiple-choice test.',
    'vacancies.myPage': 'My Page',
    'vacancies.logout': 'Log out',
    'vacancies.emptyTitle': 'No vacancies yet',
    'vacancies.emptySubtitle': 'Use My Page to publish your first vacancy.',
    'vacancies.startTest': 'Start test →',
    'vacancies.waiting': 'Waiting for answer',
    'vacancies.tryAgain': 'Try again',
    'vacancies.delete': 'Delete vacancy',
    'vacancies.deleting': 'Deleting...',
    'vacancies.filterAll': 'All categories',
    'vacancies.filterLabel': 'Filter by category',
    'vacancies.noTest': 'No test required',

    'auth.titleLogin': 'Log in',
    'auth.titleRegister': 'Create account',
    'auth.subtitle': 'Companies publish vacancies. Candidates complete a custom test.',
    'auth.fullName': 'Full name',
    'auth.fullNamePlaceholder': 'Alex Carter',
    'auth.accountType': 'Account type',
    'auth.accountApplicant': 'Employee / Applicant',
    'auth.accountCompany': 'Company',
    'auth.helperCompany':
      'Company perks: publish roles, review tests, message applicants.',
    'auth.helperApplicant':
      'Employee perks: take tests, track status, get interview updates.',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'you@email.com',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': '••••••••',
    'auth.loading': 'Please wait...',
    'auth.enter': 'Enter dsq.ge',
    'auth.registerContinue': 'Register and continue',
    'auth.toggleToRegister': 'New here? Create an account',
    'auth.toggleToLogin': 'Already have an account? Log in',

    'profile.eyebrow': 'Profile',
    'profile.titleFallback': 'Profile',
    'profile.roleLabel': 'Role: {role}',
    'profile.openVacancies': 'Open vacancies',
    'profile.messages': 'Messages',
    'profile.logout': 'Log out',
    'profile.account': 'Account',
    'profile.roleMode': 'Role mode: {role}',
    'profile.changeRole': 'Change account type',
    'profile.employeeTitle': 'Employee / Applicant',
    'profile.employeeDesc': 'Employee perks: take tests, track status, get interview updates.',
    'profile.companyTitle': 'Company',
    'profile.companyDesc': 'Company perks: publish roles, review tests, message applicants.',
    'profile.notifications': 'Notifications',
    'profile.noUpdates': 'No updates yet.',
    'profile.appliedJobs': 'Applied jobs',
    'profile.appliedDesc': 'Track your submissions and hiring stages.',
    'profile.emptyApplicationsTitle': 'No applications yet',
    'profile.emptyApplicationsDesc': 'Take a test to start your application journey.',
    'profile.scoreLabel': 'Score: {score}/{total}',

    'cvForm.eyebrow': 'Candidate profile',
    'cvForm.title': 'Publish your CV',
    'cvForm.subtitle':
      'Create a professional candidate profile recruiters can review in seconds.',
    'cvForm.back': 'Back',
    'cvForm.socialTitle': 'Social links',
    'cvForm.socialDesc': 'You can add links to websites you want hiring managers to see.',
    'cvForm.socialPlaceholder': 'LinkedIn, GitHub, portfolio',
    'cvForm.addLink': 'Add link',
    'cvForm.personalTitle': 'Personal Information',
    'cvForm.upload': 'Upload',
    'cvForm.namePlaceholder': 'Name',
    'cvForm.surnamePlaceholder': 'Surname',
    'cvForm.professionPlaceholder': 'Profession',
    'cvForm.phonePlaceholder': 'Mobile Phone',
    'cvForm.emailPlaceholder': 'Email Address',
    'cvForm.addressPlaceholder': 'Address',
    'cvForm.countryPlaceholder': 'Country',
    'cvForm.cityPlaceholder': 'City',
    'cvForm.aboutPlaceholder': 'Write about you',
    'cvForm.workTitle': 'Work experience',
    'cvForm.positionPlaceholder': 'Position',
    'cvForm.companyPlaceholder': 'Company',
    'cvForm.startDatePlaceholder': 'Start Date (MM/YYYY)',
    'cvForm.endDatePlaceholder': 'End Date (MM/YYYY)',
    'cvForm.currentPosition': 'Current Position',
    'cvForm.addDescription': 'Add Description',
    'cvForm.clear': 'Clear',
    'cvForm.add': 'Add',
    'cvForm.roleFallback': 'Role',
    'cvForm.companyFallback': 'Company',
    'cvForm.startFallback': 'Start',
    'cvForm.present': 'Present',
    'cvForm.educationTitle': 'Education',
    'cvForm.degreePlaceholder': 'Degree',
    'cvForm.schoolPlaceholder': 'University/Institute/College',
    'cvForm.facultyPlaceholder': 'Faculty',
    'cvForm.languagesTitle': 'Languages',
    'cvForm.selectLanguagePlaceholder': 'Select Language',
    'cvForm.levelPlaceholder': 'Level',
    'cvForm.skillsTitle': 'Skills',
    'cvForm.skillPlaceholder': 'Enter skill',
    'cvForm.certificatesTitle': 'Certificates',
    'cvForm.titlePlaceholder': 'Title',
    'cvForm.organizationPlaceholder': 'Organization',
    'cvForm.issueDatePlaceholder': 'Issue Date (MM/YYYY)',
    'cvForm.certificateFallback': 'Certificate',
    'cvForm.trainingsTitle': 'Trainings & Courses',
    'cvForm.trainingFallback': 'Training',
    'cvForm.publish': 'Publish CV',

    'cvList.eyebrow': 'Looking for job',
    'cvList.title': 'Job seeker CVs',
    'cvList.subtitle': 'Browse saved CVs from candidates.',
    'cvList.addCv': 'Add CV',
    'cvList.backToVacancies': 'Back to vacancies',
    'cvList.emptyTitle': 'No CVs yet',
    'cvList.emptySubtitle': 'Use Add CV to fill out your profile.',
    'cvList.hideDetails': 'Hide details',
    'cvList.viewDetails': 'View details',
    'cvList.deleteCv': 'Delete CV',
    'cvList.personalInfo': 'Personal info',
    'cvList.workExperience': 'Work experience',
    'cvList.education': 'Education',
    'cvList.languages': 'Languages',
    'cvList.skills': 'Skills',
    'cvList.certificates': 'Certificates',
    'cvList.trainings': 'Trainings',
    'cvList.socialNetworks': 'Social networks',
    'cvList.notProvided': 'Not provided.',

    'messages.eyebrow': 'Messages',
    'messages.title': 'Messaging portal',
    'messages.subtitle': 'Connect applicants and companies in one place.',
    'messages.back': 'Back',
    'messages.emptyTitle': 'No conversations yet',
    'messages.emptySubtitle': 'Messages will appear after a company responds.',
    'messages.message': 'Message',
    'messages.startConversation': 'Start the conversation.',
    'messages.writePlaceholder': 'Write a message...',
    'messages.send': 'Send',
    'messages.selectThread': 'Select a thread to begin.',

    'tests.eyebrow': 'Tests',
    'tests.title': 'Role assessments',
    'tests.subtitle': 'Pick a vacancy and complete the multiple-choice test.',
    'tests.backToVacancies': 'Back to vacancies',
    'tests.emptyTitle': 'No tests yet',
    'tests.emptySubtitle': 'Companies will publish tests for each vacancy.',
    'tests.submitted': 'Test submitted',
    'tests.start': 'Start test',
    'tests.noTest': 'No test',

    'test.eyebrow': 'Test',
    'test.titleFallback': 'Role test',
    'test.subtitle': 'Company test assignment',
    'test.backToVacancies': 'Back to vacancies',
    'test.company': 'Company: {company}',
    'test.timeLeft': 'Time left: {time}',
    'test.aiCopy': 'AI generated test tailored to this role.',
    'test.manualCopy': 'Company written test.',
    'test.finish': 'Finish test',
    'test.abandon': 'Abandon',
    'test.timeUpTitle': 'Time is up',
    'test.timeUpText': 'Sorry, the test time has expired.',
    'test.ok': 'OK',

    'company.eyebrow': 'Company',
    'company.title': 'Post vacancies',
    'company.subtitle': 'Choose a role and add optional details.',
    'company.backToVacancies': 'Back to vacancies',
    'company.chooseType': 'Choose vacancy type',
    'company.details': 'Vacancy details',
    'company.companyName': 'Company name',
    'company.companyNamePlaceholder': 'dsq.ge',
    'company.roleTitle': 'Role title',
    'company.jobTypeOptional': 'Job type (optional)',
    'company.jobTypePlaceholder': 'Full time / Part time',
    'company.salaryOptional': 'Monthly salary (optional)',
    'company.salaryPlaceholder': '$2,500',
    'company.basedIn': 'Based in',
    'company.locationPlaceholder': 'Tbilisi, GE',
    'company.minScore': 'Minimum score required',
    'company.minScorePlaceholder': '10',
    'company.description': 'Description',
    'company.descriptionPlaceholder': 'Describe the role, team, and expectations',
    'company.testType': 'Test type',
    'company.recommended': 'Recommended',
    'company.noTest': 'No test is required for this vacancy type.',
    'company.aiTest': 'AI test (15 questions)',
    'company.manualTest': 'Company written test',
    'company.manualQuestionCount': 'How many questions?',
    'company.manualQuestionLabel': 'Question {index}',
    'company.manualQuestionPlaceholder': 'Write the question here',
    'company.optionLabel': 'Option {label}',
    'company.correctAnswer': 'Correct answer',
    'company.correctOptionA': 'Option A',
    'company.correctOptionB': 'Option B',
    'company.correctOptionC': 'Option C',
    'company.questionsReady': 'Questions ready: {count}/{total}',
    'company.manualQuestions': 'Company test questions (15 lines)',
    'company.manualPlaceholder':
      'Write 15 questions, one per line. Format:\nQuestion | Option A | Option B | Option C | Correct (A/B/C)',
    'company.questionsCount': '{count}/15 questions',
    'company.publish': 'Publish vacancy',
    'company.publishing': 'Publishing...',
    'company.resultsEyebrow': 'Results',
    'company.resultsTitle': 'Test submissions',
    'company.resultsSubtitle': 'Scores are 1 point per answered question.',
    'company.emptyVacanciesTitle': 'No vacancies yet',
    'company.emptyVacanciesSubtitle': 'Publish a vacancy to receive test results.',
    'company.emptyResultsTitle': 'No results yet',
    'company.emptyResultsSubtitle': 'Results will appear here after candidates finish tests.',
    'company.noSubmissions': 'No submissions yet.',
    'company.hideDetails': 'Hide details',
    'company.viewDetails': 'View details',
    'company.delete': 'Delete',
    'company.message': 'Message',
    'company.pending': 'Pending',
    'company.interview': 'Interview',
    'company.accept': 'Accept',
    'company.reject': 'Reject',
    'company.questionBreakdown': 'Question breakdown',
    'company.answered': 'Answered',
    'company.noAnswer': 'No answer provided.',

    'admin.eyebrow': 'Admin panel',
    'admin.title': 'Activity overview',
    'admin.subtitle': 'Monitor recent activity across the platform.',
    'admin.backToVacancies': 'Back to vacancies',
    'admin.totalVacancies': 'Total vacancies',
    'admin.openVacancies': 'Open vacancies',
    'admin.waitingVacancies': 'Waiting for response',
    'admin.cvSubmissions': 'CV submissions',
    'admin.recentVacancies': 'Recent vacancies',
    'admin.noVacancies': 'No vacancies created yet.',
    'admin.recentCvs': 'Recent CV submissions',
    'admin.noCvs': 'No CV submissions yet.',

    'status.submitted': 'submitted',
    'status.pending': 'pending',
    'status.interview': 'interview',
    'status.accepted': 'accepted',
    'status.rejected': 'rejected',
    'status.waiting': 'waiting',

    'role.applicant': 'Applicant',
    'role.company': 'Company',

    'modal.registrationRequired': 'Registration required',
    'modal.register': 'Register',
    'modal.cancel': 'Cancel',

    'require.default': 'Please register to use this feature.',
    'require.accessArea': 'Please register to access this area.',
    'require.viewProfile': 'Register to view your profile.',
    'require.startTest': 'Register to start the test.',
    'require.manageVacancies': 'Register to manage vacancies.',
    'require.companyTools': 'Register to access company tools.',
    'require.takeTest': 'Register to take a test.',
    'require.manageResults': 'Register to manage results.',
    'require.updateStatuses': 'Register to update statuses.',
    'require.useMessaging': 'Register to use messaging.',
    'require.addCv': 'Register to add your CV.',
    'require.manageCvs': 'Register to manage CVs.',

    'notifications.acceptedTitle': 'Application accepted',
    'notifications.interviewTitle': 'Interview requested',
    'notifications.statusMessage': 'Your application for {title} has been {status}.',
    'notifications.acceptedMessage':
      'Congrats! We have accepted you for {title}. Let\'s discuss next steps.',
    'notifications.interviewMessage':
      'We would like to invite you to an interview for {title}.',

    'cv.defaults.noFile': 'No file uploaded',
    'cv.defaults.noDetails': 'No details provided.',
    'cv.defaults.notProvided': 'Not provided.',
    'cv.defaults.role': 'Role',
    'cv.defaults.company': 'Company',
    'cv.defaults.start': 'Start',
    'cv.defaults.present': 'Present',

    'vacancy.defaults.company': 'Company',
    'vacancy.defaults.remote': 'Remote',
    'vacancy.defaults.notSpecified': 'Not specified',
    'vacancy.defaults.noDescription': 'No description added yet.',
  },
  ka: {
    'nav.home': 'მთავარი',
    'nav.vacancies': 'ღია ვაკანსიები',
    'nav.tests': 'ტესტები',
    'nav.profile': 'პროფილი',
    'nav.messages': 'შეტყობინებები',
    'nav.cvs': 'CV-ები',
    'nav.company': 'კომპანია',
    'nav.companyMode': 'კომპანიის რეჟიმი',
    'nav.applicantMode': 'აპლიკანტის რეჟიმი',
    'nav.admin': 'ადმინ პანელი',
    'nav.login': 'შესვლა',
    'nav.register': 'რეგისტრაცია',
    'nav.toggle': 'ნავიგაციის გადართვა',
    'nav.switchToEnglish': 'ინგლისურზე გადართვა',
    'nav.switchToGeorgian': 'ქართულზე გადართვა',

    'home.title': 'დასაქმდი მარტივად, დარეგისტრირდი სწრაფად.',
    'home.subtitle':
      'ტალანტების პლატფორმა ტესტებით, მკაფიო დაქირავების ეტაპებით და ჩაშენებული მესიჯინგით კომპანიებსა და კანდიდატებს შორის.',
    'home.explore': 'ვაკანსიების ნახვა',
    'home.viewProfile': 'პროფილის ნახვა',
    'home.register': 'რეგისტრაცია',
    'home.howItWorks': 'როგორ მუშაობს',
    'home.step1': 'ნახეთ ვაკანსიები და გაეცანით პლატფორმას.',
    'home.step2': 'კანდიდატები ასრულებენ 15 კითხვიან ტესტს.',
    'home.step3': 'კომპანიები ხედავენ შედეგებს და გეგმავენ შემდეგ ეტაპებს.',
    'home.step4': 'შეტყობინებები და ნოტიფიკაციები ყველას აერთიანებს.',
    'home.quickLinksTitle': 'სწრაფი ბმულები',
    'home.quickLinksDesc': 'გადახტი პროფილზე, ვაკანსიებზე, ტესტებსა და მესიჯებზე.',
    'home.trackerTitle': 'აპლიკაციის ტრეკერი',
    'home.trackerDesc': 'ნახე სტატუსები: გაგზავნილი, მოლოდინი, ინტერვიუ, მიღება.',
    'home.messagingTitle': 'მესიჯინგის პორტალი',
    'home.messagingDesc': 'დაუკავშირდი კომპანიებს მიღებისთანავე.',

    'vacancies.eyebrow': 'ვაკანსიები',
    'vacancies.title': 'ნახე ღია პოზიციები',
    'vacancies.subtitle': 'აირჩიე პოზიცია და დაიწყე ტესტი.',
    'vacancies.myPage': 'ჩემი გვერდი',
    'vacancies.logout': 'გასვლა',
    'vacancies.emptyTitle': 'ვაკანსიები ჯერ არ არის',
    'vacancies.emptySubtitle': 'გამოიყენე „ჩემი გვერდი“ პირველი ვაკანსიის გამოსაქვეყნებლად.',
    'vacancies.startTest': 'ტესტის დაწყება →',
    'vacancies.waiting': 'პასუხის მოლოდინი',
    'vacancies.tryAgain': 'ხელახლა სცადე',
    'vacancies.delete': 'ვაკანსიის წაშლა',
    'vacancies.deleting': 'ვშლით...',
    'vacancies.filterAll': 'ყველა კატეგორია',
    'vacancies.filterLabel': 'კატეგორიის მიხედვით',
    'vacancies.noTest': 'ტესტი არ არის საჭირო',

    'auth.titleLogin': 'შესვლა',
    'auth.titleRegister': 'ანგარიშის შექმნა',
    'auth.subtitle': 'კომპანიები აქვეყნებენ ვაკანსიებს. კანდიდატები ასრულებენ ტესტს.',
    'auth.fullName': 'სრული სახელი',
    'auth.fullNamePlaceholder': 'ალექს კარტერი',
    'auth.accountType': 'ანგარიშის ტიპი',
    'auth.accountApplicant': 'თანამშრომელი / აპლიკანტი',
    'auth.accountCompany': 'კომპანია',
    'auth.helperCompany':
      'კომპანიის პრივილეგიები: ვაკანსიების გამოქვეყნება, ტესტების შეფასება, მესიჯინგი.',
    'auth.helperApplicant':
      'თანამშრომლის პრივილეგიები: ტესტების გავლა, სტატუსის მონიტორინგი, ინტერვიუს განახლებები.',
    'auth.email': 'ელ-ფოსტა',
    'auth.emailPlaceholder': 'you@email.com',
    'auth.password': 'პაროლი',
    'auth.passwordPlaceholder': '••••••••',
    'auth.loading': 'გთხოვთ დაელოდოთ...',
    'auth.enter': 'შესვლა dsq.ge-ზე',
    'auth.registerContinue': 'რეგისტრაცია და გაგრძელება',
    'auth.toggleToRegister': 'ახალი ხარ? შექმენი ანგარიში',
    'auth.toggleToLogin': 'უკვე გაქვს ანგარიში? შედი',

    'profile.eyebrow': 'პროფილი',
    'profile.titleFallback': 'პროფილი',
    'profile.roleLabel': 'როლი: {role}',
    'profile.openVacancies': 'ღია ვაკანსიები',
    'profile.messages': 'შეტყობინებები',
    'profile.logout': 'გასვლა',
    'profile.account': 'ანგარიში',
    'profile.roleMode': 'რეჟიმი: {role}',
    'profile.changeRole': 'ანგარიშის ტიპის შეცვლა',
    'profile.employeeTitle': 'თანამშრომელი / აპლიკანტი',
    'profile.employeeDesc':
      'თანამშრომლის პრივილეგიები: ტესტების გავლა, სტატუსის მონიტორინგი, ინტერვიუს განახლებები.',
    'profile.companyTitle': 'კომპანია',
    'profile.companyDesc':
      'კომპანიის პრივილეგიები: ვაკანსიების გამოქვეყნება, ტესტების შეფასება, მესიჯინგი.',
    'profile.notifications': 'შეტყობინებები',
    'profile.noUpdates': 'განახლებები ჯერ არ არის.',
    'profile.appliedJobs': 'გაგზავნილი განაცხადები',
    'profile.appliedDesc': 'დააკვირდი შენს განაცხადებს და ეტაპებს.',
    'profile.emptyApplicationsTitle': 'განაცხადები ჯერ არ არის',
    'profile.emptyApplicationsDesc': 'გაიარე ტესტი და დაიწყე განაცხადის გზა.',
    'profile.scoreLabel': 'ქულა: {score}/{total}',

    'cvForm.eyebrow': 'კანდიდატის პროფილი',
    'cvForm.title': 'CV-ის გამოქვეყნება',
    'cvForm.subtitle': 'შექმენი პროფესიონალური პროფილი, რომელსაც რეკრუტერები სწრაფად ნახავენ.',
    'cvForm.back': 'უკან',
    'cvForm.socialTitle': 'სოციალური ბმულები',
    'cvForm.socialDesc': 'დაამატე ბმულები იმ საიტებზე, რაც გსურს რომ დამსაქმებელმა ნახოს.',
    'cvForm.socialPlaceholder': 'LinkedIn, GitHub, პორტფოლიო',
    'cvForm.addLink': 'ბმულის დამატება',
    'cvForm.personalTitle': 'პირადი ინფორმაცია',
    'cvForm.upload': 'ატვირთვა',
    'cvForm.namePlaceholder': 'სახელი',
    'cvForm.surnamePlaceholder': 'გვარი',
    'cvForm.professionPlaceholder': 'პროფესია',
    'cvForm.phonePlaceholder': 'ტელეფონი',
    'cvForm.emailPlaceholder': 'ელ-ფოსტა',
    'cvForm.addressPlaceholder': 'მისამართი',
    'cvForm.countryPlaceholder': 'ქვეყანა',
    'cvForm.cityPlaceholder': 'ქალაქი',
    'cvForm.aboutPlaceholder': 'აღწერე საკუთარი თავი',
    'cvForm.workTitle': 'სამუშაო გამოცდილება',
    'cvForm.positionPlaceholder': 'პოზიცია',
    'cvForm.companyPlaceholder': 'კომპანია',
    'cvForm.startDatePlaceholder': 'დაწყების თარიღი (თვე/წელი)',
    'cvForm.endDatePlaceholder': 'დასრულების თარიღი (თვე/წელი)',
    'cvForm.currentPosition': 'ამჟამინდელი პოზიცია',
    'cvForm.addDescription': 'დამატე აღწერა',
    'cvForm.clear': 'გასუფთავება',
    'cvForm.add': 'დამატება',
    'cvForm.roleFallback': 'პოზიცია',
    'cvForm.companyFallback': 'კომპანია',
    'cvForm.startFallback': 'დაწყება',
    'cvForm.present': 'ამჟამად',
    'cvForm.educationTitle': 'განათლება',
    'cvForm.degreePlaceholder': 'ხარისხი',
    'cvForm.schoolPlaceholder': 'უნივერსიტეტი/ინსტიტუტი/კოლეჯი',
    'cvForm.facultyPlaceholder': 'ფაკულტეტი',
    'cvForm.languagesTitle': 'ენები',
    'cvForm.selectLanguagePlaceholder': 'აირჩიე ენა',
    'cvForm.levelPlaceholder': 'დონე',
    'cvForm.skillsTitle': 'უნარები',
    'cvForm.skillPlaceholder': 'შეიყვანე უნარი',
    'cvForm.certificatesTitle': 'სერტიფიკატები',
    'cvForm.titlePlaceholder': 'სათაური',
    'cvForm.organizationPlaceholder': 'ორგანიზაცია',
    'cvForm.issueDatePlaceholder': 'გამოცემის თარიღი (თვე/წელი)',
    'cvForm.certificateFallback': 'სერტიფიკატი',
    'cvForm.trainingsTitle': 'ტრენინგები და კურსები',
    'cvForm.trainingFallback': 'ტრენინგი',
    'cvForm.publish': 'CV-ის გამოქვეყნება',

    'cvList.eyebrow': 'ვაკანსიის ძიება',
    'cvList.title': 'კანდიდატების CV-ები',
    'cvList.subtitle': 'დაათვალიერე კანდიდატების შენახული CV-ები.',
    'cvList.addCv': 'CV-ის დამატება',
    'cvList.backToVacancies': 'ვაკანსიებზე დაბრუნება',
    'cvList.emptyTitle': 'CV-ები ჯერ არ არის',
    'cvList.emptySubtitle': 'გამოიყენე „CV-ის დამატება“ პროფილის შესავსებად.',
    'cvList.hideDetails': 'დეტალების დამალვა',
    'cvList.viewDetails': 'დეტალების ნახვა',
    'cvList.deleteCv': 'CV-ის წაშლა',
    'cvList.personalInfo': 'პირადი ინფორმაცია',
    'cvList.workExperience': 'სამუშაო გამოცდილება',
    'cvList.education': 'განათლება',
    'cvList.languages': 'ენები',
    'cvList.skills': 'უნარები',
    'cvList.certificates': 'სერტიფიკატები',
    'cvList.trainings': 'ტრენინგები',
    'cvList.socialNetworks': 'სოციალური ქსელები',
    'cvList.notProvided': 'არ არის მოწოდებული.',

    'messages.eyebrow': 'შეტყობინებები',
    'messages.title': 'მესიჯინგის პორტალი',
    'messages.subtitle': 'დააკავშირე კომპანიები და კანდიდატები ერთ სივრცეში.',
    'messages.back': 'უკან',
    'messages.emptyTitle': 'მესიჯები ჯერ არ არის',
    'messages.emptySubtitle': 'შეტყობინებები გამოჩნდება, როცა კომპანია პასუხობს.',
    'messages.message': 'მესიჯი',
    'messages.startConversation': 'დაიწყე საუბარი.',
    'messages.writePlaceholder': 'დაწერე შეტყობინება...',
    'messages.send': 'გაგზავნა',
    'messages.selectThread': 'აირჩიე საუბარი დასაწყებად.',

    'tests.eyebrow': 'ტესტები',
    'tests.title': 'როლის შეფასება',
    'tests.subtitle': 'აირჩიე ვაკანსია და დაასრულე მრავალვარიანტიანი ტესტი.',
    'tests.backToVacancies': 'ვაკანსიებზე დაბრუნება',
    'tests.emptyTitle': 'ტესტები ჯერ არ არის',
    'tests.emptySubtitle': 'კომპანიები თითოეულ ვაკანსიაზე ტესტს გამოაქვეყნებენ.',
    'tests.submitted': 'ტესტი გაგზავნილია',
    'tests.start': 'ტესტის დაწყება',
    'tests.noTest': 'ტესტი არ არის',

    'test.eyebrow': 'ტესტი',
    'test.titleFallback': 'როლის ტესტი',
    'test.subtitle': 'კომპანიის ტესტური დავალება',
    'test.backToVacancies': 'ვაკანსიებზე დაბრუნება',
    'test.company': 'კომპანია: {company}',
    'test.timeLeft': 'დარჩენილი დრო: {time}',
    'test.aiCopy': 'AI-ის მიერ გენერირებული ტესტი ამ როლზე.',
    'test.manualCopy': 'კომპანიის მიერ დაწერილი ტესტი.',
    'test.finish': 'ტესტის დასრულება',
    'test.abandon': 'გაუქმება',
    'test.timeUpTitle': 'დრო ამოიწურა',
    'test.timeUpText': 'სამწუხაროდ, ტესტის დრო დასრულდა.',
    'test.ok': 'კარგი',

    'company.eyebrow': 'კომპანია',
    'company.title': 'ვაკანსიების გამოქვეყნება',
    'company.subtitle': 'აირჩიე როლი და დაამატე დეტალები.',
    'company.backToVacancies': 'ვაკანსიებზე დაბრუნება',
    'company.chooseType': 'აირჩიე ვაკანსიის ტიპი',
    'company.details': 'ვაკანსიის დეტალები',
    'company.companyName': 'კომპანიის დასახელება',
    'company.companyNamePlaceholder': 'dsq.ge',
    'company.roleTitle': 'როლის სათაური',
    'company.jobTypeOptional': 'სამუშაო ტიპი (არასავალდებულო)',
    'company.jobTypePlaceholder': 'სრული/ნახევარი განაკვეთი',
    'company.salaryOptional': 'თვიური ხელფასი (არასავალდებულო)',
    'company.salaryPlaceholder': '₾2,500',
    'company.basedIn': 'ლოკაცია',
    'company.locationPlaceholder': 'თბილისი, GE',
    'company.minScore': 'საჭირო მინიმალური ქულა',
    'company.minScorePlaceholder': '10',
    'company.description': 'აღწერა',
    'company.descriptionPlaceholder': 'აღწერე როლი, გუნდი და მოლოდინები',
    'company.testType': 'ტესტის ტიპი',
    'company.recommended': 'რეკომენდებული',
    'company.noTest': 'ამ ვაკანსიისთვის ტესტი საჭირო არ არის.',
    'company.aiTest': 'AI ტესტი (15 კითხვა)',
    'company.manualTest': 'კომპანიის მიერ დაწერილი ტესტი',
    'company.manualQuestionCount': 'რამდენი კითხვა გჭირდება?',
    'company.manualQuestionLabel': 'კითხვა {index}',
    'company.manualQuestionPlaceholder': 'ჩაწერე კითხვა აქ',
    'company.optionLabel': 'ვარიანტი {label}',
    'company.correctAnswer': 'სწორი პასუხი',
    'company.correctOptionA': 'ვარიანტი A',
    'company.correctOptionB': 'ვარიანტი B',
    'company.correctOptionC': 'ვარიანტი C',
    'company.questionsReady': 'მზადაა კითხვები: {count}/{total}',
    'company.manualQuestions': 'კომპანიის კითხვები (15 ხაზი)',
    'company.manualPlaceholder':
      'დაწერე 15 კითხვა, თითო ხაზი. ფორმატი:\nკითხვა | ვარიანტი A | ვარიანტი B | ვარიანტი C | სწორი (A/B/C)',
    'company.questionsCount': '{count}/15 კითხვა',
    'company.publish': 'ვაკანსიის გამოქვეყნება',
    'company.publishing': 'ვაქვეყნებთ...',
    'company.resultsEyebrow': 'შედეგები',
    'company.resultsTitle': 'ტესტის გაგზავნები',
    'company.resultsSubtitle': 'ქულა = 1 ქულა თითო სწორ პასუხზე.',
    'company.emptyVacanciesTitle': 'ვაკანსიები ჯერ არ არის',
    'company.emptyVacanciesSubtitle': 'გამოაქვეყნე ვაკანსია შედეგების მისაღებად.',
    'company.emptyResultsTitle': 'შედეგები ჯერ არ არის',
    'company.emptyResultsSubtitle': 'შედეგები გამოჩნდება ტესტის დასრულების შემდეგ.',
    'company.noSubmissions': 'გაგზავნები ჯერ არ არის.',
    'company.hideDetails': 'დეტალების დამალვა',
    'company.viewDetails': 'დეტალების ნახვა',
    'company.delete': 'წაშლა',
    'company.message': 'მესიჯი',
    'company.pending': 'მოლოდინი',
    'company.interview': 'ინტერვიუ',
    'company.accept': 'მიღება',
    'company.reject': 'უარყოფა',
    'company.questionBreakdown': 'კითხვების ანალიზი',
    'company.answered': 'პასუხია გაცემული',
    'company.noAnswer': 'პასუხი არ არის.',

    'admin.eyebrow': 'ადმინ პანელი',
    'admin.title': 'აქტივობის მიმოხილვა',
    'admin.subtitle': 'ნახე პლატფორმის ბოლო აქტივობა.',
    'admin.backToVacancies': 'ვაკანსიებზე დაბრუნება',
    'admin.totalVacancies': 'სულ ვაკანსია',
    'admin.openVacancies': 'ღია ვაკანსიები',
    'admin.waitingVacancies': 'პასუხის მოლოდინი',
    'admin.cvSubmissions': 'CV-ს გაგზავნები',
    'admin.recentVacancies': 'ბოლო ვაკანსიები',
    'admin.noVacancies': 'ვაკანსიები ჯერ არ შექმნილა.',
    'admin.recentCvs': 'ბოლო CV-ს გაგზავნები',
    'admin.noCvs': 'CV-ს გაგზავნები ჯერ არ არის.',

    'status.submitted': 'გაგზავნილია',
    'status.pending': 'მოლოდინი',
    'status.interview': 'ინტერვიუ',
    'status.accepted': 'მიღებულია',
    'status.rejected': 'უარყოფილია',
    'status.waiting': 'მოლოდინი',

    'role.applicant': 'აპლიკანტი',
    'role.company': 'კომპანია',

    'modal.registrationRequired': 'რეგისტრაცია საჭიროა',
    'modal.register': 'რეგისტრაცია',
    'modal.cancel': 'გაუქმება',

    'require.default': 'გთხოვთ დარეგისტრირდეთ ამ ფუნქციის გამოყენებისთვის.',
    'require.accessArea': 'გთხოვთ დარეგისტრირდეთ ამ ზონაში შესასვლელად.',
    'require.viewProfile': 'პროფილის სანახავად დარეგისტრირდი.',
    'require.startTest': 'ტესტის დასაწყებად დარეგისტრირდი.',
    'require.manageVacancies': 'ვაკანსიების მართვისთვის დარეგისტრირდი.',
    'require.companyTools': 'კომპანიის ინსტრუმენტებისთვის დარეგისტრირდი.',
    'require.takeTest': 'ტესტის გასავლელად დარეგისტრირდი.',
    'require.manageResults': 'შედეგების მართვისთვის დარეგისტრირდი.',
    'require.updateStatuses': 'სტატუსების განახლებისთვის დარეგისტრირდი.',
    'require.useMessaging': 'მესიჯინგის გამოსაყენებლად დარეგისტრირდი.',
    'require.addCv': 'CV-ის დასამატებლად დარეგისტრირდი.',
    'require.manageCvs': 'CV-ების მართვისთვის დარეგისტრირდი.',

    'notifications.acceptedTitle': 'განაცხადი მიღებულია',
    'notifications.interviewTitle': 'მოწვევა ინტერვიუზე',
    'notifications.statusMessage': 'თქვენი განაცხადი პოზიციაზე {title} არის {status}.',
    'notifications.acceptedMessage':
      'გილოცავთ! თქვენ მიიღეთ პოზიციაზე {title}. განვიხილოთ შემდეგი ნაბიჯები.',
    'notifications.interviewMessage':
      'გვსურს მოგიწვიოთ ინტერვიუზე პოზიციაზე {title}.',

    'cv.defaults.noFile': 'ფაილი არ არის ატვირთული',
    'cv.defaults.noDetails': 'დეტალები არ არის მითითებული.',
    'cv.defaults.notProvided': 'არ არის მოწოდებული.',
    'cv.defaults.role': 'პოზიცია',
    'cv.defaults.company': 'კომპანია',
    'cv.defaults.start': 'დაწყება',
    'cv.defaults.present': 'ამჟამად',

    'vacancy.defaults.company': 'კომპანია',
    'vacancy.defaults.remote': 'დისტანციური',
    'vacancy.defaults.notSpecified': 'არ არის მითითებული',
    'vacancy.defaults.noDescription': 'აღწერა ჯერ არ არის დამატებული.',
  },
}

function App() {
  const [authMode, setAuthMode] = useState('login')
  const [isAuthed, setIsAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [page, setPage] = useState('home')
  const [authModal, setAuthModal] = useState({ open: false, message: '' })
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('app_language')
    return stored || 'ka'
  })
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [selectedJobType, setSelectedJobType] = useState('Frontend Developer')
  const [vacancies, setVacancies] = useState([])
  const [companyName, setCompanyName] = useState('')
  const [jobType, setJobType] = useState('')
  const [salary, setSalary] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [minScore, setMinScore] = useState('10')
  const [testMode, setTestMode] = useState('ai')
  const [manualQuestionCount, setManualQuestionCount] = useState(15)
  const [manualQuestions, setManualQuestions] = useState(
    Array.from({ length: 15 }, () => ({
      prompt: '',
      options: ['', '', ''],
      correctIndex: 0,
    })),
  )
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS)
  const [showTimeUp, setShowTimeUp] = useState(false)
  const [answers, setAnswers] = useState([])
  const [activeQuestions, setActiveQuestions] = useState([])
  const [cvFileName, setCvFileName] = useState('')
  const [cvSubmissions, setCvSubmissions] = useState([])
  const [cvProfile, setCvProfile] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    phone: '',
    email: '',
    address: '',
    country: '',
    city: '',
    about: '',
  })
  const [socialLinkInput, setSocialLinkInput] = useState('')
  const [socialLinks, setSocialLinks] = useState([])
  const [workEntry, setWorkEntry] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  })
  const [workEntries, setWorkEntries] = useState([])
  const [educationEntry, setEducationEntry] = useState({
    degree: '',
    school: '',
    faculty: '',
    startDate: '',
    endDate: '',
  })
  const [educationEntries, setEducationEntries] = useState([])
  const [languageEntry, setLanguageEntry] = useState({
    name: '',
    level: '',
  })
  const [languageEntries, setLanguageEntries] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [skillsList, setSkillsList] = useState([])
  const [certificateEntry, setCertificateEntry] = useState({
    title: '',
    organization: '',
    issueDate: '',
  })
  const [certificateEntries, setCertificateEntries] = useState([])
  const [trainingEntry, setTrainingEntry] = useState({
    title: '',
    organization: '',
    startDate: '',
    endDate: '',
  })
  const [trainingEntries, setTrainingEntries] = useState([])
  const [userRole, setUserRole] = useState(() => {
    const stored = localStorage.getItem('user_role')
    return stored || 'applicant'
  })
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('notifications')
    if (!stored) {
      return []
    }
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  })
  const [messageThreads, setMessageThreads] = useState([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [deletingVacancyIds, setDeletingVacancyIds] = useState([])

  useEffect(() => {
    localStorage.setItem('app_language', language)
  }, [language])

  const t = (key, vars = {}) => {
    const template = translations[language]?.[key] ?? translations.en?.[key] ?? key
    return template.replace(/\{(\w+)\}/g, (_, token) =>
      Object.prototype.hasOwnProperty.call(vars, token) ? vars[token] : '',
    )
  }

  const getRoleLabel = (role) =>
    role === 'company' ? t('role.company') : t('role.applicant')

  const getRoleModeLabel = (role) =>
    role === 'company' ? t('nav.companyMode') : t('nav.applicantMode')

  const getStatusLabel = (status) => {
    if (!status) {
      return ''
    }
    return t(`status.${status}`)
  }

  const getJobTitleLabel = (title) =>
    JOB_TYPE_LABELS[language]?.[title] ?? title

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  const handleToggleLanguage = () =>
    setLanguage((prev) => (prev === 'ka' ? 'en' : 'ka'))

  const selectedJob = useMemo(
    () => vacancies.find((job) => job.id === selectedJobId) ?? null,
    [selectedJobId, vacancies],
  )

  const currentUserEmail = authUser?.email?.toLowerCase() ?? ''

  const fetchThreads = async () => {
    try {
      const response = await authFetch('/api/messages/threads')
      if (response.ok) {
        const data = await response.json()
        setMessageThreads(data)
      }
    } catch (error) {
      console.error('Failed to load threads', error)
    }
  }

  const applications = useMemo(() => {
    if (!currentUserEmail) {
      return []
    }

    return vacancies.flatMap((job) =>
      (job.testResults ?? [])
        .filter(
          (result) => result.candidateEmail?.toLowerCase() === currentUserEmail,
        )
        .map((result) => ({
          id: result.id,
          jobId: job.id,
          title: job.title,
          company: job.company,
          status: result.status || 'submitted',
          score: result.score,
          total: result.total,
          submittedAt: result.submittedAt,
        })),
    )
  }, [currentUserEmail, vacancies])

  useEffect(() => {
    localStorage.setItem('user_role', userRole)
  }, [userRole])

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    if (!isAuthed) {
      setMessageThreads([])
      return
    }
    fetchThreads()
  }, [isAuthed])

  useEffect(() => {
    if (!isAuthed || page !== 'messages') {
      return undefined
    }

    fetchThreads()
    const interval = setInterval(fetchThreads, 5000)
    return () => clearInterval(interval)
  }, [isAuthed, page])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const handleUnauthorized = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setIsAuthed(false)
    setAuthUser(null)
    setPage('home')
  }

  const authFetch = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...getAuthHeaders(),
      },
    })
    if (response.status === 401) {
      handleUnauthorized()
    }
    return response
  }

  const handleAuthSubmit = async ({ name, email, password, role }) => {
    setAuthError('')
    setAuthLoading(true)
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.message || 'Authentication failed.')
      }

      if (data?.token) {
        localStorage.setItem('auth_token', data.token)
      }

      if (data?.user) {
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        setAuthUser(data.user)
      }

      if (authMode === 'register' && role) {
        localStorage.setItem('user_role', role)
        setUserRole(role)
      }

      setIsAuthed(true)
      setPage('home')
    } catch (error) {
      setAuthError(error?.message || 'Authentication failed.')
    } finally {
      setAuthLoading(false)
    }
  }

  const openJobTest = (jobId) => {
    const job = vacancies.find((item) => item.id === jobId)
    if (!job?.questionSets?.length || job.testMode === 'none') {
      return
    }
    setSelectedJobId(jobId)
    setPage('test')
    setTimeLeft(TEST_DURATION_SECONDS)
    setShowTimeUp(false)
    setAnswers([])
    const randomSet =
      job.questionSets[Math.floor(Math.random() * job.questionSets.length)]
    setActiveQuestions(randomSet)
  }

  const handleDeleteVacancy = (jobId) => {
    if (deletingVacancyIds.includes(jobId)) {
      return
    }
    setDeletingVacancyIds((prev) =>
      prev.includes(jobId) ? prev : [...prev, jobId],
    )
    const deleteVacancy = async () => {
      try {
        const response = await authFetch(`/api/vacancies/${jobId}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete vacancy')
        }
        setVacancies((prev) => prev.filter((job) => job.id !== jobId))
        if (selectedJobId === jobId) {
          setSelectedJobId(null)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setDeletingVacancyIds((prev) => prev.filter((id) => id !== jobId))
      }
    }

    deleteVacancy()
  }

  const handleFinishTest = () => {
    if (!selectedJobId) {
      return
    }

    const normalizedAnswers = activeQuestions.map((_, index) =>
      typeof answers[index] === 'number' ? answers[index] : null,
    )
    const score = activeQuestions.reduce((total, question, index) => {
      if (normalizedAnswers[index] === question.correctIndex) {
        return total + 1
      }
      return total
    }, 0)
    const resultEntry = {
      id: `result-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      score,
      total: activeQuestions.length,
      questions: activeQuestions,
      answers: normalizedAnswers,
      candidateEmail: authUser?.email ?? 'anonymous',
      candidateName: authUser?.name ?? 'Candidate',
      status: 'submitted',
    }

    setVacancies((prev) =>
      prev.map((job) =>
        job.id === selectedJobId
          ? {
              ...job,
              status: 'waiting',
              tryAgain: false,
              testResults: [resultEntry, ...(job.testResults ?? [])],
            }
          : job,
      ),
    )
    authFetch(`/api/vacancies/${selectedJobId}/results`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: resultEntry, status: 'waiting', tryAgain: false }),
    }).catch((error) => {
      console.error('Failed to save test result', error)
    })
    setPage('vacancies')
  }

  const handleAbandonTest = () => {
    setPage('vacancies')
  }

  const handleTimeUpOk = () => {
    if (selectedJobId) {
      setVacancies((prev) =>
        prev.map((job) =>
          job.id === selectedJobId ? { ...job, tryAgain: true } : job,
        ),
      )
      authFetch(`/api/vacancies/${selectedJobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tryAgain: true }),
      }).catch((error) => {
        console.error('Failed to update vacancy', error)
      })
    }
    setShowTimeUp(false)
    setPage('vacancies')
  }

  const addSocialLink = () => {
    const value = socialLinkInput.trim()
    if (!value) {
      return
    }
    setSocialLinks((prev) => [value, ...prev])
    setSocialLinkInput('')
  }

  const addWorkEntry = () => {
    const hasContent =
      workEntry.position.trim() || workEntry.company.trim() || workEntry.description.trim()
    if (!hasContent) {
      return
    }
    setWorkEntries((prev) => [workEntry, ...prev])
    setWorkEntry({
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    })
  }

  const clearWorkEntry = () => {
    setWorkEntry({
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    })
  }

  const addEducationEntry = () => {
    const hasContent =
      educationEntry.degree.trim() || educationEntry.school.trim() || educationEntry.faculty.trim()
    if (!hasContent) {
      return
    }
    setEducationEntries((prev) => [educationEntry, ...prev])
    setEducationEntry({
      degree: '',
      school: '',
      faculty: '',
      startDate: '',
      endDate: '',
    })
  }

  const clearEducationEntry = () => {
    setEducationEntry({
      degree: '',
      school: '',
      faculty: '',
      startDate: '',
      endDate: '',
    })
  }

  const addLanguageEntry = () => {
    if (!languageEntry.name.trim() || !languageEntry.level.trim()) {
      return
    }
    setLanguageEntries((prev) => [languageEntry, ...prev])
    setLanguageEntry({ name: '', level: '' })
  }

  const addSkill = () => {
    const value = skillInput.trim()
    if (!value) {
      return
    }
    setSkillsList((prev) => [value, ...prev])
    setSkillInput('')
  }

  const addCertificateEntry = () => {
    const hasContent =
      certificateEntry.title.trim() || certificateEntry.organization.trim() || certificateEntry.issueDate.trim()
    if (!hasContent) {
      return
    }
    setCertificateEntries((prev) => [certificateEntry, ...prev])
    setCertificateEntry({ title: '', organization: '', issueDate: '' })
  }

  const clearCertificateEntry = () => {
    setCertificateEntry({ title: '', organization: '', issueDate: '' })
  }

  const addTrainingEntry = () => {
    const hasContent =
      trainingEntry.title.trim() || trainingEntry.organization.trim() || trainingEntry.startDate.trim()
    if (!hasContent) {
      return
    }
    setTrainingEntries((prev) => [trainingEntry, ...prev])
    setTrainingEntry({ title: '', organization: '', startDate: '', endDate: '' })
  }

  const clearTrainingEntry = () => {
    setTrainingEntry({ title: '', organization: '', startDate: '', endDate: '' })
  }

  const handleSaveCv = async () => {
    const personalParts = [
      `${cvProfile.firstName} ${cvProfile.lastName}`.trim(),
      cvProfile.profession,
      cvProfile.phone,
      cvProfile.email,
      cvProfile.address,
      [cvProfile.city, cvProfile.country].filter(Boolean).join(', '),
    ]
      .map((item) => item.trim())
      .filter(Boolean)

    const workText = workEntries
      .map((entry) => {
        const dates = entry.current
          ? `${entry.startDate || t('cv.defaults.start')} - ${t('cv.defaults.present')}`
          : [entry.startDate, entry.endDate].filter(Boolean).join(' - ')
        return [entry.position, entry.company, dates, entry.description]
          .map((item) => item.trim())
          .filter(Boolean)
          .join(' • ')
      })
      .filter(Boolean)
      .join('\n')

    const educationText = educationEntries
      .map((entry) => {
        const dates = [entry.startDate, entry.endDate].filter(Boolean).join(' - ')
        return [entry.degree, entry.school, entry.faculty, dates]
          .map((item) => item.trim())
          .filter(Boolean)
          .join(' • ')
      })
      .filter(Boolean)
      .join('\n')

    const languageText = languageEntries
      .map((entry) => `${entry.name} ${entry.level}`.trim())
      .filter(Boolean)
      .join(', ')

    const skillsText = skillsList.join(', ')

    const certificatesText = certificateEntries
      .map((entry) => [entry.title, entry.organization, entry.issueDate]
        .map((item) => item.trim())
        .filter(Boolean)
        .join(' • '))
      .filter(Boolean)
      .join('\n')

    const trainingsText = trainingEntries
      .map((entry) => {
        const dates = [entry.startDate, entry.endDate].filter(Boolean).join(' - ')
        return [entry.title, entry.organization, dates]
          .map((item) => item.trim())
          .filter(Boolean)
          .join(' • ')
      })
      .filter(Boolean)
      .join('\n')

    const socialText = socialLinks.join(', ')

    const parts = [
      personalParts.join(' • '),
      cvProfile.about.trim(),
      workText,
      educationText,
      languageText,
      skillsText,
      certificatesText,
      trainingsText,
      socialText,
    ].filter(Boolean)

    if (parts.length === 0 && !cvFileName) {
      return
    }

    const summaryText = parts.join(' · ')

    const submission = {
      id: `cv-${Date.now()}`,
      fileName: cvFileName || t('cv.defaults.noFile'),
      summary: summaryText.slice(0, 160) || t('cv.defaults.noDetails'),
      personalInfo: personalParts.join(' • '),
      workExperience: workText,
      education: educationText,
      languages: languageText,
      skills: skillsText,
      certificates: certificatesText,
      trainings: trainingsText,
      socialNetworks: socialText,
    }

    try {
      const response = await authFetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })
      const saved = await response.json().catch(() => null)
      if (response.ok && saved) {
        setCvSubmissions((prev) => [saved, ...prev])
      } else {
        setCvSubmissions((prev) => [submission, ...prev])
      }
    } catch (error) {
      console.error('Failed to save CV', error)
      setCvSubmissions((prev) => [submission, ...prev])
    }
    setPage('cvs')
  }

  const handleDeleteCv = (cvId) => {
    const removeCv = async () => {
      try {
        const response = await authFetch(`/api/cvs/${cvId}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete CV')
        }
        setCvSubmissions((prev) => prev.filter((cv) => cv.id !== cvId))
      } catch (error) {
        console.error(error)
      }
    }

    removeCv()
  }

  const handleDeleteResult = (jobId, resultId) => {
    setVacancies((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              testResults: (job.testResults ?? []).filter(
                (result) => result.id !== resultId,
              ),
            }
          : job,
      ),
    )

    authFetch(`/api/vacancies/${jobId}/results/${resultId}`, {
      method: 'DELETE',
    }).catch((error) => {
      console.error('Failed to delete result', error)
    })
  }

  const handlePublish = async () => {
    if (isPublishing) {
      return
    }
    setIsPublishing(true)
    const normalizedManualQuestions = normalizeManualQuestions(manualQuestions)
    const normalizedMinScore = Number.parseInt(minScore, 10)
    const companyLabel = companyName.trim() || t('vacancy.defaults.company')
    const questionSets =
      testMode === 'ai'
        ? generateQuestionSets(selectedJobType, companyLabel)
        : testMode === 'manual'
          ? generateManualQuestionSets(normalizedManualQuestions)
          : []

    const newVacancy = {
      id: `job-${Date.now()}`,
      title: selectedJobType,
      company: companyLabel,
      location: location.trim() || t('vacancy.defaults.remote'),
      type: jobType.trim() || t('vacancy.defaults.notSpecified'),
      salary: salary.trim() || t('vacancy.defaults.notSpecified'),
      description: description.trim() || t('vacancy.defaults.noDescription'),
      minScore: Number.isFinite(normalizedMinScore) ? normalizedMinScore : 0,
      testMode,
      questionSets,
      status: 'open',
      tryAgain: false,
    }

    try {
      const response = await authFetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVacancy),
      })
      const saved = await response.json().catch(() => null)
      if (response.ok && saved) {
        setVacancies((prev) => [saved, ...prev])
        setSelectedJobId(saved.id)
      } else {
        setVacancies((prev) => [newVacancy, ...prev])
        setSelectedJobId(newVacancy.id)
      }
    } catch (error) {
      console.error('Failed to publish vacancy', error)
      setVacancies((prev) => [newVacancy, ...prev])
      setSelectedJobId(newVacancy.id)
    } finally {
      setIsPublishing(false)
    }
    setPage('vacancies')
  }

  useEffect(() => {
    if (page !== 'test' || !selectedJob || showTimeUp) {
      return undefined
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [page, selectedJob, showTimeUp])

  useEffect(() => {
    if (page !== 'test') {
      return undefined
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPage('vacancies')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [page])

  useEffect(() => {
    const existingToken = localStorage.getItem('auth_token')
    if (existingToken) {
      try {
        const payload = JSON.parse(
          atob(existingToken.split('.')[1] || ''),
        )
        const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false
        if (isExpired) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        } else {
          setIsAuthed(true)
        }
      } catch {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        setAuthUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('auth_user')
      }
    }
  }, [])

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [vacancyResponse, cvResponse] = await Promise.all([
          fetch('/api/vacancies'),
          fetch('/api/cvs'),
        ])

        if (vacancyResponse.ok) {
          const vacancyData = await vacancyResponse.json()
          setVacancies(vacancyData)
        }

        if (cvResponse.ok) {
          const cvData = await cvResponse.json()
          setCvSubmissions(cvData)
        }
      } catch (error) {
        console.error('Failed to load initial data', error)
      }
    }

    loadInitialData()
  }, [])

  const isAdmin = authUser?.email?.toLowerCase() === 'dtbkyroxxx@gmail.com'

  useEffect(() => {
    if (page === 'admin' && !isAdmin) {
      setPage('vacancies')
    }
  }, [page, isAdmin])

  useEffect(() => {
    if (!isAuthed && !['home', 'vacancies', 'auth'].includes(page)) {
      setPage('home')
    }
  }, [isAuthed, page])

  const unreadNotifications = notifications.filter(
    (item) =>
      !item.read && item.recipientEmail?.toLowerCase() === currentUserEmail,
  )

  const handleNotificationRead = () => {
    if (!currentUserEmail) {
      return
    }
    setNotifications((prev) =>
      prev.map((item) =>
        item.recipientEmail?.toLowerCase() === currentUserEmail
          ? { ...item, read: true }
          : item,
      ),
    )
  }

  const addNotification = (recipientEmail, title, message) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        recipientEmail,
        title,
        message,
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ])
  }

  const ensureThread = async ({
    jobId,
    jobTitle,
    company,
    candidateEmail,
    companyEmail,
  }) => {
    const existing = messageThreads.find(
      (thread) =>
        thread.jobId === jobId &&
        thread.candidateEmail?.toLowerCase() === candidateEmail?.toLowerCase(),
    )
    if (existing) {
      return existing
    }

    const response = await authFetch('/api/messages/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, jobTitle, company, candidateEmail, companyEmail }),
    })

    const thread = await response.json().catch(() => null)
    if (!thread) {
      return null
    }

    setMessageThreads((prev) => {
      const filtered = prev.filter((item) => item.id !== thread.id)
      return [thread, ...filtered]
    })
    return thread
  }

  const handleSendMessage = async (threadId, message, sender) => {
    if (!message.trim()) {
      return
    }

    try {
      const response = await authFetch(`/api/messages/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, body: message.trim() }),
      })
      const updated = await response.json().catch(() => null)
      if (response.ok && updated) {
        setMessageThreads((prev) => {
          const filtered = prev.filter((item) => item.id !== updated.id)
          return [updated, ...filtered]
        })
      }
    } catch (error) {
      console.error('Failed to send message', error)
    }
  }

  const handleUpdateResultStatus = async (jobId, resultId, status) => {
    const job = vacancies.find((item) => item.id === jobId)
    const result = job?.testResults?.find((item) => item.id === resultId)

    setVacancies((prev) =>
      prev.map((item) =>
        item.id === jobId
          ? {
              ...item,
              testResults: (item.testResults ?? []).map((entry) =>
                entry.id === resultId ? { ...entry, status } : entry,
              ),
            }
          : item,
      ),
    )

    authFetch(`/api/vacancies/${jobId}/results/${resultId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((error) => {
      console.error('Failed to update result', error)
    })

    if (result?.candidateEmail && (status === 'accepted' || status === 'interview')) {
      addNotification(
        result.candidateEmail,
        status === 'accepted'
          ? t('notifications.acceptedTitle')
          : t('notifications.interviewTitle'),
        t('notifications.statusMessage', {
          title: getJobTitleLabel(job?.title ?? t('cv.defaults.role')),
          status: getStatusLabel(status),
        }),
      )

      const thread = await ensureThread({
        jobId,
        jobTitle: job?.title ?? 'Role',
        company: job?.company ?? 'Company',
        candidateEmail: result.candidateEmail,
        companyEmail: job?.createdBy?.email,
      })

      if (thread) {
        handleSendMessage(
          thread.id,
          status === 'accepted'
            ? t('notifications.acceptedMessage', {
                title: getJobTitleLabel(job?.title ?? t('cv.defaults.role')),
              })
            : t('notifications.interviewMessage', {
                title: getJobTitleLabel(job?.title ?? t('cv.defaults.role')),
              }),
          'company',
        )
      }
    }
  }

  const hideTopNav = page === 'cv'

  const requireAuth = (message, action) => {
    if (!isAuthed) {
      setAuthModal({
        open: true,
        message: message || t('require.default'),
      })
      return
    }
    action?.()
  }

  const handleNavigate = (next) => {
    if (!isAuthed && !['home', 'vacancies', 'auth'].includes(next)) {
      setAuthModal({
        open: true,
        message: t('require.accessArea'),
      })
      return
    }
    if (next === 'messages') {
      handleNotificationRead()
    }
    setPage(next)
  }

  return (
    <div className="app-shell">
      {!hideTopNav && (
        <TopNav
          page={page}
          onNavigate={handleNavigate}
          showAdmin={isAdmin}
          userRole={userRole}
          notificationCount={unreadNotifications.length}
          isAuthed={isAuthed}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          t={t}
          getRoleModeLabel={getRoleModeLabel}
          onAuthRegister={() => {
            setAuthMode('register')
            setPage('auth')
          }}
          onAuthLogin={() => {
            setAuthMode('login')
            setPage('auth')
          }}
        />
      )}
      <main className="main-content" id="main-content">
      {page === 'home' && (
        <HomePage
          onStart={() => setPage('vacancies')}
          onViewProfile={() =>
            requireAuth(t('require.viewProfile'), () => setPage('profile'))
          }
          onRegister={() => {
            setAuthMode('register')
            setPage('auth')
          }}
          isAuthed={isAuthed}
          t={t}
        />
      )}
      {page === 'auth' && (
        <AuthScreen
          authMode={authMode}
          isSubmitting={authLoading}
          errorMessage={authError}
          onSubmit={handleAuthSubmit}
          onToggleMode={() => {
            setAuthError('')
            setAuthMode(authMode === 'login' ? 'register' : 'login')
          }}
          t={t}
        />
      )}
      {page === 'vacancies' && (
        <VacanciesPage
          vacancies={vacancies}
          onOpenJobTest={(jobId) =>
            requireAuth(t('require.startTest'), () => openJobTest(jobId))
          }
          onDeleteVacancy={(jobId) =>
            requireAuth(t('require.manageVacancies'), () =>
              handleDeleteVacancy(jobId),
            )
          }
          onGoCompany={() =>
            requireAuth(t('require.companyTools'), () =>
              setPage('company'),
            )
          }
          onLogout={() => {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            setIsAuthed(false)
            setAuthUser(null)
            setPage('home')
          }}
          currentUserEmail={currentUserEmail}
          isAuthed={isAuthed}
          t={t}
          getStatusLabel={getStatusLabel}
          getJobTitleLabel={getJobTitleLabel}
          deletingVacancyIds={deletingVacancyIds}
        />
      )}
      {page === 'tests' && (
        <TestsPage
          vacancies={vacancies}
          applications={applications}
          onOpenJobTest={(jobId) =>
            requireAuth(t('require.takeTest'), () => openJobTest(jobId))
          }
          currentUserEmail={currentUserEmail}
          onBack={() => setPage('vacancies')}
          t={t}
          getJobTitleLabel={getJobTitleLabel}
        />
      )}
      {page === 'profile' && (
        <ProfilePage
          authUser={authUser}
          userRole={userRole}
          applications={applications}
          notifications={notifications}
          onViewMessages={() => setPage('messages')}
          onBrowseJobs={() => setPage('vacancies')}
          onRoleChange={setUserRole}
          onLogout={() => {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            setIsAuthed(false)
            setAuthUser(null)
            setPage('home')
          }}
          t={t}
          getRoleLabel={getRoleLabel}
          getStatusLabel={getStatusLabel}
          getJobTitleLabel={getJobTitleLabel}
        />
      )}
      {page === 'messages' && (
        <MessagesPage
          userRole={userRole}
          authUser={authUser}
          threads={messageThreads}
          applications={applications}
          vacancies={vacancies}
          onStartThread={ensureThread}
          onSendMessage={handleSendMessage}
          onBack={() => setPage('vacancies')}
          t={t}
          getJobTitleLabel={getJobTitleLabel}
        />
      )}
      {page === 'admin' && isAdmin && (
        <AdminPage
          vacancies={vacancies}
          cvSubmissions={cvSubmissions}
          onBack={() => setPage('vacancies')}
          t={t}
          getJobTitleLabel={getJobTitleLabel}
        />
      )}
      {page === 'company' && (
        <CompanyPage
          vacancies={vacancies}
          onDeleteResult={(jobId, resultId) =>
            requireAuth(t('require.manageResults'), () =>
              handleDeleteResult(jobId, resultId),
            )
          }
          onUpdateResultStatus={(jobId, resultId, status) =>
            requireAuth(t('require.updateStatuses'), () =>
              handleUpdateResultStatus(jobId, resultId, status),
            )
          }
          onOpenMessages={(jobId, result) =>
            requireAuth(t('require.useMessaging'), () => {
              const job = vacancies.find((item) => item.id === jobId)
              if (!job || !result?.candidateEmail) {
                return
              }
              ensureThread({
                jobId,
                jobTitle: job.title,
                company: job.company,
                candidateEmail: result.candidateEmail,
                companyEmail: job?.createdBy?.email,
              }).then(() => setPage('messages'))
            })
          }
          selectedJobType={selectedJobType}
          setSelectedJobType={setSelectedJobType}
          companyName={companyName}
          setCompanyName={setCompanyName}
          jobType={jobType}
          setJobType={setJobType}
          salary={salary}
          setSalary={setSalary}
          location={location}
          setLocation={setLocation}
          description={description}
          setDescription={setDescription}
          minScore={minScore}
          setMinScore={setMinScore}
          testMode={testMode}
          setTestMode={setTestMode}
          manualQuestionCount={manualQuestionCount}
          setManualQuestionCount={setManualQuestionCount}
          manualQuestions={manualQuestions}
          setManualQuestions={setManualQuestions}
          onPublish={handlePublish}
          onBack={() => setPage('vacancies')}
          t={t}
          getStatusLabel={getStatusLabel}
          getJobTitleLabel={getJobTitleLabel}
          isPublishing={isPublishing}
        />
      )}
      {page === 'test' && (
        <TestPage
          selectedJob={selectedJob}
          timeLeft={timeLeft}
          activeQuestions={activeQuestions}
          answers={answers}
          setAnswers={setAnswers}
          showTimeUp={showTimeUp}
          onFinish={handleFinishTest}
          onAbandon={handleAbandonTest}
          onTimeUpOk={handleTimeUpOk}
          onBack={() => setPage('vacancies')}
          t={t}
          getJobTitleLabel={getJobTitleLabel}
          formatTime={formatTime}
        />
      )}
      {page === 'cv' && (
        <CvFormPage
          onBack={() => setPage('vacancies')}
          cvFileName={cvFileName}
          onFileChange={(event) =>
            setCvFileName(event.target.files?.[0]?.name ?? '')
          }
          cvProfile={cvProfile}
          setCvProfile={setCvProfile}
          socialLinkInput={socialLinkInput}
          setSocialLinkInput={setSocialLinkInput}
          socialLinks={socialLinks}
          onAddSocialLink={addSocialLink}
          workEntry={workEntry}
          setWorkEntry={setWorkEntry}
          workEntries={workEntries}
          onAddWorkEntry={addWorkEntry}
          onClearWorkEntry={clearWorkEntry}
          educationEntry={educationEntry}
          setEducationEntry={setEducationEntry}
          educationEntries={educationEntries}
          onAddEducationEntry={addEducationEntry}
          onClearEducationEntry={clearEducationEntry}
          languageEntry={languageEntry}
          setLanguageEntry={setLanguageEntry}
          languageEntries={languageEntries}
          onAddLanguageEntry={addLanguageEntry}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          skillsList={skillsList}
          onAddSkill={addSkill}
          certificateEntry={certificateEntry}
          setCertificateEntry={setCertificateEntry}
          certificateEntries={certificateEntries}
          onAddCertificateEntry={addCertificateEntry}
          onClearCertificateEntry={clearCertificateEntry}
          trainingEntry={trainingEntry}
          setTrainingEntry={setTrainingEntry}
          trainingEntries={trainingEntries}
          onAddTrainingEntry={addTrainingEntry}
          onClearTrainingEntry={clearTrainingEntry}
          onSave={handleSaveCv}
          t={t}
        />
      )}
      {page === 'cvs' && (
        <CvListPage
          cvSubmissions={cvSubmissions}
          onAddCv={() => requireAuth(t('require.addCv'), () => setPage('cv'))}
          onBackVacancies={() => setPage('vacancies')}
          onDeleteCv={(cvId) =>
            requireAuth(t('require.manageCvs'), () => handleDeleteCv(cvId))
          }
          t={t}
        />
      )}
      </main>
      {authModal.open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>{t('modal.registrationRequired')}</h3>
            <p className="muted">{authModal.message}</p>
            <div className="test-actions">
              <button
                className="primary"
                type="button"
                onClick={() => {
                  setAuthModal({ open: false, message: '' })
                  setAuthMode('register')
                  setPage('auth')
                }}
              >
                {t('modal.register')}
              </button>
              <button
                className="ghost"
                type="button"
                onClick={() => setAuthModal({ open: false, message: '' })}
              >
                {t('modal.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
