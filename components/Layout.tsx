import {twx} from "@/utils/twx";

export const Layout = twx.div(() => [
    `max-w-5xl w-full flex-col py-6 flex gap-4 mx-auto px-4`,
]);

export const DashboardLayout = twx.div(() => [
    `max-w-4xl mx-auto p-4 space-y-6 mb-24`
])

export const LayoutTitle = twx.h1(() => [`text-4xl font-bold`]);

export const LayoutDescription = twx.p(() => [
    `text-lg text-muted-foreground`,
]);