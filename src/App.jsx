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
  parseManualQuestions,
} from './utils/testUtils'

function App() {
  const [authMode, setAuthMode] = useState('login')
  const [isAuthed, setIsAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [page, setPage] = useState('home')
  const [authModal, setAuthModal] = useState({ open: false, message: '' })
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
  const [manualTest, setManualTest] = useState('')
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
  const [messageThreads, setMessageThreads] = useState(() => {
    const stored = localStorage.getItem('message_threads')
    if (!stored) {
      return []
    }
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  })

  const selectedJob = useMemo(
    () => vacancies.find((job) => job.id === selectedJobId) ?? null,
    [selectedJobId, vacancies],
  )

  const currentUserEmail = authUser?.email?.toLowerCase() ?? ''

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
    localStorage.setItem('message_threads', JSON.stringify(messageThreads))
  }, [messageThreads])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
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
    setSelectedJobId(jobId)
    setPage('test')
    setTimeLeft(TEST_DURATION_SECONDS)
    setShowTimeUp(false)
    setAnswers([])
    const job = vacancies.find((item) => item.id === jobId)
    if (job?.questionSets?.length) {
      const randomSet =
        job.questionSets[Math.floor(Math.random() * job.questionSets.length)]
      setActiveQuestions(randomSet)
    } else {
      setActiveQuestions([])
    }
  }

  const handleDeleteVacancy = (jobId) => {
    const deleteVacancy = async () => {
      try {
        const response = await fetch(`/api/vacancies/${jobId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
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
    fetch(`/api/vacancies/${selectedJobId}/results`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
      fetch(`/api/vacancies/${selectedJobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
          ? `${entry.startDate || 'Start'} - Present`
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
      fileName: cvFileName || 'No file uploaded',
      summary: summaryText.slice(0, 160) || 'No details provided.',
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
      const response = await fetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
        const response = await fetch(`/api/cvs/${cvId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
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

    fetch(`/api/vacancies/${jobId}/results/${resultId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch((error) => {
      console.error('Failed to delete result', error)
    })
  }

  const handlePublish = async () => {
    const manualQuestions = parseManualQuestions(manualTest)
    const normalizedMinScore = Number.parseInt(minScore, 10)
    const companyLabel = companyName.trim() || 'Company'
    const questionSets =
      testMode === 'ai'
        ? generateQuestionSets(selectedJobType, companyLabel)
        : generateManualQuestionSets(manualQuestions)

    const newVacancy = {
      id: `job-${Date.now()}`,
      title: selectedJobType,
      company: companyLabel,
      location: location.trim() || 'Remote',
      type: jobType.trim() || 'Not specified',
      salary: salary.trim() || 'Not specified',
      description: description.trim() || 'No description added yet.',
      minScore: Number.isFinite(normalizedMinScore) ? normalizedMinScore : 0,
      testMode,
      questionSets,
      status: 'open',
      tryAgain: false,
    }

    try {
      const response = await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
      setIsAuthed(true)
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

  const ensureThread = ({ jobId, jobTitle, company, candidateEmail }) => {
    const existing = messageThreads.find(
      (thread) =>
        thread.jobId === jobId &&
        thread.candidateEmail?.toLowerCase() === candidateEmail?.toLowerCase(),
    )
    if (existing) {
      return existing
    }
    const created = {
      id: `thread-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      jobId,
      jobTitle,
      company,
      candidateEmail,
      messages: [],
    }
    setMessageThreads((prev) => [created, ...prev])
    return created
  }

  const handleSendMessage = (threadId, message, sender) => {
    if (!message.trim()) {
      return
    }
    setMessageThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              messages: [
                {
                  id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                  sender,
                  body: message.trim(),
                  sentAt: new Date().toISOString(),
                },
                ...thread.messages,
              ],
            }
          : thread,
      ),
    )
  }

  const handleUpdateResultStatus = (jobId, resultId, status) => {
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

    fetch(`/api/vacancies/${jobId}/results/${resultId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status }),
    }).catch((error) => {
      console.error('Failed to update result', error)
    })

    if (result?.candidateEmail && (status === 'accepted' || status === 'interview')) {
      addNotification(
        result.candidateEmail,
        status === 'accepted' ? 'Application accepted' : 'Interview requested',
        `Your application for ${job?.title ?? 'a role'} has been ${status}.`,
      )

      const thread = ensureThread({
        jobId,
        jobTitle: job?.title ?? 'Role',
        company: job?.company ?? 'Company',
        candidateEmail: result.candidateEmail,
      })

      handleSendMessage(
        thread.id,
        status === 'accepted'
          ? `Congrats! We have accepted you for ${job?.title ?? 'the role'}. Let's discuss next steps.`
          : `We would like to invite you to an interview for ${job?.title ?? 'the role'}.`,
        'company',
      )
    }
  }

  const hideTopNav = page === 'cv'

  const requireAuth = (message, action) => {
    if (!isAuthed) {
      setAuthModal({
        open: true,
        message: message || 'Please register to use this feature.',
      })
      return
    }
    action?.()
  }

  const handleNavigate = (next) => {
    if (!isAuthed && !['home', 'vacancies', 'auth'].includes(next)) {
      setAuthModal({
        open: true,
        message: 'Please register to access this area.',
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
      {page === 'home' && (
        <HomePage
          onStart={() => setPage('vacancies')}
          onViewProfile={() =>
            requireAuth('Register to view your profile.', () => setPage('profile'))
          }
          onRegister={() => {
            setAuthMode('register')
            setPage('auth')
          }}
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
        />
      )}
      {page === 'vacancies' && (
        <VacanciesPage
          vacancies={vacancies}
          onOpenJobTest={(jobId) =>
            requireAuth('Register to start the test.', () => openJobTest(jobId))
          }
          onDeleteVacancy={(jobId) =>
            requireAuth('Register to manage vacancies.', () =>
              handleDeleteVacancy(jobId),
            )
          }
          onGoCompany={() =>
            requireAuth('Register to access company tools.', () =>
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
        />
      )}
      {page === 'tests' && (
        <TestsPage
          vacancies={vacancies}
          applications={applications}
          onOpenJobTest={(jobId) =>
            requireAuth('Register to take a test.', () => openJobTest(jobId))
          }
          currentUserEmail={currentUserEmail}
          onBack={() => setPage('vacancies')}
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
        />
      )}
      {page === 'messages' && (
        <MessagesPage
          userRole={userRole}
          authUser={authUser}
          threads={messageThreads}
          onSendMessage={handleSendMessage}
          onBack={() => setPage('vacancies')}
        />
      )}
      {page === 'admin' && isAdmin && (
        <AdminPage
          vacancies={vacancies}
          cvSubmissions={cvSubmissions}
          onBack={() => setPage('vacancies')}
        />
      )}
      {page === 'company' && (
        <CompanyPage
          vacancies={vacancies}
          onDeleteResult={(jobId, resultId) =>
            requireAuth('Register to manage results.', () =>
              handleDeleteResult(jobId, resultId),
            )
          }
          onUpdateResultStatus={(jobId, resultId, status) =>
            requireAuth('Register to update statuses.', () =>
              handleUpdateResultStatus(jobId, resultId, status),
            )
          }
          onOpenMessages={(jobId, result) =>
            requireAuth('Register to use messaging.', () => {
              const job = vacancies.find((item) => item.id === jobId)
              if (!job || !result?.candidateEmail) {
                return
              }
              ensureThread({
                jobId,
                jobTitle: job.title,
                company: job.company,
                candidateEmail: result.candidateEmail,
              })
              setPage('messages')
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
          manualTest={manualTest}
          setManualTest={setManualTest}
          onPublish={handlePublish}
          onBack={() => setPage('vacancies')}
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
        />
      )}
      {page === 'cvs' && (
        <CvListPage
          cvSubmissions={cvSubmissions}
          onAddCv={() =>
            requireAuth('Register to add your CV.', () => setPage('cv'))
          }
          onBackVacancies={() => setPage('vacancies')}
          onDeleteCv={(cvId) =>
            requireAuth('Register to manage CVs.', () => handleDeleteCv(cvId))
          }
        />
      )}
      {authModal.open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>Registration required</h3>
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
                Register
              </button>
              <button
                className="ghost"
                type="button"
                onClick={() => setAuthModal({ open: false, message: '' })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
