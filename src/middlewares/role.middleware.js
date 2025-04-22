//verifica si el usuario tiene los roles permitidos

const roleMiddleware = (...rolesPermitidos) => {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role) {
            return res.status(401).json({ message: "No autenticado aún" });
        }

        if (!rolesPermitidos.includes(role)) {
            return res.status(403).json({
                message: `Acceso denegado.`
            });
        }
        next();
    };
};

module.exports = roleMiddleware;