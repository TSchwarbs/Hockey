"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { HollowDepth } from "@/lib/types";

interface BookingState {
  hollow: HollowDepth | null;
  windowId: string | null;
  windowDate: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}

interface BookingContextValue extends BookingState {
  setHollow: (v: HollowDepth) => void;
  setWindow: (id: string, date: string) => void;
  setCustomerFields: (fields: Partial<Pick<BookingState, "customerName" | "customerEmail" | "customerPhone" | "notes">>) => void;
  reset: () => void;
}

const initialState: BookingState = {
  hollow: null,
  windowId: null,
  windowDate: null,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  notes: "",
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setHollow: (hollow) => setState((s) => ({ ...s, hollow })),
        setWindow: (windowId, windowDate) =>
          setState((s) => ({ ...s, windowId, windowDate })),
        setCustomerFields: (fields) => setState((s) => ({ ...s, ...fields })),
        reset: () => setState(initialState),
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
