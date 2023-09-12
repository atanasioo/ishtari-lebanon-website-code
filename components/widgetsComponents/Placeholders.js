import { useRouter } from "next/router";

function SlideshowPlaceholder({ width, height, alt }) {
  const router = useRouter();
  const catalog =
    router.asPath.startsWith("/category") ||
    router.asPath.includes("c=") ||
    router.asPath.startsWith("/seller") ||
    router.asPath.includes("s=") ||
    router.asPath.startsWith("/manufacturer") ||
    router.asPath.includes("m=")
      ? true
      : false;
  return (
    <img
      src="/images/placeholder_slideshow.png"
      width={width && !catalog ? width : 1000}
      height={height ? height : 270}
      alt={alt}
    />
  );
}
function SquarePlaceholder({ width, height, alt }) {
  const router = useRouter();
  const catalog =
    router.asPath.startsWith("/category") ||
    router.asPath.includes("c=") ||
    router.asPath.startsWith("/seller") ||
    router.asPath.includes("s=") ||
    router.asPath.startsWith("/manufacturer") ||
    router.asPath.includes("m=")
      ? true
      : false;
  return (
    <img
      src="/images/product_placeholder_square.png"
      width={width && !catalog ? width : 160}
      height={height ? height : 160}
      alt={alt}
    />
  );
}

export { SlideshowPlaceholder, SquarePlaceholder };
