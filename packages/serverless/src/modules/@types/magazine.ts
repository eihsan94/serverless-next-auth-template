import { Post } from "./post";

export interface Magazine {
    partition_key?: string,
    heroImage?: string, 
    title: string, 
    description: string, 
    isPublished: boolean,
    posts?: Post[],
}
