import React from "react";

function TopSearch() {
  return (
    <>
      <div className="relative flex justify-center lg:flex-grow">
        <input
          type={"text"}
          placeholder={"What are you looking for?"}
          autoComplete="off"
          className="hidden lg:block rounded-sm h-11  w-11/12  outline-none p-4 bg-dsearchGrey "
        />
      </div>
    </>
  );
}

export default TopSearch;
