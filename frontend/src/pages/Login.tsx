import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { login } from '../api/auth'
import { getApiErrorMessage } from '../api/errors'
import { useAuth } from '../auth/AuthContext'
import { BrandMark } from '../components/BrandMark'
import { useI18n } from '../i18n'
type LoginFormValues = {
  email: string
  password: string
}

export function LoginPage() {
  const { t, toggleLang } = useI18n()
  const [apiError, setApiError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, setAuth } = useAuth()
  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('pages.login.validation.email')),
        password: z.string().min(6, t('pages.login.validation.password')),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null)
    try {
      const data = await login(values)
      setAuth(data.token, data.user)

      const redirectTo =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setApiError(
        getApiErrorMessage(
          error,
          t('pages.login.error.failed'),
          t('pages.login.error.offline'),
        ),
      )
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <button type="button" className="btn btn-outline lang-switch auth-lang-switch" onClick={toggleLang}>
          {t('common.language')}
        </button>
        <BrandMark />
        <h1>{t('pages.login.title')}</h1>
        <p className="auth-subtitle">{t('pages.login.subtitle')}</p>

        <label htmlFor="email">{t('pages.login.email')}</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}

        <label htmlFor="password">{t('pages.login.password')}</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p className="field-error">{errors.password.message}</p>}

        {apiError && <p className="field-error">{apiError}</p>}

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? t('pages.login.signingIn') : t('pages.login.signIn')}
        </button>
      </form>
    </div>
  )
}
