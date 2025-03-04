import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { GenerateWorkExperienceInput, generateWorkExperiencSchema, WorkExperience } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { generateWorkExperience } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";

interface GenerateWorkExperienceButtonProps {
    onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

export default function GenerateWorkExperienceButton({
    onWorkExperienceGenerated,
}: GenerateWorkExperienceButtonProps){
    const subscriptionLevel = useSubscriptionLevel();

    const premiumModal = usePremiumModal();

    const [showInputDialog, setShowInputDialog] = useState(false);

    return (
        <>
            <Button
                variant={"outline"}
                type="button"
                //TODO: Block for non-premium users->done
                onClick={()=> {
                    if(!canUseAITools(subscriptionLevel)){
                        premiumModal.setOpen(true);
                        return;
                    }
                    setShowInputDialog(true);
                }}
            >
                <WandSparklesIcon className="size-4" />
                Smart fill (AI)
            </Button>
            <InputDialog 
                open={showInputDialog}
                onOpenChange={setShowInputDialog}
                onWorkExperienceGenerated={(workExperience)=>{
                    onWorkExperienceGenerated(workExperience);
                    setShowInputDialog(false);
                }}
            />
        </>
    )
}

interface InputDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}
function InputDialog({
    open,
    onOpenChange,
    onWorkExperienceGenerated
}: InputDialogProps){
    const {toast} = useToast();

    const form = useForm<GenerateWorkExperienceInput>({
        resolver: zodResolver(generateWorkExperiencSchema),
        defaultValues: {
            description: ""
        }
    });

    async function onSubmit(input: GenerateWorkExperienceInput){
        try {
            const response = await generateWorkExperience(input);
            onWorkExperienceGenerated(response);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again."
            });
        } 
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate work experience</DialogTitle>
                    <DialogDescription>
                        Describe this work experience and the AI will generate an optimized entry for you.
                    </DialogDescription>
                </DialogHeader>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder={`E.g. "from nov 2019 to dec 2020 I worked at google as a software engineer, task were: ...`}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    
                    />
                    <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                        Generate
                    </LoadingButton>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}