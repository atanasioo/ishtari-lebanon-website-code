import React from 'react'

function TopSearch() {
  return (
    <>
      <input
        type={"text"}
        placeholder={"What are you looking for?"}
        autoComplete="off"
        className="rounded-sm h-11 mx-10 flex flex-grow outline-none p-4 bg-dsearchGrey"
        
      />
    </>
  )
}

export default TopSearch