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
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  t,
  getRoleModeLabel,
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

  const flagSrc = language === 'ka' ? '/flags/us.svg' : '/flags/ge.svg'

  return (
    <nav className="top-nav">
      <div className="nav-header">
        <span className="nav-brand">dsq.ge</span>
        <button
          className="nav-burger"
          type="button"
          aria-label={t('nav.toggle')}
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
        <div className="nav-items">
          <button
            className={page === 'home' ? 'nav-button active' : 'nav-button'}
            type="button"
            onClick={() => handleNavigate('home')}
          >
            {t('nav.home')}
          </button>
          <button
            className={page === 'vacancies' ? 'nav-button active' : 'nav-button'}
            type="button"
            onClick={() => handleNavigate('vacancies')}
          >
            {t('nav.vacancies')}
          </button>
          {isAuthed ? (
            <>
              <button
                className={page === 'tests' ? 'nav-button active' : 'nav-button'}
                type="button"
                onClick={() => handleNavigate('tests')}
              >
                {t('nav.tests')}
              </button>
              <button
                className={page === 'profile' ? 'nav-button active' : 'nav-button'}
                type="button"
                onClick={() => handleNavigate('profile')}
              >
                {t('nav.profile')}
              </button>
              <button
                className={page === 'messages' ? 'nav-button active' : 'nav-button'}
                type="button"
                onClick={() => handleNavigate('messages')}
              >
                {t('nav.messages')}
                {notificationCount > 0 && (
                  <span className="nav-badge">{notificationCount}</span>
                )}
              </button>
              <button
                className={page === 'cvs' ? 'nav-button active' : 'nav-button'}
                type="button"
                onClick={() => handleNavigate('cvs')}
              >
                {t('nav.cvs')}
              </button>
              {userRole === 'company' && (
                <button
                  className={page === 'company' ? 'nav-button active' : 'nav-button'}
                  type="button"
                  onClick={() => handleNavigate('company')}
                >
                  {t('nav.company')}
                </button>
              )}
              {showAdmin && (
                <button
                  className={page === 'admin' ? 'nav-button active' : 'nav-button'}
                  type="button"
                  onClick={() => handleNavigate('admin')}
                >
                  {t('nav.admin')}
                </button>
              )}
            </>
          ) : (
            <div className="nav-auth">
              <button className="ghost" type="button" onClick={handleAuthLogin}>
                {t('nav.login')}
              </button>
              <button
                className="primary"
                type="button"
                onClick={handleAuthRegister}
              >
                {t('nav.register')}
              </button>
            </div>
          )}
        </div>
        <div className="nav-footer">
          {isAuthed && (
            <span className="nav-role">
              {getRoleModeLabel(userRole)}
            </span>
          )}
          <div className="nav-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={onToggleTheme}
              aria-label={t('nav.toggleTheme')}
              title={t('nav.toggleTheme')}
            >
              {theme === 'dark' ? (
                <>
                  <svg
                    className="theme-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 3v2" />
                    <path d="M12 19v2" />
                    <path d="M4.22 4.22l1.42 1.42" />
                    <path d="M18.36 18.36l1.42 1.42" />
                    <path d="M3 12h2" />
                    <path d="M19 12h2" />
                    <path d="M4.22 19.78l1.42-1.42" />
                    <path d="M18.36 5.64l1.42-1.42" />
                  </svg>
                  <span className="sr-only">{t('nav.themeLight')}</span>
                </>
              ) : (
                <>
                  <svg
                    className="theme-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                  </svg>
                  <span className="sr-only">{t('nav.themeDark')}</span>
                </>
              )}
            </button>
            <button
              className="language-toggle"
              type="button"
              onClick={onToggleLanguage}
              aria-label={
                language === 'ka'
                  ? t('nav.switchToEnglish')
                  : t('nav.switchToGeorgian')
              }
              title={
                language === 'ka'
                  ? t('nav.switchToEnglish')
                  : t('nav.switchToGeorgian')
              }
            >
              <img className="language-flag" src={flagSrc} alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNav
