import { Link } from "react-router-dom";

interface MissionCardProps {
    id: string;
    name: string;
    status: string;
    priority: number;
    tca: number;
    coverImageId: string;
}

const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const statusStyles: { [key: string]: string } = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};


export default function MissionCard({ name, id, status, priority, tca, coverImageId }: MissionCardProps) {
    const imageUrl = `https://api.mission.austinlopez.work/image/${coverImageId}?width=400&height=250`;

    return (
        <Link
            to={`/mission/${id}`}
            className='group relative block bg-zinc-800 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 border border-transparent hover:border-blue-500'
        >
            <img
                src={imageUrl}
                alt={`Cover for ${name}`}
                className='absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'></div>

            <div className='relative p-4 h-56 flex flex-col justify-end'>
                <h2 className='text-xl font-bold text-white'>{name}</h2>
                <div className='flex items-center justify-between mt-2 text-sm'>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${statusStyles[status.toLowerCase()] || statusStyles.completed}`}>
                        {status.toUpperCase()}
                    </span>
                    <span className='text-zinc-300'>Priority: {priority}</span>
                </div>
                <div className='mt-3 pt-3 border-t border-white/10 text-xs text-zinc-300'>
                    TCA: {formatDate(tca)}
                </div>
            </div>
        </Link>
    );
}