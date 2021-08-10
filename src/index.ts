import { api } from "./srl/api";
import { Run } from "./srl/runs";
import { ApiResponse } from "./srl/util-types";

let counter = 0;
const handleRuns = (res: ApiResponse<Run>) => {
    if(res.error) console.log(res.error.status, ":", res.error.message);
    else {
        console.log("Counter", counter);
        console.log(JSON.stringify(res.data[0], null, 2));
        if(res.next && ++counter < 5) res.next().then(handleRuns);
    }
}

api.runs({ orderDirection: "desc" }).then(handleRuns).catch(e => console.error(e));
