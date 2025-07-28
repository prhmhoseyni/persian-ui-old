import clsx from "clsx";
import { type ButtonHTMLAttributes, type DetailedHTMLProps, memo } from "react";
import styles from "./index.module.css";

const variants = {
    contained: "",
    tinted: styles["btn-tinted"],
    outlined: styles["btn-outlined"],
};

const colors = {
    brand: styles["btn-brand"],
    info: styles["btn-info"],
    success: styles["btn-success"],
    warning: styles["btn-warning"],
    danger: styles["btn-danger"],
    gray: styles["btn-gray"],
};

const sizes = {
    xs: styles["btn-xs"],
    sm: styles["btn-sm"],
    md: "",
    lg: styles["btn-lg"],
    xl: styles["btn-xl"],
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
                    styles["btn"],
                    variants[variant],
                    colors[color],
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