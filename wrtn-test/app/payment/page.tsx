"use client";

import { loadFromStorage } from "@/app/utils/storage";

export default function PaymentPage() {
  const result = loadFromStorage("lastEstimate");

  if (!result) {
    return (
      <div className="mx-auto mt-20 max-w-md text-center text-sm text-gray-500">
        결제 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-center">
        결제 완료
      </h2>
      <p className="mb-6 text-center text-sm text-gray-500">
        전력 요금 영수증
      </p>

      {/* 요약 */}
      <ul className="space-y-2 text-sm">
        <li>
          요금제:{" "}
          <strong>
            {result.plan === "FIXED" && result.years
              ? `고정 에너지 계약 ${result.years}년`
              : "가변 에너지 요금제"}
          </strong>
        </li>

        <li>소비량: {result.monthlyKwh} kWh</li>
      </ul>

      <div className="mt-4 border-t pt-4 space-y-2">
  <div className="grid grid-cols-3 font-medium text-sm">
    <span>예상 소비 금액</span>
    <span className="text-right">월간</span>
    <span className="text-right">연간</span>
  </div>

  <CompareRow
    label="전력 사용 요금"
    monthly={result.basePrice}
    yearly={result.basePrice * 12}
  />
</div>

<div className="mt-4 border-t pt-4 space-y-2">
  <p className="font-medium text-sm">부가 비용 및 세금</p>

  <CompareRow
    label="배달 및 전력망 관리비"
    monthly={result.managementFee}
    yearly={result.managementFee * 12}
  />

  <CompareRow
    label="에너지세"
    monthly={result.tax}
    yearly={result.tax * 12}
  />

  {result.discountAmount > 0 && (
    <CompareRow
      label="주거 할인"
      monthly={-result.discountAmount}
      yearly={-result.discountAmount * 12}
      highlight="discount"
    />
  )}
</div>

<div className="mt-4 border-t pt-4 space-y-2">
  <CompareRow
    label="총 납부 금액"
    monthly={result.finalMonthly}
    yearly={result.totalPayment}
    bold
  />
</div>



      </div>
  );
}

/* ---------- 공통 Row 컴포넌트 ---------- */

function CompareRow({
    label,
    monthly,
    yearly,
    highlight,
    bold,
  }: {
    label: string;
    monthly: number;
    yearly: number;
    highlight?: "discount";
    bold?: boolean;
  }) {
    return (
      <div className={`grid grid-cols-3 text-sm ${bold ? "font-semibold" : ""}`}>
        <span>{label}</span>
        <span
          className={`text-right ${
            highlight === "discount" ? "text-green-600" : ""
          }`}
        >
          {monthly.toLocaleString()}원
        </span>
        <span
          className={`text-right ${
            highlight === "discount" ? "text-green-600" : ""
          }`}
        >
          {yearly.toLocaleString()}원
        </span>
      </div>
    );
  }
  