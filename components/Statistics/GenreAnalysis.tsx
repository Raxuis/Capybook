import { getGenreAnalysis } from "@/actions/statistics";
import { GenreAnalysis as GenreAnalysisClient } from "./GenreAnalysis.client";

export async function GenreAnalysis() {
  const data = await getGenreAnalysis();
  return <GenreAnalysisClient data={data} />;
}
