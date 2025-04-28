"use client"; // Add this line

import logo from "@/assets/logo.png";
import resumePreview2 from "@/assets/resume-preview.jpg";
import resumePreview from "@/assets/resume-preview.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react"; // Import useState and useEffect

export default function Home() {
  const [isResume1OnTop, setIsResume1OnTop] = useState(true); // State to track top image
  const [isLoaded, setIsLoaded] = useState(false); // State for load animation

  const handleMouseEnter = () => {
    setIsResume1OnTop(false); // Show resume 2 on hover
  };

  const handleMouseLeave = () => {
    setIsResume1OnTop(true); // Revert to resume 1 when hover ends
  };

  // Trigger load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Small delay to ensure initial styles apply
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Build Your{" "}
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Standout Resume
          </span>{" "}
          Effortlessly
        </h1>
        <p className="text-lg text-gray-500">
          Leverage our <span className="font-bold">intelligent platform</span> to craft a compelling resume that gets noticed. Fast and easy.
        </p>
        <Button asChild size="lg" variant="premium" className="">
          <Link href="/my-resumes">Get New started</Link>
        </Button>
      </div>
      {/* Image Section with Hover Interaction */}
      <div 
        className="relative mt-8 h-[550px] w-[400px] cursor-pointer md:mt-0 md:h-[600px] md:w-[500px] lg:h-[650px] lg:w-[550px]" // Added cursor-pointer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
         <Suspense fallback={<div className="h-full w-full bg-gray-200 animate-pulse rounded-md" />}>
        {/* Image 1 */}
        <Image
          src={resumePreview}
          alt="Resume preview 1"
          fill
          className={`absolute left-0 top-0 transform object-cover shadow-xl transition-all duration-700 ease-out ${ // Adjusted duration/easing
            isLoaded ? '' : '-translate-y-full opacity-0' // Initial state for load animation
          } ${ 
            isResume1OnTop
              ? "z-10 rotate-[2deg] scale-100" 
              : "z-0 rotate-[2deg] translate-x-2 translate-y-2 scale-95 opacity-90" 
          }`}
          style={{ objectPosition: "top" }}
        />
        {/* Image 2 */}
        <Image
          src={resumePreview2}
          alt="Resume preview 2"
          fill
          className={`absolute left-0 top-0 transform object-cover shadow-xl transition-all duration-700 ease-out ${ // Adjusted duration/easing
             isLoaded ? '' : 'translate-y-full opacity-0' // Initial state for load animation
          } ${
            !isResume1OnTop
              ? "z-10 rotate-[2deg] scale-100" 
              : "z-0 rotate-[2deg] translate-x-2 translate-y-2 scale-95 opacity-90" 
          }`}
          style={{ objectPosition: "top" }}
        />
        </Suspense>
      </div>
    </main>
  );
}
