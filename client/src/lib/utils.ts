import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearsList() {
  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: currentYear - 2019 }, (_, index) => 2020 + index);
  return yearsArray;
}

export function getMonthsList() {
  return Array.from({ length: 12 }, (_, index) => ({
    value: ("0" + (index + 1)).slice(-2),
    name: new Date(0, index).toLocaleString("id-ID", { month: "long" }),
  }));
}

export function getCurrentMonth() {
  const currentMonth = new Date().getMonth() + 1;

  return ("0" + currentMonth).slice(-2);
}
