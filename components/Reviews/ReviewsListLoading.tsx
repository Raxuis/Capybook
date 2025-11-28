export default function ReviewsListLoading() {
    return (
        <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-md bg-gray-200"/>
            ))}
        </div>
    );
}
