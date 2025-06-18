export async function buscarAlquileresPorDni(dni) {
    const response = await fetch(`/api/alquileres/alquileres/buscar-por-dni?dni=${dni}`);
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }
    return await response.json();
  }