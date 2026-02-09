"use client";

import { useState } from "react";
import { REGIONS, AVAILABLE_REGIONS } from "@/app/constants/regions";
import Link from "next/link";

export default function RegionSelect() {
  const [region, setRegion] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleChange = (value: string) => {
    setRegion(value);
    setIsAvailable(AVAILABLE_REGIONS.includes(value));
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        거주 지역 선택
      </h2>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="region"
          className="text-sm font-medium text-gray-600"
        >
          지역
        </label>

        <select
          id="region"
          value={region}
          onChange={(e) => handleChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-black
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="" className="text-black">지역을 선택하세요</option>
          {REGIONS.map((r: string) => (
            <option key={r} value={r} className="text-black">
              {r}
            </option>
          ))}
        </select>
      </div>

      {isAvailable !== null && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium
            ${
              isAvailable
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
        >
          {isAvailable
            ? "해당 지역은 전력 구매가 가능합니다."
            : "현재 해당 지역은 판매 대상이 아닙니다."}
        </div>
      )}

      <div className="mt-4 text-center">
      <Link href="/usage">
  <button className="rounded-lg bg-blue-500 px-4 py-2 text-white">
    다음
  </button>
</Link>
      </div>
    </div>
  );
}
