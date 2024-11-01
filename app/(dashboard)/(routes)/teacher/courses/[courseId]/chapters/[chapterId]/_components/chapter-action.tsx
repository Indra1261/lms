"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps{
    disabled:boolean;
    courseId:string;
    chapterId:string;
    isPublic:boolean;
};

export const ChapterActions=({
    disabled,
    courseId,
    chapterId,
    isPublic
}:ChapterActionsProps) =>{

    const router=useRouter();
    const [isLoading,setIsLoading]=useState(false);

    const onClick=async()=>{
        try {
            setIsLoading(true);
            if(isPublic)
            {
                await fetch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`, {
                    method: 'PATCH'
                  });
                toast.success("Chapter unpublished");
            }
            else
            {
                await fetch(`/api/courses/${courseId}/chapters/${chapterId}/publish`, {
                    method: 'PATCH'
                  });
                toast.success("Chapter published");
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
            await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, {
                method: 'DELETE'
              });
            toast.success("Chapter deleted");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`); 
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
