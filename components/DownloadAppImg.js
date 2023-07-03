import React from 'react'
import useDeviceSize from './useDeviceSize';

function DownloadAppImg() {
    const [width] = useDeviceSize();
  return (
    <div>
        { width < 650 && window.config["site-url"] === "https://www.ishtari.com" && (
          <img
            style={{ marginTop: "-1px" }}
            src={"/images/download.gif"}
            alt="download-app"
            className="cursor-pointer"
            onClick={() =>
              (window.location.href = "https://www.ishtari.com/app")
            }
          />
        )}
        {width < 650 && window.config["site-url"] === "https://www.ishtari.com.gh" && (
          <img
            style={{ marginTop: "-1px" }}
            src={"/images/download.gif"}
            alt="download-app"
            className="cursor-pointer"
            onClick={() =>
              (window.location.href = "https://www.ishtari.com.gh/app")
            }
          />
        )}
    </div>
  )
}

export default DownloadAppImg