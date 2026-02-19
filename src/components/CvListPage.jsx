import { useState } from 'react'

const CvListPage = ({
  cvSubmissions,
  onAddCv,
  onBackVacancies,
  onDeleteCv,
  t,
}) => {
  const [expandedCvId, setExpandedCvId] = useState(null)

  const toggleCv = (cvId) => {
    setExpandedCvId((prev) => (prev === cvId ? null : cvId))
  }

  const getDisplayName = (cv) => {
    const personalInfo = cv?.personalInfo || ''
    const namePart = personalInfo
      .split('â€¢')[0]
      .split('•')[0]
      .trim()
    return namePart || t('profile.titleFallback')
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t('cvList.eyebrow')}</p>
          <h1>{t('cvList.title')}</h1>
          <p className="muted">{t('cvList.subtitle')}</p>
        </div>
        <div className="header-actions">
          <button className="ghost" type="button" onClick={onAddCv}>
            {t('cvList.addCv')}
          </button>
          <button className="ghost" type="button" onClick={onBackVacancies}>
            {t('cvList.backToVacancies')}
          </button>
        </div>
      </header>
      {cvSubmissions.length === 0 ? (
        <div className="empty-state">
          <h3>{t('cvList.emptyTitle')}</h3>
          <p className="muted">{t('cvList.emptySubtitle')}</p>
        </div>
      ) : (
        <div className="cv-list">
          <div className="grid">
            {cvSubmissions.map((cv) => (
              <div key={cv.id} className="cv-card">
                <div className="cv-list-head">
                  {cv.profileImage ? (
                    <img className="cv-card-avatar" src={cv.profileImage} alt="Profile" />
                  ) : (
                    <div className="cv-card-avatar" aria-hidden="true" />
                  )}
                  <div>
                    <h4>{getDisplayName(cv)}</h4>
                    <p className="muted">{cv.fileName}</p>
                  </div>
                </div>
                <div>
                  <p className="muted">{cv.summary}...</p>
                </div>
                <div className="cv-actions">
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => toggleCv(cv.id)}
                  >
                    {expandedCvId === cv.id
                      ? t('cvList.hideDetails')
                      : t('cvList.viewDetails')}
                  </button>
                  <button
                    className="danger"
                    type="button"
                    onClick={() => onDeleteCv(cv.id)}
                  >
                    {t('cvList.deleteCv')}
                  </button>
                </div>
                {expandedCvId === cv.id && (
                  <div className="cv-details">
                    <div>
                      <h5>{t('cvList.personalInfo')}</h5>
                      <p className="muted">
                        {cv.personalInfo || t('cvList.notProvided')}
                      </p>
                    </div>
                    <div>
                      <h5>{t('cvList.workExperience')}</h5>
                      <p className="muted">
                        {cv.workExperience || t('cvList.notProvided')}
                      </p>
                    </div>
                    <div>
                      <h5>{t('cvList.education')}</h5>
                      <p className="muted">{cv.education || t('cvList.notProvided')}</p>
                    </div>
                    <div>
                      <h5>{t('cvList.languages')}</h5>
                      <p className="muted">{cv.languages || t('cvList.notProvided')}</p>
                    </div>
                    <div>
                      <h5>{t('cvList.skills')}</h5>
                      <p className="muted">{cv.skills || t('cvList.notProvided')}</p>
                    </div>
                    <div>
                      <h5>{t('cvList.certificates')}</h5>
                      <p className="muted">
                        {cv.certificates || t('cvList.notProvided')}
                      </p>
                    </div>
                    <div>
                      <h5>{t('cvList.trainings')}</h5>
                      <p className="muted">{cv.trainings || t('cvList.notProvided')}</p>
                    </div>
                    <div>
                      <h5>{t('cvList.socialNetworks')}</h5>
                      <p className="muted">
                        {cv.socialNetworks || t('cvList.notProvided')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CvListPage
