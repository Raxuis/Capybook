import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {GiProgression} from "react-icons/gi";


const Dropdown = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="size-10">
                <Button variant={"ghost"} size={"icon"}>
                    <Menu size={48}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-inter">
                <DropdownMenuLabel>
                    <div className="flex items-center justify-center">
                        <span className="text-muted-foreground">Menu</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                        <GiProgression size={24}/>
                        <span className="ml-2">Reading Progress</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem>List</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Dropdown;
