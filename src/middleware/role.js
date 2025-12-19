export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(401).json({ message: "Потрібна авторизація" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Недостатньо прав доступу" });
    }
    next();
  };
}
