
export const imageUrlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${url}`);
    }

    const blob = await response.blob();
    const reader = new FileReader();

    return await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to convert image"));
        reader.readAsDataURL(blob);
    });
}

export const fileToBase64 = async (file: File): Promise<string> => {
    const reader = new FileReader();

    return await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    })
}
