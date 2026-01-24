import { useState } from 'react'

const TopNav = ({
  page,
  onNavigate,
  showAdmin,
  userRole,
  notificationCount,
  isAuthed,
  onAuthRegister,
  onAuthLogin,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (nextPage) => {
    onNavigate(nextPage)
    setIsOpen(false)
  }

  const handleAuthLogin = () => {
    onAuthLogin()
    setIsOpen(false)
  }

  const handleAuthRegister = () => {
    onAuthRegister()
    setIsOpen(false)
  }

  return (
    <nav className="top-nav">
      <div className="nav-header">
        <span className="nav-brand">dsq.ge</span>
        <button
          className="nav-burger"
          type="button"
          aria-label="Toggle navigation"
          aria-controls="nav-menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div
        id="nav-menu"
        className={isOpen ? 'nav-content nav-open' : 'nav-content'}
      >
        <button
          className={page === 'home' ? 'nav-button active' : 'nav-button'}
          type="button"
          onClick={() => handleNavigate('home')}
        >
          Home
        </button>
        <button
          className={page === 'vacancies' ? 'nav-button active' : 'nav-button'}
          type="button"
          onClick={() => handleNavigate('vacancies')}
        >
          Open vacancies
        </button>
        {isAuthed ? (
          <>
            <button
              className={page === 'tests' ? 'nav-button active' : 'nav-button'}
              type="button"
              onClick={() => handleNavigate('tests')}
            >
              Tests
            </button>
            <button
              className={page === 'profile' ? 'nav-button active' : 'nav-button'}
              type="button"
              onClick={() => handleNavigate('profile')}
            >
              Profile
            </button>
            <button
              className={page === 'messages' ? 'nav-button active' : 'nav-button'}
              type="button"
              onClick={() => handleNavigate('messages')}
            >
              Messages
              {notificationCount > 0 && (
                <span className="nav-badge">{notificationCount}</span>
              )}
            </button>
            {userRole !== 'company' && (
              <button
                className={page === 'cvs' ? 'nav-button active' : 'nav-button'}
                type="button"
                onClick={() => handleNavigate('cvs')}
              >
                CVs
              </button>
            )}
            {userRole === 'company' && (
              <button
                className={page === 'company' ? 'nav-button active' : 'nav-button'}
                type="button"
                onClick={() => handleNavigate('company')}
              >
                Company
              </button>
            )}
            <span className="nav-role">
              {userRole === 'company' ? 'Company mode' : 'Applicant mode'}
            </span>
            {showAdmin && (
              <button
                className={page === 'admin' ? 'nav-button active' : 'nav-button'}
                type="button"
                onClick={() => handleNavigate('admin')}
              >
                Admin panel
              </button>
            )}
          </>
        ) : (
          <div className="nav-auth">
            <button className="ghost" type="button" onClick={handleAuthLogin}>
              Log in
            </button>
            <button
              className="primary"
              type="button"
              onClick={handleAuthRegister}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default TopNav
