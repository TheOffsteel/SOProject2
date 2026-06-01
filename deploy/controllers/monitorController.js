import { fetchSnapshot } from "../services/monitorService.js";

export async function getMonitor(_req, res) {
  try {
    const data = await fetchSnapshot();
    res.set("cache-control", "no-store").json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
