const HomePage = ({ onStart, onViewProfile, onRegister, isAuthed, t }) => (
  <div className="page">
    <header className="page-header hero">
      <div>
        <p className="eyebrow">dsq.ge</p>
        <h1>{t('home.title')}</h1>
        <p className="muted">{t('home.subtitle')}</p>
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
      </div>
      <div className="hero-card">
        <h3>{t('home.howItWorks')}</h3>
        <ol>
          <li>{t('home.step1')}</li>
          <li>{t('home.step2')}</li>
          <li>{t('home.step3')}</li>
          <li>{t('home.step4')}</li>
        </ol>
      </div>
    </header>

    <section className="feature-grid">
      <article className="feature-card">
        <h4>{t('home.quickLinksTitle')}</h4>
        <p className="muted">{t('home.quickLinksDesc')}</p>
      </article>
      <article className="feature-card">
        <h4>{t('home.trackerTitle')}</h4>
        <p className="muted">{t('home.trackerDesc')}</p>
      </article>
      <article className="feature-card">
        <h4>{t('home.messagingTitle')}</h4>
        <p className="muted">{t('home.messagingDesc')}</p>
      </article>
    </section>
  </div>
)

export default HomePage
