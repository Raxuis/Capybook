"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";

interface GoalsData {
    goal: number;
    current: number;
    percentage: number;
}

interface GoalsComparisonProps {
    data: GoalsData | null;
}

export function GoalsComparison({data}: GoalsComparisonProps) {
    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Objectifs de lecture</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Aucun objectif défini pour cette année.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Objectifs de lecture</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Progression</span>
                        <span className="text-sm font-medium">{data.percentage}%</span>
                    </div>
                    <Progress value={data.percentage} className="h-2"/>
                    <div className="flex justify-between text-sm">
            <span>{data.current} {
                data.current > 1 ? "livres lus" : "livre lu"
            }</span>
                        <span>Objectif: {data.goal}{
                            data.goal > 1 ? " livres" : " livre"
                        }</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
