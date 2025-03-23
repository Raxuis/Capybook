import React from 'react';
import {auth} from "@/auth";
import ChallengesContent from "@/components/Challenges/ChallengesContent";

export default async function Dashboard() {
    const session = await auth();

    return <ChallengesContent userId={session?.user?.id}/>;
}
