# API Películas (api-render)

Proyecto pequeño en Node.js/Express que sirve datos de películas desde `peliculas.json`.

## Requisitos

- Node.js (v14+ recomendado)

## Instalación

1. Instala dependencias:

```bash
npm install
```

2. Ejecuta el servidor:

```bash
node index.js
# o si tienes script start: npm start
```

Por defecto el servidor usa el puerto `3001`. Puedes cambiarlo exportando la variable `PORT`.

## Endpoints

- `GET /` 
  - Devuelve un mensaje de bienvenida y la lista de endpoints.

- `GET /api/peliculas` 
  - Parámetro opcional de consulta: `genero` (ejemplo: `/api/peliculas?genero=accion`).
  - Respuesta: `{ total: <n>, peliculas: [ ... ] }`
  - Ejemplo:

```bash
curl "http://localhost:3001/api/peliculas?genero=accion"
```

- `GET /api/peliculas/:id`
  - Devuelve la película con el `id` numérico indicado.
  - Ejemplo:

```bash
curl "http://localhost:3001/api/peliculas/1"
```

- `GET /api/generos`
  - Devuelve la lista de géneros disponibles.
  - Ejemplo:

```bash
curl "http://localhost:3001/api/generos"
```

## Notas

- El proyecto usa módulos ES (`import`). Si ves errores de importación, añade `"type": "module"` en tu `package.json`.
- El archivo de datos es `peliculas.json` en la misma carpeta.

---

Si quieres, puedo añadir ejemplos de respuestas reales sacados de `peliculas.json` o un script `npm start` en `package.json` si falta.