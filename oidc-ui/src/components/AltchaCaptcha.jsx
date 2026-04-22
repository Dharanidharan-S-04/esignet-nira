import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";

const AltchaCaptcha = forwardRef(({ challengeUrl, onVerified, onError }, ref) => {
  const widgetRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(
    !!document.getElementById("altcha-script")?.dataset.loaded
  );

  useImperativeHandle(ref, () => ({
    reset: () => {
      widgetRef.current?.reset?.();
    },
  }));

  useEffect(() => {
    const scriptId = "altcha-script";
    const existing = document.getElementById(scriptId);
    if (existing) {
      if (existing.dataset.loaded) setScriptLoaded(true);
      else existing.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js";
    script.async = true;
    script.type = "module";
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      setScriptLoaded(true);
    });
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded) return;

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
  }, [scriptLoaded, onVerified, onError]);

  return (
    <altcha-widget
      ref={widgetRef}
      challengeurl={challengeUrl}
      style={{ width: "100%", display: "block" }}
    />
  );
});

export default AltchaCaptcha;