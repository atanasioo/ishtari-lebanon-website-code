import { HostContext } from "@/contexts/HostContext";
import Cookies from "js-cookie";
import { useContext } from "react";

function PointsLoader() {
  const { host } = useContext(HostContext);
  var mystyle = {};
  if (
    Cookies.get("site-local-name") === "flo" ||
    host === "www.flo-lebanon.com"
  ) {
    mystyle = {
      backgroundColor: "#FF681F",
    };
  } else if (
    Cookies.get("site-local-name") === "aalbeit" ||
    host === "www.aalbeit.com"
  ) {
    mystyle = {
      backgroundColor: "#04A59C",
    };
  } else {
    mystyle = {
      backgroundColor: "#bf1b26",
    };
  }

  return (
    <div className="text-center w-full">
      <div className="ldds-ellipsis text-dbase">
        <div style={mystyle}></div>
        <div style={mystyle}></div>
        <div style={mystyle}></div>
        <div style={mystyle}></div>
      </div>
    </div>
  );
}

export default PointsLoader;
