//verifica si el usuario tiene los roles permitidos

const roleMiddleware = (...rolesPermitidos) => {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role) {
            console.log(`Rol actual: ${role} no permitido - Permitidos: ${rolesPermitidos}`);
            return res.status(401).json({ message: "No autenticado aún" });
        }

        if (!rolesPermitidos.includes(role)) {
            return res.status(403).json({
                message: `Acceso denegado.`
            });
        }
        console.log(`Rol actual: ${role} permitido - Permitidos: ${rolesPermitidos}`);
        next();
    };
};

module.exports = roleMiddleware;