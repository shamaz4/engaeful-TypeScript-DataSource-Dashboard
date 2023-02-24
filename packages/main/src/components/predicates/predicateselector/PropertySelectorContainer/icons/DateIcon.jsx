
export default function DateIcon() {
    return(
<svg-icon 
  style={{
    display: "inline-block",
    height: 20,
    minHeight: 20,
    minWidth: 20,
    position: "relative",
    width: 20,
    top: -2,
  }}
icon="type-date">
  <svg 
    style={{
      marginRight: "0px",
      width: "unset",
      height: "unset"   
  }}
  fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path
      d="M5 9.5V17a1 1 0 001 1h10a1 1 0 001-1V9.5m-12 0V7a1 1 0 011-1h10a1 1 0 011 1v2.5m-12 0h12"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M8 4v2M14 4v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
</svg-icon>

    )
}