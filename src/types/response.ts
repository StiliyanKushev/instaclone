import { IValidationResultErrors } from "./form-validation";
import { IPost } from "../shared/PostsPartial/PostsPartial";

export default interface IGenericResponse {
    success: boolean,
    messege: string,
    errors?: IValidationResultErrors
}

export interface IPostsChunkResponse {
    success: boolean,
    posts: Array<IPost>
}