const fs = require('fs')
function getFile(path) {
    const data = fs.readFileSync(path, 'utf8')
    return data
}

exports.handler = async () => {
    const styles = getFile('./src/style.css')
    const html = getFile('./src/index.html')
    const js = getFile('./src/app.js')
    const result = html.replace('{{styles}}', styles).replace('{{js}}', js)

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: result
    }
}
