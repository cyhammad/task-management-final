import { useRouter } from 'next/router'
import { AuthContextProvider } from '../context/AuthContext'
import '../styles/globals.css'
import ProtectedRoute from '../components/ProtectedRoute'
import { useEffect } from 'react'
import { getMessaging, getToken, requestPermission } from 'firebase/messaging'
import { app } from '../firebase'

const noAuthRequired = ['/auth/login', '/auth/signup']

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  
  return (
    <AuthContextProvider>
      {noAuthRequired.includes(router.pathname) ?
        <Component {...pageProps} />
        :
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      }
    </AuthContextProvider>
  )
}

export default MyApp
