import { skillsSchema, SkillsValues } from "@/lib/validation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EditorFormProps } from "@/lib/types";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";



export default function SkillsForm({resumeData, setResumeData}: EditorFormProps) {
    const form = useForm<SkillsValues>({
        resolver: zodResolver(skillsSchema),
        defaultValues: {
            skills: resumeData.skills || []
        }
    });

    useEffect(() => {
        const {unsubscribe} = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
    
            //Update resume data
            setResumeData({
                ...resumeData, 
                // skills: values.skills
                // ?.filter(skill => skill !== undefined)
                // .map(skill => skill.trim())
                // .filter(skill => skill !== "") || [],
            })
        });
        return unsubscribe
    }, [form, resumeData, setResumeData]);
    
    return (
        <div className="max-w-xl mx-auto space-y-3">
            {/* <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Skills</h2>
                <p className="text-sm text-muted-foreground">What are you good at?</p>
            </div> */}
            <Form {...form}>
                <form className="space-y-2">
                    <FormField
                        control={form.control}
                        name="skills"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="sr-only">Skills</FormLabel>
                                <FormControl>
                                    {/* <Textarea
                                        {...field}
                                        placeholder="e.g. React.js, Node.js, MongoDB"
                                        onChange={(e)=>{
                                            const skills = e.target.value.split(",");
                                            field.onChange(skills);
                                        }}
                                        className="min-h-32"
                                    /> */}
                                </FormControl>
                                <FormDescription>
                                    Separate each skill with a comma.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
}
