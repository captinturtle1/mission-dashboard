import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import '../index.css'

function Home() {
    const { id } = useParams()
    const [mission, setMissino] = useState({})

    useEffect(() => {
        fetch(`http://localhost:8080/mission/${id}`)
            .then((res) => res.json())
            .then((data) => setMissino(data))
    }, [])

    return (
        <div className='bg-slate-800 w-screen h-screen p-10 text-white'>
            <Link to="/" className='text-blue-500 underline'>Back</Link>
            <h1>{mission.name}</h1>
            <h2>{mission.active}</h2>
            <h2>{mission.start_date}</h2>
            <div className='grid grid-cols-3 gap-4 mt-4'>
                {mission.image_ids && mission.image_ids.map((image: string) => (
                    <img key={image} src={`http://localhost:8080/image/${image}?width=384&height=240`} alt={mission.name} />
                ))}
            </div>
        </div>
    )
}

export default Home
