import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rmaojzgeofgjskqygrce.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtYW9qemdlb2ZnanNrcXlncmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMzM2MDksImV4cCI6MjAzNjkwOTYwOX0.dwG2oVqOIVJisQC3zGS9z7Jg1k2BvQsV3y0bSsXqp-I";
export const supabase = createClient(supabaseUrl, supabaseKey);
