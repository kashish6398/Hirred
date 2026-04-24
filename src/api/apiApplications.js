import createSupabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
  const supabase = await createSupabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.error("Error uploading Resume:", storageError);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting application:", error);
    return null;
  }

  return data;
}

export async function updateApplicationStatus(token, { application_id }, status) {
  const supabase = await createSupabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", application_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error updating application status:", error);
    return null;
  }

  return data;
} 

export async function updateApplications(token, { job_id }, status){
    const supabase = await createSupabaseClient(token);

    const {data,error} = await supabase.from("applications").update({status}).eq("job_id",job_id).select("*");

    if(error || data.length === 0){
        console.error("Error Updating Application Status:", error);
        return null;
    }

    return data;
}