"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
  text?: string;
}

export default function LogoutButton({
  className = "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-medium w-full text-right cursor-pointer",
  showIcon = true,
  text = "خروج از حساب",
}: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button onClick={handleLogout} className={className}>
      {showIcon && <LogOut className="w-4 h-4 shrink-0" />}
      <span>{text}</span>
    </button>
  );
}
