import nodemailer from "nodemailer";
export async function sendCoachEmail(params) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL = SMTP_USER, } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
        throw new Error("SMTP env not configured: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL");
    }
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
    const subject = `New booking for ${params.session.sport} (${params.session.city}, ${params.session.state})`;
    const lines = [
        `Hi ${params.coachName},`,
        "",
        `A player booked your session:`,
        `Sport: ${params.session.sport}`,
        params.session.dateStr ? `Date: ${params.session.dateStr}` : undefined,
        params.session.time ? `Time: ${params.session.time}` : undefined,
        `Location: ${params.session.city}, ${params.session.state}`,
        "",
        `Player details:`,
        `Name: ${params.player.playerName}`,
        `Email: ${params.player.playerEmail}`,
        `Phone: ${params.player.playerPhoneNumber}`,
        `Age: ${params.player.playerAge}`,
        `Skill: ${params.player.playerSkill}`,
        `Goals: ${params.player.specificGoals}`,
        `Comments: ${params.player.additionalComments}`,
        "",
        `Please reach out to the player to coordinate before the session.`,
    ].filter(Boolean);
    await transporter.sendMail({
        from: FROM_EMAIL,
        to: params.to,
        subject,
        text: lines.join("\n"),
    });
}
