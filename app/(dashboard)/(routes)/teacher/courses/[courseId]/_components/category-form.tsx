"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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


interface CategoryFormProps{
    intialCatagoryId :string | null;
    courseId:string;
    options:{label:string; value: string}[];
};


const formSchema=z.object({
    categoryId:z.string().min(1),
});



export const CategoryForm = ({
    intialCatagoryId,
    courseId,
    options,
}:CategoryFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:
        {
            categoryId:intialCatagoryId || ""
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

    const selectedOption=options.find((option)=> option.value ===intialCatagoryId);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course category
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing? (
                    <>Cancel</>
                ):(   
                    <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit category
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
                
                <p className={cn("text-sm mt-2",!intialCatagoryId && "text-slate-500 italic")}>
                    {selectedOption?.label || "No category"}
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
                        name="categoryId"
                        render={({field})=>(
                            <FormItem>
                                <FormControl>
                                    <Combobox
                                        options={options}
                                        value={field.value}
                                        onChange={field.onChange}

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

