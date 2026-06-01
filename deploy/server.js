import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import monitorRouter from "./routes/monitor.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use("/api/monitor", monitorRouter);
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

app.listen(PORT, () => {
  console.log(`OS Monitor rodando em http://localhost:${PORT}`);
});
