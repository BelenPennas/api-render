import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Datos cargados desde el archivo `peliculas.json`.
 * Estructura esperada:
 * {
 *   peliculas: Array<Object>,
 *   indice_por_genero: { [genero: string]: Array<number> }
 * }
 * @type {{peliculas: Array<Object>, indice_por_genero: Object}}
 */
const datos = JSON.parse(readFileSync(join(__dirname, "peliculas.json"), "utf-8"));

const app = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001;

/**
 * Ruta raíz de la API.
 * Devuelve un objeto con mensaje de bienvenida y la lista de endpoints disponibles.
 * @route GET /
 * @returns {{mensaje: string, endpoints: string[]}}
 */
app.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenidos a nuestra API",
        endpoints: [
            "/api/peliculas",
            "/api/peliculas?genero=accion",
            "/api/peliculas/:id",
            "/api/generos"
        ]
    });
});
/**
 * Obtiene la lista de películas. Opcionalmente filtra por género usando query string.
 * @route GET /api/peliculas
 * @param {string} [req.query.genero] - Género por el cual filtrar (ej: "accion").
 * @returns {{total: number, peliculas: Array<Object>}}
 * @example /api/peliculas?genero=accion
 */
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


/**
 * Ruta de compatibilidad para un formato antiguo: `/api/peliculas&generos=accion`.
 * Se mantiene para evitar romper clientes que usen ese patrón.
 * @route GET /api/peliculas&generos=:genero
 * @param {string} req.params.genero - Género a filtrar.
 * @returns {{total: number, peliculas: Array<Object>}}
 */
app.get("/api/peliculas&generos=:genero", (req, res) => {
    const genero = req.params.genero;
    let peliculas = datos.peliculas;
    if (genero) {
        peliculas = peliculas.filter(
            (p) => p.genero.toLowerCase() === genero.toLowerCase()
        );
    }
    res.json({ total: peliculas.length, peliculas });
});

/**
 * Devuelve una película por su identificador numérico.
 * @route GET /api/peliculas/:id
 * @param {number} req.params.id - ID de la película.
 * @returns {Object|404} - Objeto película o 404 si no existe.
 * @example /api/peliculas/1
 */
app.get("/api/peliculas/:id", (req, res) => {
    const pelicula = datos.peliculas.find((p) => p.id === Number(req.params.id));
    if (!pelicula) return res.status(404).json({ error: "Película no encontrada" });
    res.json(pelicula);
});

/**
 * Devuelve la lista de géneros disponibles (claves del índice por género).
 * @route GET /api/generos
 * @returns {{generos: string[]}}
 */
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