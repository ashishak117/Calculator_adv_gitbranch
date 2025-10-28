export default function Display({ value = "0", expression = "" }) {
  return (
    <div className="display">
      <div className="display-expression" title={expression}>{expression || "\u00A0"}</div>
      <div className="display-value" data-testid="display">{value}</div>
    </div>
  );
}
