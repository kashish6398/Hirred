import createSupabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery } = {}) {
  const supabase = await createSupabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url), saved: saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }

  return data;
}

export async function saveJob(token, {alreadySaved}, saveData) {
  const supabase = await createSupabaseClient(token);

  if(alreadySaved){
    const {data,error: deleteError} = await supabase
    .from("saved_jobs")
    .delete()
    .eq("job_id", saveData.job_id);

    if (deleteError) {
    console.error("Error Deleting Saved jobs:", deleteError);
    return null;
  }
  return {data,message: "Job Removed"}

  } else {
    const {data,error: insertError} = await supabase
    .from("saved_jobs")
    .insert([saveData])
    .select();

    if (insertError) {
      console.error("Error Adding Saved jobs:", insertError);
      return null;
    }
    return {data,message: "Job Added"}
  }
}

export async function getSingleJob(token,{job_id}){
    const supabase = await createSupabaseClient(token);

    const {data,error} = await supabase
    .from("jobs")
    .select("*,company:companies(name,logo_url), applications: applications(*)")
    .eq("id",job_id)
    .single();

    if(error){
        console.error("Error fetching Job:", error);
        return null;
    }

    return data;
} 

export async function updateHiringStatus(token,{job_id},isOpen){
    const supabase = await createSupabaseClient(token);

    const {data,error} = await supabase
    .from("jobs")
    .update({ isOpen : isOpen})
    .eq("id",job_id)
    .select();

    if(error){
        console.error("Error updating hiring status:", error);
        return null;
    }

    return data;
} 

export async function addNewJob(token,_,jobData){
    const supabase = await createSupabaseClient(token);

    const {data,error} = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

    if(error){
        console.error("Error adding new job:", error);
        return null;
    }

    return data;
} 

export async function getSavedJobs(token){
    const supabase = await createSupabaseClient(token);

    const {data,error} = await supabase
    .from("saved_jobs")
    .select("* , job:jobs(*, company:companies(name,logo_url))");

    if(error){
        console.error("Error Fetching Saved jobs:", error);
        return null;
    }

    return data;
}

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await createSupabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching my jobs:", error);
    return null;
  }

  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await createSupabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id",job_id)
    .select();

  if (error) {
    console.error("Error deleting job:", error);
    return null;
  }

  return data;
}
