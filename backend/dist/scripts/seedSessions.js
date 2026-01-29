import "dotenv/config";
import { firestore } from "../firebase/admin";
async function main() {
    const sessions = [
        {
            // Required SessionSchema fields
            date: new Date("2026-02-01"),
            sport: "tennis",
            time: "10:00",
            state: "RI",
            city: "Providence",
            duration: 60,
            cost: 45,
            booked: false,
            coachNote: "Intro drills",
            coachName: "Madeline Templeton",
            coachEmail: "madeline_templeton@brown.edu",
            coachExperience: "D1 soccer player at Brown",
            playerName: "Alex",
            playerEmail: "alex@example.com",
            playerPhoneNumber: "5551234567",
            playerAge: 16,
            playerSkill: "beginner",
            specificGoals: "Backhand",
            additionalComments: "N/A",
        },
        {
            date: new Date("2026-02-01"),
            sport: "soccer",
            time: "14:30",
            state: "RI",
            city: "Providence",
            duration: 90,
            cost: 30,
            booked: false,
            coachNote: "Ball control",
            coachName: "Madeline Templeton",
            coachEmail: "madeline_templeton@brown.edu",
            coachExperience: "D1 soccer player at Brown",
            playerName: "Sam",
            playerEmail: "sam@example.com",
            playerPhoneNumber: "5559876543",
            playerAge: 18,
            playerSkill: "intermediate",
            specificGoals: "Dribbling",
            additionalComments: "Bring water",
        },
    ];
    const batch = firestore.batch();
    for (const s of sessions) {
        const dateStr = s.date.toISOString().slice(0, 10);
        const ref = firestore.collection("sessions").doc();
        batch.set(ref, { ...s, dateStr, createdAt: Date.now() });
    }
    await batch.commit();
    console.log(`Seeded ${sessions.length} sessions.`);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
