"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProgressData {
  date: string;
  pages: number;
  books: number;
}

interface ProgressChartsProps {
  data: ProgressData[];
}

export function ProgressCharts({ data }: ProgressChartsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progression de lecture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pages"
                stroke="#8884d8"
                name="Pages lues"
              />
              <Line
                type="monotone"
                dataKey="books"
                stroke="#82ca9d"
                name="Livres terminés"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
