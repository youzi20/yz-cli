import { cva } from "cva";
import { twMerge } from "tailwind-merge";

import { VariantStyle } from "../__type";

const wrapperStyle = cva({
  base: "flex items-center border border-white/20 bg-white/5 transition-all",
  variants: {
    variant: { container: "", outline: "", none: "" },
    size: {
      large: "h-14 gap-3.5 rounded-xl px-4",
      medium: "",
      small: "",
    },
    colors: { default: "", primary: "", secondary: "" },
    focus: { true: "border-white/50 bg-white/20" },
  },
  defaultVariants: { colors: "default", size: "medium", variant: "container" },
});

export type FieldStatus = "success" | "filled";

export function FieldControl(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export function FieldLabel(props: { className?: string; children: React.ReactNode }) {
  const { className, ...other } = props;

  return <div className={twMerge("mb-3 text-xs leading-none text-white/60", className)} {...other} />;
}

export interface FieldHelperType {
  status: FieldStatus;
  text: string;
}

export function FieldHelper(props: FieldHelperType) {
  const { status, text } = props;

  return (
    <p className={twMerge("mt-2 text-xs leading-none", status === "filled" && "text-filled")}>
      {text}
    </p>
  );
}

export interface FieldWrapperType extends VariantStyle {
  status?: FieldStatus;
  focus?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  className?: string;
  children?: React.ReactNode;
}

export function FieldWrapper(
  props: FieldWrapperType & Omit<React.HTMLAttributes<HTMLDivElement>, "prefix">,
) {
  const { focus, status, size, colors, prefix, suffix, className, children } = props;

  return (
    <div
      className={twMerge(
        wrapperStyle({ size, colors, focus }),

        status === "filled" && "filled",
        className,
      )}
    >
      {prefix}
      {children}
      {suffix}
    </div>
  );
}
