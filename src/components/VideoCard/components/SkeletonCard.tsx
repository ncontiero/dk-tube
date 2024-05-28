import type { VideoCardVariant } from "../types";

interface SkeletonCardProps {
  readonly variant?: VideoCardVariant;
}

function SkeletonThumbnail({ variant = "medium" }: SkeletonCardProps) {
  return (
    <div
      className={`z-10 aspect-video size-full ${
        variant === "large" || variant === "largeVertical"
          ? "xs:rounded-xl"
          : "h-24 w-40 xs:rounded-md"
      } animate-pulse bg-zinc-800`}
    >
      {variant === "large" || variant === "largeVertical" ? (
        <div className="h-[200px] w-[360px] rounded-xl" />
      ) : (
        <div className={`mr-0 h-full w-40 rounded-md xs:h-24`} />
      )}
    </div>
  );
}

export function SkeletonCard({ variant = "medium" }: SkeletonCardProps) {
  return (
    <>
      {variant === "large" || variant === "largeVertical" ? (
        <SkeletonThumbnail variant={variant} />
      ) : (
        <div className="z-10 h-52 w-full min-w-[160px] xs:h-24 xs:w-1/2">
          <SkeletonThumbnail variant={variant} />
        </div>
      )}
      <div
        className={`flex w-full gap-3 ${
          variant !== "large" &&
          variant !== "largeVertical" &&
          "mt-4 self-start xs:mt-0.5"
        } px-2 xs:pl-0 xs:pr-6`}
      >
        {(variant === "large" || variant === "largeVertical") && (
          <div className="mt-3">
            <span className="relative z-10 flex size-9 rounded-full">
              <span className="aspect-square size-full animate-pulse rounded-full bg-zinc-800 object-cover" />
            </span>
          </div>
        )}
        <div className="flex w-3/4 flex-col">
          <span
            className={`z-10 mb-2 h-6 w-full animate-pulse bg-zinc-800 ${
              (variant === "large" || variant === "largeVertical") && "mt-3"
            }`}
          />
          <span className="z-10 h-6 w-4/5 animate-pulse bg-zinc-800 opacity-60" />
        </div>
      </div>
    </>
  );
}
