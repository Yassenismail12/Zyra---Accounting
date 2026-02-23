import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import { login } from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { BrandMark } from '../components/BrandMark'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, setAuth } = useAuth()

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
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setApiError('Cannot reach API. Make sure backend is running on port 3000.')
          return
        }

        const message =
          error.response.data?.message ||
          error.response.data?.error?.message ||
          'Login failed. Please try again.'
        setApiError(message)
        return
      }
      setApiError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <BrandMark />
        <h1>Login to ZYRA</h1>
        <p className="auth-subtitle">Sign in to continue to your dashboard</p>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p className="field-error">{errors.email.message}</p>}

        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p className="field-error">{errors.password.message}</p>}

        {apiError && <p className="field-error">{apiError}</p>}

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
