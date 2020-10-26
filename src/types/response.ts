import { IValidationResultErrors } from "./form-validation";
import { IPost, IPostComment } from '../shared/PostsPartial/PostsPartial';
import { DirectItem } from '../components/InboxView/InboxView';

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

export interface IPostCommentResponse extends IGenericResponse {
    comment: IPostComment,
}

export interface IDirectsChunkResponse extends IGenericResponse {
    directs: Array<DirectItem>
}

export interface IMessage {
    user: string,
    text: string,
}

export interface IMessageDB {
    name: string,
    text: string,
}