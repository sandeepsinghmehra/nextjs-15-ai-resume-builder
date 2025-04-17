
import { interestsSchema, InterestsValues, ResumeValues } from "@/lib/validation";
import { useEffect, useRef, useState } from "react";
import { BorderStyles } from "@/components/editor/BorderStyleButton";
import { MinusIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";

import { useFieldArray, useForm, UseFormReturn, UseFieldArrayAppend } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { deleteSingleHobby, handleAddNewHobby } from "./actions";



interface ResumeSectionProps {
    resumeData: ResumeValues,
    setResumeData: (data: ResumeValues) => void
}

export default function HobbiesSection({resumeData, setResumeData}: ResumeSectionProps){
    const { colorHex, borderStyle, isInterestSection, fontSize, fontFamily} = resumeData;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const form = useForm<InterestsValues>({
        resolver: zodResolver(interestsSchema),
        defaultValues: {
            interestsSectionName: resumeData?.interestsSectionName || "",
            interests: resumeData.interests?.length ? resumeData?.interests : [{ id: "", resumeId: "", name: "" }] 
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
                            id: interest.id || "",
                            resumeId: interest.resumeId || "",
                            name: interest.name || "",
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
        name: "interests",
        keyName: "key",
    });
    return (
        <>
        { 
        isInterestSection ?
            <>
                <hr 
                    className="border-2"
                    style={{
                        borderColor: colorHex,
                        marginTop:  `${fontSize === 'big'?'24px': fontSize === 'medium'? '12px': '6px'}`,
                    }}
                />
                <div 
                    className="border-2 border-transparent border-dashed p-0 rounded-md w-full max-w-3xl group transition-colors duration-300 hover:border-gray-300"
                    style={{
                        marginTop:  `${fontSize === 'big'?'24px': fontSize === 'medium'? '12px': '6px'}`,
                    }}
                >
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
                                                        className="text-lg uppercase font-semibold focus:outline-none focus:bg-slate-200 hover:bg-gray-200 transition-colors py-1 px-2 border border-transparent rounded-md m-0 dark:bg-white"
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
                            <div className='flex flex-row flex-wrap gap-2'>
                                {fields.map((field:any, index:number) => (
                                    <HobbiesItem
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
                                        hobbyId={field.id}
                                        resumeId={field.resumeId}
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
    // append: ({name}: {name: string}) => void;
    append: UseFieldArrayAppend<InterestsValues, "interests">;
    colorHex: string|undefined;
    fontFamily: string|undefined;
    fontSize: string|undefined;
    hobbyId: string;
    resumeId: string;
}

function HobbiesItem({id, form, index, remove, length, setIsModalOpen, append, colorHex, fontFamily, fontSize, hobbyId, resumeId}: HobbiesItemProps){

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
                                        hobbyId={hobbyId}
                                        resumeId={resumeId}
                                    />
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter language"
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

interface HobbiesButtonsProps {
    index: number;
    remove: (index: number) => void;
    length: number;
    setIsModalOpen: (value: boolean) => void;
    // append: ({name}: {name: string}) => void;
    append: UseFieldArrayAppend<InterestsValues, "interests">;
    showButtons: boolean;
    setShowButtons: (value: boolean) => void;
    hobbyId: string;
    resumeId: string;
}
function HobbiesButtons({setIsModalOpen, remove, index, append, length, showButtons, setShowButtons, hobbyId, resumeId}: HobbiesButtonsProps){
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
                            await deleteSingleHobby(hobbyId);
                            remove(index);
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
                        const res = await handleAddNewHobby(resumeId);
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