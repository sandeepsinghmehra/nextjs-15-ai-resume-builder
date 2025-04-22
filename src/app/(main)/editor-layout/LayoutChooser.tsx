import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {formatDate, set} from "date-fns";
import { BorderStyles } from "@/components/editor/BorderStyleButton";
import { UploadIcon } from "lucide-react";
import ClassicTemplate from "@/components/Templates/Classic";
import SplitTemplate from "@/components/Templates/Split";
import HybridTemplate from "@/components/Templates/Hybrid";

interface ResumeLayoutTemplateChooserProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    templateName: string | undefined;
    contentRef?: React.Ref<HTMLDivElement>;
    className?: string;
}

export default function LayoutChooser({
    resumeData, 
    setResumeData,
    templateName,
    contentRef,
    className
}: ResumeLayoutTemplateChooserProps){
    // console.log("resumedata", resumeData)
    return (
    <div>
        {templateName === "classic" && (
            <ClassicTemplate
                resumeData={resumeData}
                setResumeData={setResumeData}
                // className="max-w-3xl shadow-md"
                contentRef={contentRef}
                className={className}
            />
        )}
        {templateName === "split" && (
            <SplitTemplate
                resumeData={resumeData}
                setResumeData={setResumeData}
                className="max-w-3xl shadow-md"
            />
        )}
        {templateName === "hybrid" && (
            <HybridTemplate
                resumeData={resumeData}
                setResumeData={setResumeData}
                className="max-w-3xl shadow-md"
            />
        )}
    </div>
    );
}


