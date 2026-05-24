import express from "express";
import cors from "cors";
import pokemonRoutes from "./routes/pokemon";
import fightRoutes from "./routes/fight";
import typeChartRoutes from "./routes/typeChart";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/pokemon", pokemonRoutes);
app.use("/api/fight", fightRoutes);
app.use("/api/type-chart", typeChartRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

export default app;
