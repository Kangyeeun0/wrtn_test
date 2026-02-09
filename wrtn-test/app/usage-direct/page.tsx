"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { saveToStorage, loadFromStorage } from "@/app/utils/storage";

export default function UsageDirectPage() {
  const [kwh, setKwh] = useState<number|"">("");
  const [hasSmartMeter, setHasSmartMeter] = useState(false);
  const [installSmartMeter, setInstallSmartMeter] = useState(false);
  const [hasCarCharger, setHasCarCharger] = useState(false);

  // 새로고침 시 값 복구
  useEffect(() => {
    const saved = loadFromStorage("usageDirect");
    if (saved) {
      setKwh(saved.kwh);
      setHasSmartMeter(saved.hasSmartMeter);
      setInstallSmartMeter(saved.installSmartMeter);
      setHasCarCharger(saved.hasCarCharger);
    }
  }, []);

  // 값 변경 시 저장
  useEffect(() => {
    saveToStorage("usageDirect", {
      kwh,
      hasSmartMeter,
      installSmartMeter,
      hasCarCharger,
    });
  }, [kwh, hasSmartMeter, installSmartMeter, hasCarCharger]);

  const finalUsage = hasCarCharger ? Number(kwh) * 2 : Number(kwh);

  return (
    <div className="mx-auto mt-16 max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        전력 소비량 직접 입력
      </h2>

      {/* kWh 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          월 전력 소비량 (kWh)
        </label>
        <input
          type="number"
          min={0}
          value={kwh}
          onChange={(e) => e.target.value === "" ? setKwh("") : setKwh(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-black
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="ex) 350"
        />
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
        최종 월 소비량:{" "}
        <strong>{finalUsage} kWh</strong>
      </div>

      {/* 이동 */}
      <div className="flex justify-end">
        <Link
          href="/estimate"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white"
        >
          견적 보기
        </Link>
      </div>
    </div>
  );
}
