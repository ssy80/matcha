
  //validate user fields
  //email - valid email
  //username - 3-50 (alphanumeric)
  //firstname - 3-50 (alpha)
  //lastname - 3-50 (alpha)
  //userPassword - 6-12 (1 upper, 1 lower, 1 number, 1 special char)


export class Validation{

    //constructor(){}

    static isEmail(value)
    {
        if (typeof value !== 'string') return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value.trim());
    }

    static isLengthBetween(value, min, max)
    {
        if (typeof value !== 'string') return false;

        const len = String(value.trim()).length;
        return (len >= min && len <= max);
    }

    static isAlpha(value)
    {
        if (typeof value !== 'string') return false;

        const alphaRegex = /^[A-Za-z]+$/;
        return alphaRegex.test(value.trim());
    }

    static isAlphaNumeric(value)
    {
        if (typeof value !== 'string') return false;
    
        const alphaNumericRegex = /^[A-Za-z0-9]+$/;
        return alphaNumericRegex.test(value.trim());
    }

    /* Passwords criteria: 6-12 (1 upper, 1 lower, 1 number, 1 special char)*/
    static isValidPassword(value)
    {
        if (typeof value !== 'string') return false;
        
        // Check length
        if (value.length < 6 || value.length > 12) 
        {
            return false;
        }

        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(value)) 
        {
            return false;
        }

        // Check for at least one lowercase letter
        if (!/[a-z]/.test(value)) 
        {
            return false;
        }

        // Check for at least one number
        if (!/\d/.test(value)) 
        {
            return false;
        }

        // Check for at least one special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
        {
            return false;
        }

        return true;
    }

}