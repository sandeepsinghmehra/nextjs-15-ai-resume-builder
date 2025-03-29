import { summarySchema, SummaryValues } from "@/lib/validation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EditorFormProps } from "@/lib/types";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import GenerateSummaryButton from "./GenerateSummaryButton";



export default function SummaryForm({resumeData, setResumeData}: EditorFormProps) {
    const form = useForm<SummaryValues>({
        resolver: zodResolver(summarySchema),
        defaultValues: {
            summary: resumeData.summary || ""
        }
    });

    useEffect(() => {
        const {unsubscribe} = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
    
            //Update resume data
            setResumeData({...resumeData, ...values})
        });
        return unsubscribe
    }, [form, resumeData, setResumeData]);
    
    return (
        <div className="max-w-xl mx-auto space-y-3">
            <div className="space-y-1.5 text-center">
                {/* <h2 className="text-2xl font-semibold">Professional Summary</h2>
                <p className="text-sm text-muted-foreground">
                    write a short introduction for your resume or let the AI gererate one from your entered data.
                </p> */}
            </div>
            <Form {...form}>
                <form className="space-y-2">
                    <FormField
                        control={form.control}
                        name="summary"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="sr-only">Professional Summary</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="A brief, engaging text about yourself"
                                        className="min-h-32"
                                    />
                                </FormControl>
                                <FormMessage />
                                <GenerateSummaryButton
                                    resumeData={resumeData}
                                    onSummaryGenerated={summary => form.setValue("summary", summary)}
                                />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
}
