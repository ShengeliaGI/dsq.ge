const ProfilePage = ({
  authUser,
  userRole,
  applications,
  notifications,
  onViewMessages,
  onBrowseJobs,
  onLogout,
  onRoleChange,
  t,
  getRoleLabel,
  getStatusLabel,
  getJobTitleLabel,
}) => {
  const userNotifications = notifications.filter(
    (item) =>
      item.recipientEmail?.toLowerCase() === authUser?.email?.toLowerCase(),
  )

  return (
    <div className="page profile-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t('profile.eyebrow')}</p>
          <h1>{authUser?.name || t('profile.titleFallback')}</h1>
          <p className="muted">
            {t('profile.roleLabel', { role: getRoleLabel(userRole) })}
          </p>
        </div>
        <div className="header-actions">
          <button className="ghost" type="button" onClick={onBrowseJobs}>
            {t('profile.openVacancies')}
          </button>
          <button className="ghost" type="button" onClick={onViewMessages}>
            {t('profile.messages')}
          </button>
          <button className="danger" type="button" onClick={onLogout}>
            {t('profile.logout')}
          </button>
        </div>
      </header>

      <section className="profile-grid">
        <div className="profile-card">
          <h3>{t('profile.account')}</h3>
          <p className="muted">{authUser?.email}</p>
          <p className="muted">
            {t('profile.roleMode', { role: getRoleLabel(userRole) })}
          </p>
        </div>
        <div className="profile-card">
          <h3>{t('profile.changeRole')}</h3>
          <div className="role-grid">
            <button
              className={userRole === 'applicant' ? 'role-card active' : 'role-card'}
              type="button"
              onClick={() => onRoleChange('applicant')}
            >
              <h4>{t('profile.employeeTitle')}</h4>
              <p className="muted">{t('profile.employeeDesc')}</p>
            </button>
            <button
              className={userRole === 'company' ? 'role-card active' : 'role-card'}
              type="button"
              onClick={() => onRoleChange('company')}
            >
              <h4>{t('profile.companyTitle')}</h4>
              <p className="muted">{t('profile.companyDesc')}</p>
            </button>
          </div>
        </div>
        <div className="profile-card">
          <h3>{t('profile.notifications')}</h3>
          {userNotifications.length === 0 ? (
            <p className="muted">{t('profile.noUpdates')}</p>
          ) : (
            <ul className="notification-list">
              {userNotifications.slice(0, 5).map((item) => (
                <li key={item.id} className="notification-item">
                  <strong>{item.title}</strong>
                  <p className="muted">{item.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="applications-section">
        <header className="section-header">
          <div>
            <h2>{t('profile.appliedJobs')}</h2>
            <p className="muted">{t('profile.appliedDesc')}</p>
          </div>
        </header>
        {applications.length === 0 ? (
          <div className="empty-state">
            <h3>{t('profile.emptyApplicationsTitle')}</h3>
            <p className="muted">{t('profile.emptyApplicationsDesc')}</p>
          </div>
        ) : (
          <div className="grid">
            {applications.map((application) => (
              <div key={application.id} className="job-card">
                <div>
                  <h3>{getJobTitleLabel(application.title)}</h3>
                  <p className="muted">{application.company}</p>
                </div>
                <div className="meta">
                  <span>
                    {t('profile.scoreLabel', {
                      score: application.score,
                      total: application.total,
                    })}
                  </span>
                  <span>{new Date(application.submittedAt).toLocaleDateString()}</span>
                </div>
                <span className={`status-chip ${application.status}`}>
                  {getStatusLabel(application.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default ProfilePage
