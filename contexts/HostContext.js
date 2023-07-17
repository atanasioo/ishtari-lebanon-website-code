import { getHost } from "@/functions";
import Cookies from "js-cookie";
import React, { createContext, useEffect, useState } from "react";

export const HostContext = createContext();

export const HostProvider = ({ children }) => {
  const [host, setHost] = useState("");

  useEffect(() => {
    let site_host= window.location.host;
    if(site_host.startsWith("localhost")){
        site_host= Cookies.get("site-local-name");
    }

    getHost(site_host).then((hostUrl) => {
        console.log(hostUrl);
      setHost(hostUrl);
    });
  }, []);

  return (
    <HostContext.Provider value={{ host }}>{children}</HostContext.Provider>
  );
};
