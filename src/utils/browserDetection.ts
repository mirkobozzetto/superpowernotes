type BrowserInfo = {
  isIOS: boolean;
  browser: string;
  version: string;
};

const getDefaultBrowserInfo = (): BrowserInfo => ({
  isIOS: false,
  browser: "unknown",
  version: "unknown",
});

export const createBrowserDetection = (): BrowserInfo => {
  if (typeof window === "undefined") {
    return getDefaultBrowserInfo();
  }

  try {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isChrome = /chrome/.test(userAgent);
    const browser = isChrome ? "chrome" : isSafari ? "safari" : "other";
    const version = userAgent.match(/(version|chrome)\/(\d+)/)?.[2] || "unknown";

    return { isIOS, browser, version };
  } catch (error) {
    console.error("Error detecting browser:", error);
    return getDefaultBrowserInfo();
  }
};
