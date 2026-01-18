import { useEffect, useState } from 'react'

const AuthScreen = ({
  authMode,
  isSubmitting,
  errorMessage,
  onSubmit,
  onToggleMode,
}) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setPassword('')
  }, [authMode])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name: fullName.trim(), email: email.trim(), password })
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">dsq.ge</p>
          <h1>{authMode === 'login' ? 'Log in' : 'Create account'}</h1>
          <p className="muted">
            Companies publish vacancies. Candidates complete a custom test.
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <label>
              Full name
              <input
                type="text"
                placeholder="Alex Carter"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {errorMessage && <p className="auth-error">{errorMessage}</p>}
          <button className="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait...'
              : authMode === 'login'
                ? 'Enter dsq.ge'
                : 'Register and continue'}
          </button>
        </form>
        <button className="link" type="button" onClick={onToggleMode}>
          {authMode === 'login'
            ? 'New here? Create an account'
            : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  )
}

export default AuthScreen
