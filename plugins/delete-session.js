import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, {
      text: "*🚨 𝐔𝐭𝐢𝐥𝐢𝐳𝐳𝐢 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐝𝐢𝐫𝐞𝐭𝐭𝐚𝐦𝐞𝐧𝐭𝐞 𝐧𝐞𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐝𝐞𝐥 𝐛𝐨𝐭.*"
    }, { quoted: m });
  }

  try {
    const sessionFolder = "./varesession/";

    if (!existsSync(sessionFolder)) {
      return await conn.sendMessage(m.chat, {
        text: "*❌ 𝐍𝐨𝐧 𝐜𝐢 𝐬𝐨𝐧𝐨 𝗵𝗮𝗻𝗱𝗶𝗰𝗮𝗽𝗽𝗮𝘁𝗶 o 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐨𝐧𝐨.*"
      }, { quoted: m });
    }

    const sessionFiles = await fsPromises.readdir(sessionFolder);
    let deletedCount = 0;

    for (const file of sessionFiles) {
      if (file !== "creds.json") {
        await fsPromises.unlink(path.join(sessionFolder, file));
        deletedCount++;
      }
    }

    const textMsg = deletedCount === 0 
      ? '❗ 𝐍𝐢𝐞𝐧𝐭𝐞 𝗵𝗮𝗻𝗱𝗶𝗰𝗮𝗽𝗽𝗮𝘁𝗶, 𝐫𝐢𝐩𝐫𝐨𝐯𝐚 𝐭𝐫𝐚 𝐩𝐨𝐜𝐨 𝐧𝐞 𝐡𝐨 𝐛𝐢𝐬𝐨𝐠𝐧𝐨 ‼️' 
      : '🔥🔫 𝐇𝐨 𝐬𝐩𝐚𝐰𝐧-𝐤𝐢𝐥𝐥𝐚𝐭𝐨 ' + deletedCount + ' 𝗵𝗮𝗻𝗱𝗶𝗰𝗮𝗽𝗽𝗮𝘁𝗶 !💀';

    await conn.sendMessage(m.chat, {
      text: textMsg
    }, { quoted: m });

  } catch (error) {
    console.error('Errore durante l\'eliminazione delle sessioni:', error);
    await conn.sendMessage(m.chat, { text: "❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐳𝐢𝐨𝐧𝐞!" }, { quoted: m });
  }
};

handler.help = ['deletession'];
handler.tags = ["owner"];
handler.command = /^(deletession|ds)$/i;
handler.owner = true;

export default handler;
