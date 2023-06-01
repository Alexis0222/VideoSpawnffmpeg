import restify from 'restify'

import morgan from 'morgan'
import bunyan from 'bunyan'
const ffmpegPath = 'C:/ffmpeg/bin/ffmpeg'
const path = require('path');

const { spawn } = require('node:child_process');
const server = restify.createServer({
    name: 'bootcamp',
    log: bunyan.createLogger({
        name: 'audit',
        level: 'error'
    })
})


const interactuandoConelIOS = (fileName: string) => new Promise((resolve, rejects) => {

    const touch = spawn('touch', [fileName]);

    touch.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    })
    touch.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    })
    touch.on('close', (code) => {
        console.log(`Childe process exited with code ${code}`);
        resolve(`resolution code ->>>> ${code}`)
    })

})

const convertirVideoWebmMP4 = () => {
    const inputFile = path.join(__dirname, 'Videos', 'ElvideoversionWebm.webm');
    const outputtFile = path.join(__dirname, 'Videos', 'NuevovideoversionWebmaMP4.mp4');

    const ffmpeg = spawn(ffmpegPath, ['-i', inputFile, outputtFile]);

    ffmpeg.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
const convertirVideoMP4Webm = () => {

    const inputFile = path.join(__dirname, 'Videos', 'ElvideoVersionMP4.mp4');
    const outputtFile = path.join(__dirname, 'Videos', 'NuevovideoversionMP4aWebm.webm');

    const ffmpeg = spawn(ffmpegPath, ['-i', inputFile, outputtFile]);

    ffmpeg.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
const quitarAudioVideos = () => {

    const inputFilemp4 = path.join(__dirname, 'Videos', 'ElvideoVersionMP4.mp4');
    const outputtFilemp4 = path.join(__dirname, 'Videos', 'NuevovideoversionWebmaMP4muted.mp4');
    const inputFilewebm = path.join(__dirname, 'Videos', 'ElvideoversionWebm.webm');
    const outputtFilewebm = path.join(__dirname, 'Videos', 'NuevovideoversionMP4aWebmmuted.webm');

    let ffmpeg = spawn(ffmpegPath, ['-i', inputFilemp4, '-an', outputtFilemp4]);
    ffmpeg = spawn(ffmpegPath, ['-i', inputFilewebm, '-an', outputtFilewebm]);
    ffmpeg.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

server.get('/api/v1/transform/webmtomp4', (req, res, next) => {
    convertirVideoWebmMP4();
    try {
        return res.json({
            message: 'Se ha realizado la conversion de webm a mp4',
        })
    } catch (error) {
        console.log(error?.stack)
        console.log(error)
        return res.json({
            message: error?.message,
            error: true
        })
    }
})
server.get('/api/v1/transform/mp4towebm', (req, res, next) => {

    try {
        convertirVideoMP4Webm()
        return res.json({
            message: 'Se ha realizado la conversion de mp4 a webm',
            name: req?.params?.name,
        })
    } catch (error) {
        console.log(error?.stack)
        console.log(error)
        return res.json({
            message: error?.message,
            error: true
        })
    }
})
server.get('/api/v1/transform/mutevideos', (req, res, next) => {
    try {
        quitarAudioVideos()
        return res.json({
            message: 'mutevideos',
        })
    } catch (error) {
        console.log(error?.stack)
        console.log(error)
        return res.json({
            message: error?.message,
            error: true
        })
    }
})


server.get('/hello/:name', async (req, res) => {
    try {
        const response = await interactuandoConelIOS(req?.params?.name)
        return res.json({
            message: 'hola',
            name: req?.params?.name,
            codeMessage: response
        })
    } catch (error) {
        console.log(error?.stack)
        console.log(error)
        return res.json({
            message: error?.message,
            error: true
        })
    }
});


//server.head('/hello/:name', (respond));
const initServer = async () => {
    console.log("el enviroment esta en funcionamiento", process.argv)
    server.listen(process.env.SERVER_PORT, () => {
        console.log('%s listeing at %s', server.name, server.url)
    })
}

export {
    initServer
}