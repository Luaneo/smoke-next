"use client";
import { useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Hello, world!</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Счёт: {count}
      </button>
    </div>
  );
}
