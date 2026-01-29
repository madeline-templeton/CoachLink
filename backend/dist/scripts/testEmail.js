import "dotenv/config";
import { sendCoachEmail } from "../utils/email";
async function main() {
    const to = process.env.TEST_COACH_EMAIL || process.env.FROM_EMAIL;
    if (!to) {
        throw new Error("Set TEST_COACH_EMAIL or FROM_EMAIL in your environment to run the test");
    }
    await sendCoachEmail({
        to,
        coachName: "Coach Test",
        session: {
            sport: "tennis",
            dateStr: "2026-02-01",
            time: "10:00",
            city: "Providence",
            state: "RI",
        },
        player: {
            playerName: "Test Player",
            playerEmail: "player@example.com",
            playerPhoneNumber: "5551234567",
            playerAge: 16,
            playerSkill: "beginner",
            specificGoals: "Practice",
            additionalComments: "N/A",
        },
    });
    console.log("Test email sent to:", to);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
