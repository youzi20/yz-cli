"use client";

import { useState } from "react";

import { Trans } from "@lingui/react/macro";

import { FieldControl, FieldLabel, Input } from "@/components/Field";
import TagSelector, { Tag } from "@/components/TagSelector";
import Button from "@/components/Button";

import { formatTokenAmount, formatBignumber } from "@/utils/formatNumber";

import useNativeStake, { STAKE_OPTIONS } from "./useNativeStake";

interface OptionValue {
  index: number;
  apr: number;
  days: number;
  pointRate: number;
}

export default function NativeStake() {
  const [selectOption, setSelectOption] = useState<OptionValue>(STAKE_OPTIONS[0].value);
  const [amount, setAmount] = useState<string>("");

  const { balance, stake } = useNativeStake(selectOption.index, amount);

  const isDisabled = !amount || Number(amount) <= 0 || Number(balance) - Number(amount) < 0;

  const handleConfirm = async () => {
    if (isDisabled) return;

    await stake();
  };

  return (
    <div className="grid gap-4 p-4">
      <FieldControl>
        <FieldLabel className="flex items-center justify-between">
          <span>
            <Trans>Amount</Trans>
          </span>

          <p>
            <span className="mr-0.5">
              <Trans>Balance:</Trans>
            </span>
            <span>{formatBignumber(balance)}</span>
          </p>
        </FieldLabel>
        <Input
          type="number"
          size="large"
          suffix={
            <span className="cursor-pointer text-sm font-medium" onClick={() => balance && setAmount(balance)}>
              MAX
            </span>
          }
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </FieldControl>

      {selectOption.index === 0 && (
        <p className="text-sm text-white/60">
          <Trans>
            The flexible stake can only be claimed after being locked for <span className="text-white">48 hours</span>.
          </Trans>
        </p>
      )}

      <TagSelector className="grid-cols-3">
        {STAKE_OPTIONS.map(option => (
          <Tag
            className="w-full"
            size="small"
            colors="primary"
            active={option.value.index === selectOption.index}
            key={option.value.index}
            onClick={() => setSelectOption(option.value)}
          >
            {option.label}
          </Tag>
        ))}
      </TagSelector>

      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>XOC Stake</Trans>
          </span>
          <span className="font-medium text-white">{formatTokenAmount(amount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>XOC APR</Trans>
          </span>
          <span className="font-medium text-white">{`${selectOption.apr * 100}%`}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>Expected XOC</Trans>
          </span>
          <span className="font-medium text-white">
            {formatTokenAmount(amount ? (selectOption.days * selectOption.apr * Number(amount)) / 365 : 0)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>Expected XOE Points</Trans>
          </span>
          <span className="font-medium text-white">
            {formatTokenAmount(amount ? selectOption.pointRate * Number(amount) : 0)}
          </span>
        </div>
      </div>

      <Button className="mt-4" size="large" colors="secondary" disabled={isDisabled} onClick={handleConfirm}>
        <Trans>Confirm</Trans>
      </Button>
    </div>
  );
}
