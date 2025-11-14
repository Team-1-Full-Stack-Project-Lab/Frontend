import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { loginUser, logoutUser, registerUser, checkAuth, deleteUserAccount, updateUserProfile } from '@/store/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, token, isAuthenticated, loading } = useAppSelector(state => state.auth)

  const login = useCallback(
    (email: string, password: string) => {
      return dispatch(loginUser({ email, password }))
    },
    [dispatch]
  )

  const register = useCallback(
    (email: string, firstName: string, lastName: string, password: string) => {
      return dispatch(registerUser({ email, firstName, lastName, password }))
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(logoutUser())
  }, [dispatch])

  const refreshUser = useCallback(() => {
    dispatch(checkAuth())
  }, [dispatch])

  const deleteAccount = useCallback(() => {
    dispatch(deleteUserAccount())
  }, [dispatch])

  const updateProfile = useCallback(
    (email: string, firstName: string, lastName: string) => {
      dispatch(updateUserProfile({ email, firstName, lastName }))
    },
    [dispatch]
  )

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    refreshUser,
    deleteAccount,
    updateProfile,
  }
}
