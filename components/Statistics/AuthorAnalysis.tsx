import {getAuthorAnalysis} from "@/actions/statistics";
import {AuthorAnalysis as AuthorAnalysisClient} from "./AuthorAnalysis.client";

export async function AuthorAnalysis() {
    const data = await getAuthorAnalysis();
    console.log("AuthorAnalysis data", data);
    return <AuthorAnalysisClient data={data}/>;
}
