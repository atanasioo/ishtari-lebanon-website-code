import React, { useContext } from "react";
import { AccountContext } from "@/contexts/AccountContext";

function HeaderOverlay(props) {
  const { local } = props;
  const [state] = useContext(AccountContext);
  return (
    <div
      className="fixed h-full  -z-10 w-full top-0 left-0 bg-dblackOverlay"
  
    ></div>
  );
}

function FullOverlay({children, z}) {
  const zIndex = z ? z : 20;
  return (
    <div
      className={`fixed z-${zIndex} w-full h-screen left-0 bottom-0 top-0 bg-dblackOverlay `}
    >
      {children}
    </div>
  );
}

export { HeaderOverlay, FullOverlay };
