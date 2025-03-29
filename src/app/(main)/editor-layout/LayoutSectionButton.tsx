import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { PanelsTopLeft, ChevronDown, PanelTop, PanelsRightBottom } from "lucide-react";
import { useState } from "react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";

interface LayoutSectionButtonProps {
    layoutStyle: string | undefined;
    onChange: (layoutStyle: string) => void;
    color: string | undefined;
}
export const layoutStyles = [{
    name: 'split',
    icons: <PanelsTopLeft className="size-5" />,
    description: 'Split Layout'
},{
    name: 'classic',
    icons: <PanelTop className="size-5" />,
    description: 'Classic Layout'
}, {
    name: 'hybrid',
    icons: <PanelsRightBottom className="size-5" />,
    description: 'Hybrid Layout'
 }];

//'modern', 'elegant', 'professional', 'creative', 'simple', 'minimal'

const hexToRGBA = (hex: string, alpha: number) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function LayoutSectionButton({layoutStyle, onChange, color}: LayoutSectionButtonProps){
    const subscriptionLevel = useSubscriptionLevel();

    const premiumModal = usePremiumModal();

    const [showPopover, setShowPopover] = useState(false);

    return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
            <Button 
                variant={"outline"}
                size={'sm'}
                title={"Change resume layout"}
                onClick={ () => {
                    // if(!canUseCustomizations(subscriptionLevel)){
                    //     premiumModal.setOpen(true);
                    //     return;
                    // }
                    setShowPopover(true)
                }}
            >
                <PanelsTopLeft className="size-5" /> Layout <ChevronDown className="size-5" />
            </Button>
        </PopoverTrigger>
        <PopoverContent
            className={`shadow-none flex flex-row py-5 px-6 bg-white border border-gray-200 rounded-lg`}
            align="end"
        >
            {layoutStyles.map((layout:any, i: number) =>(
                <Button
                    size={'sm'}
                    className={`w-full text-left rounded-none first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg `}
                    key={i}
                    style={{
                        color: layoutStyle === layout.name ? color : '', 
                        backgroundColor: layoutStyle === layout.name ? hexToRGBA(color as string, 0.2) : '',
                    }}
                    onClick={() => {
                        onChange(layout.name);
                        setShowPopover(false);
                    }}
                >
               {layout.icons} {layout.description}
            </Button>))}
        </PopoverContent>
    </Popover>
    );
}