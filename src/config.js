// src/config.js

const useMock = true; // Change this to `true` to use the mock version

const supabase = useMock
  ? require("./supabaseMock").supabase
  : require("./supabase").supabase;

export { supabase };
