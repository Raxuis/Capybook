"use client";

// Inspired by react-hot-toast library
import * as React from "react";

import type {ToastActionElement, ToastProps} from "@/components/ui/toast";
import {CheckCircle, AlertCircle, AlertTriangle, Info} from "lucide-react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
    icon?: React.ReactNode;
    duration?: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
    | {
    type: ActionType["ADD_TOAST"];
    toast: ToasterToast;
}
    | {
    type: ActionType["UPDATE_TOAST"];
    toast: Partial<ToasterToast>;
}
    | {
    type: ActionType["DISMISS_TOAST"];
    toastId?: ToasterToast["id"];
}
    | {
    type: ActionType["REMOVE_TOAST"];
    toastId?: ToasterToast["id"];
};

interface State {
    toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, duration = TOAST_REMOVE_DELAY) => {
    if (toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId));
        toastTimeouts.delete(toastId);
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
        });
    }, duration);

    toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) => (t.id === action.toast.id ? {...t, ...action.toast} : t)),
            };

        case "DISMISS_TOAST": {
            const {toastId} = action;

            // ! Side effects ! - This could be extracted into a dismissToast() action,
            // but I'll keep it here for simplicity
            if (toastId) {
                const toast = state.toasts.find(t => t.id === toastId);
                addToRemoveQueue(toastId, toast?.duration || TOAST_REMOVE_DELAY);
            } else {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id, toast.duration || TOAST_REMOVE_DELAY);
                });
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                            ...t,
                            open: false,
                        }
                        : t,
                ),
            };
        }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };
    }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = {toasts: []};

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

function getDefaultIcon(variant: ToastProps["variant"]) {
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

type Toast = Omit<ToasterToast, "id">;

function toast({
                   variant = "default",
                   icon,
                   duration = 5000,
                   ...props
               }: Toast) {
    const id = genId();

    // Utiliser l'icône par défaut si aucune n'est fournie
    const finalIcon = icon || getDefaultIcon(variant);

    const update = (props: ToasterToast) =>
        dispatch({
            type: "UPDATE_TOAST",
            toast: {...props, id},
        });

    const dismiss = () => dispatch({type: "DISMISS_TOAST", toastId: id});

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            variant,
            icon: finalIcon,
            duration,
            open: true,
            onOpenChange: (open) => {
                if (!open) dismiss();
            },
        },
    });

    return {
        id: id,
        dismiss,
        update,
    };
}

toast.success = (props: Omit<Toast, "variant">) => toast({...props, variant: "success"});
toast.error = (props: Omit<Toast, "variant">) => toast({...props, variant: "error"});
toast.warning = (props: Omit<Toast, "variant">) => toast({...props, variant: "warning"});
toast.info = (props: Omit<Toast, "variant">) => toast({...props, variant: "info"});
toast.destructive = (props: Omit<Toast, "variant">) => toast({...props, variant: "destructive"});

function useToast() {
    const [state, setState] = React.useState<State>(memoryState);

    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => dispatch({type: "DISMISS_TOAST", toastId}),
    };
}

export {toast, useToast};