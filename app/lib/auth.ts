import crypto from "crypto";

/**
 * Verifies the launch parameters.
 */
export function verifyLaunchParams(
  searchOrParsedUrlQuery:
    | string
    | {
        [key: string]: string;
      },
  secretKey: string
): boolean {
  let sign: string | undefined;
  const queryParams: {
    [key: string]: string;
  }[] = [];

  /**
   * Function that processes the incoming query parameter. If the parameter
   * responsible for the signature is passed, replaces "sign". If
   * it encounters a parameter that's contextually correct for a signature,
   * adds it to the array of known parameters.
   */
  const processQueryParam = (key: string, value: string) => {
    if (typeof value === "string") {
      if (key === "sign") {
        sign = value;
      } else if (key.startsWith("vk_")) {
        queryParams.push({ key, value });
      }
    }
  };

  if (typeof searchOrParsedUrlQuery === "string") {
    // If the string starts with a question mark
    // (when window.location.search is passed),
    // it should be deleted.
    const formattedSearch = searchOrParsedUrlQuery.startsWith("?")
      ? searchOrParsedUrlQuery.slice(1)
      : searchOrParsedUrlQuery;

    // Trying to parse the string as a query parameter.
    for (const param of formattedSearch.split("&")) {
      const [key, value] = param.split("=");
      processQueryParam(key, value);
    }
  } else {
    for (const key of Object.keys(searchOrParsedUrlQuery)) {
      const value = searchOrParsedUrlQuery[key];
      processQueryParam(key, value);
    }
  }
  // Handling an exception when no signature is found in the parameters and
  // no parameter starts with "vk_" to avoid
  // unnecessary processing from running the code further.
  if (!sign || queryParams.length === 0) {
    return false;
  }
  // Creating a string query again, using parameters which are already filtered.
  const queryString = queryParams
    // Sorting the keys in ascending order.
    .sort((a, b) => a.key.localeCompare(b.key))
    // Recreating the new query as a string.
    .reduce((acc, { key, value }, idx) => {
      return (
        acc + (idx === 0 ? "" : "&") + `${key}=${encodeURIComponent(value)}`
      );
    }, "");

  // Creating a hash from the resulting string using the secure key.
  const paramsHash = crypto
    .createHmac("sha256", secretKey)
    .update(queryString)
    .digest()
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=$/, "");

  return paramsHash === sign;
}

const url =
  "https://example.com/?vk_user_id=494075&vk_app_id=6736218&vk_is_app_user=1&vk_are_notifications_enabled=1&vk_language=ru&vk_access_token_settings=&vk_platform=android&sign=htQFduJpLxz7ribXRZpDFUH-XEUhC9rBPTJkjUFEkRA";
const clientSecret = "wvl68m4dR1UpLrVRli"; // Secure key from your app settings

// Taking only the launch parameters.
const launchParams = decodeURIComponent(url.slice(url.indexOf("?") + 1));

// Checking if the launch parameters are valid.
const areLaunchParamsValid = verifyLaunchParams(launchParams, clientSecret);

console.log(areLaunchParamsValid ? "ok" : "fail");
