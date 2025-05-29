"use client";

import Image from "next/image";

import { useState } from "react";
import { Trans } from "@lingui/react/macro";

import { AssetsWrapper } from "@/components/Assets";
import { FieldControl, FieldLabel, Input, Select } from "@/components/Field";
import Button from "@/components/Button";

import { formatBignumber } from "@/utils/formatNumber";

import ImgXOC from "@/assets/images/xoc.png";

import useWithdraw from "./useWithdraw";

enum MainnetEnums {
  XONE = "XONE",
  BNB_SMART_CHAIN = "BNB_SMART_CHAIN",
}
interface NainnetType {
  label: React.ReactNode;
  value: MainnetEnums;
}
const MAINNET_UUID = "mainnet-select";
const MAINNET_OPTIONS: NainnetType[] = [
  {
    label: <AssetsWrapper icon={<Image className="h-8 w-8" src={ImgXOC} alt="" />}>XONE</AssetsWrapper>,
    value: MainnetEnums.XONE,
  },
  {
    label: <AssetsWrapper icon={<Image className="h-8 w-8" src={ImgXOC} alt="" />}>BNB Smart Chain</AssetsWrapper>,
    value: MainnetEnums.BNB_SMART_CHAIN,
  },
];

const TOKEN_UUID = "token-select";
interface TokenType {
  label: React.ReactNode;
  value: `0x${string}`;
}
const TOKEN_OPTIONS: TokenType[] = [
  {
    label: <AssetsWrapper icon={<Image className="h-8 w-8" src={ImgXOC} alt="" />}>XOC</AssetsWrapper>,
    value: "0x002d0619eab294d21fef071f8b780cae7e999999",
  },
  {
    label: <AssetsWrapper icon={<Image className="h-8 w-8" src={ImgXOC} alt="" />}>XOC232</AssetsWrapper>,
    value: "0x002d0619eab294d21fef071f8b780cae7e999999",
  },
];

export default function Deposit() {
  const [mainnet, setMainnet] = useState<NainnetType>(MAINNET_OPTIONS[0]);
  const [token, setToken] = useState<TokenType>(TOKEN_OPTIONS[0]);
  const [amount, setAmount] = useState<string>("");

  const { accountAddress, balance, claim } = useWithdraw(token.value, amount);

  const isDisabled = !amount || Number(amount) <= 0 || Number(balance) - Number(amount) < 0;

  const handleConfirm = async () => {
    if (isDisabled) return;

    await claim();
  };

  return (
    <div className="grid gap-4 p-4">
      <FieldControl>
        <FieldLabel>
          <Trans>Mainnet</Trans>
        </FieldLabel>
        <Select<MainnetEnums>
          size="large"
          uuid={MAINNET_UUID}
          options={MAINNET_OPTIONS}
          selectValue={mainnet}
          onChange={setMainnet}
        />
      </FieldControl>
      <FieldControl>
        <FieldLabel>
          <Trans>Token</Trans>
        </FieldLabel>
        <Select<`0x${string}`>
          size="large"
          uuid={TOKEN_UUID}
          options={TOKEN_OPTIONS}
          selectValue={token}
          onChange={setToken}
        />
      </FieldControl>
      <FieldControl>
        <FieldLabel className="flex items-center justify-between">
          <Trans>Receive Address</Trans>
        </FieldLabel>
        <Input size="large" value={accountAddress} disabled />
      </FieldControl>
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

      <Button className="mt-4" size="large" colors="secondary" disabled={isDisabled} onClick={handleConfirm}>
        <Trans>Confirm</Trans>
      </Button>
    </div>
  );
}
