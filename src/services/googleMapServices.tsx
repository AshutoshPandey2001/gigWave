import axios from "axios";
interface LocationDetails {
    latitude: number;
    longitude: number;
    locationName: string;
}
const apiKey = "AIzaSyA5sBOIt1fXpYGll4Kb_808VXSwly-M37o"

export const geocodeLocationByName = async (locationName: string): Promise<LocationDetails> => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: locationName,
                key: apiKey,
            },
        });

        const location = response.data.results[0].geometry.location;
        const locationDetails: LocationDetails = {
            latitude: location.lat,
            longitude: location.lng,
            locationName: locationName

        };

        return locationDetails;
    } catch (error) {
        throw error;
    }
};