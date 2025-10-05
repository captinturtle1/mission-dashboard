import { useEffect, useState } from 'react'
import './index.css'

import MissionCard from './components/MissionCard'

function App() {
  const [missions, setMissinos] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/missions')
      .then((res) => res.json())
      .then((data) => setMissinos(data))
  }, [])

  return (
    <div className='bg-slate-800 w-screen h-screen p-10 text-white'>
      <h1 className='text-2xl font-bold'>Mission Dashboard</h1>
      <div className='grid grid-cols-3 gap-4 mt-4'>
        {missions.map((mission) => (
          <MissionCard key={mission.id} name={mission.name} image={mission.image_ids[0]} />
        ))}
      </div>
    </div>
  )
}

export default App
