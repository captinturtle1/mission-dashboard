import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Mission as MissionType } from '../types';

const MissionSkeleton = () => (
    <div className='max-w-7xl mx-auto animate-pulse'>
        <div className='h-5 w-48 bg-zinc-700 rounded mb-6'></div>

        <div className='flex items-center gap-4 mb-6'>
            <div className='h-10 w-1/2 bg-zinc-700 rounded'></div>
            <div className='h-7 w-24 bg-zinc-700 rounded-full'></div>
        </div>

        <div className='bg-zinc-800 p-6 rounded-lg shadow-md mb-8'>
            <div className='h-8 w-1/3 bg-zinc-700 rounded mb-4'></div>
            <div className='h-5 w-1/2 bg-zinc-700 rounded'></div>
        </div>

        <div>
            <div className='h-8 w-1/4 bg-zinc-700 rounded mb-4'></div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='h-48 bg-zinc-700 rounded-lg'></div>
                <div className='h-48 bg-zinc-700 rounded-lg'></div>
                <div className='h-48 bg-zinc-700 rounded-lg'></div>
            </div>
        </div>
    </div>
);

function Mission() {
    const { id } = useParams<{ id: string }>();
    const [mission, setMission] = useState<MissionType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedImageId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className='bg-zinc-900 min-h-screen w-full p-4 sm:p-8'>
                <MissionSkeleton />
            </div>
        );
    }

    if (!mission) {
        return <div className='bg-zinc-900 min-h-screen p-8 text-white'>Mission not found.</div>;
    }

    return (
        <div className='bg-zinc-900 min-h-screen w-full p-4 sm:p-8 text-zinc-200'>
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
                    <p><strong className='text-zinc-400'>Start Date:</strong> {formatDate(mission.start_date)}</p>
                </div>

                <div>
                    <h2 className='text-2xl font-semibold text-white mb-4'>Imagery</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {mission.image_ids?.map((imageId: string) => (
                            <div
                                key={imageId}
                                className='rounded-lg overflow-hidden cursor-pointer group'
                                onClick={() => setSelectedImageId(imageId)}
                            >
                                <img
                                    src={`http://localhost:8080/image/${imageId}?width=400&height=250`}
                                    alt={`Imagery for ${mission.name}`}
                                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedImageId && (
                <div
                    className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in'
                    onClick={() => setSelectedImageId(null)}
                >
                    <button className='absolute top-4 right-4 text-white text-4xl font-bold hover:text-zinc-300'>
                        &times;
                    </button>

                    <img
                        src={`http://localhost:8080/image/${selectedImageId}`}
                        alt="Full resolution view"
                        className='max-w-full max-h-full rounded-lg shadow-2xl'
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}

export default Mission;