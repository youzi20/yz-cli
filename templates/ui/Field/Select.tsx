import { twMerge } from "tailwind-merge";

import { ArrowIcon } from "../Icon";
import { Popper, PopperItem, usePopperContext, usePopper } from "../Popover";
import { VariantStyle } from "../__type";

import { FieldWrapper } from "./Field";

interface SelectValueType {
  label?: React.ReactNode;
  placeholder?: React.ReactNode;
  children?: React.ReactNode;
  focus?: boolean;
}

export function SelectValue(props: SelectValueType) {
  const { label, placeholder, children, focus } = props;
  const { size, colors } = usePopperContext();

  return (
    <FieldWrapper size={size} colors={colors} focus={focus}>
      {children ?? (
        <div className="flex-1">
          {label ?? <span className="select-none text-[#5c6068]">{placeholder}</span>}
        </div>
      )}

      <ArrowIcon
        className={twMerge(
          "flex-shrink-0 rotate-90 text-xs text-white/30 transition-transform",
          props.focus && "-rotate-90 text-white/50",
        )}
      />
    </FieldWrapper>
  );
}

export type OptionType<T> = { label: React.ReactNode; value: T };

interface SelectProps<T = number> extends VariantStyle {
  className?: string;
  uuid: string;
  selectValue?: OptionType<T>;
  options?: OptionType<T>[];
  onChange?: (option: OptionType<T>) => void;
}

export function Select<T = number>(props: SelectProps<T>) {
  const { className, options, selectValue, onChange, ...other } = props;

  const { isOpen, closePopper } = usePopper(props.uuid);

  const handleOptionClick = (selectedOption: OptionType<T>) => {
    onChange?.(selectedOption);
    closePopper();
  };

  return (
    <Popper
      className={twMerge("right-0 w-full", className)}
      anchor={<SelectValue label={selectValue?.label} focus={isOpen} />}
      {...other}
    >
      {options?.map((item, index) => (
        <PopperItem
          active={item.value === selectValue?.value}
          onClick={() => handleOptionClick(item)}
          key={index}
        >
          {item.label}
        </PopperItem>
      ))}
    </Popper>
  );
}
