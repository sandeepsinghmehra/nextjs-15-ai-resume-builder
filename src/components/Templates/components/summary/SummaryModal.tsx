"use client";

import { Check, Sparkle } from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { env } from "@/env";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";
  


export default function SummaryModal({open, setOpen}: {open: boolean, setOpen: any}) {

    const [selectedExperience, setSelectedExperience] = useState("Select experience");
    const form = useForm<any>({
        // resolver: zodResolver(summarySchema),
        defaultValues: {
            role: "",
            experience: "",
            instructions: "",
        }
    });
    const {toast} = useToast();

    const [loading, setLoading] = useState(false);

    async function handleGenerateSummary(){
        try {
            setLoading(true);
            const values = form.getValues();
            console.log("values", values);

            //TODO: Call API to generate summary like openapi and gemini
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again."
            });
        } finally {
            setLoading(false);
        }
    }
    // console.log("form", form);
    return (
        <Dialog open={open} onOpenChange={(open:any)=>{
            if(!loading) {
                setOpen(open);
            }
        }}>
            <DialogContent className="max-w-xl">
                <DialogHeader className="flex flex-col items-center space-y-3">
                    <DialogTitle>
                        AI-Powered Writing Assistant
                    </DialogTitle> 
                    <p>Summary</p>
                </DialogHeader>
            
                <div className="space-y-6">
                   
                    <div className="flex flex-col space-y-6">
                        <Form {...form}>
                            <form className="space-y-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField 
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Job Role</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field} 
                                                        placeholder="Enter your job role" 
                                                        className="focus:outline-none"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem> 
                                        )}    
                                    />
                                    <FormField 
                                        control={form.control}
                                        name="experience"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Experience Level</FormLabel>
                                                <FormControl>
                                                    <div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button 
                                                                variant="outline" 
                                                                className={cn(
                                                                    "w-full h-9 text-left bg-transparent border border-input rounded-md shadow-sm transition-all",
                                                                    "justify-start text-sm font-normal",
                                                                    !selectedExperience && "text-muted-foreground"
                                                                )}
                                                                style={{textAlign: "left"}}
                                                            >
                                                                {selectedExperience || "Select experience"}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="start" 
                                                            className="min-w-[var(--trigger-width)] w-full"
                                                            style={{
                                                                "--trigger-width": "100%", 
                                                                width: "100%"
                                                            }as React.CSSProperties}
                                                        >
                                                            <DropdownMenuItem
                                                                 onSelect={() => {
                                                                    setSelectedExperience("Little/No experience");
                                                                    field.onChange("little"); // Update form value
                                                                }}
                                                            >Little/No experience</DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onSelect={() => {
                                                                    setSelectedExperience("Some experience");
                                                                    field.onChange("some"); // Update form value
                                                                }}
                                                            >Some experience</DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onSelect={() => {
                                                                    setSelectedExperience("A lot of experience");
                                                                    field.onChange("a-lot"); // Update form value
                                                                }}
                                                            >A lot of experience</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem> 
                                        )}    
                                    />
                                </div>
                                <FormField 
                                    control={form.control}
                                    name="instructions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instructions (optional)</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    placeholder="Enter any specific details you want to include (e.g., key skills, personal traits, industry focus)"
                                                    className="w-full min-h-[52px] text-sm font-normal focus:outline-none transition-colors p-3 border-2 rounded-md resize-none overflow-hidden bg-white dark:bg-white"
                                                    onInput={(e) => {
                                                        const target = e.target as HTMLTextAreaElement;
                                                        target.style.height = "52px"; // Reset height first
                                                        target.style.height = `${target.scrollHeight}px `; // Set new height
                                                    }}
                                                    spellCheck={true}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem> 
                                    )}    
                                />
                    
                            </form>
                        </Form>
                            <Button
                                onClick={()=> handleGenerateSummary()}
                                variant={"premium"}
                                disabled={loading}
                            >
                                <Sparkle /> Generate Summary
                            </Button>
                            <Button
                                onClick={()=> {}}
                                variant={"default"}
                                disabled={loading}
                            >
                                Use Summary
                            </Button>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}