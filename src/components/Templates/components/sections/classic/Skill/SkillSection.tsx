
import { ResumeValues, skillsSchema, SkillsValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BorderStyles } from "@/components/editor/BorderStyleButton";
import { Sparkle, MinusIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";

import { useFieldArray, useForm, UseFormReturn, UseFieldArrayAppend } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { deleteSingleSkill, handleAddNewSkill } from "./actions";


interface ResumeSectionProps {
    resumeData: ResumeValues,
    setResumeData: (data: ResumeValues) => void
}

export default function SkillsSection({resumeData, setResumeData}: ResumeSectionProps){
    const {skills, colorHex, borderStyle, isSkillSection, fontSize, fontFamily} = resumeData;
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
                            id: skill.id || "",
                            resumeId: skill.resumeId || "",
                            name: skill.name || "",
                        }))
                    : [], // Default to empty array if undefined
                });
            })();
        });
        return () => subscription.unsubscribe();
    // }, [form, setResumeData]);
    }, [form, resumeData, setResumeData]);
        
    const {fields, append, remove, move}:any = useFieldArray({
        control: form.control,
        name: "skills",
        keyName: "key",
    });
    return (
        <>
        {
            isSkillSection ?
            <>
                <hr 
                    className="border-2"
                    style={{
                        borderColor: colorHex,
                        marginTop:  `${fontSize === 'big'?'24px': fontSize === 'medium'? '12px': '6px'}`,
                    }}
                />
                <div 
                    className="relative border-2 border-transparent border-dashed rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300 m-0 p-0"
                    style={{
                        marginTop:  `${fontSize === 'big'?'24px': fontSize === 'medium'? '12px': '6px'}`,
                    }}
                >
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
                                                        className="w-full text-lg uppercase font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                                        style={{
                                                            display: "block",
                                                            width: "100%",
                                                            fontSize: `${fontSize === 'big'?'18px': fontSize==='medium'? '17px': '16px'}`,
                                                            lineHeight: `${fontSize === 'big'?'28px': fontSize==='medium'? '24px': '20px'}`,
                                                            fontFamily: fontFamily,
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
                                        key={field.key}
                                        index={index}
                                        form={form}
                                        remove={remove}
                                        length={fields.length}
                                        setIsModalOpen={setIsModalOpen}
                                        append={append}
                                        colorHex={colorHex}
                                        fontFamily={fontFamily}
                                        fontSize={fontSize}
                                        skillId={field.id}
                                        resumeId={field.resumeId}
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
    append: UseFieldArrayAppend<SkillsValues, "skills">;
    // append: ({name}: {name: string}) => void;
    colorHex: string|undefined;
    fontFamily: string|undefined;
    fontSize: string|undefined;
    skillId: string;
    resumeId: string;
}

function SkillItem({id, form, index, remove, length, setIsModalOpen, append, colorHex, fontFamily, fontSize, skillId, resumeId}: SkillItemProps){

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
                                        skillId={skillId}
                                        resumeId={resumeId}
                                    />
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter skill"
                                        className="text-md font-medium text-muted-foreground focus:outline-none bg-slate-200 focus:bg-slate-200 hover:bg-gray-200 transition-colors py-0 px-2 border border-transparent rounded-md m-0 dark:bg-white"
                                        onMouseEnter={() => setShowButtons(true)} // Keep buttons visible when hovering input
                                        onMouseLeave={() => setShowButtons(false)} // Hide only when leaving input
                                        style={{
                                            width: 'auto',
                                            minWidth: "50px",
                                            maxWidth: "100%",
                                            fontSize: `${fontSize === 'big'?'17px': fontSize==='medium'? '16px': '15px'}`,
                                            lineHeight: `${fontSize === 'big'?'26px': fontSize==='medium'? '22px': '18px'}`,
                                            fontFamily: fontFamily,
                                            fontWeight: 500,
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
    append: UseFieldArrayAppend<SkillsValues, "skills">;
    showButtons: boolean;
    setShowButtons: (value: boolean) => void;
    skillId: string;
    resumeId: string;
}
function SkillButtons({setIsModalOpen, remove, index, append, length, showButtons, setShowButtons, skillId, resumeId}: SkillButtonsProps){
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
                        onClick={async()=>{
                            await deleteSingleSkill(skillId);
                            remove(index)
                        }}
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
                    onClick={async() => {
                        const res = await handleAddNewSkill(resumeId);
                        // console.log("res", res);
                        if(Object.keys(res).length > 0 && res.id){
                            append({
                                id: res.id,
                                resumeId: resumeId,
                                name: "",
                            });
                        }
                    }}
                >
                    <PlusIcon className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}
