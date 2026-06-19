import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const datos = JSON.parse(readFileSync(join(__dirname, "peliculas.json"), "utf-8"));

const app = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenidos a nuestra API",
        endpoints: [
            "/api/peliculas",
            "/api/peliculas/:id",
            "/api/generos"
        ]
    });
});
app.get("/api/peliculas", (req, res) => {
    const { genero } = req.query;
    let peliculas = datos.peliculas;
    if (genero) {
        peliculas = peliculas.filter(
            (p) => p.genero.toLowerCase() === genero.toLowerCase()
        );
    }
    res.json({ total: peliculas.length, peliculas });
});

app.get("/api/peliculas/:id", (req, res) => {
    const pelicula = datos.peliculas.find((p) => p.id === Number(req.params.id));
    if (!pelicula) return res.status(404).json({ error: "Película no encontrada" });
    res.json(pelicula);
});

app.get("/api/generos", (req, res) => {
    res.json({ generos: Object.keys(datos.indice_por_genero) });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`El puerto ${PORT} ya está en uso. Cierra el otro proceso o ejecuta: set PORT=3001 && npm start`);
    } else {
        console.error("Error al iniciar el servidor:", err.message);
    }
    process.exit(1);
});