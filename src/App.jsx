import { useState } from "react";
import Display from "./components/Display";
import Keypad from "./components/Keypad";

/**
 * Utility: clamp to reasonable string without trailing junk.
 */
function formatNumber(num) {
  if (!isFinite(num)) return "Error";
  // Avoid "-0"
  const fixed = Number(num.toPrecision(12));
  let str = String(fixed);
  // Ensure max length & remove trailing zeros for decimals
  if (str.includes(".")) {
    // trim trailing zeros
    str = str.replace(/(\.\d*?[1-9])0+$/,"$1").replace(/\.$/, "");
  }
  // limit display length sensibly
  if (str.length > 16) {
    // fallback to exponential
    str = Number(fixed).toExponential(8).replace(/\+?0*(\d+)$/,"$1");
  }
  return str;
}

/**
 * Evaluate tokens with operator precedence (×, ÷ before +, -).
 * tokens = [num, op, num, op, num, ...] where op in + - × ÷
 */
function evaluateTokens(tokens) {
  if (tokens.length === 0) return 0;

  // Map symbols
  const opsMap = { "×": "*", "÷": "/", "+": "+", "-": "-" };
  const mapped = tokens.map(t => opsMap[t] ?? t);

  // First pass: * and /
  const pass1 = [];
  for (let i = 0; i < mapped.length; i++) {
    const t = mapped[i];
    if (t === "*" || t === "/") {
      const a = Number(pass1.pop());
      const b = Number(mapped[++i]);
      const v = t === "*" ? a * b : a / b;
      pass1.push(v);
    } else {
      pass1.push(t);
    }
  }

  // Second pass: + and -
  let acc = Number(pass1[0]);
  for (let i = 1; i < pass1.length; i += 2) {
    const op = pass1[i];
    const b = Number(pass1[i + 1]);
    if (op === "+") acc += b;
    else if (op === "-") acc -= b;
  }

  return acc;
}

export default function App() {
  // What’s on the big display
  const [current, setCurrent] = useState("0");
  // Small expression line (e.g., "12 × 3 +")
  const [expression, setExpression] = useState("");
  // Internal token list for evaluation
  const [tokens, setTokens] = useState([]); // e.g., ["12", "×", "3"]
  // Track if we just pressed "="; affects what the next number does
  const [justEvaluated, setJustEvaluated] = useState(false);
  // Track last input category
  const [lastType, setLastType] = useState(null); // 'digit' | 'op' | 'equals' | 'percent' | 'sign' | 'dot' | 'ac'

  const updateExpressionFromTokens = (extra = "") => {
    const e = (tokens.join(" ") + (extra ? " " + extra : "")).trim();
    setExpression(e);
  };

  const inputDigit = (d) => {
    if (justEvaluated) {
      // Start a new calculation
      setTokens([]);
      setExpression("");
      setCurrent(d);
      setJustEvaluated(false);
      setLastType("digit");
      return;
    }
    setCurrent((prev) => (prev === "0" ? d : prev + d));
    setLastType("digit");
  };

  const inputDot = () => {
    if (justEvaluated) {
      setTokens([]);
      setExpression("");
      setCurrent("0.");
      setJustEvaluated(false);
      setLastType("dot");
      return;
    }
    setCurrent((prev) => (prev.includes(".") ? prev : prev + "."));
    setLastType("dot");
  };

  const toggleSign = () => {
    setCurrent((prev) => {
      if (prev === "0") return "0";
      return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
    });
    setLastType("sign");
  };

  const percent = () => {
    // Simple calculator behavior: turn current into percentage of 1
    setCurrent((prev) => {
      const v = Number(prev);
      if (!isFinite(v)) return "0";
      return formatNumber(v / 100);
    });
    setLastType("percent");
  };

  const clearAll = () => {
    setCurrent("0");
    setExpression("");
    setTokens([]);
    setJustEvaluated(false);
    setLastType("ac");
  };

  const inputOperator = (op) => {
    // If we just evaluated, start new expression with result
    if (justEvaluated) {
      setTokens([current, op]);
      setJustEvaluated(false);
      setLastType("op");
      setExpression(`${current} ${op}`);
      setCurrent("0");
      return;
    }

    // If last was op, replace it (user changed mind)
    if (lastType === "op" && tokens.length > 0) {
      const newTokens = [...tokens];
      newTokens[newTokens.length - 1] = op;
      setTokens(newTokens);
      setLastType("op");
      updateExpressionFromTokens();
      return;
    }

    // Normal case: push current then operator
    const pushable = lastType === "digit" || lastType === "dot" || lastType === "percent" || lastType === "sign" || expression === "";
    const newTokens = [...tokens];
    if (pushable) newTokens.push(current);
    newTokens.push(op);
    setTokens(newTokens);
    setCurrent("0");
    setLastType("op");
    updateExpressionFromTokens();
  };

  const equals = () => {
    // If we press "=" without a new number after an operator, try to complete with current
    let work = [...tokens];
    if (lastType !== "op") {
      work.push(current);
    } else {
      // Trailing operator: ignore it
      work = work.slice(0, -1);
    }

    if (work.length === 0) {
      setJustEvaluated(true);
      setLastType("equals");
      return;
    }

    const result = evaluateTokens(work.map(x => (typeof x === "string" ? x : String(x))));
    const formatted = formatNumber(result);

    setExpression(work.join(" ") + " =");
    setCurrent(formatted);
    setTokens([]);
    setJustEvaluated(true);
    setLastType("equals");
  };

  const handleKey = (label) => {
    if (/^\d$/.test(label)) {
      inputDigit(label);
      return;
    }
    switch (label) {
      case "AC":
        clearAll();
        break;
      case ".":
        inputDot();
        break;
      case "+/-":
        toggleSign();
        break;
      case "%":
        percent();
        break;
      case "+":
      case "-":
      case "×":
      case "÷":
        inputOperator(label);
        break;
      case "=":
        equals();
        break;
      default:
        // no-op
        break;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Calculator</h1>
        <p className="sub">Git Flow Demo – Logic Stage</p>
      </header>

      <main className="main">
        <div className="calculator">
          <Display value={current} expression={expression} />
          <Keypad onKey={handleKey} />
        </div>
      </main>

      <footer className="footer">
        <small>Vite + React • Logic v0.3.0</small>
      </footer>
    </div>
  );
}
