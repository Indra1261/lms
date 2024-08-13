"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface DescriptionFormProps{
   intialDescription:string | null;
    courseId:string;
};


const formSchema=z.object({
    description:z.string().min(1,{
        message:"Description is required",
    }),
});



export const DescriptionForm = ({
   intialDescription,
    courseId
}:DescriptionFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:
        {
            description:intialDescription || ""
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
            Course description
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing? (
                    <>Cancel</>
                ):(   
                    <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit description
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
                
                <p className={cn(
                    "text-sm mt-2",
                    !intialDescription && "text-slate-500 italic"
                )}>
                    { intialDescription || "No description"}
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
                        name="description"
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        disabled={isSubmitting}
                                        // placeholder="eg .. 'Neet warrior batch'"
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

