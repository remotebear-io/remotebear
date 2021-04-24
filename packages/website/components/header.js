import { useRouter } from "next/router";
import Link from "./link";
import { Logo } from "./logo";

export default function Header() {
  const links = [
    { href: "/", label: "Jobs" },
    {
      href: "/companies",
      label: "Companies",
    },
    { href: "/about", label: "About" },
  ];
  return (
    <header className="flex mt-2 sm:mt-4 justify-between">
      <Link
        href="/"
        className="flex items-center font-serif font-semibold text-2xl text-gray-500 justify-self-center"
      >
        <Logo className="w-8 h-8 rounded-md mr-2" />
        <h2>remotebear</h2>
      </Link>
      <div className="flex flex-col md:flex-row items-end">
        {links.map(({ href, label, onClick }, index) => (
          <HeaderLink
            key={href}
            href={href}
            label={label}
            onClick={onClick}
            last={index === links.length - 1}
          />
        ))}
      </div>
    </header>
  );
}

function HeaderLink({ href, label, onClick, last }) {
  const router = useRouter();
  const isActive =
    href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`flex items-center text-lg text-gray-500 justify-self-center hover:underline font-medium ${
        isActive ? "underline" : ""
      } ${last ? "" : "md:mr-4"}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
