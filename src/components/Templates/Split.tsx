import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { educationSchema, EducationValues, interestsSchema, InterestsValues, languagesSchema, LanguagesValues, personalInfoSchema, PersonalInfoValues, ResumeValues, skillsSchema, SkillsValues, summarySchema, SummaryValues, workExperienceSchema, WorkExperienceValues } from "@/lib/validation";
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
import { Textarea } from "../ui/textarea";
import { TimelineLayout } from "./components/layout/timeline-layout";
import { Timeline, TimelineHeader, TimelineItem } from "./components/layout/timeline";

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
                                        className="text-md font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1.5 px-3 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            fontSize: `${fontSize === 'big'?'24px': fontSize==='medium'? '20px': '16px'}`,
                                            lineHeight: `${fontSize === 'big'?'32px': fontSize==='medium'? '28px': '24px'}`,
                                            fontFamily: fontFamily,
                                            fontWeight: 500
                                        }}
                                    />
                                    {/* <Input {...field} placeholder="Fisrt Name" /> */}
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
                                            className="text-lg font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                            style={{
                                                // color: colorHex,
                                                display: "block",
                                                width: "100%",
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
                                    <FormLabel className="sr-only">Professional Summary</FormLabel>
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
                                                className="w-full min-h-[30px] text-lg font-light focus:outline-none focus:bg-gray-200 hover:bg-gray-200 transition-colors py-0.5 px-1.5 border border-transparent rounded-md resize-none overflow-hidden bg-white dark:bg-white dark:focus:bg-slate-200 dark:hover:bg-slate-200 m-0"
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
    const { colorHex, isLocationSection, isEmailSection, isPhoneSection, isLinkedinSection, isWebsiteSection, isGithubSection } = resumeData;
    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            personalDetailName: resumeData.personalDetailName || "",
            email: resumeData.email || "",
            phone: resumeData.phone || "",
            location: resumeData.location || ""
        }
    });

    const textCityRef = useRef<HTMLDivElement>(null);
    const textEmailRef = useRef<HTMLDivElement>(null);
    const textPhoneRef = useRef<HTMLDivElement>(null);

    const [locationWidth, setLocationWidth] = useState("auto");
    const [emailWidth, setEmailWidth] = useState("auto");
    const [phoneWidth, setPhoneWidth] = useState("auto");
    
    useEffect(() => {
        const {unsubscribe} = form.watch(async (values:any) => {
            const isValid = await form.trigger();
            //Update resume data
            setResumeData({...resumeData, ...values})
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    

    useEffect(() => {
        if (textCityRef.current) {
            setLocationWidth(`${textCityRef.current.offsetWidth + 20}px`);
        }
    }, [resumeData.location]);

    useEffect(() => {
        if (textEmailRef.current) {
            setEmailWidth(`${textEmailRef.current.offsetWidth + 20}px`);
        }
    }, [resumeData.email]);
    
    useEffect(() => {
        if (textPhoneRef.current) {
            setPhoneWidth(`${textPhoneRef.current.offsetWidth + 20}px`);
        }
    }, [resumeData.phone]);


    return (
        <>
            {/* <hr 
                className="border-2"
                style={{
                    borderColor: colorHex
                }}
            /> */}
            <Form {...form}>
                <div className="space-y-3 break-inside-avoid">
                <FormField
                        control={form.control}
                        name="personalDetailName"
                        render={({ field, fieldState  }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Personal Details</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Personal Details"
                                        className="text-lg font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            // color: colorHex,
                                            display: "block",
                                            width: "100%",
                                        }}
                                    />
                                </FormControl>
                                
                                {fieldState.error && (<FormMessage />)}
                            </FormItem>
                        )}
                    />
                    
                    <div className="flex flex-wrap flex-row items-center space-y-1">
                        {isLocationSection ?
                            <div className="flex justify-start items-center gap-1">
                                <MapPinIcon color={'#fff'} fill={colorHex} className="size-7" />
                                {/* Location Field */}
                                <div className="relative flex">
                                    <span
                                        ref={textCityRef}
                                        className="absolute opacity-0 pointer-events-none whitespace-pre"
                                    >
                                        {resumeData.location || "Your Location"}
                                    </span>
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field, fieldState  }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Location</FormLabel>
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Your Location"
                                                    className="text-sm font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-3 border border-transparent rounded-md m-0 dark:bg-white"
                                                    style={{
                                                        width: locationWidth,
                                                        minWidth: "100px",
                                                        maxWidth: "100%",
                                                    }}
                                                />
                                                
                                            </FormControl>
                                            {fieldState.error && (<FormMessage />)}
                                        </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        : null } 
                        {isEmailSection ?<div className="flex justify-start items-center gap-1">
                            
                            <MailIcon absoluteStrokeWidth color={'#fff'} fill={colorHex} className="size-7" />
                            {/* Email Field */}
                            <div className="relative flex">
                                <span
                                    ref={textEmailRef}
                                    className="absolute opacity-0 pointer-events-none whitespace-pre"
                                >
                                    {resumeData.email || "Your Email"}
                                </span>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field, fieldState  }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Email</FormLabel>
                                        <FormControl>
                                            <input
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
                                            />
                                            
                                        </FormControl>
                                        {fieldState.error && (<FormMessage />)}
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </div>: null}
                        {isPhoneSection ? 
                        <div className="flex justify-start items-center gap-1">

                            <PhoneIcon absoluteStrokeWidth color={'#fff'} fill={colorHex} className="size-7" />
                            {/* Phone Field */}
                            <div className="relative flex">
                                <span
                                    ref={textPhoneRef}
                                    className="absolute opacity-0 pointer-events-none whitespace-pre"
                                >
                                    {resumeData.phone || "Phone Number"}
                                </span>

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field, fieldState  }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Phone Number</FormLabel>
                                        <FormControl>
                                            <input
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



function WorkExperienceSection({resumeData, setResumeData}: ResumeSectionProps){
    // console.log("resumeData", resumeData);
    const { colorHex, isWorkSection} = resumeData;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const form = useForm<WorkExperienceValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            workExperienceSectionName: resumeData?.workExperienceSectionName || "",
            workExperiences: resumeData.workExperiences?.length
                ? resumeData.workExperiences
                : [{ position: "", company: "", startDate: "", endDate: "", description: "" }]
        }
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            (async () => {
                const isValid = await form.trigger();
                if (!isValid) return;
    
                setResumeData({
                    ...resumeData, // Using existing state
                    workExperienceSectionName: values?.workExperienceSectionName || "",
                    workExperiences: Array.isArray(values?.workExperiences)
                        ? values.workExperiences
                              .filter((exp): exp is any => !!exp) // Ensure valid entries
                              .map((exp) => ({
                                  position: exp.position || "",
                                  company: exp.company || "",
                                  startDate: exp.startDate || "",
                                  endDate: exp.endDate || "",
                                  description: exp.description || "",
                              }))
                        : [], // Default to empty array if undefined
                });
            })();
        });
        return () => subscription.unsubscribe()
    }, [form, setResumeData]);

    const {fields, append, remove, move} = useFieldArray({
        control: form.control,
        name: "workExperiences"
    });

    return (
        <>
        { isWorkSection ?
            <>
                {/* <hr 
                    className="border-2"
                    style={{
                        borderColor: colorHex
                    }}
                /> */}
                <Form {...form}>
                    <div className="break-inside-avoid">
                    <FormField
                        control={form.control}
                        name="workExperienceSectionName"
                        render={({ field, fieldState  }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Work Experience Section</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="EXPERIENCE"
                                        className="text-lg font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            // color: colorHex,
                                            display: "block",
                                            width: "100%",
                                        }}
                                    />
                                </FormControl>
                                
                                {fieldState.error && (<FormMessage />)}
                            </FormItem>
                        )}
                    />
                        <Timeline className=''>
                            {fields.map((field, index) => (
                                <WorkExperienceItem 
                                    id={field.id}
                                    key={field.id} 
                                    index={index}
                                    form={form}
                                    remove={remove}
                                    length={fields.length}
                                    setIsModalOpen={setIsModalOpen}
                                    append={append}
                                    colorHex={colorHex}
                                    setResumeData={setResumeData}
                                />
                            ))} 
                        </Timeline>              
                    </div>
                </Form>
            </> : null
        }
        </>
    )
}

interface WorkExperienceItemProps {
    id: string;
    form: UseFormReturn<WorkExperienceValues>;
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({position, company, startDate, endDate, description}: {position: string, company: string, startDate: string, endDate: string, description: string}) => void;
    colorHex: string|undefined;
    setResumeData: (data: any) => void;
}

function WorkExperienceItem({id, form, index, remove, length, setIsModalOpen, append, colorHex, setResumeData}: WorkExperienceItemProps){

    // const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});

{/* <div className="relative  "></div> */}
    return (
        <TimelineItem className="border-2 border-transparent border-dashed p-0 rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300">
                      
            <ExperienceButtons remove={remove} length={length} setIsModalOpen={setIsModalOpen} append={append} index={index} />
            <TimelineHeader>
                <FormField
                    control={form.control}
                    name={`workExperiences.${index}.company`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px] block w-full">
                            <FormLabel className="sr-only">Company</FormLabel>
                            <FormControl>   
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Employer"
                                    className=" w-full block text-md font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                    style={{display: 'block',  color: colorHex,}}
                                />    
                            
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </TimelineHeader>
            <div className="flex flex-row flex-wrap items-center">
                <FormField
                    control={form.control}
                    name={`workExperiences.${index}.position`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px]">
                            <FormLabel className="sr-only">Job title</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="POSITION"
                                    className="text-md font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                            
                <FormField
                    control={form.control}
                    name={`workExperiences.${index}.startDate`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px]">
                            <FormLabel className="sr-only">Start Date</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="from"
                                    className="w-20 text-center text-xs font-light focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-1 border border-transparent rounded-md m-0 dark:bg-white"
                                /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />{" - "}
                <FormField
                    control={form.control}
                    name={`workExperiences.${index}.endDate`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px]">
                            <FormLabel className="sr-only">End Date</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Until"
                                    className="w-20 text-center text-xs font-light focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-1 border border-transparent rounded-md m-0 dark:bg-white"
                                /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
                
            <FormField
                control={form.control}
                name={`workExperiences.${index}.description`}
                render={({field})=>(
                    <FormItem className="space-y-[1px]">
                        <FormLabel className="sr-only">Description</FormLabel>
                        <FormControl className="m-0 p-0">
                            <div className="relative  m-0 p-0 pb-0 flex box-border h-auto">
                                <textarea
                                    {...field}
                                    value={field.value || ""}
                                    ref={(el) => {
                                        if (el) {
                                            el.style.height = "25px"; // Reset height first
                                            el.style.height = `${el.scrollHeight}px`; // Set new height
                                        }
                                    }}
                                    placeholder="Enter your work experience description"
                                    rows={1}
                                    className="w-full min-h-[25px] text-md font-light focus:outline-none focus:bg-gray-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-sm resize-none overflow-hidden bg-white dark:bg-white dark:focus:bg-slate-200 dark:hover:bg-slate-200 box-border"
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = "25px"; // Reset height first
                                        target.style.height = `${target.scrollHeight}px `; // Set new height
                                    }}                
                                    spellCheck={true}
                                    // onChange={(e) => {
                                    //     field.onChange(e); // Update form state
                                    //     setResumeData((prev: any) => ({
                                    //         ...prev,
                                    //         workExperiences: prev.workExperiences.map((exp: any, i: number) =>
                                    //             i === index ? { ...exp, description: e.target.value } : exp
                                    //         )
                                    //     }));
                                    // }}
                                /> 
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </TimelineItem>
    )
}

interface ExperienceButtonsProps {
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({position, company, startDate, endDate, description}: {position: string, company: string, startDate: string, endDate: string, description: string}) => void;
}

function ExperienceButtons({setIsModalOpen, remove, index, append, length}: ExperienceButtonsProps){
    return (
        <div className="absolute -top-3.5 right-2 border border-transparent rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 ">
            <div className="flex items-center gap-1 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 transition-colors">
                <Button 
                    variant={'destructive'} 
                    size={"sm"}
                    className="border rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 px-2 py-0 text-xs font-light h-6"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Sparkle className="w-5 h-5" /> Writing Assistant
                </Button>
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                        onClick={()=>remove(index)}
                    >
                        <MinusIcon className="w-5 h-5" />
                    </Button>
                )}
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    >
                        <ChevronsUpDownIcon className="w-5 h-5" />
                    </Button>
                )}
                <Button 
                    size={"icon"} 
                    variant={'destructive'} 
                    className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    onClick={()=> append({
                        position: "",
                        company: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                    })}
                >
                    <PlusIcon className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}


function EducationSection({resumeData, setResumeData}: ResumeSectionProps){
    // console.log("resumeData", resumeData);
    const {educations,  colorHex, isEducationSection} = resumeData;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const form = useForm<EducationValues>({
            resolver: zodResolver(educationSchema),
            defaultValues: {
                educationSectionName: resumeData?.educationSectionName || "",
                educations: resumeData.educations?.length
                ? resumeData.educations
                : [{ degree: "", school: "", startDate: "", endDate: "", }]
            }
        });
    
        useEffect(() => {
            const subscription = form.watch((values) => {
                (async () => {
                    const isValid = await form.trigger();
                    if (!isValid) return;

                    setResumeData({
                        ...resumeData,
                        educationSectionName: values?.educationSectionName || "",
                        educations: Array.isArray(values?.educations)
                        ? values.educations
                            .filter((edu): edu is any => !!edu) // Ensure valid entries
                            .map((edu) => ({
                                degree: edu.degree || "",
                                school: edu.school || "",
                                startDate: edu.startDate || "",
                                endDate: edu.endDate || "",
                            }))
                        : [], // Default to empty array if undefined
                    });
                })();
            });
            return () => subscription.unsubscribe();
        }, [form, setResumeData]);
        
        const {fields, append, remove, move} = useFieldArray({
            control: form.control,
            name: "educations"
        });

    return (
        <>
        {
            isEducationSection ?
            <>
                <hr 
                    className="border-2"
                    style={{
                        borderColor: colorHex
                    }}
                />
                <Form {...form}>
                    <div className="break-inside-avoid">
                    <FormField
                        control={form.control}
                        name="educationSectionName"
                        render={({ field, fieldState  }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Education Section</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="EDUCATION"
                                        className="text-lg font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            // color: colorHex,
                                            display: "block",
                                            width: "100%",
                                        }}
                                    />
                                </FormControl>
                                
                                {fieldState.error && (<FormMessage />)}
                            </FormItem>
                        )}
                    />
                        <Timeline className=''>
                            {fields.map((field, index) => (
                                <EducationItem 
                                    id={field.id}
                                    key={field.id} 
                                    index={index}
                                    form={form}
                                    remove={remove}
                                    length={fields.length}
                                    setIsModalOpen={setIsModalOpen}
                                    append={append}
                                    colorHex={colorHex}
                                    setResumeData={setResumeData}
                                />
                            ))} 
                        </Timeline>              
                    </div>
                </Form>
            </> : null
        }
        </>
    )
}

interface EducationItemProps {
    id: string;
    form: UseFormReturn<EducationValues>;
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({school, degree, startDate, endDate}: {school: string, degree: string, startDate: string, endDate: string}) => void;
    colorHex: string|undefined;
    setResumeData: (data: any) => void;
}

function EducationItem({id, form, index, remove, length, setIsModalOpen, append, colorHex, setResumeData}: EducationItemProps){

    // const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});
{/* <div className="relative  "></div> */}
    return (
        <TimelineItem className="border-2 border-transparent border-dashed p-0 rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300">
                      
            <EducationButtons remove={remove} length={length} setIsModalOpen={setIsModalOpen} append={append} index={index} />
            <TimelineHeader>
                <FormField
                    control={form.control}
                    name={`educations.${index}.school`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px] block w-full">
                            <FormLabel className="sr-only">School</FormLabel>
                            <FormControl>   
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="SCHOOL"
                                    className=" w-full block text-md font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                    style={{display: 'block',  color: colorHex,}}
                                />    
                            
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </TimelineHeader>
            <div className="flex flex-row flex-wrap items-center">
                <FormField
                    control={form.control}
                    name={`educations.${index}.degree`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px]">
                            <FormLabel className="sr-only">Degree</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="DEGREE"
                                    className="text-md font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                            
                <FormField
                    control={form.control}
                    name={`educations.${index}.startDate`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px]">
                            <FormLabel className="sr-only">Start Date</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="from"
                                    className="w-20 text-center text-xs font-light focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-1 border border-transparent rounded-md m-0 dark:bg-white"
                                /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />{" - "}
                <FormField
                    control={form.control}
                    name={`educations.${index}.endDate`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px]">
                            <FormLabel className="sr-only">End Date</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Until"
                                    className="w-20 text-center text-xs font-light focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-1 border border-transparent rounded-md m-0 dark:bg-white"
                                /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </TimelineItem>
    )
}

interface EducationButtonsProps {
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({school, degree, startDate, endDate}: {school: string, degree: string, startDate: string, endDate: string}) => void;
}
function EducationButtons({setIsModalOpen, remove, index, append, length}: EducationButtonsProps){
    return (
        <div className="absolute -top-3.5 right-2 border border-transparent rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 ">
            <div className="flex items-center gap-1 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 transition-colors">
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                        onClick={()=>remove(index)}
                    >
                        <MinusIcon className="w-5 h-5" />
                    </Button>
                )}
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    >
                        <ChevronsUpDownIcon className="w-5 h-5" />
                    </Button>
                )}
                <Button 
                    size={"icon"} 
                    variant={'destructive'} 
                    className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    onClick={()=> append({
                        degree: "",
                        school: "",
                        startDate: "",
                        endDate: "",
                    })}
                >
                    <PlusIcon className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}

function SkillsSection({resumeData, setResumeData}: ResumeSectionProps){
    const {skills, colorHex, borderStyle, isSkillSection} = resumeData;
    const [isModalOpen, setIsModalOpen] = useState(false);

    // if(!skills?.length) return null;
    const form = useForm<SkillsValues>({
        resolver: zodResolver(skillsSchema),
        defaultValues: {
            skillsSectionName: resumeData.skillsSectionName || "",
            skills: resumeData.skills?.length ? resumeData?.skills : [{ name: "" }] 
        }
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            (async () => {
                const isValid = await form.trigger();
                if (!isValid) return;

                setResumeData({
                    ...resumeData,
                   skillsSectionName: values.skillsSectionName || "",
                    skills: Array.isArray(values?.skills)
                    ? values.skills
                        .filter((skill): skill is any => !!skill) // Ensure valid entries
                        .map((skill) => ({
                            name: skill.name || "",
                        }))
                    : [], // Default to empty array if undefined
                });
            })();
        });
        return () => subscription.unsubscribe();
    }, [form, setResumeData]);
        
    const {fields, append, remove, move}:any = useFieldArray({
        control: form.control,
        name: "skills"
    });
    return (
        <>
        {
            isSkillSection ?
            <>
                <hr 
                    className="border-2"
                    style={{
                        borderColor: colorHex
                    }}
                />
                <div className="relative border-2 border-transparent border-dashed rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300 m-0 p-0">
                    <Button 
                        variant={'destructive'} 
                        size={"sm"}
                        className="absolute -top-3.5 right-2 border rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 px-2 py-0 text-xs font-light h-6"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Sparkle /> Writing Assistant
                    </Button>
                    <Form {...form}>
                        <div className="break-inside-avoid box-border">
                            <FormField
                                control={form.control}
                                name="skillsSectionName"
                                render={({ field, fieldState  }) => (
                                    <FormItem  className="space-y-0 m-0 p-0">
                                        <FormLabel className="sr-only">Skills Section</FormLabel>
                                        <FormControl>
                                            <div className=" rounded-md w-full max-w-3xl transition-colors duration-300 hover:border-gray-300 m-0 p-0 pb-0 flex box-border h-auto">
                                                    {/* Writing Assistant Button (Hidden by Default, Shown on Hover/Focus) */}
                                                    
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="SKILLS"
                                                        className="w-full text-lg font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                                        style={{
                                                            display: "block",
                                                            width: "100%",
                                                        }}
                                                    />
                                            </div>
                                        </FormControl>
                                        
                                        {fieldState.error && (<FormMessage />)}
                                    </FormItem>
                                )}
                            />
                            <div className='flex flex-row flex-wrap gap-2 w-full'>
                                {fields.map((field:any, index:number) => (
                                    <SkillItem
                                        id={field.id}
                                        key={field.id} 
                                        index={index}
                                        form={form}
                                        remove={remove}
                                        length={fields.length}
                                        setIsModalOpen={setIsModalOpen}
                                        append={append}
                                        colorHex={colorHex}
                                    />
                                ))} 
                            </div>              
                        </div>
                    </Form>
                </div>
            </>: null
        }
        </>
    )
}

interface SkillItemProps {
    id: string;
    form: UseFormReturn<SkillsValues>;
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({name}: {name: string}) => void;
    colorHex: string|undefined;
}

function SkillItem({id, form, index, remove, length, setIsModalOpen, append, colorHex}: SkillItemProps){

    // const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});
    const [showButtons, setShowButtons] = useState(false);
    // const textSkillRef = useRef<HTMLDivElement>(null);

    // const [width, setWidth] = useState("auto");

    // useEffect(() => {
    //     if (textSkillRef.current) {
    //         setWidth(`${textSkillRef.current.offsetWidth + 20}px`);
    //     }
    // }, []);

    return (
            <div className="w-[24%]">
                <FormField
                    control={form.control}
                    name={`skills.${index}.name`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px]">
                            <FormLabel className="sr-only">Skill</FormLabel>
                            <FormControl>
                                <div 
                                    className="relative p-0 rounded-md transition-colors duration-300 focus-within:opacity-100 hover:opacity-100 "
                                    onMouseEnter={() => setShowButtons(true)}
                                    onMouseLeave={() => setShowButtons(false)}
                                    onFocus={() => setShowButtons(true)} 
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget)) setShowButtons(false);
                                    }}
                                    tabIndex={-1} // Ensures div can be focused
                                >
                      
                                    <SkillButtons 
                                        remove={remove} 
                                        length={length} 
                                        setIsModalOpen={setIsModalOpen} 
                                        append={append} 
                                        index={index} 
                                        showButtons={showButtons} 
                                        setShowButtons={setShowButtons}
                                    />
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter skill"
                                        className="text-md font-medium focus:outline-none bg-slate-200 focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                        onMouseEnter={() => setShowButtons(true)} // Keep buttons visible when hovering input
                                        onMouseLeave={() => setShowButtons(false)} // Hide only when leaving input
                                        style={{
                                            width: 'auto',
                                            minWidth: "50px",
                                            maxWidth: "100%",
                                        }}
                                    /> 
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>

    )
}

interface SkillButtonsProps {
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({name}: {name: string}) => void;
    showButtons: boolean;
    setShowButtons: (value: boolean) => void;
}
function SkillButtons({setIsModalOpen, remove, index, append, length, showButtons, setShowButtons}: SkillButtonsProps){
    return (
        <div 
            className={`absolute -top-3.5 right-2 border border-transparent rounded-full transition-opacity ${showButtons ? "opacity-100" : "opacity-0"} duration-300 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 `}
            onMouseEnter={() => setShowButtons(true)}  // Keep visible when hovering buttons
            onMouseLeave={() => setShowButtons(false)} // Hide only when leaving buttons
        >
            <div className="flex items-center gap-1 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 transition-colors">
                
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                        onClick={()=>remove(index)}
                    >
                        <MinusIcon className="w-5 h-5" />
                    </Button>
                )}
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    >
                        <ChevronsUpDownIcon className="w-5 h-5" />
                    </Button>
                )}
                <Button 
                    size={"icon"} 
                    variant={'destructive'} 
                    className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    onClick={()=> append({
                        name: "",
                    })}
                >
                    <PlusIcon className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}

function LanguageSection({resumeData, setResumeData}: ResumeSectionProps){
    const { colorHex, borderStyle, isLanguageSection} = resumeData;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const form = useForm<LanguagesValues>({
        resolver: zodResolver(languagesSchema),
        defaultValues: {
            languagesSectionName: resumeData?.languagesSectionName || "",
            languages: resumeData.languages?.length ? resumeData?.languages : [{ name: "" }] 
        }
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            (async () => {
                const isValid = await form.trigger();
                if (!isValid) return;

                setResumeData({
                    ...resumeData,
                    languagesSectionName: values.languagesSectionName || "",
                    languages: Array.isArray(values?.languages)
                    ? values.languages
                        .filter((language): language is any => !!language) // Ensure valid entries
                        .map((language) => ({
                            name: language.name || "",
                        }))
                    : [], // Default to empty array if undefined
                });
            })();
        });
        return () => subscription.unsubscribe();
    }, [form, setResumeData]);
        
    const {fields, append, remove, move}:any = useFieldArray({
        control: form.control,
        name: "languages"
    });
    return (
        <>
        {
            isLanguageSection ?
            <>
                <hr 
                    className="border-2"
                    style={{
                        borderColor: colorHex
                    }}
                />
                <div className="border-2 border-transparent border-dashed p-0 rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300">
                    <Form {...form}>
                        <div className="break-inside-avoid">
                            <FormField
                                control={form.control}
                                name="languagesSectionName"
                                render={({ field, fieldState  }) => (
                                    <FormItem  className="space-y-0 m-0 p-0">
                                        <FormLabel className="sr-only">Language Section Name</FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-md w-full max-w-3xl transition-colors duration-300 hover:border-gray-300 m-0 p-0 pb-0 flex box-border h-auto">
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="LANGUAGES"
                                                        className="text-lg font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                                        style={{
                                                            display: "block",
                                                            width: "100%",
                                                        }}
                                                    />
                                            </div>
                                        </FormControl>
                                        
                                        {fieldState.error && (<FormMessage />)}
                                    </FormItem>
                                )}
                            />
                            <div className='flex flex-row flex-wrap gap-2'>
                                {fields.map((field:any, index:number) => (
                                    <LanguageItem
                                        id={field.id}
                                        key={field.id} 
                                        index={index}
                                        form={form}
                                        remove={remove}
                                        length={fields.length}
                                        setIsModalOpen={setIsModalOpen}
                                        append={append}
                                        colorHex={colorHex}
                                    />
                                ))} 
                            </div>              
                        </div>
                    </Form>
                </div>
            </> : null
        }
        </>
    )
}

interface LanguageItemProps {
    id: string;
    form: UseFormReturn<LanguagesValues>;
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({name}: {name: string}) => void;
    colorHex: string|undefined;
}

function LanguageItem({id, form, index, remove, length, setIsModalOpen, append, colorHex}: LanguageItemProps){

    // const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});
    const [showButtons, setShowButtons] = useState(false);

    return (
        <div className="w-[24%]">
                <FormField
                    control={form.control}
                    name={`languages.${index}.name`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px]">
                            <FormLabel className="sr-only">Language</FormLabel>
                            <FormControl>
                                <div 
                                    className="relative p-0 rounded-md w-full max-w-3xl transition-colors duration-300 focus-within:opacity-100 hover:opacity-100 "
                                    onMouseEnter={() => setShowButtons(true)}
                                    onMouseLeave={() => setShowButtons(false)}
                                    onFocus={() => setShowButtons(true)} 
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget)) setShowButtons(false);
                                    }}
                                    tabIndex={-1} // Ensures div can be focused
                                >
                      
                                    <LanguageButtons 
                                        remove={remove} 
                                        length={length} 
                                        setIsModalOpen={setIsModalOpen} 
                                        append={append} 
                                        index={index} 
                                        showButtons={showButtons} 
                                        setShowButtons={setShowButtons}
                                    />
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter language"
                                        className="text-md font-medium focus:outline-none bg-slate-200 focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                        onMouseEnter={() => setShowButtons(true)} // Keep buttons visible when hovering input
                                        onMouseLeave={() => setShowButtons(false)} // Hide only when leaving input
                                        style={{
                                            width: 'auto',
                                            minWidth: "50px",
                                            maxWidth: "100%",
                                        }}
                                    /> 
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>

    )
}

interface LanguageButtonsProps {
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({name}: {name: string}) => void;
    showButtons: boolean;
    setShowButtons: (value: boolean) => void;
}
function LanguageButtons({setIsModalOpen, remove, index, append, length, showButtons, setShowButtons}: LanguageButtonsProps){
    return (
        <div 
            className={`absolute -top-3.5 right-2 border border-transparent rounded-full transition-opacity ${showButtons ? "opacity-100" : "opacity-0"} duration-300 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 `}
            onMouseEnter={() => setShowButtons(true)}  // Keep visible when hovering buttons
            onMouseLeave={() => setShowButtons(false)} // Hide only when leaving buttons
        >
            <div className="flex items-center gap-1 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 transition-colors">
                
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                        onClick={()=>remove(index)}
                    >
                        <MinusIcon className="w-5 h-5" />
                    </Button>
                )}
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    >
                        <ChevronsUpDownIcon className="w-5 h-5" />
                    </Button>
                )}
                <Button 
                    size={"icon"} 
                    variant={'destructive'} 
                    className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    onClick={()=> append({
                        name: "",
                    })}
                >
                    <PlusIcon className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}


function HobbiesSection({resumeData, setResumeData}: ResumeSectionProps){
    const { colorHex, borderStyle, isInterestSection} = resumeData;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const form = useForm<InterestsValues>({
        resolver: zodResolver(interestsSchema),
        defaultValues: {
            interestsSectionName: resumeData?.interestsSectionName || "",
            interests: resumeData.interests?.length ? resumeData?.interests : [{ name: "" }] 
        }
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            (async () => {
                const isValid = await form.trigger();
                if (!isValid) return;

                setResumeData({
                    ...resumeData,
                    interestsSectionName: values.interestsSectionName || "",
                    interests: Array.isArray(values?.interests)
                    ? values.interests
                        .filter((interest): interest is any => !!interest) // Ensure valid entries
                        .map((interest) => ({
                            name: interest.name || "",
                        }))
                    : [], // Default to empty array if undefined
                });
            })();
        });
        return () => subscription.unsubscribe();
    }, [form, setResumeData]);
        
    const {fields, append, remove, move}:any = useFieldArray({
        control: form.control,
        name: "interests"
    });
    return (
        <>
        { 
        isInterestSection ?
            <>
                <hr 
                    className="border-2"
                    style={{
                        borderColor: colorHex
                    }}
                />
                <div className="border-2 border-transparent border-dashed p-0 rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300">
                    <Form {...form}>
                        <div className="break-inside-avoid">
                            <FormField
                                control={form.control}
                                name="interestsSectionName"
                                render={({ field, fieldState  }) => (
                                    <FormItem  className="space-y-0 m-0 p-0">
                                        <FormLabel className="sr-only">Insterest Section Name</FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-md w-full max-w-3xl transition-colors duration-300 hover:border-gray-300 m-0 p-0 pb-0 flex box-border h-auto">
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="LANGUAGES"
                                                        className="text-lg font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                                        style={{
                                                            display: "block",
                                                            width: "100%",
                                                        }}
                                                    />
                                            </div>
                                        </FormControl>
                                        
                                        {fieldState.error && (<FormMessage />)}
                                    </FormItem>
                                )}
                            />
                            <div className='flex flex-row flex-wrap gap-2'>
                                {fields.map((field:any, index:number) => (
                                    <HobbiesItem
                                        id={field.id}
                                        key={field.id} 
                                        index={index}
                                        form={form}
                                        remove={remove}
                                        length={fields.length}
                                        setIsModalOpen={setIsModalOpen}
                                        append={append}
                                        colorHex={colorHex}
                                    />
                                ))} 
                            </div>              
                        </div>
                    </Form>
                </div>
            </>
        : null 
        }
        </>
    )
}

interface HobbiesItemProps {
    id: string;
    form: UseFormReturn<InterestsValues>;
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({name}: {name: string}) => void;
    colorHex: string|undefined;
}

function HobbiesItem({id, form, index, remove, length, setIsModalOpen, append, colorHex}: HobbiesItemProps){

    // const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});
    const [showButtons, setShowButtons] = useState(false);

    return (
        <div className="w-[24%]">
                <FormField
                    control={form.control}
                    name={`interests.${index}.name`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px]">
                            <FormLabel className="sr-only">Skill</FormLabel>
                            <FormControl>
                                <div 
                                    className="relative p-0 rounded-md w-full max-w-3xl transition-colors duration-300 focus-within:opacity-100 hover:opacity-100 "
                                    onMouseEnter={() => setShowButtons(true)}
                                    onMouseLeave={() => setShowButtons(false)}
                                    onFocus={() => setShowButtons(true)} 
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget)) setShowButtons(false);
                                    }}
                                    tabIndex={-1} // Ensures div can be focused
                                >
                      
                                    <HobbiesButtons 
                                        remove={remove} 
                                        length={length} 
                                        setIsModalOpen={setIsModalOpen} 
                                        append={append} 
                                        index={index} 
                                        showButtons={showButtons} 
                                        setShowButtons={setShowButtons}
                                    />
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter language"
                                        className="text-md font-medium focus:outline-none bg-slate-200 focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                        onMouseEnter={() => setShowButtons(true)} // Keep buttons visible when hovering input
                                        onMouseLeave={() => setShowButtons(false)} // Hide only when leaving input
                                        style={{
                                            width: 'auto',
                                            minWidth: "50px",
                                            maxWidth: "100%",
                                        }}
                                    /> 
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>

    )
}

interface HobbiesButtonsProps {
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: ({name}: {name: string}) => void;
    showButtons: boolean;
    setShowButtons: (value: boolean) => void;
}
function HobbiesButtons({setIsModalOpen, remove, index, append, length, showButtons, setShowButtons}: HobbiesButtonsProps){
    return (
        <div 
            className={`absolute -top-3.5 right-2 border border-transparent rounded-full transition-opacity ${showButtons ? "opacity-100" : "opacity-0"} duration-300 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 `}
            onMouseEnter={() => setShowButtons(true)}  // Keep visible when hovering buttons
            onMouseLeave={() => setShowButtons(false)} // Hide only when leaving buttons
        >
            <div className="flex items-center gap-1 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 transition-colors">
                
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                        onClick={()=>remove(index)}
                    >
                        <MinusIcon className="w-5 h-5" />
                    </Button>
                )}
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    >
                        <ChevronsUpDownIcon className="w-5 h-5" />
                    </Button>
                )}
                <Button 
                    size={"icon"} 
                    variant={'destructive'} 
                    className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                    onClick={()=> append({
                        name: "",
                    })}
                >
                    <PlusIcon className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}