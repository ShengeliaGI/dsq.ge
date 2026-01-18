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
  <div className="page">
    <header className="page-header">
      <div>
        <p className="eyebrow">Looking for job</p>
        <h1>Create your CV</h1>
        <p className="muted">Fill out each section below.</p>
      </div>
      <button className="ghost" type="button" onClick={onBack}>
        Back
      </button>
    </header>
    <div className="company-panel">
      <div className="panel-section">
        <label>
          Upload CV / Resume
          <div className="file-input">
            <input id="cv-upload" type="file" onChange={onFileChange} />
            <label className="file-button" htmlFor="cv-upload">
              Choose file
            </label>
            <span className="file-name">{cvFileName || 'No file chosen'}</span>
          </div>
        </label>
      </div>
      <div className="panel-section">
        <div className="form-grid">
          <label>
            Personal Information
            <textarea
              rows="4"
              placeholder="Name, phone, email, location"
              value={personalInfo}
              onChange={(event) => setPersonalInfo(event.target.value)}
            />
          </label>
          <label>
            Work Experience
            <textarea
              rows="4"
              placeholder="Company, role, dates"
              value={workExperience}
              onChange={(event) => setWorkExperience(event.target.value)}
            />
          </label>
          <label>
            Education
            <textarea
              rows="4"
              placeholder="School, degree, years"
              value={education}
              onChange={(event) => setEducation(event.target.value)}
            />
          </label>
          <label>
            Languages
            <textarea
              rows="3"
              placeholder="English B2, Russian B1"
              value={languages}
              onChange={(event) => setLanguages(event.target.value)}
            />
          </label>
          <label>
            Skills
            <textarea
              rows="3"
              placeholder="Tools, platforms, technical skills"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
            />
          </label>
          <label>
            Certificates
            <textarea
              rows="3"
              placeholder="Certification name, year"
              value={certificates}
              onChange={(event) => setCertificates(event.target.value)}
            />
          </label>
          <label>
            Trainings and Educational Courses
            <textarea
              rows="3"
              placeholder="Course name, provider"
              value={trainings}
              onChange={(event) => setTrainings(event.target.value)}
            />
          </label>
          <label>
            Social Networks
            <textarea
              rows="3"
              placeholder="LinkedIn, GitHub, portfolio"
              value={socialNetworks}
              onChange={(event) => setSocialNetworks(event.target.value)}
            />
          </label>
        </div>
        <button className="primary" type="button" onClick={onSave}>
          Save CV
        </button>
      </div>
    </div>
  </div>
)

export default CvFormPage
