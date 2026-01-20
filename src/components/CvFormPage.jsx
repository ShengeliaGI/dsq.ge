const CvFormPage = ({
  onBack,
  cvFileName,
  onFileChange,
  cvProfile,
  setCvProfile,
  socialLinkInput,
  setSocialLinkInput,
  socialLinks,
  onAddSocialLink,
  workEntry,
  setWorkEntry,
  workEntries,
  onAddWorkEntry,
  onClearWorkEntry,
  educationEntry,
  setEducationEntry,
  educationEntries,
  onAddEducationEntry,
  onClearEducationEntry,
  languageEntry,
  setLanguageEntry,
  languageEntries,
  onAddLanguageEntry,
  skillInput,
  setSkillInput,
  skillsList,
  onAddSkill,
  certificateEntry,
  setCertificateEntry,
  certificateEntries,
  onAddCertificateEntry,
  onClearCertificateEntry,
  trainingEntry,
  setTrainingEntry,
  trainingEntries,
  onAddTrainingEntry,
  onClearTrainingEntry,
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

    <div className="company-panel cv-form">
      <div className="panel-section">
        <div className="cv-section-card">
          <div className="cv-section-header">
            <h2>Social links</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <p className="muted">
            You can add links to websites you want hiring managers to see.
          </p>
          <div className="cv-inline">
            <input
              type="text"
              placeholder="LinkedIn, GitHub, portfolio"
              value={socialLinkInput}
              onChange={(event) => setSocialLinkInput(event.target.value)}
            />
            <button className="primary" type="button" onClick={onAddSocialLink}>
              Add link
            </button>
          </div>
          {socialLinks.length > 0 && (
            <div className="cv-tag-list">
              {socialLinks.map((link) => (
                <span key={link} className="cv-tag">
                  {link}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel-section">
        <div className="cv-section-card">
          <div className="cv-section-header">
            <h2>Personal Information</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-personal">
            <div className="cv-avatar">
              <div className="cv-avatar-circle" />
              <label className="file-button" htmlFor="cv-upload">
                Upload
              </label>
              <input id="cv-upload" type="file" onChange={onFileChange} />
            </div>
            <div className="cv-form-grid">
              <input
                type="text"
                placeholder="Name"
                value={cvProfile.firstName}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, firstName: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Surname"
                value={cvProfile.lastName}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, lastName: event.target.value }))
                }
              />
              <input
                className="full-width"
                type="text"
                placeholder="Profession"
                value={cvProfile.profession}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, profession: event.target.value }))
                }
              />
              <input
                className="full-width"
                type="text"
                placeholder="Mobile Phone"
                value={cvProfile.phone}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
              <input
                className="full-width"
                type="email"
                placeholder="Email Address"
                value={cvProfile.email}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <input
                className="full-width"
                type="text"
                placeholder="Address"
                value={cvProfile.address}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, address: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Country"
                value={cvProfile.country}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, country: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder="City"
                value={cvProfile.city}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, city: event.target.value }))
                }
              />
              <textarea
                className="full-width"
                rows="4"
                placeholder="Write about you"
                value={cvProfile.about}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, about: event.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <div className="cv-section-card">
          <div className="cv-section-header">
            <h2>Work experience</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-form-grid">
            <input
              className="full-width"
              type="text"
              placeholder="Position"
              value={workEntry.position}
              onChange={(event) =>
                setWorkEntry((prev) => ({ ...prev, position: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder="Company"
              value={workEntry.company}
              onChange={(event) =>
                setWorkEntry((prev) => ({ ...prev, company: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Start Date (MM/YYYY)"
              value={workEntry.startDate}
              onChange={(event) =>
                setWorkEntry((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="End Date (MM/YYYY)"
              value={workEntry.endDate}
              onChange={(event) =>
                setWorkEntry((prev) => ({ ...prev, endDate: event.target.value }))
              }
            />
            <label className="cv-checkbox">
              <input
                type="checkbox"
                checked={workEntry.current}
                onChange={(event) =>
                  setWorkEntry((prev) => ({ ...prev, current: event.target.checked }))
                }
              />
              Current Position
            </label>
            <textarea
              className="full-width"
              rows="4"
              placeholder="Add Description"
              value={workEntry.description}
              onChange={(event) =>
                setWorkEntry((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </div>
          <div className="cv-actions-row">
            <button className="ghost" type="button" onClick={onClearWorkEntry}>
              Clear
            </button>
            <button className="primary" type="button" onClick={onAddWorkEntry}>
              Add
            </button>
          </div>
          {workEntries.length > 0 && (
            <div className="cv-list">
              {workEntries.map((entry, index) => (
                <div key={`${entry.position}-${index}`} className="cv-list-card">
                  <strong>{entry.position || 'Role'}</strong> · {entry.company || 'Company'}
                  <span className="muted">
                    {entry.current
                      ? `${entry.startDate || 'Start'} - Present`
                      : [entry.startDate, entry.endDate].filter(Boolean).join(' - ')}
                  </span>
                  {entry.description && <p>{entry.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel-section">
        <div className="cv-section-card">
          <div className="cv-section-header">
            <h2>Education</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-form-grid">
            <input
              className="full-width"
              type="text"
              placeholder="Degree"
              value={educationEntry.degree}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, degree: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder="University/Institute/College"
              value={educationEntry.school}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, school: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder="Faculty"
              value={educationEntry.faculty}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, faculty: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Start Date (MM/YYYY)"
              value={educationEntry.startDate}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="End Date (MM/YYYY)"
              value={educationEntry.endDate}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, endDate: event.target.value }))
              }
            />
          </div>
          <div className="cv-actions-row">
            <button className="ghost" type="button" onClick={onClearEducationEntry}>
              Clear
            </button>
            <button className="primary" type="button" onClick={onAddEducationEntry}>
              Add
            </button>
          </div>
          {educationEntries.length > 0 && (
            <div className="cv-list">
              {educationEntries.map((entry, index) => (
                <div key={`${entry.degree}-${index}`} className="cv-list-card">
                  <strong>{entry.degree || 'Degree'}</strong> · {entry.school || 'School'}
                  <span className="muted">
                    {[entry.startDate, entry.endDate].filter(Boolean).join(' - ')}
                  </span>
                  {entry.faculty && <p>{entry.faculty}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel-section">
        <div className="cv-section-card">
          <div className="cv-section-header">
            <h2>Languages</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-inline">
            <input
              type="text"
              placeholder="Select Language"
              value={languageEntry.name}
              onChange={(event) =>
                setLanguageEntry((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Level"
              value={languageEntry.level}
              onChange={(event) =>
                setLanguageEntry((prev) => ({ ...prev, level: event.target.value }))
              }
            />
            <button className="primary" type="button" onClick={onAddLanguageEntry}>
              Add
            </button>
          </div>
          {languageEntries.length > 0 && (
            <div className="cv-tag-list">
              {languageEntries.map((entry, index) => (
                <span key={`${entry.name}-${index}`} className="cv-tag">
                  {entry.name} · {entry.level}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel-section">
        <div className="cv-section-card">
          <div className="cv-section-header">
            <h2>Skills</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-inline">
            <input
              type="text"
              placeholder="Enter skill"
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
            />
            <button className="primary" type="button" onClick={onAddSkill}>
              Add
            </button>
          </div>
          {skillsList.length > 0 && (
            <div className="cv-tag-list">
              {skillsList.map((skill) => (
                <span key={skill} className="cv-tag">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel-section">
        <div className="cv-section-card">
          <div className="cv-section-header">
            <h2>Certificates</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-form-grid">
            <input
              className="full-width"
              type="text"
              placeholder="Title"
              value={certificateEntry.title}
              onChange={(event) =>
                setCertificateEntry((prev) => ({ ...prev, title: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder="Organization"
              value={certificateEntry.organization}
              onChange={(event) =>
                setCertificateEntry((prev) => ({ ...prev, organization: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder="Issue Date (MM/YYYY)"
              value={certificateEntry.issueDate}
              onChange={(event) =>
                setCertificateEntry((prev) => ({ ...prev, issueDate: event.target.value }))
              }
            />
          </div>
          <div className="cv-actions-row">
            <button className="ghost" type="button" onClick={onClearCertificateEntry}>
              Clear
            </button>
            <button className="primary" type="button" onClick={onAddCertificateEntry}>
              Add
            </button>
          </div>
          {certificateEntries.length > 0 && (
            <div className="cv-list">
              {certificateEntries.map((entry, index) => (
                <div key={`${entry.title}-${index}`} className="cv-list-card">
                  <strong>{entry.title || 'Certificate'}</strong>
                  <span className="muted">{entry.organization || 'Organization'}</span>
                  {entry.issueDate && <span className="muted">{entry.issueDate}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel-section">
        <div className="cv-section-card">
          <div className="cv-section-header">
            <h2>Trainings & Courses</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-form-grid">
            <input
              className="full-width"
              type="text"
              placeholder="Title"
              value={trainingEntry.title}
              onChange={(event) =>
                setTrainingEntry((prev) => ({ ...prev, title: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder="Organization"
              value={trainingEntry.organization}
              onChange={(event) =>
                setTrainingEntry((prev) => ({ ...prev, organization: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Start Date (MM/YYYY)"
              value={trainingEntry.startDate}
              onChange={(event) =>
                setTrainingEntry((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="End Date (MM/YYYY)"
              value={trainingEntry.endDate}
              onChange={(event) =>
                setTrainingEntry((prev) => ({ ...prev, endDate: event.target.value }))
              }
            />
          </div>
          <div className="cv-actions-row">
            <button className="ghost" type="button" onClick={onClearTrainingEntry}>
              Clear
            </button>
            <button className="primary" type="button" onClick={onAddTrainingEntry}>
              Add
            </button>
          </div>
          {trainingEntries.length > 0 && (
            <div className="cv-list">
              {trainingEntries.map((entry, index) => (
                <div key={`${entry.title}-${index}`} className="cv-list-card">
                  <strong>{entry.title || 'Training'}</strong>
                  <span className="muted">{entry.organization || 'Organization'}</span>
                  <span className="muted">
                    {[entry.startDate, entry.endDate].filter(Boolean).join(' - ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="cv-footer">
        <button className="primary" type="button" onClick={onSave}>
          Publish CV
        </button>
      </div>
    </div>
  </div>
)

export default CvFormPage
