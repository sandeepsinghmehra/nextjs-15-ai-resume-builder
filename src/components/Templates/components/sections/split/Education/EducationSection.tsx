
import { educationSchema, EducationValues, ResumeValues } from "@/lib/validation";
import { useEffect, useRef, useState } from "react";
import { BorderStyles } from "@/components/editor/BorderStyleButton";
import { MinusIcon, ChevronsUpDownIcon, PlusIcon, TrashIcon, Loader } from "lucide-react";

import { useFieldArray, useForm, UseFormReturn, UseFieldArrayAppend } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timeline, TimelineHeader, TimelineItem } from "../../../layout/timeline";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { deleteSingleEducation, handleAddNewEducation } from "./actions";


interface ResumeSectionProps {
    resumeData: ResumeValues,
    setResumeData: (data: ResumeValues) => void
}

export default function EducationSection({resumeData, setResumeData}: ResumeSectionProps){
    // console.log("resumeData", resumeData);
    const {educations,  colorHex, isEducationSection, fontSize, fontFamily} = resumeData;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlusLoading, setIsPlusLoading] = useState<Record<number, boolean>>({});
    const [isMinusLoading, setIsMinusLoading] = useState<Record<number, boolean>>({});

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
                                id: edu.id || "",
                                resumeId: edu.resumeId || "",
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
        // }, [form, setResumeData]);
        }, [form, resumeData, setResumeData]);
        
        const {fields, append, remove, move} = useFieldArray({
            control: form.control,
            name: "educations",
            keyName: "key",
        });

    return (
        <>
        {
            isEducationSection ?
            <>
                <hr 
                    className="border-2"
                    style={{
                        borderColor: colorHex,
                        marginTop:  `${fontSize === 'big'?'24px': fontSize === 'medium'? '12px': '6px'}`,
                    }}
                />
                <Form {...form}>
                    <div 
                        className="break-inside-avoid"
                        style={{
                            marginTop:  `${fontSize === 'big'?'24px': fontSize === 'medium'? '12px': '6px'}`,
                        }}
                    >
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
                                        className="text-lg uppercase font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                        style={{
                                            // color: colorHex,
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
                                <EducationItem 
                                    id={field.id}
                                    key={field.key}
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
                                    eduId={field.id}
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

interface EducationItemProps {
    id: string;
    form: UseFormReturn<EducationValues>;
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: UseFieldArrayAppend<EducationValues, "educations">;
    colorHex: string|undefined;
    setResumeData: (data: any) => void;
    fontFamily: string|undefined;
    fontSize: string|undefined;
    eduId: string;
    resumeId: string;
    isPlusLoading: Record<number, boolean>;
    setIsPlusLoading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
    isMinusLoading: Record<number, boolean>;
    setIsMinusLoading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

function EducationItem({
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
    eduId, 
    resumeId,
    isPlusLoading,
    setIsPlusLoading,
    isMinusLoading,
    setIsMinusLoading,
}: EducationItemProps){

    useEffect(() => {
        document.documentElement.style.setProperty("--primary-color", colorHex as string); // Set the CSS variable dynamically
    }, [colorHex]); 

    // const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});
{/* <div className="relative  "></div> */}
    return (
        <TimelineItem className="border-2 border-transparent border-dashed p-0 rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300">
                      
            <EducationButtons 
                remove={remove} 
                length={length} 
                setIsModalOpen={setIsModalOpen} 
                append={append} 
                index={index} 
                eduId={eduId} 
                resumeId={resumeId} 
                isPlusLoading={isPlusLoading}
                setIsPlusLoading={setIsPlusLoading}
                isMinusLoading={isMinusLoading}
                setIsMinusLoading={setIsMinusLoading}
            />
            <TimelineHeader className="dynamic-time-line-header-point-after">
                <FormField
                    control={form.control}
                    name={`educations.${index}.school`}
                    render={({field})=>(
                        <FormItem className="space-y-[1px] block w-full">
                            <FormLabel className="sr-only">School</FormLabel>
                            <FormControl>   
                                <input
                                    {...field}
                                    value={field.value ?? ""}
                                    type="text"
                                    placeholder="SCHOOL"
                                    className=" w-full block text-md font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </TimelineHeader>
            <div className="flex flex-row flex-wrap items-center">
                <div className="w-4/5 flex flex-row items-center justify-start">
                    <FormField
                        control={form.control}
                        name={`educations.${index}.degree`}
                        render={({field})=>(
                            <FormItem className="space-y-[1px]">
                                <FormLabel className="sr-only">Degree</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        value={field.value ?? ""}
                                        type="text"
                                        placeholder="DEGREE"
                                        className="text-md font-medium focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
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
                        name={`educations.${index}.startDate`}
                        render={({field})=>(
                            <FormItem className="space-y-[1px]">
                                <FormLabel className="sr-only">Start Date</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        value={field.value ?? ""}
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
                        name={`educations.${index}.endDate`}
                        render={({field})=>(
                            <FormItem className="space-y-[1px]">
                                <FormLabel className="sr-only">End Date</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        value={field.value ?? ""}
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
        </TimelineItem>
    )
}

interface EducationButtonsProps {
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    append: UseFieldArrayAppend<EducationValues, "educations">;
    eduId: string;
    resumeId: string;
    isPlusLoading: Record<number, boolean>;
    setIsPlusLoading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
    isMinusLoading: Record<number, boolean>;
    setIsMinusLoading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}
function EducationButtons({
    setIsModalOpen, 
    remove, 
    index, 
    append, 
    length, 
    eduId, 
    resumeId,
    isPlusLoading,
    setIsPlusLoading,
    isMinusLoading,
    setIsMinusLoading,
}: EducationButtonsProps){
    return (
        <div className="absolute -top-3.5 right-2 border border-transparent rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 ">
            <div className="flex items-center gap-1 hover:outline-none hover:border-transparent hover:bg-transparent hover:text-gray-500 transition-colors">
                {length > 1 && (
                    <Button 
                        size="icon" 
                        variant={'destructive'} 
                        className="rounded-full px-2 py-0 text-xs font-light h-6 w-6" 
                        onClick={async()=>{
                            setIsMinusLoading((prev) => ({ ...prev, [index]: true }));
                            await deleteSingleEducation(eduId); 
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
                        const res = await handleAddNewEducation(resumeId);
                        // console.log("res", res);
                        if(Object.keys(res).length > 0 && res.id){
                            append({
                                id: res.id,
                                resumeId: resumeId,
                                degree: "",
                                school: "",
                                startDate: "",
                                endDate: "",
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