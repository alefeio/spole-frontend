import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  /** compact — header; default — auth; large — hero opcional */
  size?: "compact" | "default" | "large";
  className?: string;
  priority?: boolean;
};

const sizeClasses = {
  compact: "h-8 w-auto max-w-[9.5rem] sm:h-9 sm:max-w-[11rem]",
  default: "h-10 w-auto max-w-[12rem] sm:h-11 sm:max-w-[13rem]",
  large: "h-12 w-auto max-w-[14rem] sm:h-14 sm:max-w-[16rem]"
};

export function BrandLogo({
  href = "/",
  size = "compact",
  className,
  priority = false
}: BrandLogoProps) {
  const image = (
    <Image
      src="/logo_h.png"
      alt="Spolê"
      width={320}
      height={80}
      priority={priority}
      className={cn("object-contain object-left", sizeClasses[size], className)}
    />
  );

  if (!href) {
    return <span className="inline-flex shrink-0 items-center">{image}</span>;
  }

  return (
    <Link
      href={href}
      className="focus-visible:ring-ring inline-flex shrink-0 items-center rounded-md focus-visible:ring-[3px] focus-visible:outline-none"
    >
      {image}
    </Link>
  );
}
