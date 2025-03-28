import { workExperienceSchema, WorkExperienceValues } from "@/lib/validation"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GripHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {CSS} from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import GenerateWorkExperienceButton from "./GenerateWorkExperienceButton";


export default function WorkExperienceForm({resumeData, setResumeData}: EditorFormProps) {
    const form = useForm<WorkExperienceValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            // workExperiences: resumeData.workExperiences || []
            workExperiences: resumeData.workExperiences?.length
            ? resumeData.workExperiences
            : [{ position: "", company: "", startDate: "", endDate: "", description: "" }]
        }
    });

    useEffect(() => {
        const {unsubscribe} = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
    
            //Update resume data
            // setResumeData({
            //     ...resumeData, 
            //     workExperiences: values.workExperiences?.filter(exp => exp !== undefined) || [],
            // })
            if (values?.workExperiences?.length === 0) {
                setResumeData({
                    ...resumeData,
                    workExperiences: [{ position: "", company: "", startDate: "", endDate: "", description: "" }],
                });
            } else {
                setResumeData({
                    ...resumeData,
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

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    function handleDragEnd(event: DragEndEvent){
        const {active, over} = event;

        if(over && active.id !== over.id){
            const oldIndex = fields.findIndex(field => field.id === active.id);
            const newIndex = fields.findIndex(field => field.id === over.id);

            move(oldIndex, newIndex);

            return arrayMove(fields, oldIndex, newIndex);

        }
    }
    return (
        <div className="max-w-xl w-full mx-auto space-y-3">
            {/* <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Work Experiences</h2>
                <p className="text-sm text-muted-foreground">Add as many work experiences as you like.</p>
            </div> */}
            <Form {...form}>
                <form className="max-w-xl w-full space-y-2 overflow-y-auto h-96">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={fields}
                            strategy={verticalListSortingStrategy}
                        >
                            {fields.map((field, index) => (
                                <WorkExperienceItem 
                                    id={field.id}
                                    key={field.id} 
                                    index={index}
                                    form={form}
                                    remove={remove}
                                    length={fields.length}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                    
                </form>
                    <div className="flex justify-center py-2">
                        <Button 
                            type="button"
                            onClick={()=> append({
                                position: "",
                                company: "",
                                startDate: "",
                                endDate: "",
                                description: "",
                            })}
                        >
                            Add work experience
                        </Button>
                    </div>
            </Form>
        </div>
    );
}


interface WorkExperienceItemProps {
    id: string;
    form: UseFormReturn<WorkExperienceValues>;
    index: number;
    remove: (index: number) => void;
    length: number;
}

function WorkExperienceItem({id, form, index, remove, length}: WorkExperienceItemProps){

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});

    return (
    <div 
        className={cn("space-y-3 border rounded-md bg-background p-3",
            isDragging && "z-50 cursor-grab shadow-xl relative"
        )}
        ref={setNodeRef}
        style={{
            transform: CSS.Transform.toString(transform),
            transition
        }}
    >
        <div className="flex justify-between gap-2">
            <span className="font-semibold">
                Work experience {index + 1}
            </span>
            <GripHorizontal 
                className="size-5 cursor-grab text-muted-foreground focus:outline-none" 
                {...attributes}
                {...listeners}
            />

        </div>
        <div className="flex justify-center">
            <GenerateWorkExperienceButton 
                onWorkExperienceGenerated={exp => form.setValue(`workExperiences.${index}`, exp)}
            />
        </div>
        <FormField
            control={form.control}
            name={`workExperiences.${index}.position`}
            render={({field})=>(
                <FormItem>
                    <FormLabel>Job title</FormLabel>
                    <FormControl>
                        <Input {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name={`workExperiences.${index}.company`}
            render={({field})=>(
                <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-3">
            <FormField
                control={form.control}
                name={`workExperiences.${index}.startDate`}
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                            <Input 
                                {...field} 
                                type={"date"}
                                value={field.value?.slice(0, 10)}  
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`workExperiences.${index}.endDate`}
                render={({field})=>(
                    <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                            <Input 
                                {...field} 
                                type={"date"}
                                value={field.value?.slice(0, 10)}  
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormDescription>
            Leave <span className="font-semibold">end date</span> empty if you are currently working here.
        </FormDescription>
        <FormField
                control={form.control}
                name={`workExperiences.${index}.description`}
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea 
                                className="min-h-32"
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            { length > 1 && (
                <Button variant={'destructive'} type="button" onClick={()=>remove(index)}>
                    Remove
                </Button>
            )}
    </div>
    )
}