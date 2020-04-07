// 
// require the filesystem reader
const fs = require('fs');
//
// for server creation
const http = require('http');
//
// url module
const url = require('url');

//
// access a file using its directory name
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
//
// parser it from a json to an object
const laptopData = JSON.parse(json);
// 
// create a server and return a response with a status
// and its header
const server = http.createServer((req, res) => {
    //
    // the browser will make a request 
    // get the pathname aka the string after the utl
    const pathName = url.parse(req.url, true).pathname;
    //
    // get the whole query string in form of an object
    const query = url.parse(req.url, true).query;
    //     
    // get the laptops id
    const id = url.parse(req.url, true).query.id;
    //
    // product overview
    if (pathName === '/products' || pathName === '/') {

        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput =  data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {

                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
            
                res.end(overviewOutput);
            });

        });

    }
    //
    // laptop detail
    else if (pathName === '/laptop' && id < laptopData.length) {

        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            // 
            // get the specified laptop at the id
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);

            res.end(output);
        });
    }
    // 
    // url not found
    else {

        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('Error 404: The page was not found');

    }


});
//
// listen to the following port and ip address
server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for request now');
});

function replaceTemplate(originalHtml, laptop) {

    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);

    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}