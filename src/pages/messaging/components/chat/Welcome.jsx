import { EmojiEmotions } from "@mui/icons-material"; // Importing the MUI welcome icon

export default function Welcome() {
  return (
    <div className="lg:col-span-2 lg:block bg-white dark:bg-gray-900">
      <div className="pl-5">
        {/* MUI EmojiEmotions Icon used as the welcome icon */}
        <div className="text-center">
          <EmojiEmotions style={{ fontSize: 60, color: "#4CAF50" }} /> {/* Adjust the size and color */}
        </div>
        <div className="text-center">
          <h2 className="text-xl text-gray-500 dark:text-gray-400">
            Select a Chat to Start Messaging
          </h2>
        </div>
      </div>
    </div>
  );
}
