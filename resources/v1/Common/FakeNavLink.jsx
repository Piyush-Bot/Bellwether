import React from "react";
import { useRouteMatch } from "react-router-dom";

export const FakeNavLink = ({
  children,
  to,
  className = "",
  style = {},
  activeClassName = "active",
  basename = "",
  activeStyle = {},
  exact,
  strict,
}) => {
  const active = useRouteMatch({ path: to, exact, strict });
  let styleObj = style;
  if (active) {
    styleObj = { ...styleObj, ...activeStyle };
  }
  return (
    <a
      href={basename + to}
      className={className + (active ? ` ${activeClassName}` : "")}
      style={styleObj}
    >
      {children}
    </a>
  );
};
