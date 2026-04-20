// AltchaCaptcha.jsx
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import "altcha"; // registers the <altcha-widget> custom element

const AltchaCaptcha = forwardRef(({ challengeUrl, onVerified, onError }, ref) => {
  const widgetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      widgetRef.current?.reset?.();
    },
  }));

  useEffect(() => {
    const widget = widgetRef.current;
    const handleStateChange = (event) => {
      const { state, payload } = event.detail || {};
      if (state === "verified") {
        onVerified(payload);
      } else if (state === "unverified" || state === "error") {
        onError?.();
      }
    };

    widget?.addEventListener("statechange", handleStateChange);
    return () => widget?.removeEventListener("statechange", handleStateChange);
  }, [onVerified, onError]);

  return (
    <altcha-widget
      ref={widgetRef}
      challengeurl={challengeUrl}
      style={{ width: "100%", display: "block" }}
    />
  );
});

export default AltchaCaptcha;