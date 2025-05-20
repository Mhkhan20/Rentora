'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/signup");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Welcome to Rentora</h1>
      <Button onClick={handleClick}>Get Started</Button>
    </main>
  );
}
