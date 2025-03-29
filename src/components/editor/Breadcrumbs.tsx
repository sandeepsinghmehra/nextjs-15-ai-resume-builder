import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react";
import { steps } from "./steps";

interface BreadcrumbsProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
}
export default function Breadcrumbs({currentStep, setCurrentStep}: BreadcrumbsProps) {
    return (
        <div className="flex justify-center bg-white dark:bg-gray-800 h-10 z-10 m-auto">
            <Breadcrumb className="flex justify-center">
                <BreadcrumbList>
                {steps.map((step: any) => (
                    <React.Fragment key={step.key}>
                        <BreadcrumbItem>
                            {step.key === currentStep ? (
                                <BreadcrumbPage>{step.title}</BreadcrumbPage>
                            ): (
                                <BreadcrumbLink asChild>
                                    <button onClick={()=> setCurrentStep(step.key)}>
                                        {step.title}
                                    </button>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="last:hidden" />
                    </React.Fragment>
                ))} 
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}