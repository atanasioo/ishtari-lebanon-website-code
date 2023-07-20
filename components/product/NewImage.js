import { HostContext } from "@/contexts/HostContext";
import React, { useContext } from "react";

function NewImage() {
  const host = useContext(HostContext);

  return (
    <div>
      {host !== "https://www.ishtari.com.gh" && (
          <img
            src={"/images/new-1.png"}
            className="absolute z-10 h-5 "
            alt="New product"
            width={42}
            height={20}
          />
        )}
    </div>
  );
}

export default NewImage;
