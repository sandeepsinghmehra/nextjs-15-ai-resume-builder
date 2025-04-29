"use client"

import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export default function LoadingEditor() {
    const resumeData = {
        layoutStyle: "layout1", // default layout style
        colorHex: "#0693E3", // default color       
        fontFamily: "Arial", // default font family
        fontSize: "16px", // default font size
        isPhotoSection: false, // default photo section
        borderStyle: "solid", // default border style   
    }
    const containerRef = useRef<HTMLDivElement>(null);
    
    const {width} = useDimensions(containerRef);
    return (
        <div className='flex grow flex-col' style={{background: resumeData.colorHex}}>
            <span className="fixed left-20 right-0 top-4 z-50 w-fit group flex items-center justify-center m-auto gap-3 bg-slate-50">
                        <div className="opacity-50 lg:opacity-100 group-hover:opacity-100 transition-opacity flex flex-row gap-3 flex-none lg:left-3 lg:top-3">
                            <div className="w-[100px] h-[30px] rounded-md bg-gray-300 animate-pulse" />
                            <div className="w-[100px] h-[30px] rounded-md bg-gray-300 animate-pulse" />
                            <div className="w-[100px] h-[30px] rounded-md bg-gray-300 animate-pulse" />
                            <div className="w-[100px] h-[30px] rounded-md bg-gray-300 animate-pulse" />
                            <div className="w-[100px] h-[30px] rounded-md bg-gray-300 animate-pulse" />
                        </div>
            </span>
            <main className='grow mt-16'>
                <div className={cn(' hidden w-full md:flex')} >
                            
                    <div className="pt-5 w-full overflow-y-auto" style={{background: resumeData.colorHex}}>
                             <div 
                                className={cn("bg-white text-black h-fit w-full aspect-[210/297] m-auto", "shadow-sm transition-shadow group-hover:shadow-lg max-w-3xl")}
                                ref={containerRef}
                                >
                                    <div 
                                        className={cn("space-y-6 p-6 box-border h-auto", !width && "invisible")}
                                        style={{
                                            zoom: (1 / 794) * width,
                                        }}
                                    >
                                        <div className="flex justify-between">
                                            {/* Left Side: Name + Job Title */}
                                            <div className="space-y-2 flex flex-col">
                                                {/* Skeleton for Name */}
                                                <div className="w-[250px] h-[40px] rounded-md bg-gray-300 animate-pulse" />

                                                {/* Skeleton for Job Title */}
                                                <div className="w-[200px] h-[32px] rounded-md bg-gray-300 animate-pulse" />
                                            </div>

                                            {/* Right Side: Photo */}

                                            <div
                                                className="relative animate-pulse bg-gray-300"
                                                style={{
                                                    height: 80,
                                                    width: 80,
                                                    borderRadius: '0px'
                                                }}
                                            />
                                        </div>

                                        <div className="h-20 w-full bg-gray-200 rounded" />

                                        <div className="h-20 w-full bg-gray-200 rounded" />

                                        <div className="h-40 w-full bg-gray-200 rounded" />

                                        <div className="h-40 w-full bg-gray-200 rounded" />

                                        <div className="h-20 w-full bg-gray-200 rounded" />

                                        <div className="h-20 w-full bg-gray-200 rounded" />

                                        <div className="h-20 w-full bg-gray-200 rounded" />
                                       
                                    </div>
                                </div>
                    </div>
                </div>
            </main>
        </div>
    )
}