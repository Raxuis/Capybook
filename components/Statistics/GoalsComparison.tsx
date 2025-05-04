import { getGoalsComparison } from "@/actions/statistics";
import { GoalsComparison as GoalsComparisonClient } from "./GoalsComparison.client";

export async function GoalsComparison() {
  const data = await getGoalsComparison();
  return <GoalsComparisonClient data={data} />;
}
