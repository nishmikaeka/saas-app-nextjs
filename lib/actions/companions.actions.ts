'use server'
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";


export const createCompanion = async (formData: CreateCompanion) => {
    try {
        const { userId: author } = await auth();
        
        if (!author) {
            throw new Error('User not authenticated');
        }

        console.log('Form data received:', formData);
        console.log('User ID:', author);

        const supabase = createSupabaseClient();

        // Test the connection first with a simple select
        const { data: testData, error: testError } = await supabase
            .from('companions')
            .select('id')
            .limit(1);

        if (testError) {
            console.error('Supabase connection test failed:', testError);
            throw new Error(`Database connection failed: ${testError.message}`);
        }

        console.log('Database connection test passed');

        const insertData = {
            ...formData,
            author
        };

        console.log('Data to insert:', insertData);

        const { data, error } = await supabase
            .from('companions')
            .insert(insertData)
            .select();

        console.log('Insert result - data:', data);
        console.log('Insert result - error:', error);

        if (error) {
            console.error('Supabase insert error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw new Error(`Database error: ${error.message}`);
        }

        if (!data || data.length === 0) {
            throw new Error('No data returned from insert operation');
        }

        console.log('Successfully created companion:', data[0]);
        return data[0];

    } catch (error) {
        console.error('Error in createCompanion:', error);
        throw error;
    }
}

export const getAllCompanions=async ({limit=10,page=1,subject,topic}:GetAllCompanions)=>{
   const supabase=createSupabaseClient();
   
   let query=supabase.from('companions').select();

   if(subject && topic){
    query=query.ilike('subject',`%${subject}%`)
        .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
   } else if(subject){
    query=query.ilike('subject',`%${subject}%`);
   } else if(topic){
    query=query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
   }

   query=query.range((page-1)*limit,page*limit-1)
   const {data:companions,error}=await query;
   if(error) throw new Error(error.message);

   return companions;
}

export const getCompanion=async(id:string)=>{
    const supabase=createSupabaseClient();

    const{data,error}=await supabase
        .from('companions')
        .select()
        .eq('id',id);
    
    if(error) return console.log(error);

    return data[0];
}

export const addToSessionHistory=async (companionId:string)=>{
    const {userId}=await auth();
    const supabase=createSupabaseClient();
    const {data,error}=await supabase.from('session_history').insert({
        companion_id:companionId,
        user_Id:userId
    })

    if(error) throw new Error(error.message)
    return data;
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}