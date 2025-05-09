"use client";

import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend
} from "recharts";

interface ProgressChartsProps {
    data: Array<{
        date: string;
        pages: number;
        books: number;
    }>;
}

export const ProgressCharts = ({data}: ProgressChartsProps) => {

    const formatXAxis = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'});
    };

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Progression de lecture</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    data.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Aucune donnée disponible</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Pages lues et livres terminés au fil du temps</p>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                    <XAxis dataKey="date" tickFormatter={formatXAxis}/>
                                    <YAxis yAxisId="left"/>
                                    <YAxis yAxisId="right" orientation="right"/>
                                    <Tooltip
                                        formatter={(value, name) => {
                                            if (name === "pages") return [value, "Pages lues"];
                                            if (name === "books") return [value, "Livres terminés"];
                                            return [value, name];
                                        }}
                                        labelFormatter={(label) => formatXAxis(label)}
                                    />
                                    <Legend/>
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="pages"
                                        stroke="#8884d8"
                                        name="Pages lues"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="books"
                                        stroke="#82ca9d"
                                        name="Livres terminés"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </>
                    )
                }
            </CardContent>
        </Card>
    );
};