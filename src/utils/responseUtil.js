

export const ApiJsonResponse = (msg, error) => (
    {
        "message": msg,
        "error": error
    }
);


/*export const ApiJsonResponse = (msg, error) => {
    const resJson = {
        "message": msg,
        "error": error
    }
    return resJson
}*/


/*function apiJsonResponse(msg, error){

    const resJson = {
        "message": msg,
        "error": error
    }

    return resJson
}

export const ApiJsonResponse = apiJsonResponse;*/
