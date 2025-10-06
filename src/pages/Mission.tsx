import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Mission as MissionType } from '../types';

const statusStyles: { [key: string]: string } = {
    active: 'bg-green-500/20 text-green-400',
    upcoming: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-zinc-500/20 text-zinc-400',
    failed: 'bg-red-500/20 text-red-400',
};

const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

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

const ImageSkeleton = () => (
    <div className='aspect-video bg-zinc-700 rounded-lg'></div>
);

function Mission() {
    const { id } = useParams<{ id: string }>();
    const [mission, setMission] = useState<MissionType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    const IMAGES_PER_PAGE = 9;
    const [visibleImages, setVisibleImages] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [isFetchingMoreImages, setIsFetchingMoreImages] = useState(false);

    const [contrast, setContrast] = useState(0);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastImageRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            const hasMoreImages = node?.parentElement ? (node.parentElement.children.length < (mission?.image_ids.length || 0)) : false;
            if (entries[0].isIntersecting && hasMoreImages) {
                setIsFetchingMoreImages(true);
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, mission]);

    useEffect(() => {
        if (!id) return;
        fetch(`https://api.mission.austinlopez.work/mission/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setMission(data);
                setVisibleImages(data.image_ids.slice(0, IMAGES_PER_PAGE));
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

    useEffect(() => {
        if (isFetchingMoreImages && mission) {
            setTimeout(() => {
                const nextPage = page + 1;
                const newVisibleImages = mission.image_ids.slice(0, nextPage * IMAGES_PER_PAGE);

                setVisibleImages(newVisibleImages);
                setPage(nextPage);
                setIsFetchingMoreImages(false);
            }, 500);
        }
    }, [isFetchingMoreImages, mission, page]);

    useEffect(() => {
        if (!mission) return;
        const hasMoreImages = visibleImages.length < mission.image_ids.length;

        if (isLoading || isFetchingMoreImages || !hasMoreImages) return;

        if (document.documentElement.scrollHeight <= window.innerHeight) {
            setIsFetchingMoreImages(true);
        }
    }, [mission, visibleImages, isLoading, isFetchingMoreImages]);

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
        <div className='min-h-screen w-full p-4 sm:p-8 text-zinc-200'>
            <div className='max-w-7xl mx-auto'>
                <Link to="/" className='text-blue-400 hover:underline mb-6 inline-block'>
                    &larr; Back to Dashboard
                </Link>

                <div className='flex items-center gap-4 mb-8'>
                    <h1 className='text-4xl font-bold text-white'>{mission.name}</h1>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[mission.status.toLowerCase()] || statusStyles.completed}`}>
                        {mission.status.toUpperCase()}
                    </span>
                </div>


                <div className='bg-zinc-800 p-6 rounded-lg shadow-md mb-8'>
                    <h2 className='text-2xl font-semibold text-white mb-4 border-b border-white/10 pb-2'>Operational Details</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>

                        <div>
                            <p className='text-sm text-zinc-400'>Priority</p>
                            <p className='text-lg font-medium text-white'>{mission.priority}</p>
                        </div>
                        <div>
                            <p className='text-sm text-zinc-400'>Collection Type</p>
                            <p className='text-lg font-medium text-white'>{mission.collection_type}</p>
                        </div>
                        <div>
                            <p className='text-sm text-zinc-400'>Minimum Range</p>
                            <p className='text-lg font-medium text-white'>{mission.min_range_km.toLocaleString()} km</p>
                        </div>

                        <div>
                            <p className='text-sm text-zinc-400'>Observer Satellite</p>
                            <p className='text-lg font-mono text-white'>{mission.observer_satellite_id}</p>
                        </div>
                        <div>
                            <p className='text-sm text-zinc-400'>Target Satellite</p>
                            <p className='text-lg font-mono text-white'>{mission.target_satellite_id}</p>
                        </div>
                        <div>
                            <p className='text-sm text-zinc-400'>Pointing Target</p>
                            <p className='text-lg font-mono text-white'>{mission.pointing_target}</p>
                        </div>

                        <div className='md:col-span-2 lg:col-span-3'>
                            <p className='text-sm text-zinc-400'>Collection Window</p>
                            <p className='text-lg font-medium text-white'>
                                {formatTimestamp(mission.collection_window_start)} to {formatTimestamp(mission.collection_window_end)}
                            </p>
                        </div>
                        <div className='md:col-span-2 lg:col-span-3'>
                            <p className='text-sm text-zinc-400'>Time of Closest Approach (TCA)</p>
                            <p className='text-lg font-medium text-white'>{formatTimestamp(mission.tca)}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className='sticky top-0 z-10 bg-zinc-900 py-4 text-2xl font-semibold text-white mb-4'>Imagery ({visibleImages.length} / {mission.image_ids.length})</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {visibleImages.map((imageId, index) => {
                            if (visibleImages.length === index + 1) {
                                return (
                                    <div
                                        ref={lastImageRef}
                                        key={imageId}
                                        className='rounded-lg overflow-hidden cursor-pointer group'
                                        onClick={() => {
                                            setSelectedImageId(imageId);
                                            setContrast(0);
                                        }}
                                    >
                                        <img src={`https://api.mission.austinlopez.work/image/${imageId}?width=400&height=250`} alt={`Imagery for ${mission.name}`} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110' />
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={imageId}
                                        className='rounded-lg overflow-hidden cursor-pointer group'
                                        onClick={() => {
                                            setSelectedImageId(imageId);
                                            setContrast(0);
                                        }}
                                    >
                                        <img src={`https://api.mission.austinlopez.work/image/${imageId}?width=400&height=250`} alt={`Imagery for ${mission.name}`} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110' />
                                    </div>
                                );
                            }
                        })}
                        {isFetchingMoreImages && (
                            <>
                                <ImageSkeleton />
                                <ImageSkeleton />
                                <ImageSkeleton />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {selectedImageId && (
                <div
                    className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in'
                    onClick={() => setSelectedImageId(null)}
                >
                    <button className='absolute top-4 right-4 text-white text-4xl font-bold hover:text-zinc-300 cursor-pointer'>
                        &times;
                    </button>

                    <img
                        src={`https://api.mission.austinlopez.work/image/${selectedImageId}?contrast=${contrast}`}
                        className='max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl'
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div
                        className='absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm p-4 rounded-lg w-full max-w-md'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <label htmlFor="contrast" className="block text-sm font-medium text-white mb-2 text-center">
                            Contrast: {contrast}
                        </label>
                        <input
                            id="contrast"
                            type="range"
                            min="-100"
                            max="100"
                            step="1"
                            value={contrast}
                            onChange={(e) => setContrast(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Mission;