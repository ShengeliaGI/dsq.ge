const ProfilePage = ({
  authUser,
  userRole,
  applications,
  notifications,
  onViewMessages,
  onBrowseJobs,
  onLogout,
  onRoleChange,
}) => {
  const userNotifications = notifications.filter(
    (item) =>
      item.recipientEmail?.toLowerCase() === authUser?.email?.toLowerCase(),
  )

  return (
    <div className="page profile-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{authUser?.name || 'Profile'}</h1>
          <p className="muted">Role: {userRole}</p>
        </div>
        <div className="header-actions">
          <button className="ghost" type="button" onClick={onBrowseJobs}>
            Open vacancies
          </button>
          <button className="ghost" type="button" onClick={onViewMessages}>
            Messages
          </button>
          <button className="danger" type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="profile-grid">
        <div className="profile-card">
          <h3>Account</h3>
          <p className="muted">{authUser?.email}</p>
          <p className="muted">Role mode: {userRole}</p>
        </div>
        <div className="profile-card">
          <h3>Change account type</h3>
          <div className="role-grid">
            <button
              className={userRole === 'applicant' ? 'role-card active' : 'role-card'}
              type="button"
              onClick={() => onRoleChange('applicant')}
            >
              <h4>Employee / Applicant</h4>
              <p className="muted">
                Employee perks: take tests, track status, get interview updates.
              </p>
            </button>
            <button
              className={userRole === 'company' ? 'role-card active' : 'role-card'}
              type="button"
              onClick={() => onRoleChange('company')}
            >
              <h4>Company</h4>
              <p className="muted">
                Company perks: publish roles, review tests, message applicants.
              </p>
            </button>
          </div>
        </div>
        <div className="profile-card">
          <h3>Notifications</h3>
          {userNotifications.length === 0 ? (
            <p className="muted">No updates yet.</p>
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
            <h2>Applied jobs</h2>
            <p className="muted">Track your submissions and hiring stages.</p>
          </div>
        </header>
        {applications.length === 0 ? (
          <div className="empty-state">
            <h3>No applications yet</h3>
            <p className="muted">Take a test to start your application journey.</p>
          </div>
        ) : (
          <div className="grid">
            {applications.map((application) => (
              <div key={application.id} className="job-card">
                <div>
                  <h3>{application.title}</h3>
                  <p className="muted">{application.company}</p>
                </div>
                <div className="meta">
                  <span>
                    Score: {application.score}/{application.total}
                  </span>
                  <span>{new Date(application.submittedAt).toLocaleDateString()}</span>
                </div>
                <span className={`status-chip ${application.status}`}>
                  {application.status}
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
