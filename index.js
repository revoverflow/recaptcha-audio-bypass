const {
    spawn
} = require('child_process');
const express = require('express');
const app = express();

app.get('/recaptcha', function (req, res) {

    console.log(req.query);

    if (req.query.p == null || req.query.k == null) {
        res.json({
            success: false,
            error: "Missing arguments"
        });

        res.end();
    } else {
        require('axios').get('https://www.google.com/recaptcha/api2/payload/audio.mp3?p=' + req.query.p + "&k=" + req.query.k, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
            responseType: 'arraybuffer'
        }).then(resp => {
            require('fs').writeFile("python/recognize.mp3", resp.data, (err) => {
                if (err) {
                    return;
                }

                var recognizer = spawn('py', ['python/recognize.py', '']);

                recognizer.stdout.on('data', (data) => {
                    res.json({
                        success: true,
                        captchaRes: data.toString().replace("\r\n", "")
                    });

                    res.end();
                });
            });
        }).catch(err => {
            res.json({
                success: false,
                error: "Couldn't get audio file"
            });

            res.end();
        });
        /*var recognizer = spawn('py', ['python/recognize.py', '']);

            recognizer.stdout.on('data', (data) => {
                res.json({
                    success: true,
                    captchaRes: data.toString().replace("\r\n", "")
                });
        
                res.end();
            });*/
    }
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});