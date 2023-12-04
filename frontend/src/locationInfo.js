export default function LocationInfo() {
  let capitalize = (s) => {
    return s[0].toUpperCase() + s.slice(1);
  };
  return (
    <div>
      {capitalize(sessionStorage.getItem("role"))}&nbsp;@&nbsp;
      {sessionStorage.getItem("city")}, &nbsp;VA
    </div>
  );
}
