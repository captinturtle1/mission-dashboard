import { useEffect, useState } from 'react';
import MissionCard from '../components/MissionCard';
import type { Mission } from '../types';

function Home() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/missions')
            .then((res) => res.json())
            .then((data) => {
                setMissions(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch missions:", error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className='bg-zinc-900 min-h-screen w-full p-4 sm:p-8 text-gray-100'>
            <div className='max-w-7xl mx-auto'>
                <header className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight text-white'>Mission Dashboard</h1>
                    <p className='text-gray-400 mt-1'>Select a mission to view operational details.</p>
                </header>

                {isLoading ? (
                    <p>Loading missions...</p>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {missions.map((mission) => (
                            <MissionCard
                                key={mission.id}
                                id={mission.id}
                                name={mission.name}
                                coverImageId={mission.image_ids[0]}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;