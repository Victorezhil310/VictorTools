"use client";

import React, { useState, useEffect } from "react";
import { ArrowRightLeft } from "lucide-react";

type Category = "length" | "weight" | "temperature";

const unitLabels: Record<Category, Record<string, string>> = {
  length: {
    m: "Meters (m)",
    km: "Kilometers (km)",
    ft: "Feet (ft)",
    in: "Inches (in)",
    cm: "Centimeters (cm)",
    mi: "Miles (mi)",
  },
  weight: {
    kg: "Kilograms (kg)",
    g: "Grams (g)",
    lb: "Pounds (lb)",
    oz: "Ounces (oz)",
  },
  temperature: {
    C: "Celsius (°C)",
    F: "Fahrenheit (°F)",
    K: "Kelvin (K)",
  },
};

// Conversions mapping to base unit (length: meter, weight: gram)
const lengthRatios: Record<string, number> = {
  m: 1,
  km: 1000,
  ft: 0.3048,
  in: 0.0254,
  cm: 0.01,
  mi: 1609.344,
};

const weightRatios: Record<string, number> = {
  kg: 1000,
  g: 1,
  lb: 453.59237,
  oz: 28.349523,
};

export default function UnitConverterTool() {
  const [category, setCategory] = useState<Category>("length");
  const [inputValue, setInputValue] = useState("1");
  const [inputUnit, setInputUnit] = useState("m");
  const [outputValue, setOutputValue] = useState("");
  const [outputUnit, setOutputUnit] = useState("ft");

  const convert = () => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) {
      setOutputValue("");
      return;
    }

    if (category === "length") {
      const valueInMeters = num * lengthRatios[inputUnit];
      const result = valueInMeters / lengthRatios[outputUnit];
      setOutputValue(result.toFixed(6).replace(/\.?0+$/, ""));
    } else if (category === "weight") {
      const valueInGrams = num * weightRatios[inputUnit];
      const result = valueInGrams / weightRatios[outputUnit];
      setOutputValue(result.toFixed(6).replace(/\.?0+$/, ""));
    } else if (category === "temperature") {
      let valueInC = num;
      if (inputUnit === "F") {
        valueInC = (num - 32) * (5 / 9);
      } else if (inputUnit === "K") {
        valueInC = num - 273.15;
      }

      let result = valueInC;
      if (outputUnit === "F") {
        result = valueInC * (9 / 5) + 32;
      } else if (outputUnit === "K") {
        result = valueInC + 273.15;
      }
      setOutputValue(result.toFixed(4).replace(/\.?0+$/, ""));
    }
  };

  useEffect(() => {
    // Reset units when category changes
    const defaultUnits: Record<Category, { input: string; output: string }> = {
      length: { input: "m", output: "ft" },
      weight: { input: "kg", output: "lb" },
      temperature: { input: "C", output: "F" },
    };
    setInputUnit(defaultUnits[category].input);
    setOutputUnit(defaultUnits[category].output);
  }, [category]);

  useEffect(() => {
    convert();
  }, [inputValue, inputUnit, outputUnit, category]);

  const swapUnits = () => {
    const temp = inputUnit;
    setInputUnit(outputUnit);
    setOutputUnit(temp);
    setInputValue(outputValue);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Category selector */}
      <div className="flex bg-muted/40 rounded-xl p-1 gap-1">
        {(["length", "weight", "temperature"] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-1 text-center rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              category === cat ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-9 items-center gap-4 pt-4">
        {/* Left Side */}
        <div className="sm:col-span-4 space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            From
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background transition-all"
          />
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-semibold outline-none focus:border-primary"
          >
            {Object.entries(unitLabels[category]).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="sm:col-span-1 flex justify-center pt-5">
          <button
            onClick={swapUnits}
            className="p-3 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm"
          >
            <ArrowRightLeft className="h-4.5 w-4.5 rotate-90 sm:rotate-0" />
          </button>
        </div>

        {/* Right Side */}
        <div className="sm:col-span-4 space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            To
          </label>
          <input
            type="text"
            readOnly
            value={outputValue}
            className="h-11 w-full rounded-xl border border-border bg-muted/30 px-3.5 text-sm font-semibold text-foreground outline-none select-all"
          />
          <select
            value={outputUnit}
            onChange={(e) => setOutputUnit(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-semibold outline-none focus:border-primary"
          >
            {Object.entries(unitLabels[category]).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
