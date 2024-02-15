"use client";
import React from "react";
import { ThemeProvider } from "next-themes";

function ThemeContext({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" themes={["light", "dark"]}>
      {children}
    </ThemeProvider>
  );
}

export default ThemeContext;
