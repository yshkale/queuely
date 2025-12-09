import { Logo } from "./Logo";

export const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4.5 border-b border-neutral-200">
      <Logo />
    </header>
  );
};
