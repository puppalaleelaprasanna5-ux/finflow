import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold">
        ∞
      </div>

      <span className="text-xl font-bold">
        FinFlow
      </span>
    </Link>
  );
}