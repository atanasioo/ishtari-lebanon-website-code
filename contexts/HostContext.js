import { getConfig, getHost } from "@/functions";
import Cookies from "js-cookie";
import React, { createContext, useEffect, useState } from "react";

export const HostContext = createContext();

export const HostProvider = ({ children }) => {
  const [host, setHost] = useState("");
  const [config, setConfig] = useState({});

  useEffect(() => {
    let site_host= window.location.host;
    if(site_host.startsWith("localhost")){
        site_host= Cookies.get("site-local-name");
    }

    getHost(site_host).then((hostUrl) => {
      setHost(hostUrl);
    });
    getConfig(site_host).then((config) => {
      setConfig(config);
    })
  }, []);


  return (
    <HostContext.Provider value={{ host, config }}>{children}</HostContext.Provider>
  );
};
