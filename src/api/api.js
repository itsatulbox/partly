'use client'

import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_API_TOKEN;
const baseURL = process.env.NEXT_PUBLIC_BASEURL;

const apiClient = axios.create({
    baseURL,
});

/**
 * Fetch vehicle information by license plate.
 * @param {string} licensePlate
 * @returns {Promise<object>} Vehicle data response
 */
export async function getVehicleInformation(licensePlate) {
    const requestBody = {
        identifier: {
            plate: licensePlate,
            region: 'UREG32',         // NZ - always UREG32
            state: null,              // NZ - always null
        },
        languages: ['en-NZ', 'en'],
    };

    // Set the Authorization header
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;

    // Call the Partly API endpoint
    const response = await apiClient.post('/api/v1/vehicles.search', requestBody);
    return response.data;
}

export default apiClient;