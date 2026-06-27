const auth = (req, res, next)=>{
    // Temporarily bypassing token verification for development with Clerk
    next();
}

export default auth;
