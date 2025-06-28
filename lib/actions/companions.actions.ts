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