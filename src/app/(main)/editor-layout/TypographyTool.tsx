import { Button } from "@/components/ui/button";
import { Check, ChevronDown, TypeOutline } from "lucide-react";
import { useEffect, useState } from "react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { useForm } from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoValues, ResumeValues } from "@/lib/validation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
  

interface SectionPickerProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    onChange: (data:{fontSize: string, fontFamily: string}) => void;
    color: string | undefined;
}
export const details = [{
        name: 'fontFamily',
        description: 'Font'
    },{
        name: 'fontSize',
        description: 'Size'
    }
];

const fontOptions = [
    { label: "Nunito", value: "Nunito" },
    { label: "Arial", value: "Arial" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Helvetica", value: "'Helvetica', sans-serif" },
    { label: "Calibri", value: "'Calibri', sans-serif" },
    { label: "Garamond", value: "'Garamond', serif" },
    { label: "Verdana", value: "'Verdana', sans-serif" },
    { label: "Lato", value: "'Lato', sans-serif" },
    { label: "Roboto", value: "'Roboto', sans-serif" },
    { label: "Montserrat", value: "'Montserrat', sans-serif" },
    { label: "Open Sans", value: "'Open Sans', sans-serif" },
    { label: "Poppins", value: "'Poppins', sans-serif" },
    { label: "Source Sans Pro", value: "'Source Sans Pro', sans-serif" },
    { label: "Merriweather", value: "'Merriweather', serif" },
    { label: "Playfair Display", value: "'Playfair Display', serif" },
    { label: "Fira Sans", value: "'Fira Sans', sans-serif" },
    { label: "Work Sans", value: "'Work Sans', sans-serif" },
    { label: "Quicksand", value: "'Quicksand', sans-serif" },
    { label: "PT Serif", value: "'PT Serif', serif" },
    { label: "Josefin Sans", value: "'Josefin Sans', sans-serif" },
    { label: "Raleway", value: "'Raleway', sans-serif" }
];

export const fontSizes = [{
    name: 'small',
    description: 'Small'
},{
    name: 'medium',
    description: 'Medium'
}, {
    name: 'big',
    description: 'Big'
}];

const hexToRGBA = (hex: string, alpha: number) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


export default function TypographyTool({resumeData, setResumeData, onChange, color}: SectionPickerProps){
    const subscriptionLevel = useSubscriptionLevel();

    const premiumModal = usePremiumModal();

    const [showPopover, setShowPopover] = useState(false);

    // console.log("selectedFont", selectedFont);
    const { colorHex, fontSize, fontFamily } = resumeData;
        const form = useForm<PersonalInfoValues>({
            resolver: zodResolver(personalInfoSchema),
            defaultValues: {
                fontFamily: resumeData.fontFamily,
                fontSize: resumeData.fontSize,
            }
        });
    
        
        useEffect(() => {
            const {unsubscribe} = form.watch(async (values:any) => {
                const isValid = await form.trigger();
                //Update resume data
                setResumeData({...resumeData, ...values})
            });
            return unsubscribe;
        }, [form, resumeData, setResumeData]);

    return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
            <Button 
                variant={"outline"}
                size={'sm'}
                title={"Change resume typography"}
                onClick={ () => {
                    // if(!canUseCustomizations(subscriptionLevel)){
                    //     premiumModal.setOpen(true);
                    //     return;
                    // }
                    setShowPopover(true)
                }}
            >
                <TypeOutline className="size-5" /> Typography <ChevronDown className="size-5" />
            </Button>
        </PopoverTrigger>
        <PopoverContent
            className={`shadow-none flex flex-row py-5 px-6 bg-white border border-gray-200 rounded-lg`}
            align="end"
        >
            {/* <Form {...form}> */}
      {/* <form className="w-full space-y-3 space-x-3 flex flex-row items-start justify-start"> */}
        {/* <div className="w-1/2 mt-0"> */}
         
          <div className="space-y-2">
                <div className="space-y-1">

                    <h6 className="mb-1 text-lg font-medium">Font</h6>
                    <div className={`shadow-none flex flex-row bg-white`}>
                    <Select 
                        onValueChange={(data) => {
                            // console.log("data in valueChange", data);
                            onChange({ fontSize: resumeData.fontSize, fontFamily: data});
                            // setShowPopover(false);
                        }} 
                        defaultValue={resumeData.fontFamily}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent className="h-60">
                            <SelectGroup>
                                {fontOptions.map((font) => (
                                    <SelectItem
                                        key={font.value}
                                        value={font.value}
                                        className="flex flex-row items-center"
                                    >
                                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    </div>
                </div>
                <div className="space-y-1">
                

                    <h6 className="mb-1 text-lg font-medium">Size</h6>
                    <div className={`shadow-none flex flex-row bg-white`}>
                        {fontSizes.map((fontSizeItem:any, i: number) =>{
                            // console.log("fontSize === fontSize.name", fontSize, fontSizeItem.name);
                            return (
                                <Button
                                    size={'sm'}
                                    className={`w-full text-left rounded-none first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg `}
                                    key={i}
                                    style={{
                                        color: resumeData.fontSize === fontSizeItem.name ? color : '', 
                                        backgroundColor: resumeData.fontSize === fontSizeItem.name ? hexToRGBA(color as string, 0.2) : '',
                                    }}
                                    onClick={() => {
                                        onChange({ fontSize: fontSizeItem.name, fontFamily: resumeData.fontFamily});
                                    }}
                                >
                                    {fontSizeItem.description}
                                </Button>
                            )
                        })}
                    </div>
                    </div>
                </div>
            {/* </div> */}
        {/* </div> */}
        <div  className="w-1/2 mt-0" style={{marginTop: 0,}}>
        </div>
      {/* </form> */}
    {/* </Form> */}
        </PopoverContent>
    </Popover>
    );
}