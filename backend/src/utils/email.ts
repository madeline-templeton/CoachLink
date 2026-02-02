import sgMail from "@sendgrid/mail";

export type CoachEmailParams = {
  to: string;
  coachName: string;
  session: {
    sport: string;
    dateStr?: string;
    time?: string;
    city: string;
    state: string;
  };
  player: {
    playerName: string;
    playerEmail: string;
    playerPhoneNumber: string;
    playerAge: number;
    playerSkill: string;
    specificGoals: string;
    additionalComments: string;
  };
};

export async function sendCoachEmail(params: CoachEmailParams) {
  const { SENDGRID_API_KEY, FROM_EMAIL } = process.env as Record<
    string,
    string | undefined
  >;

  if (!SENDGRID_API_KEY || !FROM_EMAIL) {
    throw new Error(
      "SendGrid env not configured: SENDGRID_API_KEY, FROM_EMAIL",
    );
  }

  sgMail.setApiKey(SENDGRID_API_KEY);

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
  ].filter(Boolean) as string[];

  await sgMail.send({
    from: FROM_EMAIL,
    to: params.to,
    subject,
    text: lines.join("\n"),
  });
}

export type PlayerEmailParams = {
  to: string;
  playerName: string;
  session: {
    sport: string;
    dateStr?: string;
    time?: string;
    city: string;
    state: string;
    duration?: number;
    cost?: number;
  };
  coach: {
    coachName: string;
    coachEmail: string;
    coachExperience: string;
  };
};

export async function sendPlayerEmail(params: PlayerEmailParams) {
  const { SENDGRID_API_KEY, FROM_EMAIL } = process.env as Record<
    string,
    string | undefined
  >;

  if (!SENDGRID_API_KEY || !FROM_EMAIL) {
    throw new Error(
      "SendGrid env not configured: SENDGRID_API_KEY, FROM_EMAIL",
    );
  }

  sgMail.setApiKey(SENDGRID_API_KEY);

  const subject = `Booking Confirmed: ${params.session.sport} session with ${params.coach.coachName}`;
  const lines = [
    `Hi ${params.playerName},`,
    "",
    `Your session has been booked successfully!`,
    "",
    `Session details:`,
    `Sport: ${params.session.sport}`,
    params.session.dateStr ? `Date: ${params.session.dateStr}` : undefined,
    params.session.time ? `Time: ${params.session.time}` : undefined,
    params.session.duration
      ? `Duration: ${params.session.duration} minutes`
      : undefined,
    params.session.cost ? `Cost: $${params.session.cost}` : undefined,
    `Location: ${params.session.city}, ${params.session.state}`,
    "",
    `Your Coach:`,
    `Name: ${params.coach.coachName}`,
    `Email: ${params.coach.coachEmail}`,
    `Experience: ${params.coach.coachExperience}`,
    "",
    `Your coach may reach out to you before the session. Please check your email and be ready at the scheduled time!`,
    "",
    `See you on the field!`,
  ].filter(Boolean) as string[];

  await sgMail.send({
    from: FROM_EMAIL,
    to: params.to,
    subject,
    text: lines.join("\n"),
  });
}
