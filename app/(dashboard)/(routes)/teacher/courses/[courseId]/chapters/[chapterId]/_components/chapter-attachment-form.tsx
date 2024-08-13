"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { File, ImageIcon, Loader, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { FileUpload } from "@/components/file-upload";
import { Attachment, Chapter, Course } from "@prisma/client";


interface ChapterAttachmentFormProps{
    initialData: Chapter & {attachments: Attachment[]};
    courseId:string;
    chapterId:string;
};


const formSchema=z.object({
        url:z.string().min(1),
});



export const ChapterAttachmentForm = ({
    initialData,
    courseId,
    chapterId
}:ChapterAttachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [deletingId,setDeletingId]=useState<string | null>(null);
    // const form=useForm<z.infer<typeof formSchema>>({
    //     resolver:zodResolver(formSchema),
    //     defaultValues:{
    //         initialdata: initialdata.attachments
    //     },
    // });
    const router=useRouter();

   
    const toggleEdit=()=>setIsEditing((current)=>!current);

    const onSubmit=async(values:z.infer<typeof formSchema>) =>{
        
        try {
           
            // await axios.patch(`api/courses/${courseId}`,values);
               
            await fetch(`/api/courses/${courseId}/chapters/${chapterId}/attachments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            toast.success("Course updated");
            toggleEdit();
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong");
            toggleEdit();
        }
        
    }

    const onDelete=async(id:string)=>{
        try {
            setDeletingId(id);
            const response=await fetch(`/api/courses/${courseId}/chapters/${chapterId}/attachments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(id),
            });
            if (!response.ok) {
                throw new Error(`Failed to delete attachment: ${response.statusText}`);
              }
            toast.success("Attachment updated");
            router.refresh()

        } catch  {
            toast.error("Something went wrong");
        } finally{
            setDeletingId(null);
        }
    }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course Attachments
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                    <>Cancel</>
                )}   
                {!isEditing && (
                    <>
                    <PlusCircle className="h-4 w-4 mr-2"/>
                    Add a file
                    </>
                )}
              
            </Button>
        </div>
        {!isEditing && (
            <>
                {initialData.attachments.length==0 && (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No attachments yet
                    </p>
                )}

                {initialData.attachments.length>0 && (
                    <div className="space-y-2">
                        {initialData.attachments.map((attachment)=>(
                            <div
                            key={attachment.id}
                            className="flex items-center p-3 w-full bg-sky-100 border-sky-200
                            border text-sky-700 rounded-md"

                            >
                                <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                <p className="text-xs line-clamp-1">
                                    {attachment.name}
                                </p>
                                {deletingId===attachment.id && (
                                    <div>
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                    </div>
                                )} 
                                {deletingId!==attachment.id && (
                                    <button 
                                        onClick={()=>onDelete(attachment.id)}
                                        className="ml-auto hover:opacity-75 transition"
                                       
                                    >
                                        <X className="h-4 w-4 "/>
                                    </button>
                                )} 
                            </div>
                        ))}
                    </div>
                )

                }
            </>
    
        )}
        

        {isEditing && (
          <div>
           <FileUpload
                endpoint="courseAttachment"
                onChange={(url)=>{
                    if(url){
                        onSubmit({url:url});
                        
                    }
                }}
           />
           
          </div>
        )}

    </div>
  )
}

