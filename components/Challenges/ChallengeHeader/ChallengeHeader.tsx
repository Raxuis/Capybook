import React, {memo} from 'react';
import CreateChallengeDialog from "@/components/Challenges/CreateChallenge/CreateChallengeDialog";
import ChallengeHeaderInfo from "@/components/Challenges/ChallengeHeader/ChallengeHeaderInfo";
import UpdateChallengeDialog from "@/components/Challenges/UpdateChallenge/UpdateChallengeDialog";

const ChallengeHeader = memo(() => {
    return (
        <>
            <div className="mb-4 flex w-full items-start max-sm:flex-col sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Mes challenges de lecture</h1>
                <CreateChallengeDialog/>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                <ChallengeHeaderInfo type="booksRead"/>
                <ChallengeHeaderInfo type="challengesCompleted"/>
                <ChallengeHeaderInfo type="inProgress"/>
            </div>
            <UpdateChallengeDialog/>
        </>
    );
});

ChallengeHeader.displayName = 'ChallengeHeader';

export default ChallengeHeader;
