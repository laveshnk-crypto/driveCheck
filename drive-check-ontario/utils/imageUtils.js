import RNFS from "react-native-fs";

/*
    Converts a local image file (uri) to a base64 string.
    @param {string} uri - local file path (e.g., from image picker)
    @returns {Promise<string>} base64-encoded image
*/

export const convertToBase64 = async (uri) => {
    try {
        const base64string = await RNFS.readFile(uri, "base64");
        return base64string;
    } catch (error) {
        console.log("Error converting image to base64:", error);
        throw error;
    }
}