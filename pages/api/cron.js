import cron from 'node-cron';
import sendMail from "@/libs/mailer";


export default (req, res) => {

    // Schedule a task to run at a specific time and date
    cron.schedule('0 15 * * *', () => {
        sendMail('croftj0827@gmail.com', 'Scheduled Email', 'This is a scheduled email.');
    });

    res.status(200).json({ message: 'Cron job scheduled' });
}