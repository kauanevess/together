import { useState } from 'react'
import './App.css'

import StartScreen from './screens/StartScreen'
import QuestionScreen from './screens/QuestionScreen'
import FinalScreen from './screens/FinalScreen'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [finalizado, setFinalizado] = useState(false)

  if (!usuario) {
    return (
      <StartScreen
        onSelectUser={setUsuario}
      />
    )
  }

  if (finalizado) {
    return <FinalScreen />
  }

  return (
    <QuestionScreen
      user={usuario}
      onFinish={() => setFinalizado(true)}
    />
  )
}

export default App