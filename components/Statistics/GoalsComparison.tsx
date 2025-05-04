import { getGoalsComparison } from "@/actions/statistics";
import { GoalsComparison as GoalsComparisonClient } from "./GoalsComparison.client";

export async function GoalsComparison() {
  const data = await getGoalsComparison();
    console.log("GoalsComparison data", data);
  return <GoalsComparisonClient data={data} />;
}
