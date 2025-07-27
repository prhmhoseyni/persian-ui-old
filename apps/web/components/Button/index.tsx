import clsx from "clsx";
import { type ButtonHTMLAttributes, type DetailedHTMLProps, memo } from "react";

const colors = {
    brand: {
        contained: "text-prose-inverse bg-brand hover:bg-brand-hover active:bg-brand-active active:shadow-focus-brand",
        tinted: "text-brand bg-brand-light hover:bg-brand-light-hover active:bg-brand-light-active active:shadow-focus-brand",
        outlined: "text-brand hover:text-brand-hover active:text-brand-active border border-brand hover:border-brand-hover active:border-brand-active active:shadow-focus-brand",
    },

    info: {
        contained: "text-prose-inverse bg-info hover:bg-info-hover active:bg-info-active active:shadow-focus-info",
        tinted: "text-info bg-info-light hover:bg-info-light-hover active:bg-info-light-active active:shadow-focus-info",
        outlined: "text-info hover:text-info-hover active:text-info-active border border-info hover:border-info-hover active:border-info-active active:shadow-focus-info",
    },

    success: {
        contained: "text-prose-inverse bg-success hover:bg-success-hover active:bg-success-active active:shadow-focus-success",
        tinted: "text-success bg-success-light hover:bg-success-light-hover active:bg-success-light-active active:shadow-focus-success",
        outlined: "text-success hover:text-success-hover active:text-success-active border border-success hover:border-success-hover active:border-success-active active:shadow-focus-success",
    },

    warning: {
        contained: "text-prose-inverse bg-warning hover:bg-warning-hover active:bg-warning-active active:shadow-focus-warning",
        tinted: "text-warning bg-warning-light hover:bg-warning-light-hover active:bg-warning-light-active active:shadow-focus-warning",
        outlined: "text-warning hover:text-warning-hover active:text-warning-active border border-warning hover:border-warning-hover active:border-warning-active active:shadow-focus-warning",
    },

    danger: {
        contained: "text-prose-inverse bg-danger hover:bg-danger-hover active:bg-danger-active active:shadow-focus-danger",
        tinted: "text-danger bg-danger-light hover:bg-danger-light-hover active:bg-danger-light-active active:shadow-focus-danger",
        outlined: "text-danger hover:text-danger-hover active:text-danger-active border border-danger hover:border-danger-hover active:border-danger-active active:shadow-focus-danger",
    },

    gray: {
        contained: "text-prose-inverse bg-gray hover:bg-gray-hover active:bg-gray-active active:shadow-focus-gray",
        tinted: "text-gray bg-gray-light hover:bg-gray-light-hover active:bg-gray-light-active active:shadow-focus-gray",
        outlined: "text-gray hover:text-gray-hover active:text-gray-active border border-gray hover:border-gray-hover active:border-gray-active active:shadow-focus-gray",
    },

};

const sizes = {
    xs: "px-[0.75rem] h-[2rem] text-subtitle5",
    sm: "px-[0.75rem] h-[2.25rem] text-subtitle5",
    md: "px-[0.75rem] h-[2.5rem] text-subtitle5",
    lg: "px-[1rem] h-[2.75rem] text-subtitle4",
    xl: "px-[1rem] h-[3rem] text-subtitle3",
};

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    variant?: "contained" | "tinted" | "outlined";
    color?: "brand" | "info" | "success" | "warning" | "danger" | "gray";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Button = (props: Props) => {
    const {
        variant = "contained",
        color = "brand",
        size = "md",
        className = "",
        children,
        ...rest
    } = props;

    return (
        <button
            className={
                clsx(
                    "cursor-pointer inline-flex items-center justify-center gap-1 rounded-lg min-w-fit transition-all ease-in-out duration-300",
                    "disabled:cursor-not-allowed disabled:opacity-40",
                    colors[color][variant],
                    sizes[size],
                    className,
                )
            }
            {...rest}
        >
            {children}
        </button>
    );
}


export default memo(Button);