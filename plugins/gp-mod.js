// Plugin Moderatori — Sistema 888 BOT

let handler = async (m, { conn, text, command, usedPrefix, isOwner, isAdmin }) => {

    // Solo Owner o Admin del gruppo possono gestire i moderatori
    if (!isOwner && !isAdmin)
        return m.reply("❌ Questo comando è riservato al proprietario del bot o agli admin del gruppo.")

    let chatId = m.chat

    // Inizializzazione database chat
    if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {}
    if (!global.db.data.chats[chatId].moderatori) global.db.data.chats[chatId].moderatori = []

    let mods = global.db.data.chats[chatId].moderatori

    // ---------------------- ADDMOD ----------------------
    if (command === 'addmod') {
        let who = m.mentionedJid?.[0]
            || (m.quoted ? m.quoted.sender : null)
            || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)

        if (!who) return m.reply("Tagga qualcuno per aggiungerlo come moderatore.")
        if (mods.includes(who)) return m.reply("⚠️ Questo utente è già moderatore.")

        mods.push(who)

        return m.reply(
            `✅ @${who.split('@')[0]} è stato aggiunto come *Moderatore*!\n` +
            `> Usa *.mods* per vedere i comandi disponibili.`,
            null,
            { mentions: [who] }
        )
    }

    // ---------------------- DELMOD ----------------------
    if (command === 'delmod') {
        let who = m.mentionedJid?.[0]
            || (m.quoted ? m.quoted.sender : null)
            || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)

        if (!who) return m.reply("Tagga qualcuno per rimuoverlo.")
        if (!mods.includes(who)) return m.reply("⚠️ Questo utente non è moderatore.")

        global.db.data.chats[chatId].moderatori = mods.filter(jid => jid !== who)

        return m.reply(
            `🗑️ Privilegi rimossi per @${who.split('@')[0]}.`,
            null,
            { mentions: [who] }
        )
    }

    // ---------------------- LISTA MODERATORI ----------------------
    if (command === 'listanera') {
        if (mods.length === 0) return m.reply("📋 Nessun moderatore registrato.")

        let lista = `📋 *LISTA MODERATORI*\n\n`
        mods.forEach((jid, i) => lista += `${i + 1}. @${jid.split('@')[0]}\n`)

        return conn.sendMessage(chatId, { text: lista, mentions: mods }, { quoted: m })
    }

    // ---------------------- COMANDO MODS ----------------------
    if (command === 'mods') {
        let txt = `
🛡️ *COMANDI MODERATORI — SISTEMA 888 BOT*

• .addmod @utente
  ➜ Aggiunge un moderatore (solo Owner/Admin)

• .delmod @utente
  ➜ Rimuove un moderatore (solo Owner/Admin)

• .listanera
  ➜ Mostra la lista dei moderatori

⚠️ I moderatori NON possono:
• promuovere admin
• declassare admin
• gestire ruoli
• modificare permessi del gruppo
        `.trim()

        return m.reply(txt)
    }
}

// ---------------------- PROTEZIONE COMANDI ----------------------
handler.before = async function (m) {
    if (!m.isGroup || !global.db.data.chats[m.chat]?.moderatori) return

    let mods = global.db.data.chats[m.chat].moderatori

    // Se non è moderatore, ignora
    if (!mods.includes(m.sender)) return

    // Comandi proibiti ai moderatori
    const comandiProibiti = /^(promote|demote|admin|unadmin|addadmin|deladmin)$/i

    let body = m.text?.trim() || ''
    let isCommand = /^[.!/]/.test(body)
    let cmd = body.slice(1).split(' ')[0].toLowerCase()

    if (isCommand && comandiProibiti.test(cmd)) {
        return m.reply("🚫 *Azione non consentita*\nI Moderatori non possono gestire i ruoli o gli admin.")
    }
}

handler.help = ['addmod', 'delmod', 'listanera', 'mods']
handler.tags = ['admin', 'group']
handler.command = /^(addmod|delmod|listanera|mods)$/i
handler.group = true
handler.admin = true

export default handler