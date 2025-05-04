import { Suspense } from "react";
import { ProgressCharts } from "@/components/Statistics/ProgressCharts";
import { GenreAnalysis } from "@/components/Statistics/GenreAnalysis";
import { AuthorAnalysis } from "@/components/Statistics/AuthorAnalysis";
import { GoalsComparison } from "@/components/Statistics/GoalsComparison";
import { StatisticsLoading } from "@/components/Statistics/StatisticsLoading";

export default function StatisticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vos Statistiques</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<StatisticsLoading />}>
          <ProgressCharts />
        </Suspense>

        <Suspense fallback={<StatisticsLoading />}>
          <GenreAnalysis />
        </Suspense>

        <Suspense fallback={<StatisticsLoading />}>
          <AuthorAnalysis />
        </Suspense>

        <Suspense fallback={<StatisticsLoading />}>
          <GoalsComparison />
        </Suspense>
      </div>
    </div>
  );
}
