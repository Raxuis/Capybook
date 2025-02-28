"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import {cva, type VariantProps} from "class-variance-authority";
import {XIcon, CheckCircle, AlertCircle, Info, AlertTriangle} from "lucide-react";
import * as React from "react";

import {cn} from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

function ToastViewport({
                           className,
                           ...props
                       }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>) {
    return (
        <ToastPrimitives.Viewport
            className={cn(
                "fixed top-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:flex-col md:max-w-[400px]",
                className,
            )}
            {...props}
        />
    );
}

const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-center justify-between overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:data-[swipe-direction=left]:slide-out-to-left-full data-[state=closed]:data-[swipe-direction=right]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
        variants: {
            variant: {
                default: "border bg-background text-foreground",
                destructive: "destructive group border-destructive bg-destructive text-white",
                success: "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
                error: "border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
                warning: "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
                info: "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
    icon?: React.ReactNode;
}

function Toast({
                   className,
                   variant,
                   icon,
                   children,
                   ...props
               }: ToastProps) {
    return (
        <ToastPrimitives.Root className={cn(toastVariants({variant}), className)} {...props}>
            <div className="flex w-full items-start gap-3">
                {icon && <span className="flex-shrink-0 mt-0.5">{icon}</span>}
                <div className="flex-1">{children}</div>
            </div>
        </ToastPrimitives.Root>
    );
}

function ToastAction({
                         className,
                         asChild = false,
                         ...props
                     }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>) {
    return (
        <ToastPrimitives.Action
            className={cn(
                !asChild &&
                "hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive focus:group-[.destructive]:ring-destructive focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-[color,box-shadow] outline-none hover:group-[.destructive]:text-white focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            asChild={asChild}
            {...props}
        >
            {props.children}
        </ToastPrimitives.Action>
    );
}

function ToastClose({
                        className,
                        asChild = false,
                        ...props
                    }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>) {
    return (
        <ToastPrimitives.Close
            className={cn(
                !asChild &&
                "group focus-visible:border-ring focus-visible:ring-ring/50 absolute top-3 right-3 flex size-7 items-center justify-center rounded transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none",
                className,
            )}
            toast-close=""
            asChild={asChild}
            {...props}
        >
            {asChild ? (
                props.children
            ) : (
                <XIcon
                    size={16}
                    className="opacity-60 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                />
            )}
        </ToastPrimitives.Close>
    );
}

function ToastTitle({
                        className,
                        ...props
                    }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>) {
    return <ToastPrimitives.Title className={cn("text-sm font-medium", className)} {...props} />;
}

function ToastDescription({
                              className,
                              ...props
                          }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>) {
    return (
        <ToastPrimitives.Description
            className={cn("text-sm opacity-90", className)}
            {...props}
        />
    );
}

function getDefaultIcon(variant: string | undefined) {
    if (!variant || variant === 'default') return null;

    switch (variant) {
        case 'success':
            return <CheckCircle className="text-green-600 dark:text-green-400" size={18}/>;
        case 'error':
            return <AlertCircle className="text-red-600 dark:text-red-400" size={18}/>;
        case 'warning':
            return <AlertTriangle className="text-amber-600 dark:text-amber-400" size={18}/>;
        case 'info':
            return <Info className="text-blue-600 dark:text-blue-400" size={18}/>;
        case 'destructive':
            return <AlertCircle className="text-white" size={18}/>;
        default:
            return null;
    }
}

function ToastWithIcon({
                           variant,
                           icon,
                           ...props
                       }: ToastProps) {
    const defaultIcon = getDefaultIcon(variant ?? "default");
    const finalIcon = icon || defaultIcon;

    return <Toast variant={variant} icon={finalIcon} {...props} />;
}

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    ToastWithIcon,
    type ToastActionElement,
    type ToastProps,
};