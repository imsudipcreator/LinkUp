import User from "../assets/icons/User";
import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
    try {
        

        if(post.file && typeof post.file == 'object'){
            let isImage = post?.file?.type  =='image';
            let folderName = isImage ? 'postImages' : 'postVideos';
            let fileResult = await uploadFile( folderName  , post?.file?.uri  ,isImage);  
            if(fileResult.success) post.file = fileResult.data;    
            else{
                return fileResult;
            }
        }
        const {data, error} = await supabase
        .from('posts')
        .upsert(post)
        .select()
        .single();
        
        if(error){
            console.log(" create post error", error)
            return {success : false, msg : 'An error occurred while creating post'}
        }
        return {success : true, data : data}
            
    } catch (error) {
        console.log(" create post error", error)
        return {success : false, msg : 'An error occurred while creating post'}
    }
}




export const fetchPosts = async (limit=10 , userId) => {
    try {
       if(userId){
            const {data, error} = await supabase
            .from('posts')
            .select(
                `* , user : users(id , name , image) , postLikes(*) , comments(count)`
            )
            .order('created_at', {ascending : false})
            .eq('userid' , userId)
            .limit(limit)

            if(error){
                console.log(" fetch post error", error)
                return {success : false, msg : 'An error occurred while fetching posts'}
            }
            return {success : true, data : data}

       }else{
            const {data, error} = await supabase
            .from('posts')
            .select(
                `* , user : users(id , name , image) , postLikes(*) , comments(count)`
            )
            .order('created_at', {ascending : false})
            .limit(limit)

            if(error){
                console.log(" fetch post error", error)
                return {success : false, msg : 'An error occurred while fetching posts'}
            }
            return {success : true, data : data}
       }
            
    } catch (error) {
        console.log(" fetch post error", error)
        return {success : false, msg : 'An error occurred while fetching posts'}
    }
}


export const fetchPostDetails = async (postId) => {
    try {
        const {data, error} = await supabase
        .from('posts')
        .select(
            `* , user : users(id , name , image) , postLikes(*) , comments(* , user : users (id , name , image))`
        )
        .eq('id', postId)
        .order('created_at' , {ascending : false , foreignTable : 'comments'})
        .single();

        if(error){
            console.log(" fetch post details  error", error)
            return {success : false, msg : 'An error occurred while fetching post details'}
        }
        return {success : true, data : data}
            
    } catch (error) {
        console.log(" fetch post details error", error)
        return {success : false, msg : 'An error occurred while fetching post details'}
    }
}




export const createPostLike = async (postLike) => {
    try {
        
        const {data, error} = await supabase
        .from('postLikes')
        .insert(postLike)
        .select()
        .single();
        
        if(error){
            console.log(" like post error", error)
            return {success : false, msg : 'An error occurred while liking posts'}
        }
        return {success : true, data : data}
            
    } catch (error) {
        console.log(" like post error", error)
        return {success : false, msg : 'An error occurred while liking posts'}
    }
}


export const removePostLike = async (postId , userId) => {
    try {
        
        const { error} = await supabase
        .from('postLikes')
        .delete()
        .eq('postid', postId)
        .eq('userid', userId);

        if(error){
            console.log(" dislike post error", error)
            return {success : false, msg : 'An error occurred while disliking posts'}
        }
        return {success : true}
            
    } catch (error) {
        console.log(" dislike post error", error)
        return {success : false, msg : 'An error occurred while disliking posts'}
    }
}


export const createComment = async (comment) => {
    try {
        
        const {data, error} = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();
        
        if(error){
            console.log(" comment error", error)
            return {success : false, msg : 'An error occurred while commenting posts'}
        }
        return {success : true, data : data}
            
    } catch (error) {
        console.log(" comment error", error)
        return {success : false, msg : 'An error occurred while commenting posts'}
    }
}





export const removeComment = async (commentId) => {
    try {
        
        const { error} = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

        if(error){
            console.log(" delete comment error", error)
            return {success : false, msg : 'An error occurred while deleting comment'}
        }
        return {success : true , data : {commentId}}
            
    } catch (error) {
        console.log(" delete comment error", error)
        return {success : false, msg : 'An error occurred while deleting comment'}
    }
}


export const removePost = async (postId) => {
    try {
        
        const { error} = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

        if(error){
            console.log(" delete post error", error)
            return {success : false, msg : 'An error occurred while deleting post'}
        }
        return {success : true , data : {postId}}
            
    } catch (error) {
        console.log(" delete post error", error)
        return {success : false, msg : 'An error occurred while deleting post'}
    }
}
