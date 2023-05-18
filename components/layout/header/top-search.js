import React from 'react'

function TopSearch() {
  return (
    <>
      <input
        type={"text"}
        placeholder={"What are you looking for?"}
        autoComplete="off"
        className="bg-white rounded-sm h-11 mx-10 flex flex-grow outline-none p-4"
        style={{backgroundColor: "#f4f4f4"}}
      />
    </>
  )
}

export default TopSearch