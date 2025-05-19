import {tabs} from "@/components/admin/sidebar/tabs";
import {redirect} from "next/navigation";

type Params = Promise<{ slug: string }>

export default async function Page(props: {
    params: Params
}) {
    const params = await props.params;
    const {slug} = params;

    const isValidTab = tabs.some(tab => {
        const tabSlug = tab.url.split('/').pop();
        return tabSlug === slug;
    });

    if (!isValidTab) {
        redirect("/admin");
        return null;
    }

    return (
        <div>
            <h1>Page {slug}</h1>
        </div>
    )
}