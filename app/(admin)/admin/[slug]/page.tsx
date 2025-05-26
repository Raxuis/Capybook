import AdminCrudPage, {EntitySlug} from '@/components/admin/AdminCrudPage';
import {redirect} from "next/navigation";
import {tabs} from "@/components/admin/sidebar/tabs";

export default async function Page(props: {
    params: Promise<{ slug: string }>
}) {
    const params = await props.params;
    const {slug} = params;

    const isValidTab = tabs.some(tab => {
        const tabSlug = tab.url.split('/').pop();
        return tabSlug === slug;
    });

    if (!isValidTab) {
        redirect("/admin");
    }

    return <AdminCrudPage slug={slug as EntitySlug} />;
}