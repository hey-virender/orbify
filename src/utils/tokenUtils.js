import { SignJWT, jwtVerify } from "jose";

// Generate a Token with JOSE
export const generateToken = async (userId, email) => {
  // Convert the secret key into a Uint8Array
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

  // Create the token
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" }) // Algorithm used for signing
    .setIssuedAt() // Set the issued at time
    .setExpirationTime("1h") // Token expiration time
    .sign(secret); // Sign the token using the secret key

  return token;
};

// Verify a Token with JOSE
export const verifyToken = async (token) => {
  try {
    // Convert the secret key into a Uint8Array
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    // Verify the token and decode its payload
    const { payload } = await jwtVerify(token, secret);

    return payload; // Return the decoded payload (userId and email)
  } catch (error) {
    console.log("Token parsing error", error);
    
  }
};
