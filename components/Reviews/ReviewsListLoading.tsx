export default function ReviewsListLoading() {
    console.log("Loading reviews...");
    return (
        <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-md" />
            ))}
        </div>
    );
}
