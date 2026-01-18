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
import {
  TEST_DURATION_SECONDS,
  generateManualQuestionSets,
  generateQuestionSets,
} from './utils/testUtils'

function App() {
  const [authMode, setAuthMode] = useState('login')
  const [isAuthed, setIsAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [page, setPage] = useState('vacancies')
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
  const [personalInfo, setPersonalInfo] = useState('')
  const [workExperience, setWorkExperience] = useState('')
  const [education, setEducation] = useState('')
  const [languages, setLanguages] = useState('')
  const [skills, setSkills] = useState('')
  const [certificates, setCertificates] = useState('')
  const [trainings, setTrainings] = useState('')
  const [socialNetworks, setSocialNetworks] = useState('')

  const selectedJob = useMemo(
    () => vacancies.find((job) => job.id === selectedJobId) ?? null,
    [selectedJobId, vacancies],
  )

  const handleAuthSubmit = async ({ name, email, password }) => {
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

      setIsAuthed(true)
      setPage('vacancies')
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
        const response = await fetch(`/api/vacancies/${jobId}`, { method: 'DELETE' })
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
      (answers[index] ?? '').trim(),
    )
    const score = normalizedAnswers.filter(Boolean).length
    const resultEntry = {
      id: `result-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      score,
      total: activeQuestions.length,
      questions: activeQuestions,
      answers: normalizedAnswers,
      candidateEmail: authUser?.email ?? 'anonymous',
      candidateName: authUser?.name ?? 'Candidate',
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
    }
    setShowTimeUp(false)
    setPage('vacancies')
  }

  const handleSaveCv = () => {
    const parts = [
      personalInfo,
      workExperience,
      education,
      languages,
      skills,
      certificates,
      trainings,
      socialNetworks,
    ]
      .map((item) => item.trim())
      .filter(Boolean)

    if (parts.length === 0 && !cvFileName) {
      return
    }

    const summaryText = parts.join(' · ')

    const submission = {
      id: `cv-${Date.now()}`,
      fileName: cvFileName || 'No file uploaded',
      summary: summaryText.slice(0, 160) || 'No details provided.',
      personalInfo: personalInfo.trim(),
      workExperience: workExperience.trim(),
      education: education.trim(),
      languages: languages.trim(),
      skills: skills.trim(),
      certificates: certificates.trim(),
      trainings: trainings.trim(),
      socialNetworks: socialNetworks.trim(),
    }

    setCvSubmissions((prev) => [submission, ...prev])
    setPage('cvs')
  }

  const handleDeleteCv = (cvId) => {
    setCvSubmissions((prev) => prev.filter((cv) => cv.id !== cvId))
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
  }

  const handlePublish = () => {
    const manualQuestions = manualTest
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
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

    setVacancies((prev) => [newVacancy, ...prev])
    setSelectedJobId(newVacancy.id)
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

  if (!isAuthed) {
    return (
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
    )
  }

  const hideTopNav = page === 'cv' || page === 'company'

  return (
    <div className="app-shell">
      {!hideTopNav && (
        <TopNav page={page} onNavigate={setPage} showAdmin={isAdmin} />
      )}
      {page === 'vacancies' && (
        <VacanciesPage
          vacancies={vacancies}
          onOpenJobTest={openJobTest}
          onDeleteVacancy={handleDeleteVacancy}
          onGoCompany={() => setPage('company')}
          onLogout={() => {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            setIsAuthed(false)
            setAuthUser(null)
          }}
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
          onDeleteResult={handleDeleteResult}
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
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          workExperience={workExperience}
          setWorkExperience={setWorkExperience}
          education={education}
          setEducation={setEducation}
          languages={languages}
          setLanguages={setLanguages}
          skills={skills}
          setSkills={setSkills}
          certificates={certificates}
          setCertificates={setCertificates}
          trainings={trainings}
          setTrainings={setTrainings}
          socialNetworks={socialNetworks}
          setSocialNetworks={setSocialNetworks}
          onSave={handleSaveCv}
        />
      )}
      {page === 'cvs' && (
        <CvListPage
          cvSubmissions={cvSubmissions}
          onAddCv={() => setPage('cv')}
          onBackVacancies={() => setPage('vacancies')}
          onDeleteCv={handleDeleteCv}
        />
      )}
    </div>
  )
}

export default App
