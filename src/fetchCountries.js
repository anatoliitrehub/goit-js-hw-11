const baseUrl = "https://restcountries.com/v3.1/name/";

function fetchCountries(name){
    const params = new URLSearchParams({
        fields:'name,capital,population,flags,languages'
    });

    return fetch(`${baseUrl}${name}?${params}`).then(resp => {
        if (!resp.ok) throw new Error(resp.status);
        return resp.json();})
    }

export default fetchCountries;

