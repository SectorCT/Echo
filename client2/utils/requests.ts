import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP ?? "localhost";
const SERVER_PORT = process.env.EXPO_PUBLIC_SERVER_PORT ?? "5000";
const API_URL = `https://${SERVER_IP}:${SERVER_PORT}`;

async function refreshToken() {
	const refreshToken = await AsyncStorage.getItem("refreshToken");

	const refreshResponse = await fetch(`${API_URL}/authentication/api/refreshToken/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refreshToken: refreshToken }),
	});

	if (refreshResponse.status !== 200) {
		try {
			const refreshResponseData = await refreshResponse.json();
			console.log("Error refreshing token", refreshResponse.status, refreshResponseData.message, refreshResponse);
			await AsyncStorage.removeItem("accessToken");
			await AsyncStorage.removeItem("refreshToken");
			return null;
		} catch {
			console.log("Error parsing data when refreshing token", refreshResponse.status, refreshResponse);
			return null;
		} finally {
			await AsyncStorage.removeItem("accessToken");
			await AsyncStorage.removeItem("refreshToken");
			// checkIfLoggedIn();
		}

	}
	try {

		const data = await refreshResponse.json();
		return data.accessToken;
	} catch {
		console.log("Error parsing data when refreshing token", refreshResponse.status, refreshResponse);
		return null;
	}
}

export async function makeRequest(endpoint: string, method = "GET", body = {}) {
	console.log(`[makeRequest] Starting request to ${endpoint} with method ${method}`);
	
	let accessToken = await AsyncStorage.getItem("accessToken");
	console.log('[makeRequest] Access token status:', accessToken);

	console.log('[makeRequest] Making initial request');
	const response = await fetch(`${API_URL}/${endpoint}`, method == "GET" ? {
		method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${accessToken}`
		}
	} : {
		method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${accessToken}`
		},
		body: JSON.stringify(body)
	});

	console.log('[makeRequest] Initial response status:', response.status);

	if (response.status === 401) {
		console.log('[makeRequest] Received 401, attempting token refresh');
		accessToken = await refreshToken();
		
		if (!accessToken) {
			console.error('[makeRequest] Token refresh failed');
			return null;
		}
		
		console.log('[makeRequest] Token refreshed successfully, retrying request');
		await AsyncStorage.setItem("accessToken", accessToken);
		
		console.log('[makeRequest] Making request with new token');
		const refreshedResponse = await fetch(`${API_URL}/${endpoint}`, method == "GET" ? {
			method,
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			}
		} : {
			method,
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			},
			body: JSON.stringify(body)
		});
		
		console.log('[makeRequest] Refreshed response status:', refreshedResponse.status);
		return refreshedResponse;
	}

	console.log('[makeRequest] Request completed successfully');
	return response;
}