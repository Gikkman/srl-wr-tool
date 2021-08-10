export type Link = {
    rel: string,
    uri: string,
}

export type ApiResponse<T> = {data: T[], next?: () => Promise<ApiResponse<T>>, prev?: () => Promise<ApiResponse<T>>, error: undefined} 
                           | {data: undefined, error: ServiceBusy};

export type ApiOptions = {
    embeds?: string[],
    orderBy?: string[],
    orderDirection?: "desc" | "asc",
}

export type ServiceBusy = {
    status: number,
    message: string,
    links: Link[]
}