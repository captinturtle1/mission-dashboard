import { useEffect, useState } from 'react';
import MissionCard from '../components/MissionCard';
import type { Mission } from '../types';

const MissionCardSkeleton = () => (
    <div className='h-56 bg-gray-800 rounded-lg p-4 flex flex-col justify-end'>
        <div className='h-6 w-3/4 bg-gray-700 rounded mb-2'></div>
        <div className='flex items-center justify-between'>
            <div className='h-5 w-1/4 bg-gray-700 rounded-full'></div>
            <div className='h-4 w-1/3 bg-gray-700 rounded'></div>
        </div>
        <div className='mt-3 pt-3 border-t border-white/10'>
            <div className='h-3 w-1/2 bg-gray-700 rounded'></div>
        </div>
    </div>
);

const HomeSkeleton = () => (
    <div className='animate-pulse'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            <MissionCardSkeleton />
            <MissionCardSkeleton />
            <MissionCardSkeleton />
            <MissionCardSkeleton />
        </div>
    </div>
);

function Home() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.mission.austinlopez.work/missions')
            .then((res) => res.json())
            .then((data) => {
                setMissions(data.missions);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch missions:", error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className='min-h-screen w-full p-4 sm:p-8 text-gray-100'>
            <div className='max-w-7xl mx-auto'>
                <header className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight text-white'>Mission Dashboard</h1>
                    <p className='text-gray-400 mt-1'>Select a mission to view operational details.</p>
                </header>

                {isLoading ? (
                    <HomeSkeleton />
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {missions.map((mission) => (
                            <MissionCard
                                key={mission.id}
                                id={mission.id}
                                name={mission.name}
                                status={mission.status}
                                priority={mission.priority}
                                tca={mission.tca}
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