import { useState } from "react";
import Display from "./components/Display";
import Keypad from "./components/Keypad";

export default function App() {
  const [current, setCurrent] = useState("0");
  const [expression, setExpression] = useState("");

  // For now, just show key presses; real math in next step.
  const handleKey = (label) => {
    // Visual-only behavior:
    // - numbers: append to current
    // - AC: clear
    // - simple ops: append to expression visually
    if (/^\d$/.test(label)) {
      setCurrent((prev) => (prev === "0" ? label : prev + label));
    } else if (label === "AC") {
      setCurrent("0");
      setExpression("");
    } else if (["+", "-", "×", "÷"].includes(label)) {
      setExpression((prev) => (prev ? `${prev} ${label} ` : `${current} ${label} `));
      setCurrent("0");
    } else if (label === ".") {
      setCurrent((prev) => (prev.includes(".") ? prev : prev + "."));
    } else if (label === "+/-") {
      setCurrent((prev) => (prev.startsWith("-") ? prev.slice(1) : prev === "0" ? "0" : "-" + prev));
    } else if (label === "%") {
      // just a visual nudge for now
      setExpression((prev) => `${prev || current}%`);
    } else if (label === "=") {
      // no-op yet; real evaluation in next step
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Calculator</h1>
        <p className="sub">Git Flow Demo – UI Stage</p>
      </header>

      <main className="main">
        <div className="calculator">
          <Display value={current} expression={expression} />
          <Keypad onKey={handleKey} />
        </div>
      </main>

      <footer className="footer">
        <small>Vite + React • UI v0.2.0</small>
      </footer>
    </div>
  );
}
