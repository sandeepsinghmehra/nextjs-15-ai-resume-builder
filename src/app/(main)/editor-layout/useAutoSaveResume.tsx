import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveResume } from "./actions";
import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";

export default function useAutoSaveResume(resumeData: ResumeValues){
    // console.log("resumeData in UseAutoSave: ", resumeData)
    const searchParams = useSearchParams();

    const {toast} = useToast();

    const debouncedResumeData = useDebounce(resumeData, 1500);

    const [resumeId, setResumeId] = useState(resumeData.id);

    const [lastSavedData, setLastSavedData] = useState(
        structuredClone(resumeData)
    );

    const [isSaving, setIsSaving] = useState(false);

    const [isError, setIsError] = useState(false);

    useEffect(()=> {
        setIsError(false);
    }, [debouncedResumeData]);

    useEffect(()=> {
        async function save(){
            // setIsSaving(true);
            // await new Promise(resolve => setTimeout(resolve, 1500));

            // setLastSavedData(structuredClone(debouncedResumeData));
            // setIsSaving(false);
            try {
                setIsSaving(true);
                setIsError(false);
                const newData = structuredClone(debouncedResumeData);
                const updatedResume = await saveResume({
                    ...newData,
                    ...(JSON.stringify(lastSavedData.photo, fileReplacer) === JSON.stringify(newData.photo, fileReplacer) && {
                        photo: undefined
                    }),
                    id: resumeId,
                });

                setResumeId(updatedResume.id);
                setLastSavedData(newData);

                if(searchParams.get("resumeId") !== updatedResume.id){
                    const newSearchParams = new URLSearchParams(searchParams);

                    newSearchParams.set("resumeId", updatedResume.id);

                    window.history.replaceState(
                        null, "", `?${newSearchParams.toString()}`
                    );

                }

            } catch (error) {
                setIsError(true);
                console.log(error);
                const {dismiss} = toast({
                    variant: "destructive",
                    description: (
                        <div className="space-y-3">
                            <p>Could not save changes.</p>
                            <Button
                                variant={"secondary"}
                                onClick={()=>{
                                    dismiss();
                                    save();
                                }}
                            >
                                Retry
                            </Button>
                        </div>
                    )
                });
            } finally{
                setIsSaving(false);
            }
        }

        const hasUnsavedChanges = JSON.stringify(debouncedResumeData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer);

        if(hasUnsavedChanges && debouncedResumeData && !isSaving && !isError){
            save();
        }


    }, [debouncedResumeData, isSaving, lastSavedData, isError, resumeId, searchParams, toast]);

    return {
        isSaving,
        hasUnsavedChanges: JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
    }
}