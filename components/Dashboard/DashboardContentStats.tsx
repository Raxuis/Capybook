import React from 'react';
import {ProgressCharts} from "@/components/Statistics/ProgressCharts";
import {GenreAnalysis} from "@/components/Statistics/GenreAnalysis";
import {AuthorAnalysis} from "@/components/Statistics/AuthorAnalysis";
import {GoalsComparison} from "@/components/Statistics/GoalsComparison";
import {getAllDashboardStats} from "@/actions/statistics";

export default async function DashboardContentStats() {
    const data = await getAllDashboardStats();
    if (!data || Object.keys(data).length === 0) {
        return <div>No data available</div>;
    }

    console.log("Dashboard data:", data);

    return (
        <div className="grid grid-cols-1 gap-4">
            <ProgressCharts data={data.readingProgress}/>
            <GenreAnalysis data={data.genreAnalysis}/>
            <AuthorAnalysis data={data.authorAnalysis}/>
            <GoalsComparison data={data.goalsComparison}/>
        </div>
    );
};