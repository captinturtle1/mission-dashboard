import { Link } from "react-router-dom";

interface MissionCardProps {
    id: string;
    name: string;
    coverImageId: string;
}

export default function MissionCard({ name, id, coverImageId }: MissionCardProps) {
    const imageUrl = `http://localhost:8080/image/${coverImageId}?width=400&height=250`;

    return (
        <Link
            to={`/mission/${id}`}
            className='group relative block bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105'
        >
            <img
                src={imageUrl}
                alt={`Cover for ${name}`}
                className='absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75'
            />
            <div className='absolute inset-0 bg-black opacity-50'></div>

            <div className='relative p-5 h-48 flex flex-col justify-end'>
                <h2 className='text-xl font-bold text-white'>{name}</h2>
                <p className='mt-1 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    View Details &rarr;
                </p>
            </div>
        </Link>
    );
}