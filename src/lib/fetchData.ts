export async function getCurrentTabUrl() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // Check if chrome.tabs is available
  if (typeof chrome !== "undefined" && chrome.tabs) {
    let tabs = await chrome.tabs.query(queryOptions);
    let [tab] = tabs;
    return tab?.url as string;
  } else {
    // Default value when running outside a Chrome extension
    return "test-dawg";
  }
}
