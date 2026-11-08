import { useEffect, useState } from 'react'

import { RandomizerPage } from '@/pages/randomizer-page'
import { SetupPage } from '@/pages/setup-page'
import { loadSetup, saveSetup } from '@/shared/lib/localStorage'

type Screen = 'setup' | 'randomizer'

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [participants, setParticipants] = useState<string[]>(
    () => loadSetup()?.participants ?? [],
  )
  const [teamSize, setTeamSize] = useState<number>(() => loadSetup()?.teamSize ?? 3)

  useEffect(() => {
    saveSetup({ participants, teamSize })
  }, [participants, teamSize])

  if (screen === 'setup') {
    return (
      <SetupPage
        initialNames={participants}
        teamSize={teamSize}
        onTeamSizeChange={setTeamSize}
        onStart={(names) => {
          setParticipants(names)
          setScreen('randomizer')
        }}
      />
    )
  }

  return (
    <RandomizerPage
      participants={participants}
      teamSize={teamSize}
      onBack={() => setScreen('setup')}
    />
  )
}
