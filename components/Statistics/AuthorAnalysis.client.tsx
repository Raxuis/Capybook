"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

interface AuthorData {
    name: string;
    count: number;
}

interface AuthorAnalysisProps {
    data: AuthorData[];
}

export function AuthorAnalysis({data}: AuthorAnalysisProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 10 des auteurs</CardTitle>
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
                                <p className="text-gray-500">Nombre de livres lus par auteur</p>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Bar dataKey="count" fill="#8884d8" name="Livres lus"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )
                }
            </CardContent>
        </Card>
    );
}
