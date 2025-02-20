"use client";

export default function LinkPage() {
  const id = window.location.pathname.split("/").pop() || "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        hello3 {id}
      </div>
    </main>
  );
}
