import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { PublicProps } from 'vue';
import { VNode } from 'vue';

export declare interface AnimationPreset {
    bounce: number;
    spring: boolean;
}

export declare type AnimationPresetName = keyof typeof animationPresets;

export declare const animationPresets: {
    readonly smooth: {
        readonly bounce: 0.1;
        readonly spring: true;
    };
    readonly bouncy: {
        readonly bounce: 0.6;
        readonly spring: true;
    };
    readonly subtle: {
        readonly bounce: 0.05;
        readonly spring: true;
    };
    readonly snappy: {
        readonly bounce: 0.4;
        readonly spring: true;
    };
};

declare const _default: DefineComponent<GooeyToasterProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<GooeyToasterProps> & Readonly<{}>, {
visibleToasts: number;
swipeToDismiss: boolean;
closeOnEscape: boolean;
maxQueue: number;
showProgress: boolean;
position: ToastPosition;
dir: "ltr" | "rtl";
theme: "light" | "dark";
queueOverflow: "drop-oldest" | "drop-newest";
closeButton: boolean | "top-left" | "top-right";
gap: number;
offset: number | string;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;
export { _default as GoeyToaster }
export { _default as GooeyToaster }

export declare interface DismissFilter {
    type: GooeyToastType | GooeyToastType[];
}

declare function dismissGooeyToast(idOrFilter?: string | number | DismissFilter): void;

declare interface GooeyPromiseData<T> {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
    description?: {
        loading?: VNode | string;
        success?: VNode | string | ((data: T) => VNode | string);
        error?: VNode | string | ((error: unknown) => VNode | string);
    };
    action?: {
        success?: GooeyToastAction;
        error?: GooeyToastAction;
    };
    classNames?: GooeyToastClassNames;
    fillColor?: string;
    borderColor?: string;
    borderWidth?: number;
    timing?: GooeyToastTimings;
    preset?: AnimationPresetName;
    spring?: boolean;
    bounce?: number;
    showTimestamp?: boolean;
    onDismiss?: (id: string | number) => void;
    onAutoClose?: (id: string | number) => void;
}
export { GooeyPromiseData as GoeyPromiseData }
export { GooeyPromiseData }

declare const gooeyToast: ((title: string, options?: GooeyToastOptions) => string | number) & {
    success: (title: string, options?: GooeyToastOptions) => string | number;
    error: (title: string, options?: GooeyToastOptions) => string | number;
    warning: (title: string, options?: GooeyToastOptions) => string | number;
    info: (title: string, options?: GooeyToastOptions) => string | number;
    promise: <T>(promise: Promise<T>, data: GooeyPromiseData<T>) => string;
    dismiss: typeof dismissGooeyToast;
    update: typeof updateGooeyToast;
};
export { gooeyToast as goeyToast }
export { gooeyToast }

export declare interface GooeyToastAction {
    label: string;
    onClick: () => void;
    successLabel?: string;
}

declare interface GooeyToastClassNames {
    wrapper?: string;
    content?: string;
    header?: string;
    title?: string;
    icon?: string;
    description?: string;
    actionWrapper?: string;
    actionButton?: string;
}
export { GooeyToastClassNames as GoeyToastClassNames }
export { GooeyToastClassNames }

declare interface GooeyToasterProps {
    position?: ToastPosition;
    duration?: number;
    gap?: number;
    offset?: number | string;
    theme?: 'light' | 'dark';
    closeButton?: boolean | 'top-left' | 'top-right';
    visibleToasts?: number;
    dir?: 'ltr' | 'rtl';
    preset?: AnimationPresetName;
    spring?: boolean;
    bounce?: number;
    swipeToDismiss?: boolean;
    closeOnEscape?: boolean;
    maxQueue?: number;
    queueOverflow?: 'drop-oldest' | 'drop-newest';
    showProgress?: boolean;
}
export { GooeyToasterProps as GoeyToasterProps }
export { GooeyToasterProps }

declare interface GooeyToastOptions {
    description?: VNode | string;
    action?: GooeyToastAction;
    icon?: VNode | string;
    duration?: number;
    id?: string | number;
    classNames?: GooeyToastClassNames;
    fillColor?: string;
    borderColor?: string;
    borderWidth?: number;
    timing?: GooeyToastTimings;
    preset?: AnimationPresetName;
    spring?: boolean;
    bounce?: number;
    showProgress?: boolean;
    showTimestamp?: boolean;
    onDismiss?: (id: string | number) => void;
    onAutoClose?: (id: string | number) => void;
}
export { GooeyToastOptions as GoeyToastOptions }
export { GooeyToastOptions }

declare interface GooeyToastTimings {
    displayDuration?: number;
}
export { GooeyToastTimings as GoeyToastTimings }
export { GooeyToastTimings }

declare type GooeyToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

export declare interface GooeyToastUpdateOptions {
    title?: string;
    description?: VNode | string;
    type?: GooeyToastType;
    action?: GooeyToastAction;
    icon?: VNode | string | null;
    showTimestamp?: boolean;
}

declare type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

declare function updateGooeyToast(id: string | number, options: GooeyToastUpdateOptions): void;

export { }
