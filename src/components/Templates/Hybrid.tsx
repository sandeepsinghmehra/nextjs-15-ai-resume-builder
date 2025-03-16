import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { personalInfoSchema, PersonalInfoValues, ResumeValues, summarySchema, SummaryValues, workExperienceSchema, WorkExperienceValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {formatDate, set} from "date-fns";
import { Badge } from "../ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { UploadIcon, Sparkle, MapPinIcon, MailIcon, PhoneIcon, MinusIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
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

export default function HybridTemplate({
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
            <SummarySection resumeData={resumeData} setResumeData={setResumeData} />
            <ProfileUI resumeData={resumeData} setResumeData={setResumeData} />
            <WorkExperienceSection resumeData={resumeData} setResumeData={setResumeData} />
            {/* <TimelineLayout /> */}
            {/* <EducationSection resumeData={resumeData} />
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
        jobTitle, 
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
            <div className="space-y-2.5">
                <div className="space-y-1">
                    <input
                        type="text"
                        value={firstName}
                        placeholder="Your Name"
                        onChange={(e)=>{
                            setResumeData({...resumeData, firstName: e.target.value})
                        }} 
                        className="text-3xl font-bold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-2 px-3 border border-transparent rounded-md m-0 dark:bg-white"
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
                        className="text-md font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1.5 px-3 border border-transparent rounded-md m-0 dark:bg-white"
                    />
                    {/* <p>Frontend Developer</p> */}
                </div>
            </div>
                
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
            
            
        </div>
    )
}

function SummarySection({resumeData, setResumeData}: ResumeSectionProps){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { colorHex } = resumeData;
    const form = useForm<SummaryValues>({
        resolver: zodResolver(summarySchema),
        defaultValues: {
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
            <hr 
                className="border-2"
                style={{
                    borderColor: colorHex
                }}
            />
            <Form {...form}>
                <div className="space-y-2 break-inside-avoid">
                    <div className="whitespace-pre-line text-sm">
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
                                                style={{margin: "0px !important", marginBottom: "0px !important"}}
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
        </>
    )
}

function ProfileUI({resumeData, setResumeData}: ResumeSectionProps) {
    const { colorHex } = resumeData;
    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            email: resumeData.email || "",
            phone: resumeData.phone || "",
            city: resumeData.city || "",
            country: resumeData.country || ""
        }
    });

    const textCityRef = useRef<HTMLDivElement>(null);
    const textCountryRef = useRef<HTMLDivElement>(null);
    const textEmailRef = useRef<HTMLDivElement>(null);
    const textPhoneRef = useRef<HTMLDivElement>(null);

    const [cityWidth, setCityWidth] = useState("auto");
    const [countryWidth, setCountryWidth] = useState("auto");
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
            setCityWidth(`${textCityRef.current.offsetWidth + 20}px`);
        }
    }, [resumeData.city]);

    useEffect(() => {
        if (textCountryRef.current) {
            setCountryWidth(`${textCountryRef.current.offsetWidth + 20}px`);
        }
    }, [resumeData.country]);

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
            <hr 
                className="border-2"
                style={{
                    borderColor: colorHex
                }}
            />
            <Form {...form}>
                <div className="space-y-3 break-inside-avoid">
                    <div className="flex flex-wrap flex-row items-center space-y-1">
                        <div className="flex justify-start items-center gap-1">
                            <MapPinIcon color={'#fff'} fill={colorHex} className="size-7" />
                            {/* City Field */}
                            <div className="relative flex">
                                <span
                                    ref={textCityRef}
                                    className="absolute opacity-0 pointer-events-none whitespace-pre"
                                >
                                    {resumeData.city || "Your City"}
                                </span>
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field, fieldState  }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">City</FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                type="text"
                                                placeholder="Your City"
                                                className="text-sm font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-3 border border-transparent rounded-md m-0 dark:bg-white"
                                                style={{
                                                    width: cityWidth,
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

                            {/* Country Field */}
                            <div className="relative flex">
                                <span
                                    ref={textCountryRef}
                                    className="absolute opacity-0 pointer-events-none whitespace-pre"
                                >
                                    {resumeData.country || "Your Country"}
                                </span>

                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field, fieldState  }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Country</FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                type="text"
                                                placeholder="Your Country"
                                                className="text-sm font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-3 border border-transparent rounded-md m-0 dark:bg-white"
                                                style={{
                                                    width: countryWidth,
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
                        <div className="flex justify-start items-center gap-1">

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
                        </div>
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
                    </div>
                </div>
            </Form> 
        </>
    );
}


function WorkExperienceSection({resumeData, setResumeData}: ResumeSectionProps){
    // console.log("resumeData", resumeData);
    const {workExperiences, summary, colorHex} = resumeData;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const workExperiencesNotEmpty = workExperiences?.filter(
        (exp) => Object.values(exp).filter(Boolean).length > 0
    );
    const form = useForm<WorkExperienceValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            workExperienceSectionName: resumeData?.workExperienceSectionName || "",
            workExperiences: resumeData.workExperiences?.length
                ? resumeData.workExperiences
                : [{ position: "", company: "", startDate: "", endDate: "", description: "" }]
        }
    });
    const textExperienceRef = useRef<HTMLDivElement>(null);
    const [experienceWidth, setExperienceWidth] = useState("auto");

    // if(!workExperiencesNotEmpty?.length) return null;
    // console.log("resumeData.WorkExperienceSectionName", resumeData.WorkExperienceSectionName);

    useEffect(() => {
        const {unsubscribe} = form.watch(async (values) => {
            const isValid = await form.trigger();
            console.log("isValid", isValid);
            if(!isValid) return;
        
            if (values?.workExperiences?.length === 0) {
                setResumeData({
                    ...resumeData,
                    workExperienceSectionName: values?.workExperienceSectionName || "",
                    workExperiences: [{ position: "", company: "", startDate: "", endDate: "", description: "" }],
                });
            } else {
                setResumeData({
                    ...resumeData,
                    workExperienceSectionName: values?.workExperienceSectionName,
                    workExperiences: values?.workExperiences?.filter(exp => exp !== undefined),
                });
            }
        });
        return unsubscribe
    }, [form, resumeData, setResumeData]);

    const {fields, append, remove, move} = useFieldArray({
        control: form.control,
        name: "workExperiences"
    });

    return (
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
                            />
                        ))} 
                    </Timeline>              
                </div>
            </Form>
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
}

function WorkExperienceItem({id, form, index, remove, length, setIsModalOpen, append, colorHex}: WorkExperienceItemProps){

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
                            {/* {skill} */}
                        </Badge>
                    ))}
                </div>
            </div>
        </>
    )
}