import { ApiOptions, Link } from "./util-types"

export type Run = {
    "id": string,
    "weblink": string,
    "game": string,
    "level": string | null,
    "category": string,
    "videos": null | { text: string, links: Link[]},
    "comment": string | null,
    "status": {
        "status": "new" | "verified" | "rejected",
        "examiner": null |string,
        "verify-date": null | string,
    },
    "players": (Link & {id:string} )[],
    "date": string | null,
    "submitted": string | null,
    "system": {
        "platform": null,
        "emulated": boolean,
        "region": null | string,
    },
    "splits": null | Link
    "links": Link[]
}

type OrderBy = 'game' | 'category' | 'level' | 'platform' | 'region' | 'emulated' | 'date' | 'submitted' | 'status' | 'verify-date';

export interface RunApiOptions extends ApiOptions {
    orderBy?: OrderBy[],
}