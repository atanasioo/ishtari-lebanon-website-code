import React from "react";

function NewImage() {
  return (
    <div>
      {window.config["site-url"] !== "https://www.ishtari.com.gh" && (
          <img
            src={"/images/new-1.png"}
            className="absolute z-10 h-5 "
            alt="New product"
          />
        )}
    </div>
  );
}

export default NewImage;
