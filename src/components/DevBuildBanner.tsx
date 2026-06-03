import { APP_BUILD_ID } from '../buildVersion';

/** Always visible so you can confirm the browser loaded THIS folder's code (not AI Studio cache). */
export default function DevBuildBanner() {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      /^192\.168\.\d+\.\d+$/.test(window.location.hostname));

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[10000] pointer-events-none px-2 pb-2"
      aria-hidden
    >
      <div
        className={`mx-auto max-w-lg rounded-lg px-3 py-2 text-center text-[11px] font-bold shadow-lg border ${
          isLocal
            ? 'bg-emerald-600 text-white border-emerald-700'
            : 'bg-red-600 text-white border-red-800'
        }`}
      >
        {isLocal ? (
          <>
            LOCAL DEV · build {APP_BUILD_ID} · Submit opens WhatsApp/Email picker
          </>
        ) : (
          <>
            WRONG URL — build {APP_BUILD_ID} not on AI Studio. Run npm run dev and open localhost
          </>
        )}
      </div>
    </div>
  );
}
