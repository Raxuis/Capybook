import {CardSkeleton} from "@/components/common";

export default function ReviewsListLoading() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <CardSkeleton key={i} variant="review" />
            ))}
        </div>
    );
}
