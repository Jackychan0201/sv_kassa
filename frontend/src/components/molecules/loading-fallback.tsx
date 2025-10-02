import { Label } from "../atoms/label";

interface LoadingFallbackProps {
  message?: string;
  height?: string | number;
}

export function LoadingFallback({ message = "Loading..." }: LoadingFallbackProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#1e1e1e] z-50"
    >
      <div
        className="border-5 border-black rounded-lg flex flex-col gap-y-5 items-center justify-center w-[20%] h-[20%] text-center text-[#f0f0f0] animate-pulse">
        <Label className="text-3xl">{message}</Label>
        <div className="w-8 h-8 border-4 border-t-gray-400 border-gray-700 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
