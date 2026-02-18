export const isPasswordInvalid = (password: string) => {
    if (!password) return false;

    if (password.length < 8) return true;

    if (!/[a-zA-Z]/.test(password)) return true; 
    if (!/[0-9]/.test(password)) return true;    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return true; 

    return false;
};