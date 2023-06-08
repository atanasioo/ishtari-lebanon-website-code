export default function SmallArrows({ direction, onClick, style, className }) {
  return (
    <div
      style={{
        ...style,
        background: "linear-gradient(white 30%, rgba(255, 255, 255, 0) 100%)",
      }}
      onClick={onClick}
      className={`${className} absolute z-10 hidden sm:flex items-center ${
        direction === "u"
          ? "top-0 justify-center left-0"
          : "-bottom-3 rotate-180 left-0 justify-center"
      }  w-full h-5 text-center  cursor-pointer  `}
    >
      <svg
        width={351}
        height={157}
        viewBox="0 0 351 157"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`arrow ${direction === "u" ? "top-0" : "-bottom-0 "}`}
        style={{
          background: "linear-gradient(white 30%, rgba(255, 255, 255, 0) 100%)",
        }}
      >
        <path
          d="M188.019 4.15367C181.198 -1.38456 169.802 -1.38456 162.964 4.15367L5.18116 131.94C-1.72705 137.549 -1.72705 146.646 5.18116 152.241C12.0894 157.85 23.3101 157.85 30.2183 152.241L175.499 34.6057L320.763 152.255C327.688 157.864 338.892 157.864 345.817 152.255C352.726 146.646 352.726 137.549 345.817 131.954L188.019 4.15367Z"
          fill="black"
        ></path>
      </svg>
    </div>
  );
}
