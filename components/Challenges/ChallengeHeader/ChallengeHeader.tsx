import React, {memo} from 'react';
import CreateChallengeDialog from "@/components/Challenges/CreateChallenge/CreateChallengeDialog";
import {UserWithRelations} from "@/hooks/useUser";
import ChallengeHeaderInfo from "@/components/Challenges/ChallengeHeader/ChallengeHeaderInfo";

type Props = {
    user: UserWithRelations;
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChallengeHeader = memo(({user, isDialogOpen, setIsDialogOpen}: Props) => {
    return (
        <>
            <div className="flex sm:justify-between sm:items-center mb-4 max-sm:flex-col items-start w-full">
                <h1 className="text-2xl font-bold">Mes challenges de lecture</h1>
                <CreateChallengeDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} user={user}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <ChallengeHeaderInfo type="booksRead" user={user}/>
                <ChallengeHeaderInfo type="challengesCompleted" user={user}/>
                <ChallengeHeaderInfo type="inProgress" user={user}/>
            </div>
        </>
    );
});

export default ChallengeHeader;
