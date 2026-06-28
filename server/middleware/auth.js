// This is a placeholder for Clerk Authentication Middleware
// In a real application with Clerk, you would use @clerk/clerk-sdk-node

export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.headers.userid;
        console.log("protectEducator: Incoming userId header:", userId);

        if (!userId) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        req.auth = { userId };
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const protectUser = async (req, res, next) => {
    try {
        const userId = req.headers.userid;
        console.log("protectUser: Incoming userId header:", userId);

        if (!userId) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        req.auth = { userId };
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
