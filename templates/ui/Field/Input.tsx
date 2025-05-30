import { useMemo, useState } from "react";

import { cva, cx } from "cva";
import { twMerge } from "tailwind-merge";

import { VariantColors } from "../__type";

import { FieldWrapperType, FieldWrapper } from "./Field";

const inputStyle = cva({
  base: "w-10 flex-1 flex-shrink-0 select-none bg-transparent outline-none",
});

export type InputType = FieldWrapperType &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "size" | "prefix" | "suffix"> & {
    colors?: VariantColors;
    value?: string | number | null;
  };

export function Input(props: InputType) {
  const { className, status, size, colors, prefix, suffix, value, onFocus, onBlur, ...other } =
    props;
  const [focus, setFocus] = useState<boolean>(false);

  const classs = useMemo(() => cx(className), [className]);

  const wrapperProps = { className: classs, status, size, colors, prefix, suffix, focus };

  return (
    <FieldWrapper {...wrapperProps}>
      <input
        className={twMerge("h-full", inputStyle())}
        value={value ?? ""}
        onFocus={e => {
          onFocus?.(e);
          setFocus(true);
        }}
        onBlur={e => {
          onBlur?.(e);
          setFocus(false);
        }}
        onClick={e => e.stopPropagation()}
        {...other}
      />
    </FieldWrapper>
  );
}

export type TextareaType = FieldWrapperType &
  Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "size" | "prefix" | "suffix"
  > & {
    colors?: VariantColors;
    value?: string | number | null;
  };

export function Textarea(props: TextareaType) {
  const { className, status, size, colors, prefix, suffix, onFocus, onBlur, value, ...other } =
    props;

  const [focus, setFocus] = useState<boolean>(false);

  const suffixWrapper = suffix && <div className="absolute bottom-2.5 right-4">{suffix}</div>;

  const wrapperProps = {
    className: cx("input relative h-auto rounded-2xl", className),
    focus,
    status,
    size,
    colors,
    prefix,
    suffix: suffixWrapper,
  };

  return (
    <FieldWrapper {...wrapperProps}>
      <textarea
        className={twMerge("resize-none", inputStyle())}
        value={value ?? ""}
        onFocus={e => {
          onFocus?.(e);
          setFocus(true);
        }}
        onBlur={e => {
          onBlur?.(e);
          setFocus(false);
        }}
        {...other}
      />
    </FieldWrapper>
  );
}
