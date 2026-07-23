"use client";

import { useState, useCallback, useEffect } from "react";
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ToolLayout } from "@/components/tool-layout";

const unitCategories = {
  length: {
    name: "Length",
    units: {
      mm: { name: "Millimeter", toBase: 0.001 },
      cm: { name: "Centimeter", toBase: 0.01 },
      m: { name: "Meter", toBase: 1 },
      km: { name: "Kilometer", toBase: 1000 },
      in: { name: "Inch", toBase: 0.0254 },
      ft: { name: "Foot", toBase: 0.3048 },
      yd: { name: "Yard", toBase: 0.9144 },
      mi: { name: "Mile", toBase: 1609.344 },
    },
  },
  weight: {
    name: "Weight",
    units: {
      mg: { name: "Milligram", toBase: 0.001 },
      g: { name: "Gram", toBase: 1 },
      kg: { name: "Kilogram", toBase: 1000 },
      oz: { name: "Ounce", toBase: 28.3495 },
      lb: { name: "Pound", toBase: 453.592 },
      t: { name: "Tonne", toBase: 1000000 },
    },
  },
  temperature: {
    name: "Temperature",
    units: {
      c: { name: "Celsius", toBase: null as null },
      f: { name: "Fahrenheit", toBase: null as null },
      k: { name: "Kelvin", toBase: null as null },
    },
  },
  volume: {
    name: "Volume",
    units: {
      ml: { name: "Milliliter", toBase: 0.001 },
      l: { name: "Liter", toBase: 1 },
      gal: { name: "US Gallon", toBase: 3.78541 },
      qt: { name: "US Quart", toBase: 0.946353 },
      pt: { name: "US Pint", toBase: 0.473176 },
      cup: { name: "US Cup", toBase: 0.236588 },
      floz: { name: "US Fluid Ounce", toBase: 0.0295735 },
    },
  },
  area: {
    name: "Area",
    units: {
      sqm: { name: "Square Meter", toBase: 1 },
      sqkm: { name: "Square Kilometer", toBase: 1000000 },
      sqft: { name: "Square Foot", toBase: 0.092903 },
      sqyd: { name: "Square Yard", toBase: 0.836127 },
      acre: { name: "Acre", toBase: 4046.86 },
      ha: { name: "Hectare", toBase: 10000 },
    },
  },
  speed: {
    name: "Speed",
    units: {
      ms: { name: "Meters/second", toBase: 1 },
      kmh: { name: "Kilometers/hour", toBase: 0.277778 },
      mph: { name: "Miles/hour", toBase: 0.44704 },
      kn: { name: "Knots", toBase: 0.514444 },
    },
  },
};

type Category = keyof typeof unitCategories;

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  switch (from) {
    case "c": celsius = value; break;
    case "f": celsius = (value - 32) * 5 / 9; break;
    case "k": celsius = value - 273.15; break;
    default: celsius = value;
  }
  switch (to) {
    case "c": return celsius;
    case "f": return celsius * 9 / 5 + 32;
    case "k": return celsius + 273.15;
    default: return celsius;
  }
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [inputValue, setInputValue] = useState("1");
  const [result, setResult] = useState(0);

  const units = unitCategories[category].units;

  useEffect(() => {
    const value = parseFloat(inputValue) || 0;
    if (category === "temperature") {
      setResult(convertTemperature(value, fromUnit, toUnit));
    } else {
      const fromBase = (units as Record<string, { name: string; toBase: number }>)[fromUnit]?.toBase || 1;
      const toBase = (units as Record<string, { name: string; toBase: number }>)[toUnit]?.toBase || 1;
      setResult((value * fromBase) / toBase);
    }
  }, [inputValue, fromUnit, toUnit, category, units]);

  const swap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit]);

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between different units of measurement instantly."
      category="text"
    >
      <div className="space-y-6">
        <div>
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(v) => {
              if (v) {
                setCategory(v as Category);
                const newUnits = Object.keys(unitCategories[v as Category].units);
                setFromUnit(newUnits[0]);
                setToUnit(newUnits[1] || newUnits[0]);
              }
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(unitCategories).map(([key, cat]) => (
                <SelectItem key={key} value={key}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-4">
          <div>
            <Label>From</Label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="mt-1"
            />
            <Select value={fromUnit} onValueChange={(v) => v && setFromUnit(v)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(units).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={swap} variant="outline" size="icon" className="mb-1">
            <ArrowDownUp className="h-4 w-4" />
          </Button>

          <div>
            <Label>To</Label>
            <Card className="mt-1">
              <CardContent className="p-3">
                <p className="text-2xl font-bold text-brand">
                  {typeof result === "number"
                    ? result % 1 === 0
                      ? result
                      : result.toFixed(6)
                    : result}
                </p>
              </CardContent>
            </Card>
            <Select value={toUnit} onValueChange={(v) => v && setToUnit(v)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(units).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
