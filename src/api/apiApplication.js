import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// - Apply to job ( candidate )
export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token); // Get supabase client

  const random = Math.floor(Math.random() * 90000); // Random number for file name
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes") // Storage bucket
    .upload(fileName, jobData.resume); // Upload resume to storage

  if (storageError) throw new Error("Error uploading Resume"); // Throw error if upload fails

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`; // Resume URL

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select(); // Insert application data

  if (error) {
    // Throw error if insert fails
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data; // Return inserted data
}

// - Edit Application Status ( recruiter )
export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token); // Get supabase client instance
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select(); // Update application status

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  } // Throw error if update fails

  return data; // Return updated data
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token); // Get supabase client instance
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id); // Fetch applications data for candidate

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  } // Throw error if fetch fails

  return data; // Return fetched data
}
