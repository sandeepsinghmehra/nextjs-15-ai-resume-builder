import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { PanelsTopLeft, ChevronDown, PanelTop, PanelsRightBottom, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { useForm } from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoValues, ResumeValues } from "@/lib/validation";

interface SectionPickerProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    onChange: (layoutStyle: string) => void;
    color: string | undefined;
}
export const personalDetails = [{
    name: 'isLocationSection',
    description: 'Location'
},{
    name: 'isPhoneSection',
    description: 'Phone Number'
}, {
    name: 'isEmailSection',
    description: 'Email'
},
// {
//     name: 'isWebsiteSection',
//     description: 'Website'
// },{
//     name: 'isLinkedinSection',
//     description: 'LinkedIn'
// },
// {
//     name: 'isGithubSection',
//     description: 'Github'
// },{
//     name: 'isSocialLinkSection',
//     description: 'Social Link'
// }
];

export const otherSectionDetails = [
    {
        name: 'isPhotoSection',
        description: 'Picture'
    },{
        name: 'isSummarySection',
        description: 'About Me'
    },{
        name: 'isJobTitleSection',
        description: 'Role'
    },{
        name: 'isWorkSection',
        description: 'Work Experience'
    },{
        name: 'isEducationSection',
        description: 'Education'
    },{
        name: 'isSkillSection',
        description: 'Skills'
    },{
        name: 'isLanguageSection',
        description: 'Languages'
    },{
        name: 'isInterestSection',
        description: 'Hobbies'
    },
    // {
    //     name: 'isKeyachivementSection',
    //     description: 'Keyachivement'
    // }   
]


//'modern', 'elegant', 'professional', 'creative', 'simple', 'minimal'

const hexToRGBA = (hex: string, alpha: number) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function SectionPicker({resumeData, setResumeData, onChange, color}: SectionPickerProps){
    const subscriptionLevel = useSubscriptionLevel();

    const premiumModal = usePremiumModal();

    const [showPopover, setShowPopover] = useState(false);

    const { colorHex } = resumeData;
        const form = useForm<PersonalInfoValues>({
            resolver: zodResolver(personalInfoSchema),
            defaultValues: {
                isEmailSection: resumeData.isEmailSection,
                isPhoneSection: resumeData.isPhoneSection,
                isLocationSection: resumeData.isLocationSection,
                isWebsiteSection: resumeData.isWebsiteSection,
                isLinkedinSection: resumeData.isLinkedinSection,
                isPhotoSection: resumeData.isPhotoSection,
                isSummarySection: resumeData.isSummarySection,
                isJobTitleSection: resumeData.isJobTitleSection,
                isWorkSection: resumeData.isWorkSection,
                isEducationSection: resumeData.isEducationSection,
                isSkillSection: resumeData.isSkillSection,
                isLanguageSection: resumeData.isLanguageSection,
                isInterestSection: resumeData.isInterestSection,
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
                title={"Change resume color"}
                onClick={ () => {
                    // if(!canUseCustomizations(subscriptionLevel)){
                    //     premiumModal.setOpen(true);
                    //     return;
                    // }
                    setShowPopover(true)
                }}
            >
                <Settings2 className="size-5" /> Sections <ChevronDown className="size-5" />
            </Button>
        </PopoverTrigger>
        <PopoverContent
            className={`shadow-none flex flex-row py-5 px-6 bg-white border border-gray-200 rounded-lg`}
            align="end"
        >
            <Form {...form}>
      <form className="w-full space-y-3 space-x-3 flex flex-row items-start justify-start">
        <div className="w-1/2 mt-0">
          <h3 className="mb-4 text-lg font-medium">Personal Details</h3>
          <div className="space-y-2">
            {personalDetails.map((personalItem: any, i: number)=> (
                <div className="space-y-4" key={i}>
                    <FormField
                    control={form.control}
                    name={personalItem.name}
                    render={({ field }) => {
                        console.log("field in checkbox", field);
                        return (
                        <FormItem className="flex flex-row items-center justify-start rounded border p-1 shadow-sm">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>{"  "}
                            <FormLabel className=" m-0 mt-0 pl-3" style={{marginTop: 0}}>{personalItem.description}</FormLabel>
                        
                        </FormItem>
                    )}}
                    />
                </div>
            ))}
            </div>
        </div>
        <div  className="w-1/2 mt-0" style={{marginTop: 0,}}>
          <h3 className="mb-4 text-lg font-medium">Other Details</h3>
          <div className="space-y-2">
            {otherSectionDetails.map((personalItem: any, i: number)=> (
                <div className="space-y-4" key={i}>
                    <FormField
                    control={form.control}
                    name={personalItem.name}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-start rounded border p-1 shadow-sm">
                            <FormControl>
                                <Switch
                                    checked={field.value === true}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>{"  "}
                            <FormLabel className=" m-0 mt-0 pl-3" style={{marginTop: 0}}>{personalItem.description}</FormLabel>
                        
                        </FormItem>
                    )}
                    />
                </div>
            ))}
            </div>
        </div>
      </form>
    </Form>
        </PopoverContent>
    </Popover>
    );
}