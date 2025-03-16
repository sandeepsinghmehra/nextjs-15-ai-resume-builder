import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {formatDate, set} from "date-fns";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { UploadIcon } from "lucide-react";
import ClassicTemplate from "@/components/Templates/Classic";
import SplitTemplate from "@/components/Templates/Split";
import HybridTemplate from "@/components/Templates/Hybrid";

interface ResumeLayoutTemplateChooserProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    templateName: string | undefined;
}

export default function LayoutChooser({
    resumeData, 
    setResumeData,
    templateName
}: ResumeLayoutTemplateChooserProps){
    const containerRef = useRef<HTMLDivElement>(null);

    const {width} = useDimensions(containerRef);
    // console.log("resumedata", resumeData)
    return (
    <div>
        {templateName === "classic" && (
            <ClassicTemplate
                resumeData={resumeData}
                setResumeData={setResumeData}
                className="max-w-2xl shadow-md"
            />
        )}
        {templateName === "split" && (
            <SplitTemplate
                resumeData={resumeData}
                setResumeData={setResumeData}
                className="max-w-2xl shadow-md"
            />
        )}
        {templateName === "hybrid" && (
            <HybridTemplate
                resumeData={resumeData}
                setResumeData={setResumeData}
                className="max-w-2xl shadow-md"
            />
        )}
    </div>
    );
}


