// Devuelve un array de roles a partir del localStorage o el valor recibido como string
export function getUserRoles(rawRoles) {
    if (!rawRoles) return [];
    return rawRoles
        .replace(/\[|\]/g, '')
        .split(',')
        .map(r => r.trim());
}

// Devuelve el texto amigable del rol principal
export function getRolTexto(roles) {
    if (roles.includes("ROLE_PROPIETARIO")) {
        return "Propietario";
    } else if (roles.includes("ROLE_EMPLEADO")) {
        return "Empleado";
    } else if (roles.includes("ROLE_CLIENTE")) {
        return "Cliente";
    }
    return null;
}