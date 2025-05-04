import { getReadingProgress } from "@/actions/statistics";
import { ProgressCharts as ProgressChartsClient } from "./ProgressCharts.client";

export async function ProgressCharts() {
  const data = await getReadingProgress();
    console.log("ProgressCharts data", data);
  return <ProgressChartsClient data={data} />;
}
