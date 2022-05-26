//const { Client, Location, List, Buttons, LocalAuth } ');
const ryz = require('./func.js')
const hx = require('hxz-api');
const brainly = require('brainly-scraper');
const cheerio = require("cheerio");
const axios = require("axios");
const translate = require('@vitalets/google-translate-api');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const gTTS = require('gtts');
const wiki = require('wikipedia');
const https = require('https');
const Wattpad = require('wattpad.js');
const w = new Wattpad();
const moment = require("moment-timezone");
const mime = require('mime-types');
const { Client, Buttons, List, MessageMedia, LocalAuth, LegacySessionAuth } = require('whatsapp-web.js');
const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't works in Windows
        '--disable-gpu'
      ],
    },
    authStrategy: new LocalAuth(),
})

var wit = moment().tz('Asia/Jayapura').format('HH:mm:ss');
var wita = moment().tz('Asia/Makassar').format('HH:mm:ss');
var wib = moment().tz('Asia/Jakarta').format('HH:mm:ss');

const antilink = JSON.parse(fs.readFileSync('./database/anti_link.json'))

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log(qr)
});


client.on('ready', () => {
    console.log('Client is ready!');
    client.setStatus('ok saya online')
});

function random_item(items)
{
  
return items[Math.floor(Math.random()*items.length)];
     
}

client.on('message', async (msg) => {
    if(msg.body.startsWith('!ig ')) {
        console.log(msg)
        const link = msg.body.slice(4);
        hx.igdl(link)
            .then(result => {
                const hasil = result.medias
                var string1 = JSON.stringify(hasil);
                var profile = JSON.parse(string1);
                console.log(hasil)
                const isc = profile[0].url
                const start = async function(a, b) {
                    const media = await MessageMedia.fromUrl(isc)
                    const chat = await msg.getChat()
                    await chat.sendMessage(media)
                }
                start();
            });
        }
});

client.on('message', async (msg) => {
    if(msg.body === '!infogempa') {
        axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json').then(({ data }) => {
        const tanggal = data.Infogempa.gempa.Tanggal
        const jam = data.Infogempa.gempa.Jam
        const kordinat = data.Infogempa.gempa.Coordinates
        const lintang = data.Infogempa.gempa.Lintang
        const bujur = data.Infogempa.gempa.Bujur
        const magnitude = data.Infogempa.gempa.Magnitude
        const Kedalaman = data.Infogempa.gempa.Kedalaman
        const Wilayah = data.Infogempa.gempa.Wilayah
        const potensi = data.Infogempa.gempa.Potensi
        const dirasakan = data.Infogempa.gempa.Dirasakan
        msg.reply(`
    *INFO GEMPA*

Tanggal = ${tanggal}
Jam = ${jam}
Kordinat = ${kordinat}
Lintang = ${lintang}
Bujur = ${bujur}
Magnitude = ${magnitude}
Kedalaman = ${Kedalaman}
Wilayah = ${Wilayah}
Potensi = ${potensi}
Dirasakan = ${dirasakan}  
        `)
      })
    }
})

client.on('message', async (msg) => {
    if(msg.body.startsWith('!kbbi ')) {
        const links = msg.body.slice(6)
        axios('https://kbbi.kemdikbud.go.id/entri/'+links).then(res => {
        const htmldata = res.data
        const $ = cheerio.load(htmldata)
        let hasil = {};
        hasil.arti = null
        hasil.title = null
        $('.container').filter(function (a, b) {
            hasil.title = $(this).find('h2').text().trim() == ''
                ? null
                : $(this).find('h2').text().trim(),
        
                hasil.arti = $(this).find('li').eq(0).text().replace(/\s+/g, ' ').trim() == ''
                    ? null
                    : $(this).find('li').eq(0).text().replace(/\s+/g, ' ').trim()
            });
        //console.log(hasil)
        msg.reply(`${hasil.title}\n\n${hasil.arti}`)
        }).catch (err => {
            msg.reply('error')
        })
    }
})

client.on('message', async (msg) => {
    if(msg.body.startsWith('!cocok ')) {
        const nam = msg.body.slice(7)
        const nama = nam.split('+')
        const nama1 = nama[0]
        const nama2 = nama[1]
        axios(`https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit%21+`).then(res => {
        try{
            const data = res.data
            const $ = cheerio.load(data)
            const cck = $('#body').text().split(nama2)[1].replace('< Hitung Kembali', '').split('\n')[0];
            const pos = cck.split('Sisi Negatif Anda: ')[0].replace('Sisi Positif Anda: ', '')
            const neg = cck.split('Sisi Negatif Anda: ')[1]
            const lov = 'https://www.primbon.com/' + $('#body > img').attr('src');
            const start = async function(a, b) {
                const media = await MessageMedia.fromUrl(lov)
                const chat = await msg.getChat()
                await chat.sendMessage(media, {caption : `
*nama anda* = ${nama1}
*nama pasangan* = ${nama2}
*sisi postif* = ${pos}
*sisi negatif* = ${neg}

sumber : primbon.com
                `})
            }
            start();
        }catch (err) {
            msg.reply('error !')
        }
      })
    }
})

client.on('message', async (msg) => {
    const pe = msg.boy
    if(msg.body.startsWith('!apakah')) {
        const pesan = ['iya','mungkin sih','g tau saya','tidak','tidak mungkin','sepertinya iya','sepertinya tidak','sudah pasti tidak','iya iya iya','yoi','iya in','mungkin','yes']
        const hasil = (random_item(pesan))
        msg.reply(hasil)
    }else if(msg.body === 'Hi') {
        msg.reply('hi juga !')
    }else if(msg.body.startsWith('!wiki ')) {
        const link = msg.body.slice(6);
        (async () => {
            try {
                const newUrl = await wiki.setLang('id')
                const page = await wiki.page(link);
                //console.log(page);
                //Response of type @Page object
                const summary = await page.summary();
                msg.reply(summary.extract);
                //Response of type @wikiSummary - contains the intro and the main image
            } catch (error) {
                msg.reply('opss saya tidak menemukan apapun')
                //=> Typeof wikiError
            }
        })();
    }else if(msg.body.startsWith('!bolekah')) {
        const pesan = ['boleh','boleh boleh aja','tidak boleh','jangan','iya','nggak boleh']
        const hasil = (random_item(pesan))
        msg.reply(hasil)
    }else if(msg.body.startsWith('!kapan')) {
        const pesan = ['tahun lalu','bulan lalu','3 minggu yang lalu','2 bulan yang lalu','kemarin','minggu lalu','2 tahun yang lalu','1 abad yang lalu','tahun depan','lusa','besok','dua minggu yang akan mendatang','minggu ini','bulan depan','nggak tau sih']
        const hasil = (random_item(pesan))
        msg.reply(hasil)
    }else if(msg.body.startsWith('!wpall ')) {
        const link = msg.body.slice(7);
        w.Stories.search(link).then(res => {
            ta = res.stories
            total = res.total
            let text = ""
            for(let te of res.stories) {
                judul = te.title
                des = te.description
                med = te.cover
                url = te.url
                text += `*judul*= ${judul}\n*deskripsi* = ${des}\n*url* = ${url}\n\n\n`
                }
            msg.reply(`*total hasil = ${total}*\n\n${text}`)
        })
        
    }else if(msg.body.startsWith('!wp ')) {
        const link = msg.body.slice(4);
        w.Stories.search(link).then(res => {
            ta = res.stories
            total = res.total
            let text = ""
            for(let te of res.stories) {
                judul = te.title
                des = te.description
                med = te.cover
                url = te.url
                //text += `*judul*= ${judul}\n*deskripsi* = ${des}\n*url* = ${url}\n\n\n`
                }
            const start = async function(a, b) {
                const media = await MessageMedia.fromUrl(med)
                const chat = await msg.getChat()
                const cap = `*judul* = ${judul}\n\n*deskripsi* = ${des}\n\n*url* = ${url}`
                await chat.sendMessage(media, {caption: cap})
            }
            start();
        })
    }
});

client.on('message', async (msg) => {
    if(msg.body.startsWith('!ytmp3 ')) {
        const link = msg.body.slice(7)
        msg.reply('Downoad media dari youtube...')
        ryz.youtube(link).then(result => {
            const link = result.mp3
            const id = result.id+".mp3"
            const title = result.title
            const size = result.size_mp3
            const thum = result.thumb
            const mp4 = result.link
            const mp4size = result.size
            const quality = result.quality
            const file = fs.createWriteStream(id)
            const request = https.get(link, function(response) {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    console.log("Download Completed");
                    try{
                        const start = async function(a, b) {
                            const media = await MessageMedia.fromFilePath(id)
                            const thumb = await MessageMedia.fromUrl(thum)
                            const chat = await msg.getChat()
                            await chat.sendMessage(media)
                            await chat.sendMessage(thumb, {caption : `title = ${title}\nsize = ${size}\n\n*VIDEO*\nsize = ${mp4size}\nquality = ${quality}\n\n*LINK DOWNLOAD*\n\n${mp4}`})
                            fs.unlinkSync(id)
                        }
                        start();
                    }catch (err) {
                        msg.reply('terjadi error, anda bisa menglangi jika terjadi error atau periksa link anda kembali')
                        try{
                            fs.unlinkSync(id)
                        }catch (err) {
                            console.log('delete file')
                        }
                    }
                })
            })
        })
    }else if(msg.body.startsWith('!ytmp4 ')) {
        const link = msg.body.slice(7)
        msg.reply('Downoad media dari youtube...')
        try{
            ryz.youtube(link).then(result => {
                //const link = result.mp3
                //const id = result.id+".mp3"
                const title = result.title
                //const size = result.size_mp3
                const thum = result.thumb
                const mp4 = result.link
                const mp4size = result.size
                const quality = result.quality
                const start = async function(a, b) {
                    try{
                        const thumb = await MessageMedia.fromUrl(thum)
                        const chat = await msg.getChat()
                        //await chat.sendMessage(media)
                        await chat.sendMessage(thumb, {caption : `title : ${title}\nsize : ${mp4size}\nquality : ${quality}\n\n*LINK DOWNLOADS*\n\n${mp4}`})

                    }catch (err) {
                        msg.reply('terjadi error !')
                    }
                }
                start();
            })
        }catch (err) {
            try {
                msg.reply('terjadi error harap periksa link anda kembali !')
            }catch (err) {
                console.log(err)
            }
        }
    }
})


client.on('message', async (msg) => {
    if(msg.body.startsWith('!lirik ')) {
        const link = msg.body.slice(7);
        msg.reply('*wait kak* permintaan sedang di proses.....')
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1000)
        try{
            ryz.lirik(link)
            .then(result => {
                const hasil = result.lirik
                const thumb = result.thumb
                const start = async function(a, b) {
                    const media = await MessageMedia.fromUrl(thumb)
                    const chat = await msg.getChat()
                    await chat.sendMessage(media, {caption: hasil})
                }
                start();
            }).catch(err => {
                msg.reply('terjadi error !')
                console.log(err)
            });
        }catch (err) {
            try {
                msg.reply('opss terjadi error')
            }catch (err) {
                console.log(err)
            }
        }
    }
});

client.on('message', async (msg) => {
    if(msg.body.startsWith('!chara ')) {
        let cha = msg.getChat();
        if (cha.isGroup) {
            msg.reply('fitur character telah di ubah menjadi self mode\nchat privat only')

        } else {
            try{
                const link = msg.body.slice(7);
                msg.reply('*wait kak* permintaan sedang di proses.....')
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(500)
                ryz.chara(link).then(result => {
                    const hasil = (random_item(result))
                    console.log(hasil)
                    const start = async function(a, b) {
                        const media = await MessageMedia.fromUrl(hasil)
                        const chat = await msg.getChat()
                        await chat.sendMessage(media, {caption: link})
                    }
                    start();
                })
            }catch (err) {
                try {
                    msg.reply('opss terjadi error')
                }catch (err) {
                    console.log(err)
                }
            }
        }
    }
});


client.on('message', async (msg) => {
    if(msg.body.startsWith('!pint ')) {
        let cha = msg.getChat();
        const link = msg.body.slice(6);
        msg.reply('*wait* permintaan sedang di proses !')
        axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + link, {
			headers: {
			"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
		}
			}).then(({data}) => {
                const $ = cheerio.load(data)
                const result = [];
		        const hasil = [];
                $('div > a').get().map(b => {
                    const link = $(b).find('img').attr('src')
                        result.push(link)
                    });
                       result.forEach(v => {
                     if(v == undefined) return
                     hasil.push(v.replace(/236/g,'736'))
                        })
                        hasil.shift();
                        const dta = (random_item(hasil))
                        const start = async function(a, b) {
                            try {
                                const media = await MessageMedia.fromUrl(dta)
                                const chat = await msg.getChat()
                                await chat.sendMessage(media, {caption: link})
                            }catch (err){
                                try{
                                    msg.reply(`tidak menemukan ${link}`)
                                }catch (err) {
                                    console.log('')
                                }
                            }
                        }
                        start();
            }).catch (err => {
                try{
                    msg.reply(`opss terjadi error`)
                }catch (err) {
                    console.log('')
                }
            })
    }
});

client.on('message', async (msg) => {
    if(msg.body.startsWith("!tr ")) {
        const te = msg.body.slice(4);
        const words = te.split(' ')[0];
        str = te.replace(words, "");
        console.log(str)
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(2000)
        try {
            translate(str, {to: words}).then(res => {
                msg.reply(res.text)
                console.log(res.from.language.iso);
            }).catch(err => {
                console.error(err);
            });
        }catch (err) {
            try {
                msg.reply('opss terjadi error')
            }catch (err) {
                console.log(err)
            }
        }
        
    }
})

client.on('message', async (message) => {
    if(message.body === '!sticker' || message.body === '!s'){
        if(message.hasMedia){
           message.downloadMedia().then(media => {

                if (media) {
    
                    const mediaPath = './downloaded-media/';
    
                    if (!fs.existsSync(mediaPath)) {
                        fs.mkdirSync(mediaPath);
                    }
    
    
                    const extension = mime.extension(media.mimetype);
    
                    const filename = new Date().getTime();
    
                    const fullFilename = mediaPath + filename + '.' + extension;
    
                    // Save t o file
                    try {
                        fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
                        console.log('File downloaded successfully!', fullFilename);
                        console.log(fullFilename);
                        MessageMedia.fromFilePath(filePath = fullFilename)
                        client.sendMessage(message.from, new MessageMedia(media.mimetype, media.data, filename), { sendMediaAsSticker: true,stickerAuthor:"Reyzbot",stickerName:"By"} )
                        fs.unlinkSync(fullFilename)
                        console.log(`File Deleted successfully!`,);
                    } catch (err) {
                        console.log('Failed to save the file:', err);
                        console.log(`File Deleted successfully!`,);
                    }
                }
            });
        }else if(message.hasQuotedMsg) {
            const msg = await message.getQuotedMessage();
            console.log(msg)
            if(msg.type === 'video' || msg.type === 'image') {
                message.downloadMedia().then(media => {

                    if (media) {
        
                        const mediaPath = './downloaded-media/';
        
                        if (!fs.existsSync(mediaPath)) {
                            fs.mkdirSync(mediaPath);
                        }
        
        
                        const extension = mime.extension(media.mimetype);
        
                        const filename = new Date().getTime();
        
                        const fullFilename = mediaPath + filename + '.' + extension;
        
                        // Save t o file
                        try {
                            fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
                            console.log('File downloaded successfully!', fullFilename);
                            console.log(fullFilename);
                            MessageMedia.fromFilePath(filePath = fullFilename)
                            client.sendMessage(message.from, new MessageMedia(media.mimetype, media.data, filename), { sendMediaAsSticker: true,stickerAuthor:"BOT DARK MOON",stickerName:"Bot"} )
                            fs.unlinkSync(fullFilename)
                            console.log(`File Deleted successfully!`,);
                        } catch (err) {
                            console.log('Failed to save the file:', err);
                            console.log(`File Deleted successfully!`,);
                        }
                    }
                });
            }
        }
     }
});




client.on('group_join', async (notification) => {
    const chatId = notification.id.remote
    const mem = notification.recipientIds
    const chat = await notification.getChat()
    let mentions = [];
    const contact = await notification.getRecipients();
    const ID = contact[0].id._serialized
    const usr = contact[0].number
    const con = await client.getContactById(ID)
    mentions.push(con)
    const nama = chat.name
    //let button = new Buttons();
    try{
        await client.sendMessage(chatId, `『 *WELLCOME* 』\n\nhi @${usr} selamat datang di ${nama}\n\n📋 intro dulu supaya pada kenal\n🍂nama :\n🍂umur :\n🍂askot :\n\nsemoga kamu betah di sini dan jangan lupa untuk mematuhi peraturan yang ada ya`, {mentions});

    }catch (err) {
        console.log(err)
    }
});

client.on('group_leave', async (notification) => {
    const chatId = notification.id.remote
    const mem = notification.recipientIds
    const chat = await notification.getChat()
    const nama = chat.name
    const contact = await notification.getRecipients();
    try{
        await client.sendMessage(chatId, `『 *sayonara* \n\nsemoga kamu tenang 😅`,'SAMPAI JUMPA',' ©️ Bot dark moon');
    }catch (err) {
        console.log(rr)
    }
});

client.on('message', async (msg) => {
    if(msg.body.startsWith('!tts ')) {
        try{
            const te = msg.body.slice(5);
            const words = te.split(' ')[0];
            str = te.replace(words, "");
            var gtts = new gTTS(str, words);
            gtts.save('tts.mp3', function (err, result) {
            if(err) { throw new Error(err) }
            console.log(result);
            const start = async function(a, b) {
                const media = MessageMedia.fromFilePath('./tts.mp3')
                const chat = await msg.getChat()
                chat.sendMessage(media)
            }
            start();
          });
        }catch (err) {
            try {
                msg.reply('opss terjadi error')
            }catch (err) {
                console.log(err)
            }
        }

    }
});

client.on('message', async (msg) => {
    if(msg.body === 'owner 👤') {
        //if(msg.type === "buttons_response")
        //console.log(msg)
        const chat = await msg.getChat();
        chat.sendMessage('https://wa.me/+6282293219613s')
    }else if(msg.body === 'rules 📚') {
        msg.reply(`
        ⚠️ ＲＵＬＥＳ ＢＯＴ ⚠️

• Jangan voice call atau video call nomor bot !

• Gunakan bot dengan bijak !

• Jangan spam bot bisa saja delay selama 5 detik !

‼️ ＪＩＫＡ ＭＥＬＡＮＧＧＡＲ ‼️

❗️ Bot akan memblokir nomor anda jika melanggar peraturan di atas

❗️ Pemblokiran bisa saja menjadi permanen

❗️ Anda tidak akan bisa mengakes/mengguanakan bot lagi

❗️ Jika menelpon bot dengan sengaja/tidak sengaja nomor anda bisa di block permanen

        `)
    }
});

client.on('message', async message => {
    let chat = await message.getChat();
    //console.log(chat);
    chat.sendSeen();
   
    if(message.body === '!ping') {
        try{
            client.sendMessage(message.from, 'saya online !',{footer : '©️ Reyzbot'});
        }catch (err) {
            console.log(err)
        }
        //let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        //await client.sendMessage(message.from, button);
    }else if(message.body.startsWith('!time ')) {
            const zona = message.body.slice(6);
        try {
            process.env.TZ = zona;
            const waktu = new Date().toString()
            message.reply(waktu)
        } catch(err) {
            message.reply(`tidak ada hasil untuk ${zona}`)
        }
    }else if(message.body.startsWith('!hbd ')) {
        try{
            const zona = message.body.slice(5);
            const l = [`hbd ${zona} semoga panjang umur`, `selamat ulang tahun ${zona}`, `panjang umur ${zona}`, `sehat selalu ${zona}`]
            const hasil = (random_item(l))
            message.reply(hasil)
        }catch (err) {
            console.log(err)
        }
    }
});


client.on('message', async msg => {
    if(msg.body === '!kode494') {
        hx.tebakgambar()
            .then(result => {
            var string1 = JSON.stringify(result);
            var profile = JSON.parse(string1);
            //console.log(hasil)
            const gambar = profile[0].image
            const jawaban = profile[0].jawaban
            const start = async function(a, b) {
                const media = await MessageMedia.fromUrl(gambar)
                const chat = await msg.getChat()
                await chat.sendMessage(media, {caption : 'ketik !siap untuk mulai'})
            }
            start();
            if (msg.body === '!siap') {
                const tes = setTimeout(function() {
                    msg.reply(`waktu habis jawaban ${jawaban}`)
                }, 1000)
                if (msg.body === jawaban) {
                    msg.reply('yeay')
                    clearTimeout(tes);
                }
            }
        });
    }
})


client.on('message', async msg => {
    const jam = moment().tz('Asia/Makassar').format('HH:mm:ss');
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    if (jam < '23:58') {
    var wak = 'https://i.pinimg.com/564x/65/78/c7/6578c7eaa4830565ea398a367f0c5115.jpg'
    var pag = 'selamat malam kak 🌃, jangan gadang terus ya '
}
    if (jam < '21:40') {
    var wak = 'https://i.pinimg.com/564x/47/16/6d/47166d0c430e6be76b06aede88fa3e17.jpg'
    var pag = 'selamat malam kak 🌃'
}
    if (jam < '19:30') {
    var wak = 'https://i.pinimg.com/564x/37/4a/0f/374a0fe994df930985a5731622fe47c5.jpg'
    var pag = 'selamat malam kak 🌃, :3'
}
    if (jam < '18:30') {
    var wak = 'https://i.pinimg.com/564x/37/4a/0f/374a0fe994df930985a5731622fe47c5.jpg'
    var pag = 'selamat malam kak 🌉, hehehe'
}
   if (jam < '17:30') {
    var wak = 'https://i.pinimg.com/564x/83/31/8c/83318ce5f00ff8db4e6b4824c6f43911.jpg'
    var pag = 'selamat soreh kak 🌆'
}
   if (jam < '15:30') {
    var wak = 'https://i.pinimg.com/564x/79/da/25/79da25c58ebd3ffa0c56f480c652310f.jpg'
    var pag = 'selamat siang kak  🏖'
}
   if (jam < '13:30') {
    var wak = 'https://i.pinimg.com/564x/d7/34/50/d73450a09a8dbc48f51d3119dbdc3343.jpg'
    var pag = 'selamat siang kak 🏖'
}
   if (jam < '09:30') {
    var wak = 'https://i.pinimg.com/564x/f8/54/f5/f854f5c1d3ffab9e61ccdc7285e35ed6.jpg'
    var pag = 'selamat pagi kak 🌇'
}
if (jam < '07:30') {
    var wak = 'https://i.pinimg.com/564x/1d/31/85/1d3185b7f776c394a9fad0c741a4bc32.jpg'
    var pag = 'selamat pagi kak 🌇, jangan lupa bersih bersih'
}
if (jam < '06:00') {
    var wak = 'https://i.pinimg.com/564x/05/43/08/054308281615a6c959c3811d26b01cfa.jpg'
    var pag = 'selamat pagi kak 🌅'
}
if (jam < '03:00') {
    var wak = 'https://i.pinimg.com/564x/bb/aa/bd/bbaabd7a1a41d849e7b0aeb64a7b6e83.jpg'
    var pag = 'udah mau menjelang pagi'
}
    if(msg.body === '!command') {
        const chat = await msg.getChat()
        if (chat.isGroup) {
            console.log(chat)
            let sections = [{title:'list',rows:[{title:'owner 👤'},{title:'rules 📚'},{title:'help❓'},{title:'!menu'}]}];
            let list = new List(`
anda bisa melihat perintah saya pada daftar di bawah ini`,'command',sections,'『DAFTAR PERINTAH SAYA』','footer');
            await client.sendMessage(msg.from, list);
        }
    }else if(msg.body === '!menu') {
        const media = await MessageMedia.fromUrl(wak)
        const menuu = `
═══════════════════════
👋 halo ${contact.pushname}


${pag}


⏰ waktu server = ${jam}


📱 device = ${msg.deviceType}


status = online ✅

═══════════════════════
    *WAKTU LAINNYA*

⏰wit = ${wit}
⏰wita = ${wita}
⏰wib = ${wib}
═══════════════════════

    🚀 *DAFTAR MENU BOT* 🚀

══════════════
*GROUP CHAT*
══════════════
👾!kick (reply)
👾!everyone
👾!promote (reply)
👾!demote (reply)
👾!close
👾!open
👾!chat
👾!delete (reply)
👾!link
👾!desc (text)
👾!title (text)
👾!anti_link on/off
══════════════
*PICT*
══════════════
👾!pint  (kata kunci)
👾!chara (kata kunci)
══════════════
*SEARCH*
══════════════
👾!wiki  (kata kunci)
👾!lirik  (kata kunci)
👾!wp  (kata kunci)
👾!wpall  (kata kunci)
👾!kbbi (kata kunci)
══════════════
*FUN*
══════════════
👾!apakah  (text)
👾!bolehkah  (text)
👾!kapan  (text)
👾!hbd  (text)
👾!tercantik
👾!terganteng
👾!terpintar
👾!tergeblek
👾!time (text)
👾!ping
👾!cocok "nama kamu + nama pasangan"
══════════════
*TRANSLATE*
══════════════
👾!tts (text)
👾!tr (text)
══════════════
*YOUTUBE DL*
══════════════
👾!ytmp3 (link)
👾!ytmp4 (link)
══════════════
*STICKER*
══════════════
👾!sticker
👾!s
══════════════
*BMKG*
══════════════
👾!infogempa
        `
        await client.sendMessage(msg.from, media, {caption: menuu}, {mentions: [contact]})
    }else if(msg.body === '!start') {
        const media = await MessageMedia.fromUrl(wak)
        const chat = await msg.getChat()
        const start = `
👋 Halo ${contact.pushname}

saya adalah Reyzbot 🤖

gunakan perintah umum
🚀 !menu
🚀 !command
🚀 !start
        
        `
        chat.sendMessage(media, {caption : start})
    }
});

client.on('message', async (msg) => {
    if(msg.body === '!kick -help') {
        msg.reply('!kick fitur adalah fitur bot yang dapat mengeluarkan member dari grup\nanda dapat reply pesan user yang mau di kick\n\n!kick <reply pesan user>')
    }else if(msg.body === '!everyone -help') {
        msg.reply('fitur !everyone adalah fitur bot untuk mengtag/mentions semua member dalam grup\n\ngunakan alasan ya !everyone <alasan>')
    }else if(msg.body === '!promote -help') {
        msg.reply('!promote fitur adalah fitur bot untuk menaikan pangkat member menjadi amdin.Fitur ini hanya dapat di gunakan admin !\n\ncontoh !promote <reply pesan>')
    }else if(msg.body === '!demote -help') {
        msg.reply('!demote fitur adalah fitur bot untuk menurunkan pangkat admin menjadi member.Fitur ini hanya dapat di gunakan admin !\n\ncontoh !demote <reply pesan>')
    }else if(msg.body === '!close -help') {
        msg.reply('!close fitur adalah fitur bot untuk mengubah peraturan group hanya admin yang dapat mengirim pesan\n\ncontoh !close')
    }else if(msg.body === '!open -help') {
        msg.reply('!open fitur adalah fitur bot untuk membuka grup yang di tutup\n\ncontoh !')
    }else if(msg.body === '!chat -help') {
        msg.reply('!chat fitur adalah fitur bot untuk memberikan informasi obrolan')
    }else if(msg.body === '!link -help') {
        msg.reply('!link fitur adalah fitur bot untuk memberikan link group !')
    }else if(msg.body === 'help❓') {
        msg.reply('gunakan perintah -help\n\ncontoh <command> -help\nconth !kick -help')
    }else if(msg.body === '!tr -help') {
        msg.reply('fitur !tr adalah fitur translate bot caranya menggunakan\n\n!tr <kode bahasa> <qwery>?\n!tr en halo apa kabar !')
    }
});


client.on('message', async (msg) => {
    if(msg.body === '!jadian') {
        const chat = await msg.getChat();
        
        let text = "";
        let mentions = [];

        for(let participant of chat.participants) {
            text += `${participant.id.user} `;
        }
        const st = text.split(' ')
        const hasil = (random_item(st))
        const hasil1 = (random_item(st))
        const ter = `${hasil}@c.us`
        const ter1 = `${hasil1}@c.us`
        const contact = await client.getContactById(ter);
        const contact1 = await client.getContactById(ter1);
        mentions.push(contact);
        mentions.push(contact1);
        await chat.sendMessage(`*pasangan hari ini*\n@${hasil} dan @${hasil1}\n\njangan anggap serius ini cuman candaan doang`, {mentions});
    }else if(msg.body === '!tercantik') {
        const chat = await msg.getChat();
        
        let text = "";

        let mentions = [];

        for(let participant of chat.participants) {
            text += `${participant.id.user} `;
        }
        const st = text.split(' ')
        const hasil = (random_item(st))
        const ter = `${hasil}@c.us`
        const contact = await client.getContactById(ter);
        mentions.push(contact);
        await chat.sendMessage(`orang tercantik di grup ini adalah @${hasil}`, {mentions});
    }else if(msg.body === '!terganteng') {
        const chat = await msg.getChat();
        
        let text = "";

        let mentions = [];

        for(let participant of chat.participants) {
            text += `${participant.id.user} `;
        }
        const st = text.split(' ')
        const hasil = (random_item(st))
        const ter = `${hasil}@c.us`
        const contact = await client.getContactById(ter);
        mentions.push(contact);
        await chat.sendMessage(`orang terganteng di grup ini adalah @${hasil}`, {mentions});
    }else if(msg.body === '!terpintar') {
        try{
            const chat = await msg.getChat();
        
            let text = "";

            let mentions = [];

            for(let participant of chat.participants) {
               text += `${participant.id.user} `;
            }
            const st = text.split(' ')
            const hasil = (random_item(st))
            const ter = `${hasil}@c.us`
            const contact = await client.getContactById(ter);
            mentions.push(contact);
            await chat.sendMessage(`orang pintar di grup ini adalah @${hasil}`, {mentions});
        }catch (err) {
            console.log(err)
        }
    }else if(msg.body === '!tergeblek') {
        try{
            const chat = await msg.getChat();
        
            let text = "";

            let mentions = [];

            for(let participant of chat.participants) {
                text += `${participant.id.user} `;
            }
            const st = text.split(' ')
            const hasil = (random_item(st))
            const ter = `${hasil}@c.us`
            const contact = await client.getContactById(ter);
            mentions.push(contact);
            await chat.sendMessage(`orang tergeblek di grup ini adalah @${hasil}`, {mentions});
        }catch (err) {
            console.log(err)
        }
    }
});

/*client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    console.log(contact)

    @c.us
    
    await chat.sendMessage(`Hello @${contact.id.user}`, {
        mentions: [contact]
    });
});
*/


client.on('message', async (msg) => {
    if(msg.body === '!everyone') {
        const chat = await msg.getChat();
        
        let text = "";
        let mentions = [];

        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });

    }else if(msg.body.startsWith('!everyone ')) {
        const chat = await msg.getChat();
        const tex = msg.body.slice(10);
        
        let text = `${tex} `;
        let mentions = [];

        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }
        console.log(mentions)
        await chat.sendMessage(text, { mentions });
    }
});

client.on('message', async (msg) => {
    if(msg.body === '!kode33') {
        console.log(msg)
    }
})

client.on('message', async (msg) => {
    let chat = await msg.getChat();
    if(msg.body === '!kick') {
        const qoet = await msg.getQuotedMessage();
        const fromm = qoet.author
        console.log(qoet)
        //console.log(msg)
        //console.log(chat)
        if (chat.isGroup) {
            const authorid = msg.author
            for(let participant of chat.participants) {
                    if(participant.id._serialized === authorid ) {
                        if (participant.isAdmin) {
                            try {
                                await chat.removeParticipants([fromm])
                                break;
                            } catch (err) {
                                msg.reply('terjadi error !')
                            }
                        }
                        
                    }else {
                        msg.reply('kamu bukan admin !')
                        break;
                    }
            }
        }      
    }else if(msg.body.startsWith('!kick ')) {
        const num = msg.body.slice(6)
        if (num.startsWith("@")) {
            const from = msg.mentionedIds
            if(from === undefined || false) return msg.reply('tag pengguna !')
            if (chat.isGroup) {
                const authorid = msg.author
                for(let participant of chat.participants) {
                        //console.log(participant)
                        if(participant.id._serialized === authorid) {
                            if (participant.isAdmin) {
                                try {
                                    await chat.removeParticipants([from])
                                    break;
                                } catch (err) {
                                    msg.reply('terjadi error !')
                                    break;
                                }
                            }else {
                                msg.reply('anda bukan admin')
                                break;
                                
                            }
                        }
                }
            }
        }else {
            msg.reply('tag pengguna')
        }
    }

});


client.on('message', async (msg) => {
    let chat = await msg.getChat();
    if( msg.body === '!promote') {
        const qoet = await msg.getQuotedMessage();
        const fromm = qoet.author
        //const par = chat.
        console.log(fromm)
        if (chat.isGroup) {
            const authorId = msg.author;
            for(let participant of chat.participants) {
                console.log(participant)
                if(participant.id._serialized === authorId) {
                    if (participant.isAdmin) {
                        try{
                            await chat.promoteParticipants([fromm])
                            msg.reply('telah di jadikan admin !')
                            break;
                        }catch (err) {
                            msg.reply('terjadi error !')
                        }
                    } else {
                        msg.reply('anda bukan admin !')
                    }
                }
            }
        }      
    }else if(msg.body.startsWith('!promote ')) {
        const num = msg.body.slice(9)
        if (num.startsWith("@")) {
            const from = msg.mentionedIds
            if(from === undefined || false) return msg.reply('tag pengguna !')
            if (chat.isGroup) {
                const authorid = msg.author
                for(let participant of chat.participants) {
                        //console.log(participant)
                        if(participant.id._serialized === authorid) {
                            if (participant.isAdmin) {
                                try {
                                    await chat.promoteParticipants([from])
                                    msg.reply('telah di jadikan admin !')
                                    break;
                                } catch (err) {
                                    msg.reply('terjadi error !')
                                    break;
                                }
                            }else {
                                msg.reply('anda bukan admin')
                                break;
                                
                            }
                        }
                }
            }
        }else {
            msg.reply('tag pengguna')
        }
    }

});

client.on('message', async (msg) => {
    let chat = await msg.getChat();
    if( msg.body === '!demote') {
        const qoet = await msg.getQuotedMessage();
        const fromm = qoet.author
        //const par = chat.
        //console.log(chat)
        if (chat.isGroup) {
            const authorId = msg.author;
            for(let participant of chat.participants) {
                if(participant.id._serialized === authorId) {
                    if (participant.isAdmin) {
                        try {
                            await chat.demoteParticipants([fromm])
                            msg.reply('telah di turunkan mejadi member !')
                            break;
                        } catch (err) {
                            msg.reply('terjadi error !')
                        }
                    } else {
                        msg.reply('anda bukan admin !')
                    }
                }
            }
        }      
    }else if(msg.body.startsWith('!demote ')) {
        const num = msg.body.slice(8)
        if (num.startsWith("@")) {
            const from = msg.mentionedIds
            if(from === undefined || false) return msg.reply('tag pengguna !')
            if (chat.isGroup) {
                const authorid = msg.author
                for(let participant of chat.participants) {
                        //console.log(participant)
                        if(participant.id._serialized === authorid) {
                            if (participant.isAdmin) {
                                try {
                                    await chat.demoteParticipants([from])
                                    msg.reply('telah di turunkan mejadi member !')
                                    break;
                                } catch (err) {
                                    msg.reply('terjadi error !')
                                    break;
                                }
                            }else {
                                msg.reply('anda bukan admin')
                                break;
                                
                            }
                        }
                }
            }
        }else {
            msg.reply('tag pengguna')
        }
    }

});




client.on('message', async (msg) => {
    if(msg.body === '!chat') {
        const chat = await msg.getChat();
        //const gr = await msg.
        if (chat.isGroup) {
            msg.reply(`
*Group Details*
Name: ${chat.name}
Description: ${chat.description}
Created At: ${chat.createdAt.toString()}
Participant count: ${chat.participants.length}
        `);
            //msg.reply('desk = '+desk)
            //msg.reply('Group = '+gc)
        }else {
            msg.reply('perintah hanya untuk grup')
        }
    }else if (msg.body === '!delete') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
            } else {
                msg.reply('hapus pesan nya harus pesan dari saya 😅');
            }
        }
    }
})

client.on('message', async (msg) => {
    if(msg.body === '!link') {
        const chat = await msg.getChat();
        if (chat.isGroup){
            const qoet = await chat.getInviteCode()
            try {
                const clea = chat.sendMessage('https://chat.whatsapp.com/'+qoet) 
            } catch (error) {
                console.log(error)
            }
        }else{
            try {
                msg.reply('kamu sedang tidak berada di dalam group')
            } catch (err) {
                console.log('error')
            }
        }

    }
})


client.on('message', async (msg) => {
    if( msg.body === '!close') {
        let chat = await msg.getChat();
        //const par = chat.
        //console.log(chat)
        if (chat.isGroup) {
            const authorId = msg.author;
            for(let participant of chat.participants) {
                if(participant.id._serialized === authorId) {
                    if (participant.isAdmin) {
                        try {
                            await chat.setMessagesAdminsOnly(['adminsOnly'])
                            msg.reply('shhht! grup telah di tutup')
                            break;
                        } catch (err) {
                            msg.reply('terjadi error !')
                        }
                    } else {
                        msg.reply('anda bukan admin !')
                    }
                }
            }
        }      
    }

});



client.on('message', async (msg) => {
    if( msg.body === '!open') {
        let chat = await msg.getChat();
        //const par = chat.
        //console.log(chat)
        if (chat.isGroup) {
            const authorId = msg.author;
            for(let participant of chat.participants) {
                if(participant.id._serialized === authorId) {
                    if (participant.isAdmin) {
                        try {
                            await chat.setMessagesAdminsOnly(false)
                            msg.reply('grup telah dibuka !')
                            break;
                        } catch (err) {
                            msg.reply('terjadi error !')
                        }
                    } else {
                        msg.reply('anda bukan admin !')
                    }
                }
            }
        }      
    }

});


client.on('message', async (msg) => {
    if (msg.body.startsWith('!desc ')) {
        let newDescription = msg.body.slice(6);
        let chat = await msg.getChat();
        //const par = chat.
        //console.log(chat)
        if (chat.isGroup) {
            const authorId = msg.author;
            for(let participant of chat.participants) {
                if(participant.id._serialized === authorId) {
                    if (participant.isAdmin) {
                        try {
                            await chat.setDescription(newDescription);
                            msg.reply('deskripsi berhasil di ubah')
                            break;
                        } catch (err) {
                            msg.reply('terjadi error !')
                        }
                    } else {
                        msg.reply('anda bukan admin !')
                    }
                }
            }
        }      
    }

});

client.on('message', async (msg) => {
    if (msg.body.startsWith('!title ')) {
        let newDescription = msg.body.slice(7);
        let chat = await msg.getChat();
        //const par = chat.
        //console.log(chat)
        if (chat.isGroup) {
            const authorId = msg.author;
            for(let participant of chat.participants) {
                if(participant.id._serialized === authorId) {
                    if (participant.isAdmin) {
                        try {
                            await chat.setSubject(newDescription);
                            msg.reply('Subjek berhasil di ubah')
                            break;
                        } catch (err) {
                            msg.reply('terjadi error !')
                        }
                    } else {
                        msg.reply('anda bukan admin !')
                    }
                }
            }
        }      
    }

});

client.on('message', async (msg) => {
    const chat = await msg.getChat()
    if(msg.body.startsWith('!anti_link ')) {
        const ket = msg.body.slice(11)
        const authorId = msg.author
            for(let participant of chat.participants) {
                if(participant.id._serialized === authorId) {
                    if (participant.isAdmin) {
                        if(ket === 'on'){
                            const chatId = chat.id._serialized
                            antilink.push(chatId)
                            fs.writeFileSync('./database/anti_link.json', JSON.stringify(antilink))
                            msg.reply('anti link di grup ini aktif !')
                        }else if(ket === 'off') {
                            try {
                                 const chatId = chat.id._serialized
                                 antilink.splice(chatId, 1)
                                 fs.writeFileSync('./database/anti_link.json', JSON.stringify(antilink))
                                 msg.reply('anti link di grup ini di nonaktif kan !')
                           }catch (err) {
                                   try{
                                        msg.reply('telah di nonaktifkan')
                                   }catch (err) {
                                        console.log(err)
                                   }
                            }
                        }else{
                            msg.reply('beri keterangan off atau on')
                        }
                    }
                }
            }
    }
})

client.on('message', async (msg) => {
    if(msg.body.includes('https://chat.whatsapp.com/')) {
        const chat = await msg.getChat()
        const chatId = chat.id._serialized
        const mem = msg.author
        if(antilink.includes(chatId)) {
            const qoet = await chat.getInviteCode()
            const link = 'https://chat.whatsapp.com/'+qoet
            if(msg.body.includes(link)) {
                console.log()
            }else {
                for(let participant of chat.participants) {
                    console.log(participant)
                    if(participant.id._serialized === mem) {
                        if (participant.isAdmin) {
                            console.log()
                            break;
                        }else{
                            try{
                                msg.reply('link grup lain terdektesi !\n\nanda di larang mengirim link grup lain di grup ini')
                                await chat.removeParticipants([mem])
                                break;
                            }catch (err) {
                                console.log(err)
                                break;
                            }
                        }
                    }
                } 
            }
        }
    }
})


client.on('error', (err) => {
    console.error(err.message);
  });



client.initialize();
