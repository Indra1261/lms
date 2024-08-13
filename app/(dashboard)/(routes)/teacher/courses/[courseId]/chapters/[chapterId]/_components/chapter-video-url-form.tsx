"use client";
import YouTubeEmbed from "@/app/(dashboard)/_components/YoutubePlayer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";







interface ChapterVideoUrlFormProps{
    initialData:{
        videoUrl:string | null;
    };
    courseId:string;
    chapterId:string;
};


const formSchema=z.object({
    videoUrl: z.string().nullable().optional(),
});



export const ChapterVideoUrlForm = ({
    initialData,
    courseId,
    chapterId,
}:ChapterVideoUrlFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData,
    });
    const router=useRouter();

    const {isSubmitting,isValid}=form.formState;
    const toggleEdit=()=>setIsEditing((current)=>!current);

    const onSubmit=async(values:z.infer<typeof formSchema>) =>{
        console.log(values);
        
        try {
            const rs=await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if(!rs.ok) 
            {
                toast.error("Something went wrong");
                return
            }
            
            toast.success("Chapter updated");
            router.refresh()
            toggleEdit();
        } catch (error) {
            toast.error("Something went wrong");
            
        }
        
    }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Video key
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing? (
                    <>Cancel</>
                ):(   
                    <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit key
                    </>
                )}
            </Button>
        </div >
        <p className="text-sm mt-2 italic">
            { !initialData.videoUrl && "No video uploaded"}
        </p>
        {!isEditing && (
                
                <div className="text-sm mt-2">
                    {initialData.videoUrl && (
                   <YouTubeEmbed
                    videoUrl={initialData.videoUrl}
                   />
                   )}
                </div>
         )}
        

        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="eg ..Rotation Motion 1"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/> 
                            </FormItem>
                        )}

                    />

                    <Button 
                        disabled={!isValid || isSubmitting}
                        type="submit"
                        
                    >
                        Save
                    </Button>


                </form>

            </Form>
        )}

    </div>
  )
}

