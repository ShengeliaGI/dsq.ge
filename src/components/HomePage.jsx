const HomePage = ({ onStart, onViewProfile, onRegister, isAuthed, t }) => {
  const featureCards = [
    {
      title: t('home.quickLinksTitle'),
      description: t('home.quickLinksDesc'),
    },
    {
      title: t('home.trackerTitle'),
      description: t('home.trackerDesc'),
    },
    {
      title: t('home.messagingTitle'),
      description: t('home.messagingDesc'),
    },
  ]

  const roleCards = [
    {
      title: t('auth.accountApplicant'),
      description: t('auth.helperApplicant'),
    },
    {
      title: t('auth.accountCompany'),
      description: t('auth.helperCompany'),
    },
  ]

  return (
    <div className="page home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">dsq.ge</p>
          <h1>{t('home.title')}</h1>
          <p className="muted hero-intro">{t('home.subtitle')}</p>
          <div className="hero-actions">
            <button className="primary" type="button" onClick={onStart}>
              {t('home.explore')}
            </button>
            <button className="ghost" type="button" onClick={onViewProfile}>
              {t('home.viewProfile')}
            </button>
            {!isAuthed && (
              <button className="ghost" type="button" onClick={onRegister}>
                {t('home.register')}
              </button>
            )}
          </div>
          <div className="hero-tag-row" aria-hidden="true">
            <span className="hero-tag">{t('nav.vacancies')}</span>
            <span className="hero-tag">{t('nav.tests')}</span>
            <span className="hero-tag">{t('nav.messages')}</span>
            <span className="hero-tag">{t('nav.cvs')}</span>
          </div>
        </div>

        <aside className="hero-card hero-process-card">
          <div className="section-kicker">{t('home.howItWorks')}</div>
          <ol className="hero-process-list">
            <li>{t('home.step1')}</li>
            <li>{t('home.step2')}</li>
            <li>{t('home.step3')}</li>
            <li>{t('home.step4')}</li>
          </ol>
        </aside>
      </section>

      <section className="feature-grid home-feature-grid">
        {featureCards.map((item) => (
          <article key={item.title} className="feature-card">
            <p className="section-kicker">{item.title}</p>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="role-grid platform-role-grid">
        {roleCards.map((item) => (
          <article key={item.title} className="role-card home-role-card">
            <h3>{item.title}</h3>
            <p className="muted">{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default HomePage
