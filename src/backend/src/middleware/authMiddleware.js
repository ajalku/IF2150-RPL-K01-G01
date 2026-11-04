//pakai ini di tiap page supaya user yg ke suatu page pasti sudah login 
function requireAuth(req, res, next) {
    if (req.session?.user) {
        return next();
    }

    return res.status(401).json({
        message: "Please log in to continue."
    });
}
module.exports = { requireAuth };