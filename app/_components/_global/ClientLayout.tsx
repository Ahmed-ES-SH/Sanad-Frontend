"use client";
import VariablesProvider from "@/app/context/VariablesContext";
import { AuthProvider } from "@/app/context/AuthContext";
import { User } from "@/lib/types/auth";
import React, { ReactNode } from "react";
import { CartProvider } from "@/app/context/CartContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./QueryClient";
import { NotificationProvider } from "@/app/context/NotificationContext";
import { StripeProvider } from "@/app/providers";

interface props {
  children: ReactNode;
}

export default function ClientLayout({ children }: props) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <VariablesProvider>
            <NotificationProvider>
              <StripeProvider>
                <CartProvider>{children}</CartProvider>
              </StripeProvider>
            </NotificationProvider>
          </VariablesProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
