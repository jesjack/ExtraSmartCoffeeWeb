const Discord = require('discord.js');
const { createWriteStream } = require ("fs");
const { spawn, spawnSync } = require('child_process');
const client = new Discord.Client();
const ytdl = require('discord-ytdl-core');
var channel_id = '742358748181430323';
// const { google } = require('googleapis');

client.on("message", msg => {
    if (msg.content.split(' ')[0] === "!p") {
        if (!msg.member.voice.channel) {
            msg.channel.send("Humano (?), no estas dentro de ningun canal de voz. (Almenos según un parametro que tengo aquí)");
        } else {
            play(msg, msg.content.split('!p ')[1]);
        }
    }
});

client.on("message", msg => {
    if(msg.content == '!s') {
        try {
            msg.channel.send('Vale, me voy 😥');
            running = false;
            plays = [];
            msg.guild.me.voice.channel.leave();
            client.user.setPresence({ status: 'idle' });
        } catch (error) {
            console.log(error);
        }
    }
});

client.on('ready', () => {
    console.log(`Parece que todo esta bien, ${client.user.tag} parece estar lista.`);
    var channel = client.channels.cache.get(channel_id);

    client.user.setPresence({ status: 'idle' });

    // channel.send('buenas');
});

client.login('NzQyMjQ0ODQ3NDIzMDYyMDY2.XzDTYQ.DVEH1au0WSOltJvvBvqA30PnJsU');

module.exports = {
    client: client,
    channel_id: channel_id
};

plays = [];

async function play(msg, q) {
    plays.push(async () => {
        let search = spawnSync('python3', ['youtube-search.py', q], {
            cwd: __dirname
        });
        
        let url = search.stdout.toString();
    
        let stream = ytdl(url, {
            filter: 'audioonly',
            opusEncoded: true,
            encoderArgs: [
                '-af',
                'bass=g=10,dynaudnorm=f=200'
            ]
        });
    
        let frase = [
            'Tienes un buen gusto ♥',
            'Tienes gustos... peculiares, ¿no es así? 😅',
            'Wow, se ve genial',
            'Esto se va a descontrolar',
            'Puedo buscar este contenido gracias a la cortezia de Hugo',
            'Tengo un secreto que no quiero que jesjack sepa... se los diria a ustedes, pero se que se lo dirian tambien'
        ];
    
        msg.channel.send(`Intentando reproducir ${url}\n${frase[Math.floor(Math.random() * frase.length)]}`);
        conn = await msg.member.voice.channel.join();
    
        client.user.setPresence({ status: 'online' });
    
        let dPatcher = conn.play(stream, { type: 'opus' });
    
        dPatcher.on('finish', () => {
            frase = [
                'Me encantó ♥',
                'Wow, no pense que tuvieras tan buenos gustos',
                '¿Podríamos ponerlo otra vez? esque estuvo muy bueno',
                'Fue un placer reproducir esto para ti',
                'Fue un gusto reproducir esto para ti',
                'Estuvo fenomenal'
            ];
        
            msg.channel.send(frase[Math.floor(Math.random() * frase.length)]);
            client.user.setPresence({ status: 'idle' });
            if(plays.length > 0) {
                plays.shift()();
            } else {
                running = false;
            }

        });
    });
    if(!running) {
        plays.shift()();
        running = true;
    }
}
var running = false;