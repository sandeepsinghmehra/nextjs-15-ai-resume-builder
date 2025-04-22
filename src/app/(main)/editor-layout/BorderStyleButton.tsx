import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { Squircle, Square, Circle } from "lucide-react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import { canUseCustomizations } from "@/lib/permissions";

export const BorderStyles = {
    SQUARE: 'square',
    CIRCLE: 'circle',
    SQUIRCLE: 'squircle',
}

const borderStyles = Object.values(BorderStyles);

interface BorderStyleButtonProps {
    borderStyle: string | undefined;
    onChange: (borderStyle: string) => void;
}

export default function BorderStyleButton({
    borderStyle, 
    onChange
}: BorderStyleButtonProps){
    const subscriptionLevel = useSubscriptionLevel();

    const premiumModal = usePremiumModal();

    const handleClick = () => {
        // if(!canUseCustomizations(subscriptionLevel)){
        //     premiumModal.setOpen(true);
        //     return;
        // }
        const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0;
        const nextIndex = (currentIndex + 1) % borderStyles.length;
        onChange(borderStyles[nextIndex]);
    }
    const Icon = borderStyle === "square" ? Square: borderStyle === "circle" ? Circle : Squircle;

    return <Button 
        variant={'outline'} 
        size={'sm'} 
        title="Change border style"
        onClick={handleClick}
        >
            <Icon className="size-5" /> Image Radius
        </Button>
}