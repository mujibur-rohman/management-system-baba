"use client";

import AppWrapper from "@/components/app-wrapper";
import formatCurrency from "@/lib/format-currency";
import formatNumber from "@/lib/format-number";
import { cn } from "@/lib/utils";
import DashboardService from "@/services/dashboard/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { ApexOptions } from "apexcharts";
import { BanknoteIcon, Package2Icon, UsersIcon } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Home() {
  const { data: countMember, isLoading: countMemberLoading } = useQuery({
    queryKey: ["count-member"],
    queryFn: async () => {
      return await DashboardService.get("count-member");
    },
  });

  const { data: countProfit, isLoading: countProfitLoading } = useQuery({
    queryKey: ["count-profit"],
    queryFn: async () => {
      return await DashboardService.get("profit-count");
    },
  });

  const { data: countStock, isLoading: countStockLoading } = useQuery({
    queryKey: ["count-stock"],
    queryFn: async () => {
      return await DashboardService.get("count-stock");
    },
  });

  const { data: profitMonths, isLoading: profitMonthsLoading } = useQuery({
    queryKey: ["profit-count-six-months"],
    queryFn: async () => {
      return await DashboardService.get("profit-count-six-months");
    },
  });

  const { data: qtyMonths, isLoading: qtyMonthsLoading } = useQuery({
    queryKey: ["qty-count-six-months"],
    queryFn: async () => {
      return await DashboardService.get("qty-count-six-months");
    },
  });

  const { theme } = useTheme();
  const profitChart = {
    series: [
      {
        name: "Profit",
        data: profitMonths?.value || [],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        endingShape: "rounded",
      },
    },
    colors: ["#4287f5"],
    dataLabels: {
      formatter: (val: any) => {
        return formatNumber(val);
      },
    },
    stroke: {
      show: true,
      width: 2,
    },
    xaxis: {
      categories: profitMonths?.month || [],
      labels: {
        show: true,
        style: {
          colors: theme === "light" ? "#000000" : "#CFCFCF",
        },
      },
    },
    yaxis: {
      title: {
        text: "Profit",
        style: {
          fontSize: "12px",
          color: theme === "light" ? "#000000" : "#CFCFCF",
          fontWeight: 600,
        },
      },
      labels: {
        show: true,
        style: {
          colors: theme === "light" ? "#000000" : "#CFCFCF",
        },
        formatter: function (val: any) {
          return formatNumber(val);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
      y: {
        formatter: function (val: any) {
          return formatCurrency(val);
        },
      },
    },
  };

  const orderedChart = {
    series: [
      {
        name: "Total Botol",
        data: qtyMonths?.value || [],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        endingShape: "rounded",
      },
    },
    colors: ["#4287f5"],
    dataLabels: {
      formatter: (val: any) => {
        return formatNumber(val);
      },
    },
    stroke: {
      show: true,
      width: 2,
    },
    xaxis: {
      categories: qtyMonths?.month || [],
      labels: {
        show: true,
        style: {
          colors: theme === "light" ? "#000000" : "#CFCFCF",
        },
      },
    },
    yaxis: {
      title: {
        text: "Profit",
        style: {
          fontSize: "12px",
          color: theme === "light" ? "#000000" : "#CFCFCF",
          fontWeight: 600,
        },
      },
      labels: {
        show: true,
        style: {
          colors: theme === "light" ? "#000000" : "#CFCFCF",
        },
        formatter: function (val: any) {
          return formatNumber(val);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
      y: {
        formatter: function (val: any) {
          return formatCurrency(val);
        },
      },
    },
  };
  return (
    <AppWrapper className="pb-24">
      <div className="mt-5">
        <p className="text-xl font-bold">Analytics</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-3">
        <div className="p-3 rounded-md flex justify-between items-center border gap-5">
          <div className="flex flex-col">
            <span className="text-sm">Total Member</span>
            <span className="text-lime-500 font-bold text-xl whitespace-nowrap">{countMemberLoading ? "..." : countMember?.countMember}</span>
          </div>
          <UsersIcon />
        </div>
        <div className="p-3 rounded-md flex justify-between items-center border gap-5">
          <div className="flex flex-col">
            <span className="text-sm">Total Profit Bulan Ini</span>
            <span
              className={cn("font-bold text-xl whitespace-nowrap", {
                "text-destructive": countProfit && countProfit.totalIncome - countProfit.totalOutcome <= 0,
                "text-green-500": countProfit && countProfit.totalIncome - countProfit.totalOutcome > 0,
              })}
            >
              {countProfit ? formatCurrency(countProfit.totalIncome - countProfit.totalOutcome) : "..."}
            </span>
          </div>
          <BanknoteIcon />
        </div>
        <div className="p-3 rounded-md flex justify-between items-center border gap-5">
          <div className="flex flex-col">
            <span className="text-sm">Stok</span>
            <span className="text-destructive font-bold text-xl whitespace-nowrap">{countStockLoading ? "..." : countStock?.totalStock} botol</span>
          </div>
          <Package2Icon />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-3">
        <div className="border rounded-md p-6">
          <span className="font-bold">Jumlah botol terjual 6 bulan terakhir</span>
          <Chart options={orderedChart as ApexOptions} width={"100%"} series={orderedChart.series} type="bar" height={350} />
        </div>
        <div className="border rounded-md p-6">
          <span className="font-bold">Profit 6 bulan terakhir</span>
          <Chart options={profitChart as ApexOptions} width={"100%"} series={profitChart.series} type="bar" height={350} />
        </div>
      </div>
    </AppWrapper>
  );
}
