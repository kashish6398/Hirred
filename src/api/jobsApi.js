import createSupabaseClient from "@/utils/supabase";

export async function getJobs(token) {
    const supabase = await createSupabaseClient(token);

    const { data, error } = await supabase
    .from("jobs")
    .select("*");

  if (error) {
    console.log(error);
    return null;
  }

  return data;
}