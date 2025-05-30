"use client";
import Image from "next/image";

import { useMemo } from "react";

import { Trans } from "@lingui/react/macro";

import Button from "@/components/Button";

import { formatTokenAmount, formatDelimiter } from "@/utils/formatNumber";
import { formatTimer } from "@/utils/formatTime";

import ImgLOGO from "@/assets/images/logo.png";

import { StakeInfo, STAKE_OPTIONS, useNativeStakeList, useClaimProfit, useExit } from "./useNativeStake";

function StakeItem(props: StakeInfo) {
  const { ith, endTime, stakeAmount, stakeType, isEnd } = props;
  const { trigger: claimProfit } = useClaimProfit(ith);
  const { trigger: exit } = useExit(ith);

  const { apr, tokenEarnings, pointEarnings } = useMemo(() => {
    const { apr, pointRate, days } = STAKE_OPTIONS[Number(stakeType || 0)].value;
    const stakeAmountNum = Number(stakeAmount || 0);

    return {
      apr: `${(apr * 100).toFixed(2)}%`,
      tokenEarnings: formatTokenAmount((days * apr * stakeAmountNum) / 365),
      pointEarnings: formatTokenAmount(pointRate * stakeAmountNum),
    };
  }, [stakeType, stakeAmount]);

  const handleClaimProfit = () => {
    if (!isEnd) return;

    return claimProfit();
  };

  const handleExit = () => {
    if (!isEnd) return;

    return exit();
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/15 px-4">
      <div className="flex items-center justify-between pb-5 pt-4">
        <Image className="h-8 w-auto" src={ImgLOGO} alt="" />

        {stakeType === "0" && (
          <Button
            className="h-8 w-14 font-medium"
            size="small"
            colors="secondary"
            disabled={!isEnd}
            onClick={handleClaimProfit}
          >
            <Trans>Claim</Trans>
          </Button>
        )}
      </div>

      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>Claimable Time</Trans>
          </span>
          <span className="font-medium text-white">{formatTimer(endTime)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>My Staked</Trans>
          </span>
          <span className="font-medium text-white">{formatDelimiter(stakeAmount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>Duration</Trans>
          </span>
          <span className="font-medium text-white">{stakeType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>ARP</Trans>
          </span>
          <span className="font-medium text-white">{apr}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>Realized Rewards</Trans>
          </span>
          <span className="font-medium text-white">{pointEarnings}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            <Trans>Expected Rewards</Trans>
          </span>
          <span className="font-medium text-white">{tokenEarnings}</span>
        </div>
      </div>

      <Button className="my-2.5 w-full text-[#800015]" variant="text" disabled={!isEnd} onClick={handleExit}>
        <Trans>Unstake</Trans>
      </Button>
    </div>
  );
}

export default function NativeStakeList() {
  const { stakeList } = useNativeStakeList();
  console.log("stakeList", stakeList);

  return (
    <div className="grid gap-3 p-4">
      {stakeList.map(stake => (
        <StakeItem {...stake} key={stake.startTime + stake.stakeType} />
      ))}
      {/* {stakes.length <= 0 && (
                <div className="w-full h-10 flex justify-center items-center">
                  <Trans>No Data</Trans>
                </div>
              )} */}
    </div>
  );
}
