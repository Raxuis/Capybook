import React, {memo} from 'react';
import CreateChallengeDialog from "@/components/Challenges/CreateChallenge/CreateChallengeDialog";
import {UserWithRelations} from "@/hooks/useUser";
import ChallengeHeaderInfo from "@/components/Challenges/ChallengeHeader/ChallengeHeaderInfo";
import UpdateChallengeDialog from "@/components/Challenges/UpdateChallenge/UpdateChallengeDialog";

type Props = {
    user: UserWithRelations;
}

const ChallengeHeader = memo(() => {
    return (
        <>
            <div className="flex sm:justify-between sm:items-center mb-4 max-sm:flex-col items-start w-full">
                <h1 className="text-2xl font-bold">Mes challenges de lecture</h1>
                <CreateChallengeDialog/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <ChallengeHeaderInfo type="booksRead"/>
                <ChallengeHeaderInfo type="challengesCompleted"/>
                <ChallengeHeaderInfo type="inProgress"/>
            </div>
            <UpdateChallengeDialog/>
        </>
    );
});

export default ChallengeHeader;
