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
            <span className="nav-role">
              {getRoleModeLabel(userRole)}
            </span>
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
        <div className="nav-actions">
          <button
            className="language-toggle"
            type="button"
            onClick={onToggleLanguage}
            aria-label={
              language === 'ka' ? t('nav.switchToEnglish') : t('nav.switchToGeorgian')
            }
            title={
              language === 'ka' ? t('nav.switchToEnglish') : t('nav.switchToGeorgian')
            }
          >
            <img className="language-flag" src={flagSrc} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default TopNav
