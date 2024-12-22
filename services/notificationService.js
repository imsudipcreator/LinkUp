import { supabase } from "../lib/supabase";

export const createNotification = async (notification) => {
    try {
        
        const {data, error} = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();
        
        if(error){
            console.log(" notification error", error)
            return {success : false, msg : 'An error occurred while notification sending'}
        }
        return {success : true, data : data}
            
    } catch (error) {
        console.log(" notification error", error)
        return {success : false, msg : 'An error occurred while notification sending'}
    }
}


export const fetchNotifications = async (receiverId) => {
    try {
        const {data, error} = await supabase
        .from('notifications')
        .select(
            `* , sender : senderid(id , name , image)`
        )
        .eq('receiverid', receiverId)
        .order('created_at' , {ascending : false})

        if(error){
            console.log(" fetch notification error", error)
            return {success : false, msg : 'An error occurred while fetching notification '}
        }
        return {success : true, data : data}
            
    } catch (error) {
        console.log(" fetch notification error", error)
        return {success : false, msg : 'An error occurred while fetching notification'}
    }
}