import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveEducationResume, saveExperiencResume, saveInterestResume, saveLanguageResume, saveResume, saveSkillResume } from "./actions";
import { Button } from "@/components/ui/button";
import { fileReplacer, getUnsavedEducations, getUnsavedExperiences, getUnsavedHobby, getUnsavedLanguage, getUnsavedSkills } from "@/lib/utils";
import { EducationType, InterestType, LanguageType, SkillType, WorkExperiences } from "@/lib/types";

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

    useEffect(() => {
        async function save() {
            try {
                setIsSaving(true);
                setIsError(false);
                const newData = structuredClone(debouncedResumeData);
                const currentResumeId = resumeId || resumeData.id; // Ensure we have the ID

                if (!currentResumeId) {
                    console.warn("Autosave skipped: No resume ID available.");
                    setIsSaving(false);
                    return; // Cannot save without an ID
                }

                // --- Identify changed items with IDs ---
                const changedExperiences = getUnsavedExperiences(newData, lastSavedData).filter((exp: WorkExperiences) => exp.id);
                const changedEducations = getUnsavedEducations(newData, lastSavedData).filter((edu: EducationType) => edu.id);
                const changedSkills = getUnsavedSkills(newData, lastSavedData).filter((skill: SkillType) => skill.id);
                const changedLanguages = getUnsavedLanguage(newData, lastSavedData).filter((lang: LanguageType) => lang.id);
                const changedInterests = getUnsavedHobby(newData, lastSavedData).filter((hobby: InterestType) => hobby.id);

                // --- Prepare update promises for array items ---
                const updatePromises: Promise<any>[] = [ // Add type annotation for the array
                    ...changedExperiences.map((exp: WorkExperiences) => saveExperiencResume({ ...exp, resumeId: currentResumeId })),
                    ...changedEducations.map((edu: EducationType) => saveEducationResume({ ...edu, resumeId: currentResumeId })),
                    ...changedSkills.map((skill: SkillType) => saveSkillResume({ ...skill, resumeId: currentResumeId })),
                    ...changedLanguages.map((lang: LanguageType) => saveLanguageResume({ ...lang, resumeId: currentResumeId })),
                    ...changedInterests.map((hobby: InterestType) => saveInterestResume({ ...hobby, resumeId: currentResumeId })),
                ];

                // --- Identify changed top-level fields (excluding arrays and photo) ---
                const {
                    workExperiences: _newExp, educations: _newEdu, skills: _newSkills,
                    languages: _newLang, interests: _newInt, photo: _newPhoto,
                    ...newTopLevelData
                } = newData;
                const {
                    workExperiences: _oldExp, educations: _oldEdu, skills: _oldSkills,
                    languages: _oldLang, interests: _oldInt, photo: _oldPhoto,
                    ...oldTopLevelData
                } = lastSavedData;

                const topLevelChanges: Partial<ResumeValues> = {};
                let hasTopLevelChanges = false;
                for (const key in newTopLevelData) {
                    if (JSON.stringify(newTopLevelData[key as keyof typeof newTopLevelData], fileReplacer) !== JSON.stringify(oldTopLevelData[key as keyof typeof oldTopLevelData], fileReplacer)) {
                        // Use 'as any' to bypass strict type checking for dynamic key assignment
                        topLevelChanges[key as keyof ResumeValues] = newTopLevelData[key as keyof typeof newTopLevelData] as any;
                        hasTopLevelChanges = true;
                    }
                }

                 // --- Add promise for top-level field updates if needed ---
                 if (hasTopLevelChanges) {
                    // Construct the payload carefully to match expected types
                    const topLevelPayload: Partial<ResumeValues> & { id: string } = {
                        ...topLevelChanges,
                        id: currentResumeId,
                        // Explicitly set array/photo fields to undefined if needed by saveResume signature,
                        // otherwise omit them if saveResume handles partial updates gracefully.
                        // Assuming saveResume handles partial updates:
                        // workExperiences: undefined, // Omit if not needed
                        // educations: undefined,    // Omit if not needed
                        // skills: undefined,        // Omit if not needed
                        // languages: undefined,     // Omit if not needed
                        // interests: undefined,     // Omit if not needed
                        // photo: undefined,         // Omit if not needed
                    };
                    // Cast to ResumeValues if saveResume expects the full type,
                    // but ensure only intended fields are present.
                    updatePromises.push(saveResume(topLevelPayload as ResumeValues));
                }

                // --- Execute all updates ---
                if (updatePromises.length > 0) {
                    const results = await Promise.all(updatePromises);
                    // Optional: Check results if needed, though individual actions handle errors
                    // Find the result from saveResume if it was called, otherwise use the first result
                    const updatedResumeResult = results.find(r => r && 'title' in r) || results[0]; // Adjust based on what saveResume returns

                    if (updatedResumeResult && updatedResumeResult.id) {
                         // Update resumeId if it was newly created by saveResume (shouldn't happen with this logic but safe)
                         if (!resumeId && updatedResumeResult.id) {
                            setResumeId(updatedResumeResult.id);
                            // Update URL if needed
                            if (searchParams.get("resumeId") !== updatedResumeResult.id) {
                                const newSearchParams = new URLSearchParams(searchParams);
                                newSearchParams.set("resumeId", updatedResumeResult.id);
                                window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
                            }
                        }
                    } else {
                        // If only array items were updated, we might not get the full resume back
                        // depending on the specific save actions. Assume success if no errors.
                        console.log("Array items updated via autosave.");
                    }

                    // Update last saved state only after successful saves
                    setLastSavedData(newData);
                } else {
                    // No relevant changes detected for autosave (only new/deleted items or no changes)
                    // console.log("Autosave: No existing items or top-level fields changed.");
                }

            } catch (error) {
                console.error("Error during autosave:", error);
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

    // useEffect(()=> {
    //     async function save(){
    //         // setIsSaving(true);
    //         // await new Promise(resolve => setTimeout(resolve, 1500));

    //         // setLastSavedData(structuredClone(debouncedResumeData));
    //         // setIsSaving(false);
    //         try {
    //             setIsSaving(true);
    //             setIsError(false);
    //             const newData = structuredClone(debouncedResumeData);
    //             // console.log("New Data: ", newData, lastSavedData);
    //             const changedExperiences = getUnsavedExperiences(debouncedResumeData, lastSavedData);
    //             const changedEducations = getUnsavedEducations(debouncedResumeData, lastSavedData);
    //             const changedSkills = getUnsavedSkills(debouncedResumeData, lastSavedData);
    //             const changedLanguage = getUnsavedLanguage(debouncedResumeData, lastSavedData);
    //             const changedInterests = getUnsavedHobby(debouncedResumeData, lastSavedData);

    //             // console.log("Changed Experiences: ", changedExperiences);

    //             // remove workExperiences from both objects
    //             const { workExperiences: newExperiences, ...restExperienceNew } = newData;
    //             const { workExperiences: oldExperiences, ...restExperienceOld } = lastSavedData;

    //             const isOnlyExperienceChanged = JSON.stringify(restExperienceNew, fileReplacer) === JSON.stringify(restExperienceOld, fileReplacer) && changedExperiences.length > 0;

    //             // remove Education from both objects
    //             const { educations: newEducation, ...restEducationNew } = newData;
    //             const { educations: oldEducation, ...restEducatoinOld } = lastSavedData;

    //             const isOnlyEducationChanged = JSON.stringify(restEducationNew, fileReplacer) === JSON.stringify(restEducatoinOld, fileReplacer) && changedEducations.length > 0;

    //              // remove skills from both objects
    //             const { skills: newSkill, ...restSkillNew } = newData;
    //             const { skills: oldSkill, ...restSkillOld } = lastSavedData;
 
    //             const isOnlySkillChanged = JSON.stringify(restSkillNew, fileReplacer) === JSON.stringify(restSkillOld, fileReplacer) && changedSkills.length > 0;

    //              // remove Language from both objects
    //             const { languages: newLanguage, ...restLanguageNew } = newData;
    //             const { languages: oldLanguage, ...restLanguageOld } = lastSavedData;
  
    //             const isOnlyLanguageChanged = JSON.stringify(restLanguageNew, fileReplacer) === JSON.stringify(restLanguageOld, fileReplacer) && changedLanguage.length > 0;

    //               // remove Hobby from both objects
    //             const { interests: newInterest, ...restInterestNew } = newData;
    //             const { interests: oldInterest, ...restInterestOld } = lastSavedData;
 
    //             const isOnlyInterestChanged = JSON.stringify(restInterestNew, fileReplacer) === JSON.stringify(restInterestOld, fileReplacer) && changedInterests.length > 0;

    //             let updatedResume:any;
    //             // console.log("isOnlyExperienceChanged: ", isOnlyExperienceChanged);
    //             if (isOnlyExperienceChanged) {
    //                 // only update changed experiences
    //                 updatedResume = await saveExperiencResume(changedExperiences[0]);
    //             }
    //             if(isOnlyEducationChanged) {
    //                 // only update changed educations
    //                 updatedResume = await saveEducationResume(changedEducations[0]);
    //             }
    //             // console.log("changedSkills: ", changedSkills);
    //             if(isOnlySkillChanged) {
    //                 // only update changed skills
    //                 updatedResume = await saveSkillResume(changedSkills[0]);
    //             }

    //             if(isOnlyLanguageChanged) {
    //                 // only update changed languages
    //                 updatedResume = await saveLanguageResume(changedLanguage[0]);
    //             }
    //             if(isOnlyInterestChanged) {
    //                 // only update changed hobbies
    //                 updatedResume = await saveInterestResume(changedInterests[0]);
    //             }
    //             if(!isOnlyExperienceChanged || !isOnlyEducationChanged || !isOnlySkillChanged || !isOnlyLanguageChanged || !isOnlyInterestChanged) {
    //                 updatedResume = await saveResume({
    //                     ...newData,
    //                     ...(JSON.stringify(lastSavedData.photo, fileReplacer) === JSON.stringify(newData.photo, fileReplacer) && {
    //                         photo: undefined
    //                     }),
    //                     id: resumeId || resumeData.id,
    //                 });
    //             }
    //             // console.log("Updated Resume in useAutoSaveResume: ", updatedResume);

    //             setResumeId(updatedResume.id);
    //             setLastSavedData(newData);

    //             if(searchParams.get("resumeId") !== updatedResume.id){
    //                 const newSearchParams = new URLSearchParams(searchParams);

    //                 newSearchParams.set("resumeId", updatedResume.id);

    //                 window.history.replaceState(
    //                     null, "", `?${newSearchParams.toString()}`
    //                 );

    //             }

    //         } catch (error) {
    //             console.log("Error in useAutoSaveResume: ", error);
    //             setIsError(true);
    //             console.log(error);
    //             const {dismiss} = toast({
    //                 variant: "destructive",
    //                 description: (
    //                     <div className="space-y-3">
    //                         <p>Could not save changes.</p>
    //                         <Button
    //                             variant={"secondary"}
    //                             onClick={()=>{
    //                                 dismiss();
    //                                 save();
    //                             }}
    //                         >
    //                             Retry
    //                         </Button>
    //                     </div>
    //                 )
    //             });
    //         } finally{
    //             setIsSaving(false);
    //         }
    //     }

    //     const hasUnsavedChanges = JSON.stringify(debouncedResumeData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer);

    //     if(hasUnsavedChanges && debouncedResumeData && !isSaving && !isError){
    //         save();
    //     }


    // }, [debouncedResumeData, isSaving, lastSavedData, isError, resumeId, searchParams, toast]);
    return {
        isSaving,
        hasUnsavedChanges: JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
    }
}
