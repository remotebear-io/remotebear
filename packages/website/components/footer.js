import { Link } from "components/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className=" flex mx-4 sm:justify-center py-8 sm:py-8 mt-8 border-gray-200 border-t border-b">
      <div className="sm:max-w-3xl w-full">
        <div className="flex flex-col sm:flex-row w-full sm:justify-between">
          <div className="flex flex-col">
            <div className="flex flex-col mb-4">
              <h3 className="font-serif font-semibold text-xl ">
                <Logo
                  className="w-6 h-6 rounded-md mr-1 inline-block"
                  fill="#374151"
                />{" "}
                remotebear
              </h3>
            </div>
            <p className="text-gray-500 w-64 mb-4">
              The remote jobs aggregator that helps you find&nbsp;work that you
              love.
            </p>
            <Link
              href="https://mmazzarolo.com"
              className="text-gray-500 hover:underline cursor-pointer mb-4"
            >
              © 2021 Mazzarolo Matteo
            </Link>
            <Link
              href="/privacy"
              className="text-gray-500 underline cursor-pointer"
            >
              Terms & Privacy
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row text-gray-700">
            <div className="sm:ml-6 mt-8 sm:mt-0">
              <p className="font-semibold">Links</p>
              <ul className="list-inside list-none pt-4 mb-6">
                <li className="mb-1">
                  <Link href="/" className="hover:underline">
                    Remote jobs
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/companies" className="hover:underline">
                    Remote companies
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/about" className="hover:underline">
                    About us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="sm:ml-6 mt-2 sm:mt-0">
              <p className="font-semibold">Help & Contact</p>
              <ul className="list-inside list-none pt-4 mb-6">
                <li className="mb-1">
                  <Link
                    href="mailto:info@remotebear.io"
                    className="hover:underline"
                  >
                    Email us
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/privacy" className="hover:underline">
                    Terms & Privacy
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="https://twitter.com/remotebear_io"
                    className="hover:underline"
                  >
                    Twitter @remotebear_io
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
