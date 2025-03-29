import { educationSchema, EducationValues } from "@/lib/validation"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GripHorizontal } from "lucide-react";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {CSS} from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";



export default function EducationForm({resumeData, setResumeData}: EditorFormProps) {
    const form = useForm<EducationValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            // educations: resumeData.educations || []
            educations: resumeData.educations?.length
            ? resumeData.educations
            : [{ degree: "", school: "", startDate: "", endDate: "", }]
        }
    });

    useEffect(() => {
        const {unsubscribe} = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
    
            //Update resume data
            // setResumeData({
            //     ...resumeData, 
            //     educations: values.educations?.filter(edu => edu !== undefined) || [],
            // })
            if (values?.educations?.length === 0) {
                setResumeData({
                    ...resumeData,
                    educations: [{ degree: "", school: "", startDate: "", endDate: "" }],
                });
            } else {
                setResumeData({
                    ...resumeData,
                    educations: values?.educations?.filter(exp => exp !== undefined),
                });
            }
        });
        return unsubscribe
    }, [form, resumeData, setResumeData]);
    
    const {fields, append, remove, move} = useFieldArray({
        control: form.control,
        name: "educations"
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
        <div className="max-w-xl mx-auto space-y-3">
            {/* <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Education</h2>
                <p className="text-sm text-muted-foreground">Add as many educations as you like.</p>
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
                                <EducationItem 
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
                <div className="flex justify-center">
                    <Button 
                        type="button"
                        onClick={()=> append({
                            degree: "",
                            school: "",
                            startDate: "",
                            endDate: "",
                        })}
                    >
                        Add education
                    </Button>
                </div>
            </Form>
        </div>
    );
}


interface EducationItemProps {
    id: string;
    form: UseFormReturn<EducationValues>;
    index: number;
    remove: (index: number) => void;
    length: number;
}

function EducationItem({
    id, 
    form, 
    index, 
    remove, 
    length
}: EducationItemProps){

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
                Education {index + 1}
            </span>
            <GripHorizontal 
                className="size-5 cursor-grab text-muted-foreground focus:outline-none" 
                {...attributes}
                {...listeners}
            />

        </div>
        <FormField
            control={form.control}
            name={`educations.${index}.degree`}
            render={({field})=>(
                <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                        <Input {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name={`educations.${index}.school`}
            render={({field})=>(
                <FormItem>
                    <FormLabel>School</FormLabel>
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
                name={`educations.${index}.startDate`}
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
                name={`educations.${index}.endDate`}
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
        {length > 1 && (
            <Button variant={'destructive'} type="button" onClick={()=>remove(index)}>
                Remove
            </Button>
        )}
    </div>
)}