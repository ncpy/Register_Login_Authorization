const roleCheck = (roles) => {
    return (req, res, next) => {

        console.log("rol: ", roles)
        //console.log("req: ", req)
        console.log("req.user.roles: ", req.myuser.roles)
        
        if (req.myuser.roles?.includes(...roles))
            next()
        else
            res.status(403).json("Yetkin YOK koçum:)")
    }
}

module.exports = roleCheck;