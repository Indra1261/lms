"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps{
    disabled:boolean;
    courseId:string;
    isPublic:boolean;
};

export const Actions=({
    disabled,
    courseId,
    isPublic
}:ActionsProps) =>{

    const router=useRouter();
    const confetti=useConfettiStore();
    const [isLoading,setIsLoading]=useState(false);

    const onClick=async()=>{
        try {
            setIsLoading(true);
            if(isPublic)
            {
                await fetch(`/api/courses/${courseId}/unpublish`, {
                    method: 'PATCH'
                  });
                toast.success("Chapter unpublished");
            }
            else
            {
                await fetch(`/api/courses/${courseId}/publish`, {
                    method: 'PATCH'
                  });
                toast.success("Chapter published");
                confetti.onOpen();
            }
            router.refresh();
        } catch {
            toast.error("Something went wrong");
            
        } finally{
            setIsLoading(false);
        }

    }

    const onDelete=async()=>{
        try {
            setIsLoading(true);
            await fetch(`/api/courses/${courseId}`, {
                method: 'DELETE'
              });
            toast.success("Courses deleted");
            router.refresh();
            router.push(`/teacher/courses`); 
        } catch {
            toast.error("something went wrong");

        } finally{
            setIsLoading(false);
        }

    }


    return(
        <div className="flex items-center gap-x-2">
            <Button 
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublic?"Unpublish":"Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
            
        </div>
    )
}
