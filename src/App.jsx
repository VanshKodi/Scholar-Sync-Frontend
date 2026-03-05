import { useEffect, useState } from 'react'
import { checkUserSession } from './utils/supabase.jsx'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      const activeSession = await checkUserSession()
      setSession(activeSession)
      console.log(activeSession)
    }

    fetchSession()
  }, [])

  return (
    <div>
      Check your developer console. Logged in: {session ? 'Yes' : 'No'}
    </div>
  )
}