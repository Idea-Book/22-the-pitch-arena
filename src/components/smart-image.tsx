import { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/lib/media";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  /** Raw DB value: absolute URL, storage path, or legacy /media path. */
  src?: string | null;
  /** Local bundled asset used when src is empty or fails to load. */
  fallback: string;
};

/**
 * Image that never shows a broken icon: resolves any CMS value through the
 * media pipeline and swaps to the bundled fallback on load failure.
 */
export function SmartImage({ src, fallback, alt = "", ...rest }: Props) {
  const resolved = resolveMediaUrl(src) ?? fallback;
  const [current, setCurrent] = useState(resolved);

  useEffect(() => setCurrent(resolved), [resolved]);

  return (
    <img
      {...rest}
      alt={alt}
      src={current}
      loading={rest.loading ?? "lazy"}
      onError={(e) => {
        if (current !== fallback) {
          console.warn(`[media] failed to load "${current}" — falling back`, { src });
          setCurrent(fallback);
        }
        rest.onError?.(e);
      }}
    />
  );
}
