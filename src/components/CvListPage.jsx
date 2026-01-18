import { useState } from 'react'

const CvListPage = ({ cvSubmissions, onAddCv, onBackVacancies, onDeleteCv }) => {
  const [expandedCvId, setExpandedCvId] = useState(null)

  const toggleCv = (cvId) => {
    setExpandedCvId((prev) => (prev === cvId ? null : cvId))
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Looking for job</p>
          <h1>Job seeker CVs</h1>
          <p className="muted">Browse saved CVs from candidates.</p>
        </div>
        <div className="header-actions">
          <button className="ghost" type="button" onClick={onAddCv}>
            Add CV
          </button>
          <button className="ghost" type="button" onClick={onBackVacancies}>
            Back to vacancies
          </button>
        </div>
      </header>
      {cvSubmissions.length === 0 ? (
        <div className="empty-state">
          <h3>No CVs yet</h3>
          <p className="muted">Use Add CV to fill out your profile.</p>
        </div>
      ) : (
        <div className="cv-list">
          <div className="grid">
            {cvSubmissions.map((cv) => (
              <div key={cv.id} className="cv-card">
                <div>
                  <h4>{cv.fileName}</h4>
                  <p className="muted">{cv.summary}...</p>
                </div>
                <div className="cv-actions">
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => toggleCv(cv.id)}
                  >
                    {expandedCvId === cv.id ? 'Hide details' : 'View details'}
                  </button>
                  <button
                    className="danger"
                    type="button"
                    onClick={() => onDeleteCv(cv.id)}
                  >
                    Delete CV
                  </button>
                </div>
                {expandedCvId === cv.id && (
                  <div className="cv-details">
                    <div>
                      <h5>Personal info</h5>
                      <p className="muted">{cv.personalInfo || 'Not provided.'}</p>
                    </div>
                    <div>
                      <h5>Work experience</h5>
                      <p className="muted">{cv.workExperience || 'Not provided.'}</p>
                    </div>
                    <div>
                      <h5>Education</h5>
                      <p className="muted">{cv.education || 'Not provided.'}</p>
                    </div>
                    <div>
                      <h5>Languages</h5>
                      <p className="muted">{cv.languages || 'Not provided.'}</p>
                    </div>
                    <div>
                      <h5>Skills</h5>
                      <p className="muted">{cv.skills || 'Not provided.'}</p>
                    </div>
                    <div>
                      <h5>Certificates</h5>
                      <p className="muted">{cv.certificates || 'Not provided.'}</p>
                    </div>
                    <div>
                      <h5>Trainings</h5>
                      <p className="muted">{cv.trainings || 'Not provided.'}</p>
                    </div>
                    <div>
                      <h5>Social networks</h5>
                      <p className="muted">{cv.socialNetworks || 'Not provided.'}</p>
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
