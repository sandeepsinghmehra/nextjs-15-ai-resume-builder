"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { ResumeValues } from '@/lib/validation';
import { cn, mapToResumeValues } from '@/lib/utils';
import useUnloadWarning from '@/hooks/useUnloadWarning';
import useAutoSaveResume from './useAutoSaveResume';
import { ResumeServerData } from '@/lib/types';
import LayoutSectionButton from './LayoutSectionButton';
import ColorPicker from './ColorPicker';
import BorderStyleButton from './BorderStyleButton';
import LayoutChooser from './LayoutChooser';
import SectionPicker from './SectionPicker';
import TypographyTool from './TypographyTool';

interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null
}

export default function ResumeEditor({resumeToEdit}: ResumeEditorProps) {
    const searchParams = useSearchParams();

    const [resumeData, setResumeData] = useState<ResumeValues>(
        resumeToEdit ? mapToResumeValues(resumeToEdit) : {
            firstName: "",
            workExperienceSectionName: "",
            workExperiences: [],
            educations: [],
            skills: [],
            languages: [],
            interests: [],
            summary: "",
            summaryName: "",
            colorHex: "#0693E3",
            borderStyle: "",
            layoutStyle: "classic",
            isPhotoSection: true,
            isSummarySection: true,
            isEmailSection: true,
            isLocationSection: true,
            isPhoneSection: true,
            isJobTitleSection: true,
            isLinkedinSection: false,
            isGithubSection: false,
            isWebsiteSection: false,
            isWorkSection: true,
            isEducationSection: true,
            isSkillSection: true,
            isLanguageSection: false,
            isInterestSection: false,
            isSocialLinkSection: false,  
            isKeyachivementSection: false,
            fontFamily: "",
            fontSize: "",
            personalDetailName: "",
        }
    );

    const [showSmResumePreview, setShowSmResumePreview] = useState<boolean>(false);

    const {isSaving, hasUnsavedChanges} = useAutoSaveResume(resumeData);

    useUnloadWarning(hasUnsavedChanges);


    function setStep(key: string){
        const newSearchParam = new URLSearchParams(searchParams)
        newSearchParam.set("step", key);
        window.history.pushState(null, "", `?${newSearchParam.toString()}`);
    }

    useUnloadWarning();
    // console.log("resumeData", resumeData);
    return (
        <div className='flex grow flex-col' style={{background: resumeData.colorHex}}>
            {/* {isSaving && (
                <div className="flex items-center justify-center h-screen">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                </div>
            )} */}
            {resumeToEdit && (
                    <span className="fixed left-20 right-0 top-4 z-50 w-fit group flex items-center justify-center m-auto gap-3 bg-slate-50">
                        <div className="opacity-50 lg:opacity-100 group-hover:opacity-100 transition-opacity flex flex-row gap-3 flex-none lg:left-3 lg:top-3">
                            <LayoutSectionButton
                                layoutStyle={resumeData.layoutStyle}
                                onChange={(layoutStyle =>{
                                    console.log('layoutStyle', layoutStyle);
                                        setResumeData({...resumeData, layoutStyle: layoutStyle});
                                        console.log('resumeData', resumeData);
                                    }
                                )}
                                color={resumeData.colorHex}
                            />
                            <ColorPicker
                                color={resumeData.colorHex}
                                onChange={(color => setResumeData({...resumeData, colorHex: color.hex}))}
                            />
                            <TypographyTool 
                                resumeData={resumeData} 
                                setResumeData={setResumeData}
                                onChange={((data: {fontFamily: string, fontSize: string}) =>{
                                    console.log('Typograpy', data);
                                        setResumeData({...resumeData, fontFamily: data.fontFamily, fontSize: data.fontSize});
                                    }
                                )}
                                color={resumeData.colorHex}
                            />
                            <SectionPicker 
                                resumeData={resumeData} 
                                setResumeData={setResumeData}
                                onChange={(layoutStyle =>{
                                        setResumeData({...resumeData, layoutStyle: layoutStyle});
                                    }
                                )}
                                color={resumeData.colorHex}
                            />
                            <BorderStyleButton
                                borderStyle={resumeData.borderStyle}
                                onChange={(borderStyle) => setResumeData({...resumeData, borderStyle: borderStyle})}
                            />
                        </div>
                    </span>
                )}
            <main className='grow mt-16'>
                    <div className={cn(' hidden w-full md:flex', cn(showSmResumePreview && "flex"))} >
                            
                            <div className="pt-5 w-full overflow-y-auto bg-secondary" style={{background: resumeData.colorHex}}>
                                <LayoutChooser
                                    resumeData={resumeData}
                                    setResumeData={setResumeData}
                                    templateName={resumeData.layoutStyle}
                                    className="shadow-sm transition-shadow group-hover:shadow-lg max-w-3xl"
                                />
                            </div>
                        </div>
            </main>
            {/* <footer className='w-full border-t px-3 py-5'>
                <p className={cn('text-muted-foreground opacity-0', isSaving && "opacity-100")}>Saving...</p>
            </footer> */}
        </div>
    )
}
