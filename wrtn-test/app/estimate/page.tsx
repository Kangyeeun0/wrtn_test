"use client";

import { useEffect, useState } from "react";
import { calculatePrice, PlanType } from "@/app/utils/calculatePrice";
import { loadFromStorage, saveToStorage } from "@/app/utils/storage";
import { useRouter } from "next/navigation";

export default function EstimatePage() {
  const router = useRouter();

  const [monthlyKwh, setMonthlyKwh] = useState(0);
  const [hasSmartMeter, setHasSmartMeter] = useState(false);
  const [installSmartMeter, setInstallSmartMeter] = useState(false);

  const [plan, setPlan] = useState<PlanType | null>(null);
  const [years, setYears] = useState<1 | 2 | 3 | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  /* STEP 3 / 4 값 불러오기 */
  useEffect(() => {
    const usage = loadFromStorage("usage");
    const usageDirect = loadFromStorage("usageDirect");

    if (usageDirect?.kwh !== "") {
      setMonthlyKwh(
        usageDirect.hasCarCharger
          ? usageDirect.kwh * 2
          : usageDirect.kwh
      );
      setHasSmartMeter(usageDirect.hasSmartMeter);
      setInstallSmartMeter(usageDirect.installSmartMeter);
    } else if (usage?.monthlyKwh !== undefined) {
      setMonthlyKwh(Number(usage.monthlyKwh));
      setHasSmartMeter(usage.hasSmartMeter);
      setInstallSmartMeter(usage.installSmartMeter);
    }
  }, []);

  /* 요금제 미선택 상태 */
  if (!plan) {
    return (
      <div className="mx-auto mt-16 max-w-xl text-center">
        <h2 className="mb-6 text-xl font-semibold">요금제를 선택하세요</h2>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setPlan("FIXED")}
            className="rounded-xl border px-6 py-4 hover:border-blue-500"
          >
            고정 요금제
          </button>

          <button
            onClick={() => setPlan("VARIABLE")}
            className="rounded-xl border px-6 py-4 hover:border-blue-500"
          >
            가변 요금제
          </button>
        </div>
      </div>
    );
  }

  const result = calculatePrice({
    monthlyKwh,
    planType: plan,
    years: plan === "FIXED" ? years ?? undefined : undefined,
    hasSmartMeter,
    installSmartMeter,
  });

  return (
    <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-8">
      {/* 왼쪽 선택 영역 */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">요금제 선택</h2>

        {/* FIXED 요금제 */}
        {plan === "FIXED" && (
          <div className="space-y-3">
            {[1, 2, 3].map((y) => {
              const preview = calculatePrice({
                monthlyKwh,
                planType: "FIXED",
                years: y as 1 | 2 | 3,
                hasSmartMeter,
                installSmartMeter,
              });

              const before =
                preview.basePrice +
                preview.tax +
                preview.managementFee;

              return (
                <div
                  key={y}
                  className={`rounded-lg border p-4 ${
                    years === y
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => {
                      setYears(y as 1 | 2 | 3);
                      setConfirmed(false);
                    }}
                    className="w-full text-left space-y-1"
                  >
                    <p className="font-medium">
                      고정 에너지 계약 {y}년
                    </p>

                    <p className="text-sm text-gray-500">
                      월간 사용료:{" "}
                      <span className="line-through">
                        {before.toLocaleString()}원
                      </span>
                    </p>

                    <p className="text-sm font-semibold text-blue-600">
                      할인 적용 월 납부 금액:{" "}
                      {preview.finalMonthly.toLocaleString()}원
                    </p>

                    <p className="text-xs text-green-600">
                      {y * 20}% 할인 적용
                    </p>
                  </button>
                </div>
              );
            })}

            <button
              disabled={!years}
              onClick={() => setConfirmed(true)}
              className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
            >
              요금제 선택
            </button>
          </div>
        )}

        {/* VARIABLE 요금제 */}
        {plan === "VARIABLE" && (() => {
          const preview = calculatePrice({
            monthlyKwh,
            planType: "VARIABLE",
            hasSmartMeter,
            installSmartMeter,
          });

          return (
            <div className="space-y-4">
              <div className="rounded-lg border border-blue-500 bg-blue-50 p-4 space-y-2">
                <p className="font-medium">가변 에너지 요금제</p>
                <p className="text-sm text-gray-600">
                  월간 예상 사용료
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  {preview.finalMonthly.toLocaleString()}원 / 월
                </p>
                <p className="text-xs text-gray-500">
                  ※ 평균 요금 기준 (계절별 변동은 추후 반영)
                </p>
              </div>

              <button
                onClick={() => setConfirmed(true)}
                className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white"
              >
                요금제 선택
              </button>
            </div>
          );
        })()}
      </div>

      {/* 오른쪽 상세 견적 */}
      {confirmed && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">상세 견적</h2>

          <ul className="space-y-2 text-sm">
            <li>요금제: {plan === "FIXED" ? "고정" : "가변"}</li>
            {years && <li>계약 기간: {years}년</li>}
            <li>소비량: {monthlyKwh} kWh</li>
            <li>전력 요금: {result.basePrice.toLocaleString()}원</li>
            <li>세금: {result.tax.toLocaleString()}원</li>
            <li>관리비: {result.managementFee.toLocaleString()}원</li>
            {result.discountAmount > 0 && (
              <li>할인 금액: -{result.discountAmount.toLocaleString()}원</li>
            )}
            {result.smartMeterCost > 0 && (
              <li>
                스마트 미터기 설치비:{" "}
                {result.smartMeterCost.toLocaleString()}원
              </li>
            )}
            <li className="mt-2 font-semibold">
              연간 총액: {result.totalPayment.toLocaleString()}원
            </li>
          </ul>

          <button
            onClick={() => {
              saveToStorage("lastEstimate", {
                plan,
                years,
                monthlyKwh,
                hasSmartMeter,
                installSmartMeter,
                ...result,
              });
              router.push("/payment");
            }}
            className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-2 text-white"
          >
            결제 완료
          </button>
        </div>
      )}
    </div>
  );
}
