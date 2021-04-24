export function Underline({
  children,
  color = "#fff0a3",
  height = "0.8rem",
  bottom = "-0.2rem",
  left = "-0.3rem",
  right = "-0.3rem",
  className = "",
  ...otherProps
}) {
  const _className = `custom-underline ${className}`;
  return (
    <span {...otherProps} className={_className}>
      {children}
      <style jsx>{`
        .custom-underline {
          display: inline-block;
          position: relative;
        }
        .custom-underline::before {
          content: "";
          position: absolute;
          z-index: -1;
          height: ${height};
          bottom: ${bottom};
          left: ${left};
          right: ${right};
          background: ${color};
          transform: rotate(-1deg) skewX(-12deg);
        }
      `}</style>
    </span>
  );
}
