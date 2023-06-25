import axios from "axios";

const api = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api",
});

export const getRoute = async (origin: number[], destination: number[]) => {
    try {
        console.log(origin, destination);
        const response = await api.get(
            `/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_API_KEY}`
        );

        const { distance, duration, start_addrress, end_addrress, steps } =
            response.data.routes[0].legs[0];
        const routes = steps
            .map((step: any) => {
                return [
                    {
                        latitude: step.start_location.lat,
                        longitude: step.start_location.lng,
                    },
                    {
                        latitude: step.end_location.lat,
                        longitude: step.end_location.lng,
                    },
                ];
            })
            .flat(1);
        return {
            distance,
            price: ((distance.value / 1000) * 2).toFixed(2),
            duration,
            start_addrress,
            end_addrress,
            routes,
        };
    } catch (error) {
        console.error(error);
    }
};
