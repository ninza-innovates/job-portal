import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// Fetch Companies
export async function getCompanies(token) {
  const supabase = await supabaseClient(token); // Supabase client instance
  const { data, error } = await supabase.from("companies").select("*"); // Fetch companies data

  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  } // Throw error if fetch fails

  return data; // Return fetched data
}

// Add Company
export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token); // Supabase client instance

  const random = Math.floor(Math.random() * 90000); // Random number for file name
  const fileName = `logo-${random}-${companyData.name}`; // File name for logo

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo); // Upload logo to storage

  if (storageError) throw new Error("Error uploading Company Logo"); // Throw error if upload fails

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`; // Logo URL

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: logo_url,
      },
    ])
    .select(); // Insert company data to companies table

  if (error) {
    console.error(error);
    throw new Error("Error submitting Companys");
  } // Throw error if insert fails

  return data; // Return inserted data
}
