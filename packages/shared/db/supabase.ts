import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = ({
  supabaseUrl,
  supabaseKey,
}: {
  supabaseUrl: string;
  supabaseKey: string;
}) => {
  return createClient(supabaseUrl, supabaseKey);
};
