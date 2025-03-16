import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {formatDate, set} from "date-fns";
import { Badge } from "../ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { UploadIcon } from "lucide-react";
import { Input } from "../ui/input";

interface ResumePreviewProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    contentRef?: React.Ref<HTMLDivElement>;
    className?: string;
}

export default function SplitTemplate({
    resumeData, 
    setResumeData,
    contentRef,
    className
}: ResumePreviewProps){
    const containerRef = useRef<HTMLDivElement>(null);

    const {width} = useDimensions(containerRef);
    // console.log("resumedata", resumeData)
    return (
    <div 
        className={cn("bg-white text-black h-fit w-full aspect-[210/297]", className)}
        ref={containerRef}
    >
        <div 
            className={cn("space-y-6 p-6", !width && "invisible")}
            style={{
                zoom: (1 / 794) * width,
            }}
            ref={contentRef}
            id={"resumePreviewContent"}
        >
            <PersonalInfoHeader resumeData={resumeData} setResumeData={setResumeData} />
            {/* <SummarySection resumeData={resumeData} />
            <WorkExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
            <SkillsSection resumeData={resumeData} /> */}
        </div>
    </div>
    );
}

interface ResumeSectionProps {
    resumeData: ResumeValues,
    setResumeData: (data: ResumeValues) => void
}

function PersonalInfoHeader({resumeData, setResumeData}: ResumeSectionProps){
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        photo, 
        firstName, 
        lastName, 
        city, 
        country, 
        jobTitle, 
        phone, 
        email,
        colorHex,
        borderStyle,
    } = resumeData;

    // const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "": photo);
    const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "": photo);

    useEffect(()=>{
        const objectUrl = photo instanceof File ? URL.createObjectURL(photo): "";
        if(objectUrl) setPhotoSrc(objectUrl)
        if(photo === null) setPhotoSrc("")
        return () => URL.revokeObjectURL(objectUrl)
    },[photo]);

    // const photoSrc = photo instanceof File ? "": photo;

    return (
        <div className="flex items-center gap-6">
            
                {photoSrc ? (<Image
                    src={photoSrc}
                    width={100}
                    height={100}
                    alt="Author photo"
                    className="aspect-square object-cover"
                    style={{
                        borderRadius: borderStyle === BorderStyles.SQUARE?"0px" : borderStyle=== BorderStyles.CIRCLE? "9999px":"10%"
                    }}
                />): (
                    <div 
                        className="aspect-square bg-gray flex items-center justify-center cursor-pointer"
                        style={{
                            borderRadius: borderStyle === BorderStyles.SQUARE?"0px" : borderStyle=== BorderStyles.CIRCLE? "9999px":"10%",
                            backgroundColor: colorHex || "gray",
                            width: 100,
                            height: 100,
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadIcon className="text-white w-6 h-6"  />
                        <Input
                            // {...fieldValues} 
                            type="file"
                            accept="image/*"
                            onChange={(e)=>{
                                const file = e.target.files?.[0]
                                // fieldValues.onChange(file)
                            }} 
                            // ref={photoInputRef}
                            className="hidden"
                        />
                    </div>
                )}
            
            <div className="space-y-2.5">
                <div className="space-y-1">
                    <input
                        type="text"
                        value={firstName}
                        placeholder="Your Name"
                        onChange={(e)=>{
                            setResumeData({...resumeData, firstName: e.target.value})
                        }} 
                        className="text-3xl font-bold focus:outline-none focus:bg-slate-200 transition-colors py-2 px-3 border border-transparent rounded-md m-0"
                        style={{
                            color: colorHex
                        }}
                    />
                    {/* <p>Sandeep singh Mehra</p> */}
                    
                    <input
                        type="text"
                        value={jobTitle}
                        placeholder="Your Role"
                        onChange={(e)=>{
                            setResumeData({...resumeData, jobTitle: e.target.value})
                        }} 
                        className="text-md font-medium focus:outline-none focus:bg-slate-200 transition-colors py-1.5 px-3 border border-transparent rounded-md m-0"
                        style={{
                            color: colorHex
                        }}
                    />
                </div>
                <p 
                    className="text-xs text-gray-500"
                >
                    {city}
                    {city && country ? ",": ""}
                    {country}
                    {(city || country) && (phone || email) ? " • ": ""}
                    {[phone, email].filter(Boolean).join(" • ")}
                </p>
            </div>
        </div>
    )
}

function SummarySection({resumeData}: ResumeSectionProps){
    const { summary, colorHex } = resumeData;

    if(!summary) return null;

    return (
        <>
            <hr 
                className="border-2"
                style={{
                    borderColor: colorHex
                }}
            />
            <div className="space-y-3 break-inside-avoid">
                <p 
                    className="text-lg font-semibold"
                    style={{
                        color: colorHex
                    }}
                >Professional profile</p>
                <div className="whitespace-pre-line text-sm">{summary}</div>

            </div>
        </>
    )
}

function WorkExperienceSection({resumeData}: ResumeSectionProps){
    const {workExperiences, colorHex} = resumeData;

    const workExperiencesNotEmpty = workExperiences?.filter(
        (exp) => Object.values(exp).filter(Boolean).length > 0
    );

    if(!workExperiencesNotEmpty?.length) return null;

    return (
        <>
            <hr 
                className="border-2"
                style={{
                    borderColor: colorHex
                }}
             />
            <div className="space-y-3">
                <p 
                    className="text-lg font-semibold"
                    style={{
                        color: colorHex
                    }}
                >
                    Work experience
                </p>
                {workExperiencesNotEmpty.map((exp, index)=>(
                    <div key={index} className="break-inside-avoid space-y-1">
                        <div 
                            className="flex items-center justify-between text-sm font-semibold"
                            style={{
                                color: colorHex
                            }}
                        >
                            <span>{exp.position}</span>
                            {exp.startDate && (
                                <span>
                                    {formatDate(exp.startDate, "MM/yyyy")} - {" "}
                                    {exp.endDate ? formatDate(exp.endDate, "MM/yyyy"): "Present"}
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-semibold">{exp.company}</p>
                        <div className="whitespace-pre-line text-xs">{exp.description}</div>
                    </div>
                ))}

            </div>
        </>
    )
}

function EducationSection({resumeData}: ResumeSectionProps){
    const {educations, colorHex} = resumeData;

    const educationsNotEmpty = educations?.filter(
        (edu) => Object.values(edu).filter(Boolean).length > 0
    );

    if(!educationsNotEmpty?.length) return null;

    return (
        <>
            <hr 
                className="border-2" 
                style={{
                    borderColor: colorHex
                }}
            />
            <div className="space-y-3">
                <p 
                    className="text-lg font-semibold"
                    style={{
                        color: colorHex
                    }}
                >
                    Education
                </p>
                {educationsNotEmpty.map((edu, index)=>(
                    <div key={index} className="break-inside-avoid space-y-1">
                        <div 
                            className="flex items-center justify-between text-sm font-semibold"
                            style={{
                                color: colorHex
                            }}
                        >
                            <span>{edu.degree}</span>
                            {edu.startDate && (
                                <span>
                                    {edu.startDate && 
                                        `${formatDate(edu.startDate, "MM/yyyy")}
                                        ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}`: ""}`
                                    }
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-semibold">{edu.school}</p>
                    </div>
                ))}

            </div>
        </>
    )
}

function SkillsSection({resumeData}: ResumeSectionProps){
    const {skills, colorHex, borderStyle} = resumeData;

    if(!skills?.length) return null;

    return(
        <>
            <hr 
                className="border-2" 
                style={{
                    borderColor: colorHex
                }}
            />
            <div className="space-y-3 break-inside-avoid">
                <p 
                    className="text-lg font-semibold"
                    style={{
                        color: colorHex
                    }}
                >
                    Skills
                </p>
                <div className="flex break-inside-avoid flex-wrap gap-2">
                    {skills.map((skill, index)=>(
                        <Badge 
                            key={index} 
                            className="bg-black text-white rounded-md hover:bg-black"
                            style={{
                                backgroundColor: colorHex,
                                borderRadius: borderStyle === BorderStyles.SQUARE?"0px" : borderStyle=== BorderStyles.CIRCLE? "9999px":"8px"
                            }}
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>
        </>
    )
}