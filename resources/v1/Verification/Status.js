import ReactTooltip from "react-tooltip";

export function statusVerification(status) {
  const icons =
    status?.picFrontStatus == 347
      ? "fa fa-times"
      : status?.picFrontStatus == 346
      ? "fa fa-check"
      : "fa fa-clock-o";
  return (
    <div
      className="text-center"
      data-tip={
        status?.picFrontStatus == 347
          ? "Rejected"
          : status?.picFrontStatus == 346
          ? "Approved"
          : "Pending"
      }
    >
      <i
        className={icons}
        style={{
          fontSize: "1.4rem",
          color:
            status?.picFrontStatus == 347
              ? "#be0a0a"
              : status?.picFrontStatus == 346
              ? "green"
              : "orange",
        }}
      ></i>
      <ReactTooltip place="top" type="dark" />
    </div>
  );
}
