
function DownloadAppImg(props) {
  return (
    <div>
        { props.host_url === "https://www.ishtari.com" && (
          <img
            style={{ marginTop: "-1px" }}
            src={"/images/download.gif"}
            alt="download-app"
            className="cursor-pointer mobile:hidden"
            onClick={() =>
              (window.location.href = "https://www.ishtari.com/app")
            }
          />
        )}
        {props.host_url === "https://www.ishtari.com.gh" && (
          <img
            style={{ marginTop: "-1px" }}
            src={"/images/download.gif"}
            alt="download-app"
            className="cursor-pointer mobile:hidden"
            onClick={() =>
              (window.location.href = "https://www.ishtari.com.gh/app")
            }
          />
        )}
    </div>
  )
}

export default DownloadAppImg