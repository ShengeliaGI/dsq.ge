const CvFormPage = ({
  onBack,
  cvFileName,
  onFileChange,
  personalInfo,
  setPersonalInfo,
  workExperience,
  setWorkExperience,
  education,
  setEducation,
  languages,
  setLanguages,
  skills,
  setSkills,
  certificates,
  setCertificates,
  trainings,
  setTrainings,
  socialNetworks,
  setSocialNetworks,
  onSave,
}) => (
  <div className="page cv-page">
    <header className="page-header">
      <div>
        <p className="eyebrow">Candidate profile</p>
        <h1>Publish your CV</h1>
        <p className="muted">
          Create a professional candidate profile recruiters can review in seconds.
        </p>
      </div>
      <button className="ghost" type="button" onClick={onBack}>
        Back
      </button>
    </header>

    <section className="cv-hero">
      <div className="cv-hero-card">
        <h2>Your CV in 3 steps</h2>
        <div className="cv-steps">
          <div className="cv-step">
            <span>1</span>
            Upload your existing resume or start from scratch.
          </div>
          <div className="cv-step">
            <span>2</span>
            Fill out key sections so hiring teams can scan fast.
          </div>
          <div className="cv-step">
            <span>3</span>
            Publish and keep it up to date anytime.
          </div>
        </div>
        <p className="helper">
          Your data is private and only visible to approved recruiters.
        </p>
      </div>
      <aside className="cv-side">
        <div className="cv-panel">
          <h3>Quick tips</h3>
          <ul className="cv-tips">
            <li>Use action verbs and measurable results.</li>
            <li>Keep skills aligned with your target role.</li>
            <li>Add links to portfolios or GitHub.</li>
          </ul>
        </div>
        <div className="cv-panel">
          <h3>Privacy first</h3>
          <p className="muted">
            You control what is shared. Remove your CV anytime from your profile.
          </p>
        </div>
      </aside>
    </section>

    <div className="company-panel cv-form">
      <div className="panel-section">
        <label>
          Upload CV / Resume (optional)
          <div className="file-drop">
            <input id="cv-upload" type="file" onChange={onFileChange} />
            <label className="file-button" htmlFor="cv-upload">
              Choose file
            </label>
            <div className="file-drop-meta">
              <span className="file-drop-title">
                {cvFileName || 'No file selected'}
              </span>
              <span className="file-drop-sub">PDF, DOC, DOCX up to 10MB</span>
            </div>
          </div>
        </label>
      </div>

      <div className="panel-section">
        <div className="cv-form-grid">
          <label className="cv-section full-width">
            Personal Information
            <textarea
              rows="4"
              placeholder="Name, phone, email, location"
              value={personalInfo}
              onChange={(event) => setPersonalInfo(event.target.value)}
            />
          </label>
          <label className="cv-section full-width">
            Work Experience
            <textarea
              rows="4"
              placeholder="Company, role, dates"
              value={workExperience}
              onChange={(event) => setWorkExperience(event.target.value)}
            />
          </label>
          <label className="cv-section">
            Education
            <textarea
              rows="4"
              placeholder="School, degree, years"
              value={education}
              onChange={(event) => setEducation(event.target.value)}
            />
          </label>
          <label className="cv-section">
            Languages
            <textarea
              rows="3"
              placeholder="English B2, Russian B1"
              value={languages}
              onChange={(event) => setLanguages(event.target.value)}
            />
          </label>
          <label className="cv-section">
            Skills
            <textarea
              rows="3"
              placeholder="Tools, platforms, technical skills"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
            />
          </label>
          <label className="cv-section">
            Certificates
            <textarea
              rows="3"
              placeholder="Certification name, year"
              value={certificates}
              onChange={(event) => setCertificates(event.target.value)}
            />
          </label>
          <label className="cv-section">
            Trainings and Educational Courses
            <textarea
              rows="3"
              placeholder="Course name, provider"
              value={trainings}
              onChange={(event) => setTrainings(event.target.value)}
            />
          </label>
          <label className="cv-section">
            Social Networks
            <textarea
              rows="3"
              placeholder="LinkedIn, GitHub, portfolio"
              value={socialNetworks}
              onChange={(event) => setSocialNetworks(event.target.value)}
            />
          </label>
        </div>
        <div className="cv-actions">
          <button className="primary" type="button" onClick={onSave}>
            Publish CV
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default CvFormPage
