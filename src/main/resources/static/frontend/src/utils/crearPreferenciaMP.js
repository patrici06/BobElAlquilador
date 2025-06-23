export async function crearPreferenciaMP({ id, nombre, descripcion, imagenUrl, precio, inicio, fin, dniCliente }) {
    const token = sessionStorage.getItem("token");

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
            // Agregamos info para redirigir al pago-exitoso
            callbackSuccessParams: {
                inicio,
                fin,
                idMaquina: id,
                dniCliente,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error desde el backend al crear preferencia:", errorText);
        throw new Error("Error al generar el link de pago");
    }

    const initPoint = await response.text(); // url para redirigir
    return initPoint;
}