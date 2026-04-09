"use client";
import VariablesProvider from "@/app/context/VariablesContext";
import { AuthProvider } from "@/app/context/AuthContext";
import { NotificationProvider } from "@/app/context/NotificationContext";
import { User } from "@/lib/types/auth";
import React, { ReactNode } from "react";
import { CartProvider } from "@/app/context/CartContext";

interface props {
  children: ReactNode;
  initialUser: User | null;
}

export default function ClientLayout({ children, initialUser }: props) {
  return (
    <>
      <VariablesProvider>
        <AuthProvider initialUser={initialUser}>
          <NotificationProvider>
            <CartProvider>{children}</CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </VariablesProvider>
    </>
  );
}
