export async function sendPostRequest(url: string, { arg }: { arg: any }) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
    });

    if (!response.ok) {
        const errorText = await response.text();
        const errorJSON = JSON.parse(errorText);
        throw errorJSON;
    }

    return response.json();
}

export async function sendGetRequest(url: string) {

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw JSON.parse(errorText);
    }

    return response.json();
}
