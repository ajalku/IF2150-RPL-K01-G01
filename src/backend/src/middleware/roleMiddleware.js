//pakai ini untuk mastiin page tsb bisa diakses dengan role user tsb

const authorizeRoles = (...allowedRoles) => {
    return (req, res,next) => {
        if(!req.session?.idPengguna){
            return res.status(401).json({
                message: "Please log in to continue."
            });
        }
        if(!allowedRoles.includes(req.session.role)){
            return res.status(403).json({
                message: "Access denied."
            })
        }
        next();
    }
}
module.exports = { authorizeRoles };