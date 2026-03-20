export const PUBLIC_PAGES = new Set(['home', 'vacancies', 'vacancy', 'auth'])

export const parseRoute = (pathname = '/') => {
  const segments = pathname
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)

  if (segments.length === 0) {
    return { page: 'home', authMode: 'login', selectedJobId: null }
  }

  const [first, second] = segments
  const selectedJobId = second ? decodeURIComponent(second) : null

  switch (first) {
    case 'vacancies':
      return second
        ? { page: 'vacancy', authMode: 'login', selectedJobId }
        : { page: 'vacancies', authMode: 'login', selectedJobId: null }
    case 'login':
      return { page: 'auth', authMode: 'login', selectedJobId: null }
    case 'register':
      return { page: 'auth', authMode: 'register', selectedJobId: null }
    case 'tests':
      return second
        ? { page: 'test', authMode: 'login', selectedJobId }
        : { page: 'tests', authMode: 'login', selectedJobId: null }
    case 'profile':
      return { page: 'profile', authMode: 'login', selectedJobId: null }
    case 'messages':
      return { page: 'messages', authMode: 'login', selectedJobId: null }
    case 'company':
      return { page: 'company', authMode: 'login', selectedJobId: null }
    case 'admin':
      return { page: 'admin', authMode: 'login', selectedJobId: null }
    case 'cvs':
      return second === 'new'
        ? { page: 'cv', authMode: 'login', selectedJobId: null }
        : { page: 'cvs', authMode: 'login', selectedJobId: null }
    default:
      return { page: 'home', authMode: 'login', selectedJobId: null }
  }
}

export const buildPath = ({
  page,
  authMode = 'login',
  selectedJobId = null,
}) => {
  switch (page) {
    case 'home':
      return '/'
    case 'vacancies':
      return '/vacancies'
    case 'vacancy':
      return selectedJobId
        ? `/vacancies/${encodeURIComponent(selectedJobId)}`
        : '/vacancies'
    case 'auth':
      return authMode === 'register' ? '/register' : '/login'
    case 'tests':
      return '/tests'
    case 'test':
      return selectedJobId
        ? `/tests/${encodeURIComponent(selectedJobId)}`
        : '/tests'
    case 'profile':
      return '/profile'
    case 'messages':
      return '/messages'
    case 'company':
      return '/company'
    case 'admin':
      return '/admin'
    case 'cv':
      return '/cvs/new'
    case 'cvs':
      return '/cvs'
    default:
      return '/'
  }
}
