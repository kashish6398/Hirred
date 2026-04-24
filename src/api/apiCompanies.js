import createSupabaseClient from "@/utils/supabase";

export async function getCompanies(token){
    const supabase = await createSupabaseClient(token);

    const {data,error} = await supabase.from("companies").select("*");

    if(error){
        console.error("Error fetching companies:", error);
        return null;
    }

    return data;
} 