import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { loginUser, logoutUser, registerUser, checkAuth } from '@/store/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, token, isAuthenticated, loading, error } = useAppSelector(state => state.auth)

  const login = useCallback(
    (email: string, password: string) => {
      dispatch(loginUser({ email, password }))
    },
    [dispatch]
  )

  const register = useCallback(
    (email: string, firstName: string, lastName: string, password: string) => {
      dispatch(registerUser({ email, firstName, lastName, password }))
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(logoutUser())
  }, [dispatch])

  const refreshUser = useCallback(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
  }
}
