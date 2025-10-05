export default function MissionCard({ name, image }: { name: string; image: string }) {
    return (
        <div className='border p-4 bg-gray-500 hover:bg-gray-600 rounded transition-colors cursor-pointer'>
            <h2 className='text-xl font-bold'>{name}</h2>
            <img src={`http://localhost:8080/images/${image}`} alt={name} />
        </div>
    )
}