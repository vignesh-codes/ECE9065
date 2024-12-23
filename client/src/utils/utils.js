export const TruncateText = (text, maxLength) => {
    if (text != undefined && text.length > maxLength) {
      return text.substring(0, maxLength) + '..';
    }
    return text;
  };

export const getToken = () => {
    return localStorage.getItem('token');
}

export function convertDateToRequiredFormat(dateString) {
  // Parse the input date string into a Date object
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
  }

  // Extract year, month, and day
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0');

  // Return the formatted date
  return `${year}-${month}-${day}`;
}

// decode jwt token
export function decodeJWT(token) {
  if (!token) {
      throw new Error("Token is required");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
      throw new Error("Invalid JWT token format");
  }

  // Decode the payload (2nd part)
  const payload = parts[1];
  try {
      // Base64url decode and parse JSON
      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      return decodedPayload;
  } catch (error) {
      throw new Error("Failed to decode token: " + error.message);
  }
}