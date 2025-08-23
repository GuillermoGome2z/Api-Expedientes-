import jwt, { Secret, SignOptions } from "jsonwebtoken";

const SECRET: Secret = (process.env.JWT_SECRET || "supersecreto") as Secret;
// En v9, expiresIn debe ser SignOptions['expiresIn'] (string | number)
const EXPIRES_IN = (process.env.JWT_EXPIRES ?? "1h") as SignOptions["expiresIn"];

export type JwtAppPayload = {
  id: number;
  username: string;
  rol: "tecnico" | "coordinador";
};

export function signToken(payload: JwtAppPayload) {
  const opts: SignOptions = { expiresIn: EXPIRES_IN };
  return jwt.sign(payload, SECRET, opts);
}

export function verifyToken(token: string): JwtAppPayload {
  const decoded = jwt.verify(token, SECRET);
  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }
  return decoded as JwtAppPayload;
}
