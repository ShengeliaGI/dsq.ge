const TopNav = ({ page, onNavigate, showAdmin }) => (
  <nav className="top-nav">
    <button
      className={page === 'vacancies' ? 'nav-button active' : 'nav-button'}
      type="button"
      onClick={() => onNavigate('vacancies')}
    >
      Vacancies
    </button>
    <button
      className={page === 'cvs' ? 'nav-button active' : 'nav-button'}
      type="button"
      onClick={() => onNavigate('cvs')}
    >
      Looking for job
    </button>
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
