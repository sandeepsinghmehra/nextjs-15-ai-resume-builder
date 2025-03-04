
import { personalInfoSchema, PersonalInfoValues } from "@/lib/validation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { EditorFormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";


export default function PersonalInfoForm({resumeData, setResumeData}: EditorFormProps) {
    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: resumeData.firstName || "",
            lastName: resumeData.lastName || "",
            email: resumeData.email || "",
            phone: resumeData.phone || "",
            city: resumeData.city || "",
            jobTitle: resumeData.jobTitle || "",
            country: resumeData.country || "",
            // photo: resumeData.photo || undefined
        }
    })

    useEffect(() => {
        const {unsubscribe} = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;

            //Update resume data
            setResumeData({...resumeData, ...values})
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    const photoInputRef = useRef<HTMLInputElement>(null);



    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">Tell us about yourself.</p>
            </div>
            <Form {...form}>
                <form className="space-y-3">
                    <FormField 
                        control={form.control}
                        name="photo"
                        render={({ field: {value, ...fieldValues} }) => (
                        <FormItem>
                                <FormLabel>Your photo</FormLabel>
                                <div className="flex items-center gap-2">
                                    <FormControl>
                                        <Input 
                                            {...fieldValues} 
                                            type="file"
                                            accept="image/*"
                                            onChange={(e)=>{
                                                const file = e.target.files?.[0]
                                                fieldValues.onChange(file)
                                            }} 
                                            ref={photoInputRef}
                                        />
                                    </FormControl>
                                    <Button
                                        variant={"secondary"}
                                        type="button"
                                        onClick={()=>{
                                            fieldValues.onChange(null)
                                            if(photoInputRef.current){
                                                photoInputRef.current.value = "";
                                            }
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                                <FormMessage />
                        </FormItem> 
                        )}    
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <FormField 
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                            <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Fisrt Name" />
                                    </FormControl>
                                    <FormMessage />
                            </FormItem> 
                            )}    
                        />
                        <FormField 
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                            <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Last Name" />
                                    </FormControl>
                                    <FormMessage />
                            </FormItem> 
                            )}    
                        />
                    </div>
                    <FormField 
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Job Title" />
                                </FormControl>
                                <FormMessage />
                            </FormItem> 
                        )}    
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <FormField 
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                            <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="City" />
                                    </FormControl>
                                    <FormMessage />
                            </FormItem> 
                            )}    
                        />
                        <FormField 
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                            <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Country" />
                                    </FormControl>
                                    <FormMessage />
                            </FormItem> 
                            )}    
                        />
                    </div>
                    <FormField 
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Phone" type="tel" />
                                </FormControl>
                                <FormMessage />
                            </FormItem> 
                        )}    
                    />

                    <FormField 
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Email" type="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem> 
                        )}    
                    />
                    
                </form>
            </Form>
        </div>
    );
}