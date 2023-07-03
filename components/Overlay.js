import React, { useContext } from "react";
import { AccountContext } from "@/contexts/AccountContext";

function HeaderOverlay(props) {
  const { local } = props;
  const [state] = useContext(AccountContext);
  return (
    <div
      className="absolute z-20 w-full h-screen left-0 bg-dblackOverlay"
      style={{
        top:
          !local && !state?.admin
            ? "137px"
            : local && state?.admin
            ? "250px"
            : !local && state?.admin
            ? "185px"
            : "200px",
      }}
    ></div>
  );
}

function FullOverlay(props) {
  const z = props.z ? props.z : 10;
  return (
    <div
      className={`fixed z-${z} w-full h-screen left-0 bottom-0 top-0 bg-dblackOverlay `}
    ></div>
  );
}

export { HeaderOverlay, FullOverlay };
