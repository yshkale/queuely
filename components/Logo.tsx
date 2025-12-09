import localFont from "next/font/local";

const logoFont = localFont({
  src: "../app/fonts/Queuely-serif.ttf",
});

export const Logo = () => {
  return (
    <h1 className={`${logoFont.className} text-2xl tracking-tight text-black`}>
      Queuely
    </h1>
  );
};
