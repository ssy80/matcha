    // Timezone Fix Helper
    export const formatMessageTime = (dateString: string) => {
        if (!dateString) 
            return "";

        let utcString = dateString;
        
        if (!dateString.endsWith("Z")) 
            utcString += "Z";
        
        return new Date(utcString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };
