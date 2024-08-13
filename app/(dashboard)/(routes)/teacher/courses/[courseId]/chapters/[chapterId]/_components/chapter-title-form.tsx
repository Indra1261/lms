"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterTitileFormProps{
    initialData:{
        title:string;
    };
    courseId:string;
    chapterId:string;
};


const formSchema=z.object({
    title:z.string().min(1)
});



export const ChapterTitileForm = ({
    initialData,
    courseId,
    chapterId,
}:ChapterTitileFormProps) => {

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
            Chapter title
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing? (
                    <>Cancel</>
                ):(   
                    <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit title
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
                
                <p className="text-sm mt-2">
                    {initialData.title}
                </p>
         )}
        

        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <FormField
                        control={form.control}
                        name="title"
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

