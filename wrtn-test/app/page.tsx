import RegionSelect from "./components/RegionSelect";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* 타이틀 */}
      <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-8 text-center">
        전력 구매 서비스
      </h1>

      {/* 선택 컴포넌트 감싸기 */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <RegionSelect />
      </div>
    </main>
  );
}
