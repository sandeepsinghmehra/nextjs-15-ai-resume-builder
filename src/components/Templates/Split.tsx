import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { personalInfoSchema, PersonalInfoValues, ResumeValues, summarySchema, SummaryValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {constructNow, formatDate, set} from "date-fns";
import { Badge } from "../ui/badge";
import { BorderStyles } from "@/components/editor/BorderStyleButton";
import { UploadIcon, Sparkle, MapPinIcon, MailIcon, PhoneIcon, MinusIcon, ChevronsUpDownIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import SummaryModal from "./components/summary/SummaryModal";
import WorkExperienceSection from "./components/sections/split/Experience/ExperienceSection";
import EducationSection from "./components/sections/split/Education/EducationSection";
import SkillsSection from "./components/sections/split/Skill/SkillSection";
import LanguageSection from "./components/sections/split/Language/LanguageSection";
import HobbiesSection from "./components/sections/split/Hobby/HobbySection";

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

    const { 
        colorHex,
        borderStyle,
    } = resumeData;
    
    // console.log("resumedata", resumeData)
    return (
    <div 
        className={cn("bg-white text-black h-fit w-full aspect-[210/297] m-auto", className)}
        ref={containerRef}
    >
        <div 
            className={cn("space-y-6 p-6 box-border h-auto", !width && "invisible")}
            style={{
                zoom: (1 / 794) * width,
            }}
            ref={contentRef}
            id={"resumePreviewContent"}
        >
            <PersonalInfoHeader resumeData={resumeData} setResumeData={setResumeData} />
            <hr 
                className="border-2"
                style={{
                    borderColor: colorHex
                }}
            />
            <div className="flex flex-row gap-1">
                <div className="flex flex-col w-1/3">
                    <SummarySection resumeData={resumeData} setResumeData={setResumeData} />
                    <ProfileUI resumeData={resumeData} setResumeData={setResumeData} />
                </div>
                <div className="flex flex-col w-2/3">
                    <WorkExperienceSection resumeData={resumeData} setResumeData={setResumeData} />
                    <EducationSection resumeData={resumeData} setResumeData={setResumeData} />
                    <SkillsSection resumeData={resumeData} setResumeData={setResumeData} />
                    <LanguageSection resumeData={resumeData} setResumeData={setResumeData} />
                    <HobbiesSection resumeData={resumeData} setResumeData={setResumeData} />
                </div>
            </div>
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
        colorHex,
        borderStyle,
        isPhotoSection,
        isJobTitleSection,
        fontFamily,
        fontSize,
    } = resumeData;


    const initialPhoto = resumeData.photo instanceof File ? URL.createObjectURL(resumeData.photo) : resumeData.photo || null;
    const [photoSrc, setPhotoSrc] = useState<string | null>(initialPhoto);
    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: resumeData.firstName || "",
            jobTitle: resumeData.jobTitle || "",
        }
    });

    useEffect(() => {
        const {unsubscribe} = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;

            //Update resume data
            setResumeData({...resumeData, ...values})
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);
    // Handle File Upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPhotoSrc(objectUrl);
            setResumeData({ ...resumeData, photo: file }); // Save image to database
        }
    };

    // Handle File Removal
    const handleRemovePhoto = () => {
        setPhotoSrc(null);
        setResumeData({ ...resumeData, photo: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    return (
        <Form {...form}>
            <form className="flex justify-start"> 
            {
                isPhotoSection ?
                <FormField 
                    control={form.control}
                name="photo"
                render={({ field: { value, ...fieldValues } }) => (
                    <FormItem>
                        <FormLabel className="sr-only">Your Photo</FormLabel>
                            <div className="relative group w-[100px] h-[100px]">
                            {/* Upload/Remove Overlay */}
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-50 group-hover:opacity-100 transition-opacity "
                                style={{
                                    borderRadius: borderStyle === BorderStyles.SQUARE?"0px" : borderStyle=== BorderStyles.CIRCLE? "9999px":"10%"
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                        {photoSrc ? (
                                            <TrashIcon
                                                className="text-transparent group-hover:text-white w-6 h-6 cursor-pointer"
                                                onClick={handleRemovePhoto}
                                            />
                                        ) : (
                                            <>
                                            <UploadIcon className="text-white w-6 h-6" />
                                            <Input 
                                                {...fieldValues}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                style={{display: 'none'}}
                                            />
                                        </>
                                        )}
                                    </div>

                                    {/* Image or Upload Placeholder */}
                                    {photoSrc && (
                                        <Image
                                            src={photoSrc}
                                            width={100}
                                            height={100}
                                            alt="Profile Photo"
                                            className="aspect-square object-cover"
                                            style={{
                                                borderRadius: borderStyle === BorderStyles.SQUARE?"0px" : borderStyle=== BorderStyles.CIRCLE? "9999px":"10%"
                                            }}
                                        />
                                    )}
                                    
                                </div>
                                <FormMessage />
                            </FormItem>
                    )}
                /> : null
                }   
            <div className="space-y-2.5">
                <div className="space-y-1">
                    <FormField 
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">First Name</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Your Name"
                                        className="text-3xl font-bold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-2 px-3 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            color: colorHex,
                                            fontSize: `${fontSize === 'big'?'30px': fontSize==='medium'? '24px': '20px'}`,
                                            lineHeight: `${fontSize === 'big'?'36px': fontSize==='medium'? '32px': '28px'}`,
                                            fontFamily: fontFamily,
                                            fontWeight: 700,
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem> 
                        )}    
                    />
                    {isJobTitleSection ?
                    <FormField 
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Job Title</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Your Role"
                                        className="text-md uppercase font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1.5 px-3 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            fontSize: `${fontSize === 'big'?'24px': fontSize==='medium'? '20px': '16px'}`,
                                            lineHeight: `${fontSize === 'big'?'32px': fontSize==='medium'? '28px': '24px'}`,
                                            fontFamily: fontFamily,
                                            fontWeight: 500
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem> 
                        )}    
                    />: null}
                </div>

                
            </div>
           
            </form>
        </Form>
    )
}

function SummarySection({resumeData, setResumeData}: ResumeSectionProps){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { colorHex, isSummarySection, fontSize, fontFamily } = resumeData;
    const form = useForm<SummaryValues>({
        resolver: zodResolver(summarySchema),
        defaultValues: {
            summaryName: resumeData.summaryName || "",
            summary: resumeData.summary || ""
        }
    });
    useEffect(() => {
        const {unsubscribe} = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
        
            //Update resume data
            setResumeData({...resumeData, ...values})
        });
        return unsubscribe
    }, [form, resumeData, setResumeData]);

    return (
        <>
        {isSummarySection ? <>
            {/* <hr 
                className="border-2"
                style={{
                    borderColor: colorHex
                }}
            /> */}
            <Form {...form}>
                <div className="space-y-2 break-inside-avoid">

                    <div className="whitespace-pre-line text-sm">
                        <FormField
                            control={form.control}
                            name="summaryName"
                            render={({ field, fieldState  }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">About Me</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="About Me"
                                            className="text-lg uppercase font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                fontSize: `${fontSize === 'big'?'18px': fontSize==='medium'? '17px': '16px'}`,
                                                lineHeight: `${fontSize === 'big'?'28px': fontSize==='medium'? '24px': '20px'}`,
                                                fontFamily: fontFamily,
                                            }}
                                        />
                                    </FormControl>
                                    
                                    {fieldState.error && (<FormMessage />)}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="summary"
                            render={({field})=>(
                                <FormItem className="space-y-0 m-0 p-0">
                                    <FormLabel className="sr-only ">Professional Summary</FormLabel>
                                    <FormControl className="m-0 p-0">       
                                        <div className="relative border-2 border-transparent border-dashed rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300 m-0 p-0 pb-0 flex box-border h-auto">
                                            {/* Writing Assistant Button (Hidden by Default, Shown on Hover/Focus) */}
                                            <Button 
                                                variant={'destructive'} 
                                                size={"sm"}
                                                className="absolute -top-3.5 right-2 border rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 px-2 py-0 text-xs font-light h-6"
                                                onClick={() => setIsModalOpen(true)}
                                            >
                                                <Sparkle /> Writing Assistant
                                            </Button>

                                            {/* Textarea Field */}
                                            <textarea
                                                {...field}
                                                ref={(el) => {
                                                    if (el) {
                                                        el.style.height = "30px"; // Reset height first
                                                        el.style.height = `${el.scrollHeight}px`; // Set new height
                                                    }
                                                }}
                                                placeholder="Enter your professional summary"
                                                // rows={1}
                                                className="w-full min-h-[30px] text-justify text-lg font-light focus:outline-none focus:bg-gray-200 hover:bg-gray-200 transition-colors py-0.5 px-1.5 border border-transparent rounded-md resize-none overflow-hidden bg-white dark:bg-white dark:focus:bg-slate-200 dark:hover:bg-slate-200 m-0"
                                                onInput={(e) => {
                                                    const target = e.target as HTMLTextAreaElement;
                                                    target.style.height = "auto"; // Reset height first
                                                    target.style.height = `${target.scrollHeight}px `; // Set new height
                                                }}
                                                style={{
                                                    margin: "0px !important", 
                                                    marginBottom: "0px !important",
                                                    fontSize: `${fontSize === 'big'?'20px': fontSize === 'medium'? '18px': '14px'}`,
                                                    lineHeight: `${fontSize === 'big'?'24px': fontSize === 'medium'? '22px': '18px'}`,
                                                    fontFamily: fontFamily,
                                                }}
                                                spellCheck={true}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </Form>
            <SummaryModal open={isModalOpen} setOpen={setIsModalOpen} />
        </> : null}
        </>
    )
}

function ProfileUI({resumeData, setResumeData}: ResumeSectionProps) {
    const { 
        colorHex, 
        isLocationSection, 
        isEmailSection, 
        isPhoneSection, 
        isLinkedinSection, 
        isWebsiteSection, 
        isGithubSection,  
        fontFamily,
        fontSize,
    } = resumeData;
    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            personalDetailName: resumeData.personalDetailName || "",
            email: resumeData.email || "",
            phone: resumeData.phone || "",
            location: resumeData.location || ""
        }
    });

    // const textCityRef = useRef<HTMLDivElement>(null);
    // const textEmailRef = useRef<HTMLDivElement>(null);
    // const textPhoneRef = useRef<HTMLDivElement>(null);

    // const [locationWidth, setLocationWidth] = useState("auto");
    // const [emailWidth, setEmailWidth] = useState("auto");
    // const [phoneWidth, setPhoneWidth] = useState("auto");
    
    useEffect(() => {
        const {unsubscribe} = form.watch(async (values:any) => {
            const isValid = await form.trigger();
            //Update resume data
            setResumeData({...resumeData, ...values})
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    

    // useEffect(() => {
    //     if (textCityRef.current) {
    //         setLocationWidth(`${textCityRef.current.offsetWidth + 20}px`);
    //     }
    // }, [resumeData.location]);

    // useEffect(() => {
    //     if (textEmailRef.current) {
    //         setEmailWidth(`${textEmailRef.current.offsetWidth + 20}px`);
    //     }
    // }, [resumeData.email]);
    
    // useEffect(() => {
    //     if (textPhoneRef.current) {
    //         setPhoneWidth(`${textPhoneRef.current.offsetWidth + 20}px`);
    //     }
    // }, [resumeData.phone]);


    return (
        <>
            {/* <hr 
                className="border-2"
                style={{
                    borderColor: colorHex
                }}
            /> */}
            <Form {...form}>
                <div 
                    className="space-y-0 break-inside-avoid"
                    style={{
                        marginTop:  `${fontSize === 'big'?'24px': fontSize === 'medium'? '12px': '6px'}`,
                    }}
                >
                    <FormField
                        control={form.control}
                        name="personalDetailName"
                        render={({ field, fieldState  }) => (
                            <FormItem className="m-0 p-0 space-y-0">
                                <FormLabel className="sr-only">Personal Details</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Personal Details"
                                        className="text-lg uppercase font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            fontSize: `${fontSize === 'big'?'18px': fontSize==='medium'? '17px': '16px'}`,
                                            lineHeight: `${fontSize === 'big'?'28px': fontSize==='medium'? '24px': '20px'}`,
                                            fontFamily: fontFamily,
                                        }}
                                    />
                                </FormControl>
                                
                                {fieldState.error && (<FormMessage />)}
                            </FormItem>
                        )}
                    />
                    
                    <div className="flex flex-col gap-0">
                        {isLocationSection ?
                            <div className="flex justify-start items-center gap-1 w-full">
                                <MapPinIcon 
                                    color={'#fff'} 
                                    fill={colorHex} 
                                    className={"size-7"} 
                                    style={{
                                        width: `${fontSize === 'big'?'28px': fontSize === 'medium'? '24px': '20px'}`,
                                        height: `${fontSize === 'big'?'28px': fontSize === 'medium'? '24px': '20px'}`,
                                    }}
                                />
                                {/* Location Field */}
                                <div className="relative flex grow space-y-0 ">
                                    {/* <span
                                        ref={textCityRef}
                                        className="absolute opacity-0 pointer-events-none whitespace-pre"
                                    >
                                        {resumeData.location || "Your Location"}
                                    </span> */}
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field, fieldState  }) => (
                                        <FormItem className="space-y-0 m-0 p-0" style={{width: "100%"}}>
                                            <FormLabel className="sr-only">Location</FormLabel>
                                            <FormControl className="m-0 p-0 flex box-border h-auto">
                                                <textarea
                                                    {...field}
                                                    ref={(el:any) => {
                                                        if (el) {
                                                            el.style.height = "16px"; // Reset height first
                                                            el.style.height = `${el.scrollHeight}px`; // Set new height
                                                        }
                                                    }}
                                                    placeholder="Your Location"
                                                    className="w-full min-h-[16px] text-md font-light focus:outline-none focus:bg-gray-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md resize-none overflow-hidden bg-white dark:bg-white dark:focus:bg-slate-200 dark:hover:bg-slate-200 m-0"
                                                    onInput={(e:any) => {
                                                        const target = e.target as HTMLTextAreaElement;
                                                        target.style.height = "auto"; // Reset height first
                                                        target.style.height = `${target.scrollHeight}px `; // Set new height
                                                    }}
                                                    style={{
                                                        margin: "0px !important", 
                                                        marginBottom: "0px !important",
                                                        maxWidth: "100%",
                                                        fontSize: `${fontSize === 'big'?'14px': fontSize === 'medium'? '13px': '12px'}`,
                                                        lineHeight: `${fontSize === 'big'?'20px': fontSize === 'medium'? '19px': '18px'}`,
                                                        fontFamily: fontFamily,
                                                    }}
                                                    spellCheck={true}
                                                />
                                                
                                            </FormControl>
                                            {fieldState.error && (<FormMessage />)}
                                        </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        : null } 
                        {isEmailSection ?<div className="flex justify-start items-center gap-1 w-full">
                            
                            <MailIcon 
                                absoluteStrokeWidth 
                                color={'#fff'} 
                                fill={colorHex} 
                                className="size-7" 
                                style={{
                                    width: `${fontSize === 'big'?'28px': fontSize === 'medium'? '24px': '20px'}`,
                                    height: `${fontSize === 'big'?'28px': fontSize === 'medium'? '24px': '20px'}`,
                                }}
                            />
                            {/* Email Field */}
                            <div className="relative flex grow space-y-0 m-0 p-0">
                                {/* <span
                                    ref={textEmailRef}
                                    className="absolute opacity-0 pointer-events-none whitespace-pre"
                                >
                                    {resumeData.email || "Your Email"}
                                </span> */}

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field, fieldState  }) => (
                                    <FormItem className="space-y-0 m-0 p-0" style={{width: "100%"}}>
                                        <FormLabel className="sr-only">Email</FormLabel>
                                        <FormControl className="m-0 p-0 flex box-border h-auto">
                                            {/* <input
                                                {...field}
                                                type="text"
                                                placeholder="Your Email"
                                                className="text-sm font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-3 border border-transparent rounded-md m-0 dark:bg-white"
                                                style={{
                                                    width: emailWidth,
                                                    minWidth: "100px",
                                                    maxWidth: "100%",
                                                    marginTop: "0px"
                                                }}
                                            /> */}

                                                <textarea
                                                    {...field}
                                                    ref={(el:any) => {
                                                        if (el) {
                                                            el.style.height = "16px"; // Reset height first
                                                            el.style.height = `${el.scrollHeight}px`; // Set new height
                                                        }
                                                    }}
                                                    placeholder="Your Email"
                                                    className="w-full min-h-[16px] text-md font-light focus:outline-none focus:bg-gray-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md resize-none overflow-hidden bg-white dark:bg-white dark:focus:bg-slate-200 dark:hover:bg-slate-200 m-0"
                                                    onInput={(e:any) => {
                                                        const target = e.target as HTMLTextAreaElement;
                                                        target.style.height = "auto"; // Reset height first
                                                        target.style.height = `${target.scrollHeight}px `; // Set new height
                                                    }}
                                                    style={{
                                                        margin: "0px !important", 
                                                        marginBottom: "0px !important",
                                                        fontSize: `${fontSize === 'big'?'14px': fontSize === 'medium'? '13px': '12px'}`,
                                                        lineHeight: `${fontSize === 'big'?'20px': fontSize === 'medium'? '19px': '18px'}`,
                                                        fontFamily: fontFamily,
                                                        maxWidth: "100%",
                                                    }}
                                                    spellCheck={true}
                                                />
                                            
                                        </FormControl>
                                        {fieldState.error && (<FormMessage />)}
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </div>: null}
                        {isPhoneSection ? 
                        <div className="flex justify-start items-center gap-1 w-full">

                            <PhoneIcon 
                                absoluteStrokeWidth 
                                color={'#fff'} 
                                fill={colorHex} 
                                className="size-7" 
                                style={{
                                    width: `${fontSize === 'big'?'28px': fontSize === 'medium'? '24px': '20px'}`,
                                    height: `${fontSize === 'big'?'28px': fontSize === 'medium'? '24px': '20px'}`,
                                }}
                            />
                            {/* Phone Field */}
                            <div className="relative flex grow space-y-0 m-0 p-0">
                                {/* <span
                                    ref={textPhoneRef}
                                    className="absolute opacity-0 pointer-events-none whitespace-pre"
                                >
                                    {resumeData.phone || "Phone Number"}
                                </span> */}

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field, fieldState  }) => (
                                    <FormItem className="space-y-0 m-0 p-0" style={{width: "100%"}}>
                                        <FormLabel className="sr-only">Phone Number</FormLabel>
                                        <FormControl className="m-0 p-0 flex box-border h-auto">
                                            {/* <input
                                                {...field}
                                                type="text"
                                                placeholder="Your Email"
                                                className="text-sm font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-3 border border-transparent rounded-md m-0 dark:bg-white"
                                                style={{
                                                    width: phoneWidth,
                                                    minWidth: "100px",
                                                    maxWidth: "100%",
                                                    marginTop: "0px"
                                                }}
                                            /> */}

                                                <textarea
                                                    {...field}
                                                    ref={(el:any) => {
                                                        if (el) {
                                                            el.style.height = "16px"; // Reset height first
                                                            el.style.height = `${el.scrollHeight}px`; // Set new height
                                                        }
                                                    }}
                                                    placeholder="Your Number"
                                                    className="w-full min-h-[16px] text-md font-light focus:outline-none focus:bg-gray-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md resize-none overflow-hidden bg-white dark:bg-white dark:focus:bg-slate-200 dark:hover:bg-slate-200 m-0"
                                                    onInput={(e:any) => {
                                                        const target = e.target as HTMLTextAreaElement;
                                                        target.style.height = "auto"; // Reset height first
                                                        target.style.height = `${target.scrollHeight}px `; // Set new height
                                                    }}
                                                    style={{
                                                        margin: "0px !important", 
                                                        marginBottom: "0px !important",
                                                        fontSize: `${fontSize === 'big'?'14px': fontSize === 'medium'? '13px': '12px'}`,
                                                        lineHeight: `${fontSize === 'big'?'20px': fontSize === 'medium'? '19px': '18px'}`,
                                                        fontFamily: fontFamily,
                                                        maxWidth: "100%",
                                                    }}
                                                    spellCheck={true}
                                                />
                                            
                                        </FormControl>
                                        {fieldState.error && (<FormMessage />)}
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        :null}
                    </div> 
                </div>
            </Form> 
        </>
    );
}



