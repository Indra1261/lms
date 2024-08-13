"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { FileUpload } from "@/components/file-upload";
interface ImageFormProps{
    initialImageUrl: string | null;
    courseId:string;
};


const formSchema=z.object({
    imageurl:z.string().min(1,{
        message:"image is required",
    }),
});



export const ImageForm = ({
    initialImageUrl,
    courseId
}:ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            imageurl: initialImageUrl || ""
        },
    });
    const router=useRouter();

    const {isSubmitting,isValid}=form.formState;
    const toggleEdit=()=>setIsEditing((current)=>!current);

    const onSubmit=async(values:z.infer<typeof formSchema>) =>{
        
        try {
           
            // await axios.patch(`api/courses/${courseId}`,values);
               
            await fetch(`/api/courses/${courseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            toast.success("Course updated");
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong");
            toggleEdit();
        }
        
    }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course image
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                    <>Cancel</>
                )}   
                {!isEditing && !initialImageUrl && (
                    <>
                    <PlusCircle className="h-4 w-4 mr-2"/>
                    Add an image
                    </>
                )}
                {!isEditing && initialImageUrl &&(
                    <>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Edit image
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
                
               !initialImageUrl ? (
                  <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                  </div>

                
               ) :(
                <div className="relative aspect-video mt-2">
                    <Image
                        alt="Upload"
                        fill
                        className="object-cover rounded-md"
                        src={initialImageUrl}
                    />
                    
                </div>
               )
         )}
        

        {isEditing && (
          <div>
           <FileUpload
                endpoint="courseImage"
                onChange={(url)=>{
                    if(url){
                        onSubmit({imageurl:url});
                        toggleEdit();
                    }
                }}
           />
          </div>
        )}

    </div>
  )
}

