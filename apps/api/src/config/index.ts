const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET must be set in environment variables");
}

const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  env: process.env.NODE_ENV || "development",
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};

export default config;
