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

interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null
}

export default function ResumeEditor({resumeToEdit}: ResumeEditorProps) {
    const searchParams = useSearchParams();

    const [resumeData, setResumeData] = useState<ResumeValues>(
        resumeToEdit ? mapToResumeValues(resumeToEdit): {}
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
            {true && (
                    <div className="fixed left-20 right-0 top-4 z-50 group flex items-center justify-center gap-3">
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
                            <BorderStyleButton
                                borderStyle={resumeData.borderStyle}
                                onChange={(borderStyle) => setResumeData({...resumeData, borderStyle: borderStyle})}
                            />
                        </div>
                    </div>
                )}
            <main className='grow mt-16'>
                    <div className={cn(' hidden w-full md:flex', cn(showSmResumePreview && "flex"))} >
                            
                            <div className="flex pt-5 w-full justify-center overflow-y-auto bg-secondary" style={{background: resumeData.colorHex}}>
                                <LayoutChooser
                                    resumeData={resumeData}
                                    setResumeData={setResumeData}
                                    templateName={resumeData.layoutStyle}
                                />
                            </div>
                        </div>
            </main>
            <footer className='w-full border-t px-3 py-5'>
                <p className={cn('text-muted-foreground opacity-0', isSaving && "opacity-100")}>Saving...</p>
            </footer>
        </div>
    )
}
