import { useState, useEffect, useCallback } from 'react';
import MissionCard from '../components/MissionCard';
import type { Mission } from '../types';

const MissionCardSkeleton = () => (
    <div className='h-56 bg-zinc-800 rounded-lg p-4 flex flex-col justify-end'>
        <div className='h-6 w-3/4 bg-zinc-700 rounded mb-2'></div>
        <div className='flex items-center justify-between'>
            <div className='h-5 w-1/4 bg-zinc-700 rounded-full'></div>
            <div className='h-4 w-1/3 bg-zinc-700 rounded'></div>
        </div>
        <div className='mt-3 pt-3 border-t border-white/10'>
            <div className='h-3 w-1/2 bg-zinc-700 rounded'></div>
        </div>
    </div>
);

const HomeSkeleton = () => (
    <div className='animate-pulse'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, i) => (
                <MissionCardSkeleton key={i} />
            ))}
        </div>
    </div>
);

function Home() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const COUNT_PER_PAGE = 16;

    const fetchMissions = useCallback(async (token: string | null) => {
        let url = `https://api.mission.austinlopez.work/missions?count=${COUNT_PER_PAGE}`;
        if (token) {
            url += `&nextToken=${token}`;
        }
        try {
            const res = await fetch(url);
            const data = await res.json();

            setMissions(prevMissions => [...prevMissions, ...data.missions]);
            setNextToken(data.nextToken || null);

            if (!data.nextToken) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch missions:", error);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchMissions(null);
    }, [fetchMissions]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 || isFetchingMore || !hasMore) {
                return;
            }
            setIsFetchingMore(true);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFetchingMore, hasMore]);

    useEffect(() => {
        if (isFetchingMore && hasMore) {
            fetchMissions(nextToken);
        }
    }, [isFetchingMore, hasMore, nextToken, fetchMissions]);

    useEffect(() => {
        if (isLoading || isFetchingMore || !hasMore) return;

        if (document.documentElement.scrollHeight <= window.innerHeight) {
            setIsFetchingMore(true);
        }
    }, [missions, isLoading, isFetchingMore, hasMore]);


    return (
        <div className='min-h-screen w-full p-4 sm:p-8 text-zinc-100'>
            <div className='max-w-7xl mx-auto'>
                <header className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight text-white'>Mission Dashboard</h1>
                    <p className='text-zinc-400 mt-1'>Select a mission to view operational details.</p>
                </header>

                {isLoading ? (
                    <HomeSkeleton />
                ) : (
                    <>
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

                        {isFetchingMore && (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 animate-pulse'>
                                <MissionCardSkeleton />
                                <MissionCardSkeleton />
                                <MissionCardSkeleton />
                                <MissionCardSkeleton />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;