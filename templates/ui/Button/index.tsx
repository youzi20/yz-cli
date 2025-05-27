import { useState } from "react";

import { cva } from "cva";
import { twMerge } from "tailwind-merge";

import { Loading } from "@/components/Icon";

type ButtonBaseType = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface ButtonType extends ButtonBaseType {
  loadingClass?: string;
  disabledLoading?: boolean;
  size?: "large" | "medium" | "small";
  colors?: "default" | "primary" | "secondary" | "text";
  variant?: "container" | "outline" | "none";
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any | Promise<any>;
}

const buttonStyle = cva({
  base: "relative select-none whitespace-nowrap rounded-lg font-bold leading-none transition-all duration-300",
  variants: {
    size: {
      large: "h-14 w-[12.5rem] text-xl",
      medium: "h-11 w-[10rem]",
      small: "h-8 w-[7.5rem] text-sm",
    },
    colors: {
      default: "",
      primary: "",
      secondary: "",
      text: "",
    },
    variant: {
      container: "",
      outline: "",
      none: "",
    },
    disabled: {
      true: "pointer-events-none",
    },
  },
  compoundVariants: [
    {
      colors: ["default", "primary", "secondary"],
      variant: "container",
      className: "border border-black text-black",
    },
    {
      colors: "default",
      variant: "container",
      className: "bg-button-default shadow-button-default",
    },
    { colors: "primary", variant: "container", className: "bg-button-primary" },
    { colors: "secondary", variant: "container", className: "bg-button-secondary" },
    { colors: ["primary", "secondary"], variant: "container", className: "shadow-button" },
    {
      colors: ["primary", "secondary"],
      variant: "container",
      size: "small",
      className: "shadow-button-sm",
    },
    {
      colors: ["default", "primary", "secondary"],
      variant: "container",
      disabled: true,
      className: "bg-[#CED3D9] bg-none shadow-button-disabled",
    },
    {
      colors: ["default", "primary", "secondary"],
      variant: "container",
      size: "small",
      disabled: true,
      className: "shadow-button-disabled-sm",
    },
    {
      colors: "primary",
      variant: "outline",
      className:
        "border border-primary text-primary active:bg-primary/20 disabled:border-[#CED3D9] disabled:text-[#CED3D9]",
    },
    // {
    //   colors: "text",
    //   variant: "container",
    //   className: "text-white hover:bg-white/20 active:bg-white/10",
    // },

    // { colors: "secondary", variant: "outline", className: "border-secondary border" },
  ],
  defaultVariants: {
    colors: "primary",
    size: "medium",
    variant: "container",
  },
});

export default function Button(props: ButtonType) {
  const {
    className,
    loadingClass,
    size,
    colors,
    variant,
    disabled,
    disabledLoading,
    loading,
    children,
    onClick,
    ...other
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async (e: any) => {
    if (onClick) {
      setIsLoading(true);

      try {
        await onClick(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isDisabled = loading || disabled || isLoading;

  return (
    <button
      className={twMerge(buttonStyle({ size, colors, variant, disabled }), className)}
      disabled={isDisabled}
      onClick={handleClick}
      {...other}
    >
      {(!disabledLoading && loading) || isLoading ? (
        <Loading className={twMerge("inline", size === "small" && "w-4", loadingClass)} />
      ) : (
        children
      )}
    </button>
  );
}
