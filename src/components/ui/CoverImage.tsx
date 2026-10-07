import Image from "next/image";
import { BrandCover } from "./BrandCover";

/**
 * Image area with a fixed aspect ratio set by the parent (className). Falls back to the branded
 * cover when there is no image, so cards and pages never show an empty box.
 */
export function CoverImage({
  src,
  alt,
  sizes,
  eager = false,
  className = "",
}: {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  /** Above-the-fold images: load immediately with high priority. */
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-primary-soft ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          unoptimized={src.endsWith(".svg")}
          className="object-cover"
        />
      ) : (
        <BrandCover label={alt} />
      )}
    </div>
  );
}
