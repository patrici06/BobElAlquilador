import { jwtDecode } from "jwt-decode";

/**
 * Extrae los roles desde un JWT sin verificar la firma (solo decodifica).
 * @param {string} token - El JWT a decodificar.
 * @returns {Array<string>} - Un array con los roles del usuario.
 */
export function getRolesFromJwt(token) {
    if (!token) return [];
    try {
        const decoded = jwtDecode(token);
        let rawRoles = decoded.roles || decoded.authorities || [];
        if (typeof rawRoles === "string") {
            return rawRoles.split(",").map(r => r.trim()).filter(r => r);
        }
        if (Array.isArray(rawRoles)) {
            return rawRoles;
        }
        return [];
    } catch (e) {
        return [];
    }
}