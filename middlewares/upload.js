import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tmpDir = path.join(__dirname, "../tmp");
const multerConfig = multer.diskStorage({ destination: tmpDir });
export const upload = multer({ storage: multerConfig });
