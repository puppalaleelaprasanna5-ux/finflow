import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-900 font-bold dark:border-white">
        ∞
      </div>

      <span className="text-xl font-bold tracking-tight">
        FinFlow
      </span>
    </Link>
  );
}