const SUPABASE_URL = "https://blmasercflmukvqwkneg.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_LI7iWnaVHxf-wIpbrjrUwA_UDjSkLMS";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
