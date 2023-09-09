import React, { useContext } from "react";
import { AccountContext } from "@/contexts/AccountContext";

function HeaderOverlay(props) {
  const { local } = props;
  const [state] = useContext(AccountContext);
  return (
    <div
      className="absolute z-20 w-full left-0 bg-dblackOverlay"
      style={{
        top:
          !local && !state?.admin
            ? "137px"
            : local && state?.admin
            ? "250px"
            : !local && state?.admin
            ? "185px"
            : "200px",
            height: "200vh"
      }}
    ></div>
  );
}

function FullOverlay({children, z}) {
  const zIndex = z ? z : 10;
  return (
    <div
      className={`fixed z-${zIndex} w-full h-screen left-0 bottom-0 top-0 bg-dblackOverlay `}
    >
      {children}
    </div>
  );
}

export { HeaderOverlay, FullOverlay };
