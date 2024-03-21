"use client";

import AppWrapper from "@/components/app-wrapper";
import { ApexOptions } from "apexcharts";
import { BanknoteIcon, Package2Icon, UsersIcon } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Home() {
  const { theme } = useTheme();
  const valueChart = {
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58],
      },
      // {
      //   name: "Revenue",
      //   data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      // },
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
      total: {
        enabled: true,
        style: {
          fontSize: "13px",
          fontWeight: 900,
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      labels: {
        show: true,
        style: {
          colors: theme === "light" ? "#000000" : "#CFCFCF",
        },
      },
    },
    yaxis: {
      title: {
        text: "Total Botol",
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
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return "$ " + val + " thousands";
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
            <span className="text-destructive font-bold text-xl whitespace-nowrap">10</span>
          </div>
          <UsersIcon />
        </div>
        <div className="p-3 rounded-md flex justify-between items-center border gap-5">
          <div className="flex flex-col">
            <span className="text-sm">Total Profit Bulan Ini</span>
            <span className="text-destructive font-bold text-xl whitespace-nowrap">10</span>
          </div>
          <BanknoteIcon />
        </div>
        <div className="p-3 rounded-md flex justify-between items-center border gap-5">
          <div className="flex flex-col">
            <span className="text-sm">Stok</span>
            <span className="text-destructive font-bold text-xl whitespace-nowrap">10 botol</span>
          </div>
          <Package2Icon />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-3">
        <div className="border rounded-md p-6">
          <span className="font-bold">Jumlah botol terjual 4 bulan terakhir</span>
          <Chart options={valueChart as ApexOptions} width={"100%"} series={valueChart.series} type="bar" height={350} />
        </div>
        <div className="border rounded-md p-6">
          <span className="font-bold">Profit 4 bulan terakhir</span>
          <Chart options={valueChart as ApexOptions} width={"100%"} series={valueChart.series} type="bar" height={350} />
        </div>
      </div>
    </AppWrapper>
  );
}
