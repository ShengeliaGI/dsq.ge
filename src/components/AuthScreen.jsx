import { useEffect, useState } from 'react'

const AuthScreen = ({
  authMode,
  isSubmitting,
  errorMessage,
  onSubmit,
  onToggleMode,
  t,
}) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('applicant')

  useEffect(() => {
    setPassword('')
  }, [authMode])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name: fullName.trim(), email: email.trim(), password, role })
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">dsq.ge</p>
          <h1>{authMode === 'login' ? t('auth.titleLogin') : t('auth.titleRegister')}</h1>
          <p className="muted">{t('auth.subtitle')}</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <label>
              {t('auth.fullName')}
              <input
                type="text"
                placeholder={t('auth.fullNamePlaceholder')}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </label>
          )}
          {authMode === 'register' && (
            <label>
              {t('auth.accountType')}
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="applicant">{t('auth.accountApplicant')}</option>
                <option value="company">{t('auth.accountCompany')}</option>
              </select>
              <span className="helper">
                {role === 'company'
                  ? t('auth.helperCompany')
                  : t('auth.helperApplicant')}
              </span>
            </label>
          )}
          <label>
            {t('auth.email')}
            <input
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            {t('auth.password')}
            <input
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {errorMessage && <p className="auth-error">{errorMessage}</p>}
          <button className="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('auth.loading')
              : authMode === 'login'
                ? t('auth.enter')
                : t('auth.registerContinue')}
          </button>
        </form>
        <button className="link" type="button" onClick={onToggleMode}>
          {authMode === 'login'
            ? t('auth.toggleToRegister')
            : t('auth.toggleToLogin')}
        </button>
      </div>
    </div>
  )
}

export default AuthScreen
