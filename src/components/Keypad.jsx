import Button from "./Button";

export default function Keypad({ onKey }) {
  const mk = (label, type = "key", wide = false) => (
    <Button key={label} label={label} type={type} wide={wide} onClick={() => onKey?.(label)} />
  );

  return (
    <div className="keypad">
      {/* Top row */}
      {mk("AC", "func")}
      {mk("+/-", "func")}
      {mk("%", "func")}
      {mk("÷", "op")}

      {/* Row 2 */}
      {mk("7")} {mk("8")} {mk("9")} {mk("×", "op")}

      {/* Row 3 */}
      {mk("4")} {mk("5")} {mk("6")} {mk("-", "op")}

      {/* Row 4 */}
      {mk("1")} {mk("2")} {mk("3")} {mk("+", "op")}

      {/* Bottom row */}
      {mk("0", "key", true)}
      {mk(".")}
      {mk("=", "equals")}
    </div>
  );
}
