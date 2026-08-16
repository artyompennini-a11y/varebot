let handler = async (m, { conn }) => {
    try {
        let username = await conn.getName(m.sender)

        // Variabile corretta
        let Punisher = `『 👋 』 *Hey ${username}!*\n`
        Punisher += `- \`Ecco tutte le informazioni per contattarmi:\`\n\n`
        Punisher += `『 📌 』 _*CONTATTI:*_\n`
        Punisher += `┌─⭓ \`Nome:\`\n  *˙⋆✮*     *Punisher*\n`
        Punisher += `├─⭓ \`Numero:\`\n  *˙⋆✮*     *wa.me/573117824583*\n`
        Punisher += `├─⭓ \`Email:\`\n  *˙⋆✮*     *thepunisher7894@gmail.com*\n`
        Punisher += `├─⭓ \`Instagram:\`\n  *˙⋆✮*     *samakavare*\n`
        Punisher += `├─⭓ \`GitHub:\`\n  *˙⋆✮*     *realvare*`

        const creatorCard = {
            image: { url: 'https://i.ibb.co/B29rgfjZ/sam.png' },
            body: Punisher,
            footer: '',
            buttons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '💻 GitHub',
                        url: 'https://github.com/realvare'
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '💬 WhatsApp',
                        url: 'https://wa.me/573117824583'
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📸 Instagram',
                        url: 'https://www.instagram.com/arty.340?igsh=ZGxranlrczNybHJ0'
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📧 Email',
                        url: 'mailto:thepunisher7894@gmail.com'
                    })
                }
            ]
        }

        await conn.sendMessage(
            m.chat,
            {
                text: `ㅤ⋆｡˚『 ╭ \`𝘾𝙍𝙀𝘼𝙏𝙊𝙍𝙀\` ╯ 』˚｡⋆\n╭\n│ 『 👨‍💻 』 \`Sviluppatore:\` \n│ ➤  _*Punisher*_\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
                footer: '',
                cards: [creatorCard]
            },
            { quoted: m }
        )

    } catch (error) {
        console.error('Errore invio messaggio creatore:', error)

        try {
            let username = await conn.getName(m.sender)

            let fallback = `『 👋 』 Hey ${username}!\n\n`
            fallback += `👨‍💻 *Creatore: Punisher*\n`
            fallback += `📱 WhatsApp: wa.me/573117824583\n`
            fallback += `📧 Email: thepunisher7894@gmail.com\n`
            fallback += `📸 Instagram: arty.340\n`
            fallback += `💻 GitHub: realvare`

            await conn.sendMessage(
                m.chat,
                {
                    image: { url: 'https://i.ibb.co/B29rgfjZ/sam.png' },
                    caption: fallback.trim()
                },
                { quoted: m }
            )

        } catch (fallbackError) {
            console.error('Errore anche nel fallback:', fallbackError)

            let username = await conn.getName(m.sender)
            await conn.reply(
                m.chat,
                `👋 Hey ${username}!\n\n👨‍💻 *Creatore: Punisher*\n\n📱 WhatsApp: wa.me/573117824583\n📧 Email: thepunisher7894@gmail.com\n📸 Instagram: arty.340\n💻 GitHub: realvare`,
                m
            )
        }
    }
}

handler.help = ['creatore']
handler.tags = ['info']
handler.command = /^(owner|creatore)$/i

export default handler