# U.D. Ideal Tres — guía rápida

## 1. Añadir el escudo real
1. Abre la carpeta `assets`.
2. Copia el escudo del club allí.
3. Ponle el nombre exacto `escudo.png`.
4. Recarga `index.html` en el navegador.

Recomendado: imagen PNG de buena calidad, idealmente con fondo transparente.

## 2. Añadir jugadores de Juvenil y Regional
1. Abre la web y baja al apartado **Panel de administración**.
2. En **Añadir jugador**, escribe nombre, dorsal, posición y categoría.
3. Pulsa **Añadir jugador**.
4. En la sección Plantilla puedes filtrar por Todos, Juvenil o Regional.

## 3. Añadir partidos, resultados y noticias
Usa las pestañas correspondientes del panel de administración. Los cambios se guardan en el navegador local actual. Exporta una copia JSON como respaldo.

## 4. Publicar gratis con GitHub Pages
Esta versión es estática y puede publicarse sin servidor:
1. Crea una cuenta en https://github.com/ si no tienes una.
2. Crea un repositorio nuevo, por ejemplo `ud-ideal-tres`.
3. Sube `index.html`, `style.css`, `script.js` y la carpeta `assets` (incluyendo `escudo.png`).
4. En el repositorio entra en **Settings → Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**, elige `main` y la carpeta `/ (root)`, y guarda.
6. Espera a que GitHub Pages indique la dirección publicada.

## Importante sobre el panel
El panel de esta versión es solo una demostración local. Los cambios guardados en tu navegador no se publican automáticamente en la web de Internet y no se sincronizan con otros dispositivos. Para administrar datos publicados desde cualquier sitio, hace falta añadir un backend/base de datos y autenticación, por ejemplo Supabase o Firebase. No pongas contraseñas ni datos privados en esta versión.
