import path from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = path.dirname(
  fileURLToPath(import.meta.url)
);

const nextConfig = {
  turbopack: {
    root: path.resolve(configDirectory, "../.."),
  },
};

export default nextConfig;