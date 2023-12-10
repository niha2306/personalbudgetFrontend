export const checkJWTExpired = (token) => {
    if (!token) {
        return true;
    }
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) {
        return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp < currentTime;
}

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        return null;
    }
}