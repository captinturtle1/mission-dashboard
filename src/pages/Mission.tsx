import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Mission as MissionType } from '../types';

function Mission() {
    const { id } = useParams<{ id: string }>();
    const [mission, setMission] = useState<MissionType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`http://localhost:8080/mission/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setMission(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch mission:", error);
                setIsLoading(false);
            });
    }, [id]);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return <div className='bg-gray-900 min-h-screen p-8 text-white'>Loading mission data...</div>;
    }

    if (!mission) {
        return <div className='bg-gray-900 min-h-screen p-8 text-white'>Mission not found.</div>;
    }

    return (
        <div className='bg-zinc-900 min-h-screen w-full p-4 sm:p-8 text-gray-200'>
            <div className='max-w-7xl mx-auto'>
                <Link to="/" className='text-blue-400 hover:underline mb-6 inline-block'>
                    &larr; Back to Dashboard
                </Link>

                <div className='flex items-center gap-4 mb-6'>
                    <h1 className='text-4xl font-bold text-white'>{mission.name}</h1>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${mission.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {mission.active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className='bg-zinc-800 p-6 rounded-lg shadow-md mb-8'>
                    <h2 className='text-2xl font-semibold text-white mb-4'>Mission Details</h2>
                    <p><strong className='text-gray-400'>Start Date:</strong> {formatDate(mission.start_date)}</p>
                </div>

                <div>
                    <h2 className='text-2xl font-semibold text-white mb-4'>Imagery</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {mission.image_ids?.map((imageId: string) => (
                            <div key={imageId} className='rounded-lg overflow-hidden'>
                                <img
                                    src={`http://localhost:8080/image/${imageId}?width=400&height=250`}
                                    alt={`Imagery for ${mission.name}`}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mission;