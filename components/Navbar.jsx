'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HousePlus, Menu } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between bg-white shadow-md">
      <div className="flex items-center gap-2 text-2xl font-bold text-black">
        <HousePlus className="w-6 h-6" />
        <Link href="/">Rentora</Link>
      </div>


      <div className="hidden md:flex space-x-4">
        {!user ? (
          <>
            <Link href="/signin">
              <button className="px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={() => signOut()}
            className="px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition"
          >
            Sign Out
          </button>
        )}
      </div>


      <div className="md:hidden">
        <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
          <DrawerTrigger asChild>
            <button>
              <Menu className="w-6 h-6" />
            </button>
          </DrawerTrigger>

          <DrawerContent className="p-6">
            <DrawerHeader>
              <DrawerTitle className="sr-only">Menu</DrawerTitle>
            </DrawerHeader>

            <div className="flex flex-col divide-y divide-gray-300 mt-2">
              {!user ? (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setIsOpen(false)}
                    className="py-2 text-lg font-medium text-black"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="py-2 text-lg font-medium text-black"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="py-2 text-lg font-medium text-black text-left"
                >
                  Sign Out
                </button>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
