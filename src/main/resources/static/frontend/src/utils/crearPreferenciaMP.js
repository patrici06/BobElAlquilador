export async function crearPreferenciaMP({ id, nombre, descripcion, imagenUrl, precio, inicio, fin, dniCliente }) {
    const token = sessionStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:8080/api/mp/pagar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id,
                nombre,
                descripcion,
                imagenUrl,
                precio,
                inicio,
                fin,
                dniCliente,
            }),
        });

        console.log("📤 Status respuesta:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error desde el backend al crear preferencia:", errorText);
            throw new Error("Error al generar el link de pago");
        }

        // Intentá primero obtenerlo como json, porque tu backend está devolviendo texto o JSON?
        // En el backend haces: return ResponseEntity.ok(preference.getInitPoint());
        // Ese método devuelve un String, así que response.text() está bien.
        const initPoint = await response.text();

        console.log("👉 initPoint recibido:", initPoint);

        return initPoint;

    } catch (error) {
        console.error("Error en crearPreferenciaMP:", error);
        throw error;
    }
}