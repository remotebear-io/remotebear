import Link from "./link";

export function Button({ className, disabled, href, onClick, ...otherProps }) {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick();
  };
  const baseClassName =
    "flex items-center md:text-lg rounded-md shadow-md bg-blue-500 text-white px-6 py-1";
  const opacityClassName = disabled
    ? "opacity-60"
    : "opacity-1 hover:bg-blue-400";
  const cursorClassName = disabled ? "cursor-default" : "cursor-pointer";
  const _className = [
    baseClassName,
    opacityClassName,
    cursorClassName,
    className,
  ].join(" ");
  return href ? (
    <a
      href={disabled ? undefined : href}
      className={_className}
      onClick={handleClick}
      {...otherProps}
    />
  ) : (
    <button className={_className} onClick={handleClick} {...otherProps} />
  );
}

export function GetInTouchButton({
  className,
  uppercaseFirst,
  hideIcon,
  ...otherProps
}) {
  return (
    <Link
      href="mailto:info@remotebear.io"
      className={`${"text-blue-600 font-medium hover:underline cursor-pointer"}${className}`}
      {...otherProps}
    >
      <>{uppercaseFirst ? "G" : "g"}et in touch</>
      {!hideIcon && (
        <>
          &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="inline-block w-5 h-5 align-text-bottom"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </>
      )}
    </Link>
  );
}
