const TopNav = ({ page, onNavigate, showAdmin, userRole, notificationCount }) => (
  <nav className="top-nav">
    <button
      className={page === 'home' ? 'nav-button active' : 'nav-button'}
      type="button"
      onClick={() => onNavigate('home')}
    >
      Home
    </button>
    <button
      className={page === 'vacancies' ? 'nav-button active' : 'nav-button'}
      type="button"
      onClick={() => onNavigate('vacancies')}
    >
      Open vacancies
    </button>
    <button
      className={page === 'tests' ? 'nav-button active' : 'nav-button'}
      type="button"
      onClick={() => onNavigate('tests')}
    >
      Tests
    </button>
    <button
      className={page === 'profile' ? 'nav-button active' : 'nav-button'}
      type="button"
      onClick={() => onNavigate('profile')}
    >
      Profile
    </button>
    <button
      className={page === 'messages' ? 'nav-button active' : 'nav-button'}
      type="button"
      onClick={() => onNavigate('messages')}
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
        onClick={() => onNavigate('cvs')}
      >
        CVs
      </button>
    )}
    {userRole === 'company' && (
      <button
        className={page === 'company' ? 'nav-button active' : 'nav-button'}
        type="button"
        onClick={() => onNavigate('company')}
      >
        Company
      </button>
    )}
    <span className="nav-role">{userRole === 'company' ? 'Company mode' : 'Applicant mode'}</span>
    {showAdmin && (
      <button
        className={page === 'admin' ? 'nav-button active' : 'nav-button'}
        type="button"
        onClick={() => onNavigate('admin')}
      >
        Admin panel
      </button>
    )}
  </nav>
)

export default TopNav
