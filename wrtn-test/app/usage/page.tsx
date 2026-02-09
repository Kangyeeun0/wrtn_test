"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { saveToStorage, loadFromStorage } from "@/app/utils/storage";

type HouseType = "아파트" | "연립주택" | "단독주택";

export default function UsagePage() {
  const [houseType, setHouseType] = useState<HouseType>("아파트");
  const [residents, setResidents] = useState(1);
  const [hasSmartMeter, setHasSmartMeter] = useState(false);
  const [installSmartMeter, setInstallSmartMeter] = useState(false);
  const [hasCarCharger, setHasCarCharger] = useState(false);

  // 새로고침 시 값 복구
  useEffect(() => {
    const saved = loadFromStorage("usage");
    if (saved) {
      setHouseType(saved.houseType);
      setResidents(saved.residents);
      setHasSmartMeter(saved.hasSmartMeter);
      setInstallSmartMeter(saved.installSmartMeter);
      setHasCarCharger(saved.hasCarCharger);
    }
  }, []);

  // 값 변경 시 저장
  useEffect(() => {
    saveToStorage("usage", {
      houseType,
      residents,
      hasSmartMeter,
      installSmartMeter,
      hasCarCharger,
    });
  }, [houseType, residents, hasSmartMeter, installSmartMeter, hasCarCharger]);

  // 월 소비량 계산
  let monthlyUsage = residents * 75;
  if (hasCarCharger) monthlyUsage *= 2;

  return (
    <div className="mx-auto mt-16 max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-black">맞춤형 전력 사용량 계산</h2>

      {/* 거주 유형 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          거주 유형
        </label>
        <select
          value={houseType}
          onChange={(e) => setHouseType(e.target.value as HouseType)}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-black"
        >
          <option>아파트</option>
          <option>연립주택</option>
          <option>단독주택</option>
        </select>
      </div>

      {/* 거주자 수 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          거주자 수
        </label>
        <select
          value={residents}
          onChange={(e) => setResidents(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-black"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n === 5 ? "5명 이상" : `${n}명`}
            </option>
          ))}
        </select>
      </div>

      {/* 스마트 미터기 */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={hasSmartMeter}
          onChange={(e) => setHasSmartMeter(e.target.checked)}
        />
        <span className="text-sm">스마트 미터기 사용 중</span>
      </div>

      {!hasSmartMeter && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={installSmartMeter}
            onChange={(e) => setInstallSmartMeter(e.target.checked)}
          />
          <span className="text-sm">
            스마트 미터기 설치 (200,000원)
          </span>
        </div>
      )}

      {/* 전기차 충전기 */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          checked={hasCarCharger}
          onChange={(e) => setHasCarCharger(e.target.checked)}
        />
        <span className="text-sm">전기차 충전기 보유</span>
      </div>

      {/* 결과 */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4 text-sm">
        예상 월 소비량:{" "}
        <strong>{monthlyUsage} kWh</strong>
      </div>

      {/* 링크 */}
      <div className="flex justify-end items-center">
       

        <Link
          href="/estimate"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 cursor-pointer"
        >
          다음
        </Link>
      </div>
    </div>
  );
}
