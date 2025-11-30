import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.get("/", (req, res) => {
  res.send("Webhook Backend Online 🚀");
});

// Receber o webhook do TradingView
app.post("/webhook", async (req, res) => {
  try {
    const payload = req.body;

    // salvar log no banco
    await supabase.from("webhook_logs").insert({
      payload,
      response_status: "received"
    });

    return res.json({ success: true, message: "Webhook recebido." });

  } catch (err) {
    console.error(err);

    return res.status(500).json({ success: false, error: "Erro interno." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando na porta 3000");
});
