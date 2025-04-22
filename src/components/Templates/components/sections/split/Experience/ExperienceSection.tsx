
import { ResumeValues, workExperienceSchema, WorkExperienceValues } from "@/lib/validation";
import { useEffect, useState } from "react";
import { BorderStyles } from "@/components/editor/BorderStyleButton";
import { Sparkle, MinusIcon, ChevronsUpDownIcon, PlusIcon, Loader } from "lucide-react";

import { useFieldArray, useForm, UseFormReturn, UseFieldArrayAppend } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timeline, TimelineHeader, TimelineItem } from "../../../layout/timeline";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { deleteSingleWorkExperience, handleAddNewExperience } from "./actions";

interface ResumeSectionProps {
    resumeData: ResumeValues,
    setResumeData: (data: ResumeValues) => void
}

export default function WorkExperienceSection({resumeData, setResumeData}: ResumeSectionProps){
    const { colorHex, isWorkSection, fontFamily, fontSize} = resumeData;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlusLoading, setIsPlusLoading] = useState<Record<number, boolean>>({});
    const [isMinusLoading, setIsMinusLoading] = useState<Record<number, boolean>>({});

    const form = useForm<WorkExperienceValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            workExperienceSectionName: resumeData?.workExperienceSectionName || "",
            workExperiences: resumeData.workExperiences
        }
    });

    useEffect(() => {
        // console.log("Initializing ExperienceSection with resumeData:", resumeData);
        const subscription = form.watch((values) => {
            // console.log("Form values changed:", values);
            (async () => {
                const isValid = await form.trigger();
                if (!isValid) {
                    // console.log("Form validation failed, skipping update");
                    return;
                }
    
                const updatedResume = {
                    ...resumeData,
                    workExperienceSectionName: values?.workExperienceSectionName || "",
                    workExperiences: Array.isArray(values?.workExperiences)
                        ? values.workExperiences
                                .filter((exp): exp is { 
                                    id: string;
                                    resumeId: string;
                                    position: string; 
                                    company: string; 
                                    startDate: string; 
                                    endDate: string; 
                                    description: string 
                                } => !!exp)
                                .map((exp) => ({
                                    id: exp.id || "",
                                    resumeId: exp.resumeId || "",
                                    position: exp.position || "",
                                    company: exp.company || "",
                                    startDate: exp.startDate || "",
                                    endDate: exp.endDate || "",
                                    description: exp.description || "",
                              }))
                        : []
                };
                
                // console.log("Updating resumeData with:", updatedResume);
                setResumeData(updatedResume);
            })();
        });
        return () => subscription.unsubscribe()
    }, [form, resumeData, setResumeData]);

    const {fields, append, remove, move} = useFieldArray({
        control: form.control,
        name: "workExperiences",
        keyName: "key",
    });

    return (
        <>
        { isWorkSection ?
            <>
                {/* <hr 
                    className="border-2"
                    style={{
                        borderColor: colorHex,
                        marginTop:  `${fontSize === 'big'?'24px': fontSize === 'medium'? '12px': '6px'}`,
                    }}
                /> */}
                <Form {...form}>
                    <div 
                        className="break-inside-avoid"
                        style={{
                            // marginTop:  `${fontSize === 'big'?'24px': fontSize === 'medium'? '12px': '6px'}`,
                        }}
                    >
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
                        <Timeline className=''>
                            {fields.map((field, index) => (
                                <WorkExperienceItem 
                                    key={field.key}
                                    id={field.key}
                                    index={index}
                                    form={form}
                                    remove={remove}
                                    length={fields.length}
                                    setIsModalOpen={setIsModalOpen}
                                    append={append}
                                    colorHex={colorHex}
                                    setResumeData={setResumeData}
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    expId={field.id}
                                    resumeId={field.resumeId}
                                    isPlusLoading={isPlusLoading}
                                    setIsPlusLoading={setIsPlusLoading}
                                    isMinusLoading={isMinusLoading}
                                    setIsMinusLoading={setIsMinusLoading}
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
    append: UseFieldArrayAppend<WorkExperienceValues, "workExperiences">;
    colorHex: string|undefined;
    setResumeData: (data: ResumeValues) => void;
    fontFamily: string|undefined;
    fontSize: string|undefined;
    expId: string;
    resumeId: string;
    isPlusLoading: Record<number, boolean>;
    setIsPlusLoading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
    isMinusLoading: Record<number, boolean>;
    setIsMinusLoading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

function WorkExperienceItem({
    id, 
    form, 
    index, 
    remove, 
    length, 
    setIsModalOpen, 
    append, 
    colorHex, 
    setResumeData, 
    fontFamily, 
    fontSize, 
    expId,
    resumeId,
    isPlusLoading,
    setIsPlusLoading,
    isMinusLoading,
    setIsMinusLoading,
}: WorkExperienceItemProps){
    useEffect(() => {
        document.documentElement.style.setProperty("--primary-color", colorHex as string);
    }, [colorHex]);

    return (
        <TimelineItem className="border-2 border-transparent border-dashed p-0 rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300">
            <ExperienceButtons 
                remove={remove} 
                length={length} 
                setIsModalOpen={setIsModalOpen} 
                append={append} 
                index={index}
                expId={expId}
                resumeId={resumeId}
                setResumeData={setResumeData}
                isPlusLoading={isPlusLoading}
                setIsPlusLoading={setIsPlusLoading}
                isMinusLoading={isMinusLoading}
                setIsMinusLoading={setIsMinusLoading}
            />
            <TimelineHeader className="dynamic-time-line-header-point-after">
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
                                    className="w-full block text-lg font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                    style={{
                                        display: 'block',  
                                        color: colorHex,
                                        fontSize: `${fontSize === 'big'?'17px': fontSize==='medium'? '16px': '15px'}`,
                                        lineHeight: `${fontSize === 'big'?'26px': fontSize==='medium'? '22px': '18px'}`,
                                        fontFamily: fontFamily,
                                        fontWeight: 600,
                                    }}
                                />
                          </FormControl>
                        </FormItem>
                    )}
                />
            </TimelineHeader>
            <div className="flex flex-row flex-wrap items-center">
                <div className="w-4/5 flex flex-row items-center justify-start">
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
                                        className="text-md font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white "
                                        style={{
                                            fontSize: `${fontSize === 'big'?'17px': fontSize==='medium'? '16px': '15px'}`,
                                            lineHeight: `${fontSize === 'big'?'26px': fontSize==='medium'? '22px': '18px'}`,
                                            fontFamily: fontFamily,
                                            fontWeight: 600,
                                        }}
                                    /> 
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="w-1/5 flex flex-row items-end justify-end">         
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
                                        className="w-20 text-center text-xs font-light text-muted-foreground focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-1 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            fontSize: `${fontSize === 'big'?'12px': fontSize==='medium'? '11px': '10px'}`,
                                            lineHeight: `${fontSize === 'big'?'18px': fontSize==='medium'? '16px': '14px'}`,
                                            fontFamily: fontFamily,
                                        }}
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
                                        className="w-20 text-center text-xs font-light text-muted-foreground focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-1 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            fontSize: `${fontSize === 'big'?'12px': fontSize==='medium'? '11px': '10px'}`,
                                            lineHeight: `${fontSize === 'big'?'18px': fontSize==='medium'? '16px': '14px'}`,
                                            fontFamily: fontFamily,
                                        }}
                                    />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>  
            </div>
                
            <FormField
                control={form.control}
                name={`workExperiences.${index}.description`}
                render={({field})=>(
                    <FormItem className="space-y-[1px]">
                        <FormLabel className="sr-only">Description</FormLabel>
                        <FormControl className="m-0 p-0">
                            <div className="relative m-0 p-0 pb-0 flex box-border h-auto">
                                <textarea
                                    {...field}
                                    value={field.value || ""}
                                    ref={(el) => {
                                        if (el) {
                                            el.style.height = "25px";
                                            el.style.height = `${el.scrollHeight}px`;
                                        }
                                    }}
                                    placeholder="Enter your work experience description"
                                    rows={1}
                                    className="w-full min-h-[25px] text-md font-light focus:outline-none focus:bg-gray-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-sm resize-none overflow-hidden bg-white dark:bg-white dark:focus:bg-slate-200 dark:hover:bg-slate-200 box-border"
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = "25px";
                                        target.style.height = `${target.scrollHeight}px `;
                                    }}
                                    spellCheck={true}
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                    style={{
                                        fontSize: `${fontSize === 'big'?'14px': fontSize==='medium'? '13px': '12px'}`,
                                        lineHeight: `${fontSize === 'big'?'22px': fontSize==='medium'? '20px': '18px'}`,
                                        fontFamily: fontFamily,
                                    }}
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
    append: UseFieldArrayAppend<WorkExperienceValues, "workExperiences">;
    expId: string;
    resumeId: string;
    setResumeData: (data: ResumeValues) => void;
    isPlusLoading: Record<number, boolean>;
    setIsPlusLoading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
    isMinusLoading: Record<number, boolean>;
    setIsMinusLoading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

function ExperienceButtons({
    setIsModalOpen, 
    remove, 
    index, 
    append, 
    length, 
    expId,
    resumeId,
    setResumeData,
    isPlusLoading,
    setIsPlusLoading,
    isMinusLoading,
    setIsMinusLoading,
}: ExperienceButtonsProps){
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
                        onClick={async() => {
                            setIsMinusLoading((prev) => ({ ...prev, [index]: true }));
                            await deleteSingleWorkExperience(expId); 
                            remove(index);
                            setIsMinusLoading((prev) => ({ ...prev, [index]: false }));
                        }}
                    >
                        {isMinusLoading[index] ? <Loader className="w-5 h-5 animate-spin" /> :<MinusIcon className="w-5 h-5" />}
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
                    onClick={async() => {
                        setIsPlusLoading((prev) => ({ ...prev, [index]: true }));
                        const res = await handleAddNewExperience(resumeId);
                        // console.log("res", res);
                        if(Object.keys(res).length > 0 && res.id){
                            append({
                                id: res.id,
                                resumeId: resumeId,
                                position: "",
                                company: "",
                                startDate: "",
                                endDate: "",
                                description: "",
                            });
                        }
                        setIsPlusLoading((prev) => ({ ...prev, [index]: false }));
                    }}
                >
                    {isPlusLoading[index] ? <Loader className="w-5 h-5 animate-spin" /> : <PlusIcon className="w-5 h-5" />}
                </Button>
            </div>
        </div>
    )
}
