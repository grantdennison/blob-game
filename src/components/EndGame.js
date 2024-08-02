import { supabase } from "../config";

export const endGame = async (user, onEndGame) => {
  if (user && user.userId) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ room_id: null })
        .eq("id", user.userId);
      if (error) {
        console.error("Error ending game:", error.message);
      } else {
        // Call the onEndGame callback to handle any additional logic
        if (onEndGame) {
          onEndGame();
        }
      }
    } catch (error) {
      console.error("Unexpected error ending game:", error);
    }
  }
};
