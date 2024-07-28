// import React, { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// function LeaderboardPage() {
//   const [leaderboard, setLeaderboard] = useState([]);

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       const { data } = await supabase
//         .from("leaderboard")
//         .select("*")
//         .order("score", { ascending: false });

//       setLeaderboard(data);
//     };

//     fetchLeaderboard();
//   }, []);

//   return (
//     <div>
//       <h1>Leaderboard</h1>
//       <ul>
//         {leaderboard.map((entry) => (
//           <li key={entry.id}>
//             {entry.name}: {entry.score}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default LeaderboardPage;
