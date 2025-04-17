import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveEducationResume, saveExperiencResume, saveInterestResume, saveLanguageResume, saveResume, saveSkillResume } from "./actions";
import { Button } from "@/components/ui/button";
import { fileReplacer, getUnsavedEducations, getUnsavedExperiences, getUnsavedHobby, getUnsavedLanguage, getUnsavedSkills } from "@/lib/utils";

export default function useAutoSaveResume(resumeData: ResumeValues){
    // console.log("resumeData in UseAutoSave: ", resumeData)
    const searchParams = useSearchParams();

    const {toast} = useToast();

    const debouncedResumeData = useDebounce(resumeData, 1500);

    const [resumeId, setResumeId] = useState(resumeData.id);

    const [lastSavedData, setLastSavedData] = useState(
        structuredClone(resumeData)
    );
    // console.log("lastSavedData in useAutoSaveResume: ", lastSavedData);

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
                // console.log("New Data: ", newData, lastSavedData);
                const changedExperiences = getUnsavedExperiences(debouncedResumeData, lastSavedData);
                const changedEducations = getUnsavedEducations(debouncedResumeData, lastSavedData);
                const changedSkills = getUnsavedSkills(debouncedResumeData, lastSavedData);
                const changedLanguage = getUnsavedLanguage(debouncedResumeData, lastSavedData);
                const changedInterests = getUnsavedHobby(debouncedResumeData, lastSavedData);

                // console.log("Changed Experiences: ", changedExperiences);

                // remove workExperiences from both objects
                const { workExperiences: newExperiences, ...restExperienceNew } = newData;
                const { workExperiences: oldExperiences, ...restExperienceOld } = lastSavedData;

                const isOnlyExperienceChanged = JSON.stringify(restExperienceNew, fileReplacer) === JSON.stringify(restExperienceOld, fileReplacer) && changedExperiences.length > 0;

                // remove Education from both objects
                const { educations: newEducation, ...restEducationNew } = newData;
                const { educations: oldEducation, ...restEducatoinOld } = lastSavedData;

                const isOnlyEducationChanged = JSON.stringify(restEducationNew, fileReplacer) === JSON.stringify(restEducatoinOld, fileReplacer) && changedEducations.length > 0;

                 // remove skills from both objects
                const { skills: newSkill, ...restSkillNew } = newData;
                const { skills: oldSkill, ...restSkillOld } = lastSavedData;
 
                const isOnlySkillChanged = JSON.stringify(restSkillNew, fileReplacer) === JSON.stringify(restSkillOld, fileReplacer) && changedSkills.length > 0;

                 // remove Language from both objects
                const { languages: newLanguage, ...restLanguageNew } = newData;
                const { languages: oldLanguage, ...restLanguageOld } = lastSavedData;
  
                const isOnlyLanguageChanged = JSON.stringify(restLanguageNew, fileReplacer) === JSON.stringify(restLanguageOld, fileReplacer) && changedLanguage.length > 0;

                  // remove Hobby from both objects
                const { interests: newInterest, ...restInterestNew } = newData;
                const { interests: oldInterest, ...restInterestOld } = lastSavedData;
 
                const isOnlyInterestChanged = JSON.stringify(restInterestNew, fileReplacer) === JSON.stringify(restInterestOld, fileReplacer) && changedInterests.length > 0;

                let updatedResume:any;
                // console.log("isOnlyExperienceChanged: ", isOnlyExperienceChanged);
                if (isOnlyExperienceChanged) {
                    // only update changed experiences
                    updatedResume = await saveExperiencResume(changedExperiences[0]);
                }
                if(isOnlyEducationChanged) {
                    // only update changed educations
                    updatedResume = await saveEducationResume(changedEducations[0]);
                }
                // console.log("changedSkills: ", changedSkills);
                if(isOnlySkillChanged) {
                    // only update changed skills
                    updatedResume = await saveSkillResume(changedSkills[0]);
                }

                if(isOnlyLanguageChanged) {
                    // only update changed languages
                    updatedResume = await saveLanguageResume(changedLanguage[0]);
                }
                if(isOnlyInterestChanged) {
                    // only update changed hobbies
                    updatedResume = await saveInterestResume(changedInterests[0]);
                }
                if(!isOnlyExperienceChanged || !isOnlyEducationChanged || !isOnlySkillChanged || !isOnlyLanguageChanged || !isOnlyInterestChanged) {
                    updatedResume = await saveResume({
                        ...newData,
                        ...(JSON.stringify(lastSavedData.photo, fileReplacer) === JSON.stringify(newData.photo, fileReplacer) && {
                            photo: undefined
                        }),
                        id: resumeId || resumeData.id,
                    });
                }
                // console.log("Updated Resume in useAutoSaveResume: ", updatedResume);

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
                console.log("Error in useAutoSaveResume: ", error);
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