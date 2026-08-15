// Plugin by Elixir & 888 staff
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import path, { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn }) => {
  try {
    const dataDir = join(__dirname, '../data')
    const staffFilePath = join(dataDir, 'staff.json')

    // Se la cartella data non esiste, la crea
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }

    // Se il file staff.json non esiste, ne crea uno di default
    if (!existsSync(staffFilePath)) {
      const defaultStaff = [
        {
          nome: "Owner",
          ruolo: "Owner / Creatore",
          telefono: "390000000000",
          instagram: "",
          telegram: ""
        }
      ]
      writeFileSync(staffFilePath, JSON.stringify(defaultStaff, null, 2), 'utf8')
    }

    const staffData = JSON.parse(readFileSync(staffFilePath, 'utf8'))

    const botVersion = global.versione || global.db?.data?.version || "1.0"

    let staff = `*⋆｡˚✦『 𝐒𝐓𝐀𝐅𝐅 』✦˚｡⋆*`
    staff += `\n\n*╭───────────────╮*`
    staff += `\n*│ 🆚 𝐕𝐞𝐫𝐬𝐢𝐨𝐧𝐞:* ${botVersion}`
    staff += `\n*╰───────────────╯*`

    if (Array.isArray(staffData) && staffData.length > 0) {
      // Owner / Creatore
      const owner = staffData[0]
      staff += `\n\n*╭─── 👑 𝐂𝐑𝐄𝐀𝐓𝐎𝐑𝐄 ───╮*`
      staff += `\n*│ ✦ 𝐍𝐨𝐦𝐞:* ${owner.nome || 'Non specificato'}`
      staff += `\n*│ ✦ 𝐑𝐮𝐨𝐥𝐨:* ${owner.ruolo || 'Creatore'}`
      if (owner.telefono) staff += `\n*│ ✦ 𝐂𝐨𝐧𝐭𝐚𝐭𝐭𝐨:* wa.me/${owner.telefono.replace(/[^0-9]/g, '')}`
      if (owner.instagram) staff += `\n*│ ✦ 𝐈𝐆:* instagram.com/${owner.instagram}`
      if (owner.telegram) staff += `\n*│ ✦ 𝐓𝐆:* @${owner.telegram}`
      staff += `\n*╰────────────────────╯*`

      // Co-Owners
      const coOwners = staffData.slice(1).filter(m => m.ruolo && m.ruolo.toLowerCase().includes('owner'))
      if (coOwners.length > 0) {
        staff += `\n\n*╭─── 🔱 𝐂𝐎-𝐎𝐖𝐍𝐄𝐑 ───╮*`
        for (const co of coOwners) {
          staff += `\n*│ ✦ ${co.nome}*`
          staff += `\n*│   ├ 𝐑𝐮𝐨𝐥𝐨:* ${co.ruolo}`
          if (co.telefono) staff += `\n*│   ├ 𝐂𝐨𝐧𝐭𝐚𝐭𝐭𝐨:* wa.me/${co.telefono.replace(/[^0-9]/g, '')}`
          if (co.instagram) staff += `\n*│   ├ 𝐈𝐆:* instagram.com/${co.instagram}`
          if (co.telegram) staff += `\n*│   └ 𝐓𝐆:* @${co.telegram}`
          staff += `\n*│*`
        }
        staff += `\n*╰────────────────────╯*`
      }

      // Managers / Staff
      const managers = staffData.slice(1).filter(m => m.ruolo && m.ruolo.toLowerCase().includes('manager'))
      if (managers.length > 0) {
        staff += `\n\n*╭─── 🛡️ 𝐒𝐓𝐀𝐅𝐅 ───╮*`
        for (const mgr of managers) {
          staff += `\n*│ ✦ ${mgr.nome}*`
          staff += `\n*│   ├ 𝐑𝐮𝐨𝐥𝐨:* ${mgr.ruolo}`
          if (mgr.telefono) staff += `\n*│   └ 𝐂𝐨𝐧𝐭𝐚𝐭𝐭𝐨:* wa.me/${mgr.telefono.replace(/[^0-9]/g, '')}`
          staff += `\n*│*`
        }
        staff += `\n*╰────────────────────╯*`
      }
    }

    staff += `\n\n*╭─── 📌 𝐈𝐍𝐅𝐎 𝐔𝐓𝐈𝐋𝐈 ───╮*`
    staff += `\n*│ ✦ 𝐆𝐢𝐭𝐡𝐮𝐛:* https://github.com/Elixir-png/ElixirBot_`
    staff += `\n*│ ✦ 𝐂𝐚𝐧𝐚𝐥𝐞:* https://whatsapp.com/channel/0029Vb8Y0igGufJ0xMYJmU40`
    staff += `\n*│ ✦ 𝐄𝐦𝐚𝐢𝐥:* ElixirBoTSupporto@proton.me`
    staff += `\n*╰────────────────────╯*`

    const mentionedJids = (staffData || [])
      .filter(m => m.telefono)
      .map(m => `${m.telefono.replace(/[^0-9]/g, '')}@s.whatsapp.net`)

    const contacts = (staffData || [])
      .filter(m => m.telefono)
      .map(m => {
        const cleanPhone = m.telefono.replace(/[^0-9]/g, '')
        return {
          vcard: `BEGIN:VCARD
VERSION:3.0
FN:${m.nome}
ORG:${m.ruolo || 'Staff'}
TEL;type=CELL;type=VOICE;waid=${cleanPhone}:+${cleanPhone}
END:VCARD`
        }
      })

    await conn.reply(m.chat, staff.trim(), m, {
      contextInfo: { mentionedJid: mentionedJids }
    })

    if (contacts.length > 0) {
      try {
        await conn.sendMessage(m.chat, {
          contacts: {
            displayName: `Team`,
            contacts: contacts
          }
        }, { quoted: m })
      } catch (e) {
        console.error('Errore invio contatti:', e)
      }
    }

    await m.react('👑')
  } catch (e) {
    console.error('Errore nel plugin staff:', e)
    await conn.reply(m.chat, '❌ Si è verificato un errore nel caricamento dello staff.', m)
  }
}

handler.help = ['staff', 'team']
handler.tags = ['main']
handler.command = ['staff', 'team']

export default handler
