export class Validation{

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
        
        if (value.length < 6 || value.length > 12) {
            return false;
        }

        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(value)) {
            return false;
        }

        // Check for at least one lowercase letter
        if (!/[a-z]/.test(value)) {
            return false;
        }

        // Check for at least one number
        if (!/\d/.test(value)) {
            return false;
        }

        // Check for at least one special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
        {
            return false;
        }

        return true;
    }

    static isValidGender(gender){
        if (typeof gender !== 'string') return false;

        const validValues = ['male', 'female'];

        return validValues.includes(gender);
    }

    static isValidSexualPreference(preference){
        if (typeof preference !== 'string') 
            return false;

        const validValues = ['male', 'female', 'bi-sexual'];
        
        return validValues.includes(preference);
    }

    static isValidInterest(interest){
        if (typeof interest !== 'string') 
            return false;

        const validValues = ['#music', '#movie', '#gym', '#swim', '#jog', '#cycle', '#animal','#vegan', '#dinner', '#travel', '#dance'];
        
        return validValues.includes(interest);
    }

    static isValidInterests(interests){
        if (Array.isArray(interests) === false) 
            return false;
        if (interests.length < 1) 
            return false;

        // Check for duplicates using Set
        const uniqueInterests = new Set(interests);
        if (uniqueInterests.size !== interests.length) 
            return false;

        for (const interest of interests){
            if (!this.isValidInterest(interest))
                return false;
        }
        return true;
    }

    static isValidCoordinates(lat, lon) {
        const latitude = Number(lat);
        const longitude = Number(lon);

        // Check if they are valid numbers
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude))
            return false;

        // Check valid ranges
        if (latitude < -90 || latitude > 90)
            return false;

        if (longitude < -180 || longitude > 180) 
            return false;

        return true;
    }

    static isValidIPv4(ip) {
        const regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
        return regex.test(ip);
    }

    static isValidDateOfBirth(dateOfBirth, minAge){
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) 
            return false;

        const dob = new Date(dateOfBirth);
        if (!(dob instanceof Date && !isNaN(dob)))
            return false;

        const today = new Date();
        if (dob > today) 
            return false;

        const [year, month, day] = dateOfBirth.split('-').map(Number);
        if (month < 1 || month > 12) 
            return false;
        if (day < 1 || day > 31) 
            return false;
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)
            return false;
            
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
    
        const adjustedAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? (age - 1) : age;
        if (adjustedAge < minAge)
            return false;

        return true;
    }
}
