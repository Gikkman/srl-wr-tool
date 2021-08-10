import fetch from "node-fetch";
import { Run, RunApiOptions } from "./runs";
import { ApiOptions, ServiceBusy, ApiResponse } from "./util-types";

////////////////////////////////////////////////////////////////////
//          TYPES
////////////////////////////////////////////////////////////////////
type ApiContent<T> = {
    data: T[],
    pagination: Pagination,
};
type Pagination = {
    offest: number,
    max: number,
    size: number,
    links: [
        {
            rel: "next"|"prev",
            uri: string,
        }
    ]
};
type FullApiOptions = ApiOptions & (
    | {url?: never, path: string} 
    | {url: string, path?: never}
);

////////////////////////////////////////////////////////////////////
//          INTERNAL METHODS
////////////////////////////////////////////////////////////////////
const baseRequest = async <T>(options: FullApiOptions): Promise<ApiResponse<T>> => {
    let url = formatApiUrl(options);
    console.log("SRL API URL: " + url)
    return fetch( url, {
        headers: {"User-Agent": "srl-test-project/0.1"},
    })
    .then( res => res.json() )
    .then( body => {
        if(body.status && body.status != 200) {
            return {error: body as ServiceBusy};
        }
        else {
            const content = body as ApiContent<T>;
            const nextLink = content.pagination.links.find(l => l.rel === "next");
            const next = nextLink ? () => baseRequest<T>({url: nextLink.uri}) : undefined;
            const prevLink = content.pagination.links.find(l => l.rel === "prev");
            const prev = prevLink ? () => baseRequest<T>({url: prevLink.uri}) : undefined;
            return {data: content.data, next, prev};
        }
    })
}

const formatApiUrl = (options: FullApiOptions) => {
    if(options.path !== undefined) {
        const orderBys = options?.orderBy ? "orderby=" + options.orderBy.join(",") : undefined;
        const embeds = options?.embeds ? "embed=" + options.embeds.join(",") : undefined;
        const direction = options?.orderDirection ? "direction=" + options.orderDirection : undefined;
        const extras = (orderBys || embeds || direction) 
            ? "?" + [orderBys, embeds, direction].filter(s => s != undefined).join("&") 
            : "";
        return `https://www.speedrun.com/api/v1/${options.path}${extras}`;
    } else {
        return options.url;
    }
}

////////////////////////////////////////////////////////////////////
//          EXPORT
////////////////////////////////////////////////////////////////////
export const api = {
    runs: (options?: RunApiOptions) => {
        return baseRequest<Run>( {path: "runs", ...options} );
    },
}