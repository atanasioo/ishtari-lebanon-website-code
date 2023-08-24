import React from "react";
import { IoMdClose } from "react-icons/io";
import { FullOverlay } from "../Overlay";

function WarrantyPopup(props) {
  const { warranties, handleWarranty, warrantyPlan } = props;
  return (
    <div>
      <FullOverlay />
      <div className="fixed bg-white top-0 left-0 bottom-0 right-0 m-auto z-30 md:z-10 md:w-max h-fit px-3 md:px-10 pt-8 pb-10 rounded-lg" style={{maxWidth: "550px"}}>
        <IoMdClose
          className="absolute z-20 right-2 top-2 w-6 h-6 cursor-pointer"
          onClick={() => handleWarranty("close")}
        />
        <div className="flex flex-col gap-7">
          <p className="pr-semibold text-d22 text-center border-b border-dgreyRate pb-2 text-dblack">
            Warranty: Select a plan
          </p>
          <div className="flex flex-wrap items-center justify-center mt-4 gap-3">
            {warranties?.map((warranty) => (
              <div
                onClick={() => {
                  handleWarranty(
                    warranty.warranty_option_data
                  );
                  handleWarranty("close");
                }}
                key={warranty.warranty_option_data.warranty_option_id}
                className={`border ${
                  Object.keys(warrantyPlan).length > 0 &&
                  warrantyPlan?.warranty_option_id ===
                    warranty.warranty_option_data.warranty_option_id
                    ? "border-dblue border-2"
                    : "border-dgreyProduct"
                }  py-3 px-4 flex flex-col items-center cursor-pointer hover:shadow-md rounded-lg hover:bg-dblueHover hover:text-white transition-all duration-200 `}
              >
                <p className="pr-semibold">
                  {warranty.warranty_option_data.warranty_titles} /{" "}
                  <span className="pr-normal text-sm">
                    {warranty.warranty_option_data.warranty_days} days
                  </span>
                </p>
                <p>${warranty.warranty_option_data.warranty_fees}</p>
              </div>
            ))} 
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarrantyPopup;
