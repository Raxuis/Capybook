"use client";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

type Props = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    user: {
        username: string;
    }
}

function EditProfileModal({
                              isOpen,
                              onOpenChange,
                              user
                          }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b border-border px-6 py-4 text-base">
                        Edit profile
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Make changes to your profile here. You can change your photo and set a username.
                </DialogDescription>
                <div className="overflow-y-auto">
                    <div className="px-6 pb-6 pt-4">
                        <div className="mb-4">
                            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50"
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                                Bio
                            </Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about yourself"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="border-t border-border px-6 py-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EditProfileModal;
