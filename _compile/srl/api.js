import fetch from "node-fetch";
const baseRequest = async (path) => {
    return fetch(`https://www.speedrun.com/api/v1/${path}`, {
        headers: { "User-Agent": "srl-test-project/0.1" },
    })
        .then(res => res.json())
        .then(json => json);
};
export const api = {
    runs: () => {
        const res = baseRequest("runs");
        res.then(body => console.log(body));
    },
};
