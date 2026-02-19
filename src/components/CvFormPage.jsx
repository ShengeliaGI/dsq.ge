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
  t,
}) => (
  <div className="page cv-page">
    <header className="page-header">
      <div>
        <p className="eyebrow">{t('cvForm.eyebrow')}</p>
        <h1>{t('cvForm.title')}</h1>
        <p className="muted">{t('cvForm.subtitle')}</p>
      </div>
      <button className="ghost" type="button" onClick={onBack}>
        {t('cvForm.back')}
      </button>
    </header>

    <div className="company-panel cv-form">
      <div className="panel-section">
        <div className="cv-section-card">
          <div className="cv-section-header">
            <h2>{t('cvForm.socialTitle')}</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <p className="muted">{t('cvForm.socialDesc')}</p>
          <div className="cv-inline">
            <input
              type="text"
              placeholder={t('cvForm.socialPlaceholder')}
              value={socialLinkInput}
              onChange={(event) => setSocialLinkInput(event.target.value)}
            />
            <button className="primary" type="button" onClick={onAddSocialLink}>
              {t('cvForm.addLink')}
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
            <h2>{t('cvForm.personalTitle')}</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-personal">
            <div className="cv-avatar">
              <div className="cv-avatar-circle" />
              <label className="file-button" htmlFor="cv-upload">
                {t('cvForm.upload')}
              </label>
              <input id="cv-upload" type="file" onChange={onFileChange} />
              {cvFileName && <p className="muted">{cvFileName}</p>}
            </div>
            <div className="cv-form-grid">
              <input
                type="text"
                placeholder={t('cvForm.namePlaceholder')}
                value={cvProfile.firstName}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, firstName: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder={t('cvForm.surnamePlaceholder')}
                value={cvProfile.lastName}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, lastName: event.target.value }))
                }
              />
              <input
                className="full-width"
                type="text"
                placeholder={t('cvForm.professionPlaceholder')}
                value={cvProfile.profession}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, profession: event.target.value }))
                }
              />
              <input
                className="full-width"
                type="text"
                placeholder={t('cvForm.phonePlaceholder')}
                value={cvProfile.phone}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
              <input
                className="full-width"
                type="email"
                placeholder={t('cvForm.emailPlaceholder')}
                value={cvProfile.email}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <input
                className="full-width"
                type="text"
                placeholder={t('cvForm.addressPlaceholder')}
                value={cvProfile.address}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, address: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder={t('cvForm.countryPlaceholder')}
                value={cvProfile.country}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, country: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder={t('cvForm.cityPlaceholder')}
                value={cvProfile.city}
                onChange={(event) =>
                  setCvProfile((prev) => ({ ...prev, city: event.target.value }))
                }
              />
              <textarea
                className="full-width"
                rows="4"
                placeholder={t('cvForm.aboutPlaceholder')}
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
            <h2>{t('cvForm.workTitle')}</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-form-grid">
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.positionPlaceholder')}
              value={workEntry.position}
              onChange={(event) =>
                setWorkEntry((prev) => ({ ...prev, position: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.companyPlaceholder')}
              value={workEntry.company}
              onChange={(event) =>
                setWorkEntry((prev) => ({ ...prev, company: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder={t('cvForm.startDatePlaceholder')}
              value={workEntry.startDate}
              onChange={(event) =>
                setWorkEntry((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder={t('cvForm.endDatePlaceholder')}
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
              {t('cvForm.currentPosition')}
            </label>
            <textarea
              className="full-width"
              rows="4"
              placeholder={t('cvForm.addDescription')}
              value={workEntry.description}
              onChange={(event) =>
                setWorkEntry((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </div>
          <div className="cv-actions-row">
            <button className="ghost" type="button" onClick={onClearWorkEntry}>
              {t('cvForm.clear')}
            </button>
            <button className="primary" type="button" onClick={onAddWorkEntry}>
              {t('cvForm.add')}
            </button>
          </div>
          {workEntries.length > 0 && (
            <div className="cv-list">
              {workEntries.map((entry, index) => (
                <div key={`${entry.position}-${index}`} className="cv-list-card">
                  <strong>{entry.position || t('cvForm.roleFallback')}</strong> ·{' '}
                  {entry.company || t('cvForm.companyFallback')}
                  <span className="muted">
                    {entry.current
                      ? `${entry.startDate || t('cvForm.startFallback')} - ${t('cvForm.present')}`
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
            <h2>{t('cvForm.educationTitle')}</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-form-grid">
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.degreePlaceholder')}
              value={educationEntry.degree}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, degree: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.schoolPlaceholder')}
              value={educationEntry.school}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, school: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.facultyPlaceholder')}
              value={educationEntry.faculty}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, faculty: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder={t('cvForm.startDatePlaceholder')}
              value={educationEntry.startDate}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder={t('cvForm.endDatePlaceholder')}
              value={educationEntry.endDate}
              onChange={(event) =>
                setEducationEntry((prev) => ({ ...prev, endDate: event.target.value }))
              }
            />
          </div>
          <div className="cv-actions-row">
            <button className="ghost" type="button" onClick={onClearEducationEntry}>
              {t('cvForm.clear')}
            </button>
            <button className="primary" type="button" onClick={onAddEducationEntry}>
              {t('cvForm.add')}
            </button>
          </div>
          {educationEntries.length > 0 && (
            <div className="cv-list">
              {educationEntries.map((entry, index) => (
                <div key={`${entry.degree}-${index}`} className="cv-list-card">
                  <strong>{entry.degree || t('cvForm.degreePlaceholder')}</strong> ·{' '}
                  {entry.school || t('cvForm.schoolPlaceholder')}
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
            <h2>{t('cvForm.languagesTitle')}</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-inline">
            <input
              type="text"
              placeholder={t('cvForm.selectLanguagePlaceholder')}
              value={languageEntry.name}
              onChange={(event) =>
                setLanguageEntry((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder={t('cvForm.levelPlaceholder')}
              value={languageEntry.level}
              onChange={(event) =>
                setLanguageEntry((prev) => ({ ...prev, level: event.target.value }))
              }
            />
            <button className="primary" type="button" onClick={onAddLanguageEntry}>
              {t('cvForm.add')}
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
            <h2>{t('cvForm.skillsTitle')}</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-inline">
            <input
              type="text"
              placeholder={t('cvForm.skillPlaceholder')}
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
            />
            <button className="primary" type="button" onClick={onAddSkill}>
              {t('cvForm.add')}
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
            <h2>{t('cvForm.certificatesTitle')}</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-form-grid">
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.titlePlaceholder')}
              value={certificateEntry.title}
              onChange={(event) =>
                setCertificateEntry((prev) => ({ ...prev, title: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.organizationPlaceholder')}
              value={certificateEntry.organization}
              onChange={(event) =>
                setCertificateEntry((prev) => ({ ...prev, organization: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.issueDatePlaceholder')}
              value={certificateEntry.issueDate}
              onChange={(event) =>
                setCertificateEntry((prev) => ({ ...prev, issueDate: event.target.value }))
              }
            />
          </div>
          <div className="cv-actions-row">
            <button className="ghost" type="button" onClick={onClearCertificateEntry}>
              {t('cvForm.clear')}
            </button>
            <button className="primary" type="button" onClick={onAddCertificateEntry}>
              {t('cvForm.add')}
            </button>
          </div>
          {certificateEntries.length > 0 && (
            <div className="cv-list">
              {certificateEntries.map((entry, index) => (
                <div key={`${entry.title}-${index}`} className="cv-list-card">
                  <strong>{entry.title || t('cvForm.certificateFallback')}</strong>
                  <span className="muted">
                    {entry.organization || t('cvForm.organizationPlaceholder')}
                  </span>
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
            <h2>{t('cvForm.trainingsTitle')}</h2>
            <button className="icon-button" type="button" aria-label="Collapse">
              ▴
            </button>
          </div>
          <div className="cv-form-grid">
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.titlePlaceholder')}
              value={trainingEntry.title}
              onChange={(event) =>
                setTrainingEntry((prev) => ({ ...prev, title: event.target.value }))
              }
            />
            <input
              className="full-width"
              type="text"
              placeholder={t('cvForm.organizationPlaceholder')}
              value={trainingEntry.organization}
              onChange={(event) =>
                setTrainingEntry((prev) => ({ ...prev, organization: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder={t('cvForm.startDatePlaceholder')}
              value={trainingEntry.startDate}
              onChange={(event) =>
                setTrainingEntry((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder={t('cvForm.endDatePlaceholder')}
              value={trainingEntry.endDate}
              onChange={(event) =>
                setTrainingEntry((prev) => ({ ...prev, endDate: event.target.value }))
              }
            />
          </div>
          <div className="cv-actions-row">
            <button className="ghost" type="button" onClick={onClearTrainingEntry}>
              {t('cvForm.clear')}
            </button>
            <button className="primary" type="button" onClick={onAddTrainingEntry}>
              {t('cvForm.add')}
            </button>
          </div>
          {trainingEntries.length > 0 && (
            <div className="cv-list">
              {trainingEntries.map((entry, index) => (
                <div key={`${entry.title}-${index}`} className="cv-list-card">
                  <strong>{entry.title || t('cvForm.trainingFallback')}</strong>
                  <span className="muted">
                    {entry.organization || t('cvForm.organizationPlaceholder')}
                  </span>
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
          {t('cvForm.publish')}
        </button>
      </div>
    </div>
  </div>
)

export default CvFormPage
