import * as React from 'react';
import { cn } from '@/lib/utils';

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Timeline.displayName = 'Timeline';

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.LiHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('group relative pb-4 pl-4 sm:pl-8', className)}
    {...props}
  />
));
TimelineItem.displayName = 'TimelineItem';

                
            
const TimelineHeader = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col items-start before:absolute before:left-2 before:h-full before:-translate-x-1/2 before:translate-y-3 before:self-start before:bg-gray-300 before:px-px after:absolute after:left-2 after:box-content after:h-2 after:w-2 after:-translate-x-1/2 after:translate-y-1.5 after:rounded-full after:border-4 after:border-blue-500 after:bg-blue-500 after:mt-[1px] group-last:before:hidden sm:flex-row sm:before:left-0 sm:before:ml-[1rem] sm:after:left-0 sm:after:ml-[1rem]',
      className
    )}
    {...props}
  />
));
TimelineHeader.displayName = 'TimelineHeader';

const TimelineTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-xl font-bold text-primary', className)}
    {...props}
  >
    {children}
  </div>
));
TimelineTitle.displayName = 'TimelineTitle';


const TimelineDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-muted-foreground', className)}
    {...props}
  />
));
TimelineDescription.displayName = 'TimelineDescription';

export {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
};