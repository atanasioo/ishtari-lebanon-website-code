import Cookies from "js-cookie";

function PointsLoader() {
    var mystyle = {};
    if (
      Cookies.get("site-local-name") === "flo" ||
      window.config["host"] === "www.flo-lebanon.com"
    ) {
      mystyle = {
        backgroundColor: "#FF681F"
      };
    } else if (
      Cookies.get("site-local-name") === "aalbeit" ||
      window.config["host"] === "www.aalbeit.com"
    ) {
      mystyle = {
        backgroundColor: "#04A59C"
      };
    } else {
      mystyle = {
        backgroundColor: "#bf1b26"
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
  