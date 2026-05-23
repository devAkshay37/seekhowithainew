"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ComboboxContextValue {
  items: unknown[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSelect?: (value: unknown) => void;
  onChange?: (value: string) => void;
}

const ComboboxContext = React.createContext<ComboboxContextValue | undefined>(undefined);

export function Combobox({ 
  items, 
  children, 
  className,
  value,
  onSelect,
  onChange
}: { 
  items: unknown[], 
  children: React.ReactNode, 
  className?: string,
  value?: string,
  onSelect?: (value: unknown) => void,
  onChange?: (value: string) => void
}) {
  const [searchValue, setSearchValue] = React.useState(value || "");
  const [isOpen, setIsOpen] = React.useState(false);

  // Update local state when value prop changes
  React.useEffect(() => {
    if (value !== undefined) {
      setSearchValue(value);
    }
  }, [value]);

  return (
    <ComboboxContext.Provider value={{ items, searchValue, setSearchValue, isOpen, setIsOpen, onSelect, onChange }}>
      <div className={cn("relative w-full", className)}>{children}</div>
    </ComboboxContext.Provider>
  );
}

export function ComboboxInput({ placeholder, className }: { placeholder?: string, className?: string }) {
  const context = React.useContext(ComboboxContext);
  if (!context) throw new Error("ComboboxInput must be used within a Combobox");

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={context.searchValue}
      onChange={(e) => {
        context.setSearchValue(e.target.value);
        context.setIsOpen(true);
        if (context.onChange) {
          context.onChange(e.target.value);
        } else if (context.onSelect) {
          context.onSelect(e.target.value);
        }
      }}
      onFocus={() => context.setIsOpen(true)}
      onBlur={() => {
        // Delay closing to allow clicking items
        setTimeout(() => context.setIsOpen(false), 200);
      }}
      className={cn(
        "w-full px-4 pt-4 pb-5 text-base text-[#0F0F1A] bg-transparent outline-none autofill:bg-transparent",
        className
      )}
    />
  );
}

export function ComboboxContent({ children }: { children: React.ReactNode }) {
  const context = React.useContext(ComboboxContext);
  if (!context) throw new Error("ComboboxContent must be used within a Combobox");

  const filteredItems = context.items.filter((item) =>
    String(item).toLowerCase().includes(context.searchValue.toLowerCase())
  );

  if (!context.isOpen || filteredItems.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-50 w-full mt-1 bg-white border border-[#E0E0EC] rounded-xl shadow-lg max-h-60 overflow-auto no-scrollbar"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function ComboboxList({ children }: { children: (item: unknown) => React.ReactNode }) {
  const context = React.useContext(ComboboxContext);
  if (!context) throw new Error("ComboboxList must be used within a Combobox");

  const filteredItems = context.items.filter((item) =>
    String(item).toLowerCase().includes(context.searchValue.toLowerCase())
  );

  if (filteredItems.length === 0) return null;

  return <div className="py-1">{filteredItems.map(children)}</div>;
}

export function ComboboxItem({ value, children, className }: { value: unknown, children: React.ReactNode, className?: string }) {
  const context = React.useContext(ComboboxContext);
  if (!context) throw new Error("ComboboxItem must be used within a Combobox");

  return (
    <div
      onClick={() => {
        context.setSearchValue(String(value));
        if (context.onSelect) context.onSelect(value);
        context.setIsOpen(false);
      }}
      className={cn(
        "px-4 py-2.5 text-sm hover:bg-orange-50 text-[#0F0F1A] cursor-pointer transition-colors border-b border-gray-50 last:border-0",
        className
      )}
    >
      {children}
    </div>
  );
}
