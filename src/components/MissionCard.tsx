import { Link } from "react-router-dom";

export default function MissionCard({ name, id }: { name: string; id: number }) {
    return (
        <Link to={`/mission/${id}`} className='border p-4 bg-gray-500 hover:bg-gray-600 rounded transition-colors cursor-pointer'>
            <h2 className='text-xl font-bold'>{name}</h2>
        </Link>
    )
}