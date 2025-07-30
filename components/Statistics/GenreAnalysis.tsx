"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from "recharts";

interface GenreData {
    name: string;
    count: number;
}

interface GenreAnalysisProps {
    data: GenreData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export function GenreAnalysis({data}: GenreAnalysisProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Analyse par genre</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    data.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-gray-500">Aucune donnée disponible</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex h-full items-center justify-center">
                                <p className="text-gray-500">Nombre de livres par genre</p>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            nameKey="name"
                                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                            ))}
                                        </Pie>
                                        <Tooltip/>
                                        <Legend/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )
                }
            </CardContent>
        </Card>
    );
}
