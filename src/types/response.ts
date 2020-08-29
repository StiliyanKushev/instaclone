import { IValidationResultErrors } from "./form-validation";
import { IPost, IPostComment } from '../shared/PostsPartial/PostsPartial';

export default interface IGenericResponse {
    success: boolean,
    messege: string,
    errors?: IValidationResultErrors
}

export interface IPostsChunkResponse {
    success: boolean,
    posts: Array<IPost>
}

export interface ICommentsChunkResponse {
    success: boolean,
    comments: Array<IPostComment>
}

export interface IPostCommentResponse extends IGenericResponse{
    comment: IPostComment,
}