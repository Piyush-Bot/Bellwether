export function statusVerification(status) {
  const icons =
    status?.picFrontStatus || status?.picBackStatus == "rejected"
      ? "fa fa-times"
      : status?.picFrontStatus && status?.picBackStatus == "approved"
      ? "fa fa-check"
      : "fa fa-clock-o";
  return (
    <div className="text-center">
      <i
        className={icons}
        style={{
          fontSize: "1.4rem",
          color:
            status?.picFrontStatus || status?.picBackStatus == "rejected"
              ? "#be0a0a"
              : status?.picFrontStatus && status?.picBackStatus == "approved"
              ? "green"
              : "orange",
        }}
      ></i>
    </div>
  );
}
