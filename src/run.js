import express from 'express';
import { readFile, writeFile } from 'fs/promises';
// import Handlebars from 'handlebars';
import exphbs from 'express-handlebars';

const SERVER_PORT = 3000;
const WEB_DIR = 'web';
const DATA_FILE = 'zmones.json';

const app = express();

// express-handlebars engine registration:
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(WEB_DIR, {
    index: false
}));

app.use(express.urlencoded({
    extended: true
}))

// express-handlebars:
app.get('/',  async (req, res) => {
    try {
        let zmones = await readFile(DATA_FILE, {
            encoding: 'utf-8'
        });
        zmones = JSON.parse(zmones);
        
        res.render('zmones', { zmones, title: 'Visi zmones' });
    } catch (err) {
        res.status(500).end(`<html><body><h1>Ivyko klaida: ${err.message}</h1></body></html>`);
    }
});

app.get('/zmogus/:id', async (req, res) => {
    // req.params.id = :id
    try {
        let zmones = await readFile(DATA_FILE, {
            encoding: 'utf-8'
        });
        zmones = JSON.parse(zmones);
        
        const id = parseInt(req.params.id);
        const zmogus = zmones.find(z => z.id === id);

        res.render('zmogus', { zmogus, title: 'Vienas zmogus' });
    } catch (err) {
        res.status(500).end(`<html><body><h1>Ivyko klaida: ${err.message}</h1></body></html>`);
    }
});

app.post('/zmogus', async (req, res) => {
    try {
        let zmones = await readFile(DATA_FILE, {
            encoding: 'utf-8'
        });
        zmones = JSON.parse(zmones);

        let nextId = 0;
        for (const zmogus of zmones) {
            if (zmogus.id > nextId) {
                nextId = zmogus.id;
            }            
        }
        nextId++;

        let zmogus = {
            id: nextId,
            vardas: req.body.vardas,
            pavarde: req.body.pavarde,
            alga: parseFloat(req.body.alga),
        }

        zmones.push(zmogus);

        await writeFile(DATA_FILE, JSON.stringify(zmones, null, 3), {
            encoding: 'utf-8'
        });

        const id = parseInt(req.params.id);
        zmogus = zmones.find(z => z.id === id);

        res.redirect('/');

    } catch (err) {
        res.status(500).end(`<html><body><h1>Ivyko klaida: ${err.message}</h1></body></html>`);
    }
});

app.get('/zmogus/:id/delete', async (req, res) => {
    // req.params.id = :id
    try {
        let zmones = await readFile(DATA_FILE, {
            encoding: 'utf-8'
        });
        zmones = JSON.parse(zmones);
        
        const id = parseInt(req.params.id);
        const zmonesFiltered = zmones.filter(z => z.id != id);

        await writeFile(DATA_FILE, JSON.stringify(zmonesFiltered, null, 3), {
            encoding: 'utf-8'
        });

        res.redirect('/');
    } catch (err) {
        res.status(500).end(`<html><body><h1>Ivyko klaida: ${err.message}</h1></body></html>`);
    }
});

app.post('/zmogus/:id', async (req, res) => {
    try {
        let zmones = await readFile(DATA_FILE, {
            encoding: 'utf-8'
        });
        zmones = JSON.parse(zmones);

        const id = parseInt(req.body.id);

        const zmogus = {
            id: id,
            vardas: req.body.vardas,
            pavarde: req.body.pavarde,
            alga: parseFloat(req.body.alga),
        }

        const index = zmones.findIndex(zm => zm.id == id);
        zmones[index] = zmogus;

        await writeFile(DATA_FILE, JSON.stringify(zmones, null, 3), {
            encoding: 'utf-8'
        });

        res.redirect('/');

    } catch (err) {
        res.status(500).end(`<html><body><h1>Ivyko klaida: ${err.message}</h1></body></html>`);
}});

// Handlebars:
// app.get('/',  async (req, res) => {
//     try {
//         let template = await readFile('views/zmones.handlebars', {
//             encoding: 'utf-8'
//         });
//         template = Handlebars.compile(template);

//         let zmones = await readFile(DATA_FILE, {
//             encoding: 'utf-8'
//         });
//         zmones = JSON.parse(zmones);
        
//         res.send(template( { zmones } ));

//     } catch (err) {
//         res.status(500).end(`<html><body><h1>Ivyko klaida: ${err.message}</h1></body></html>`);
//     }

// });

// app.get('/',  async (req, res) => {
//     try {
//         let zmones = await readFile(DATA_FILE, {
//             encoding: 'utf-8'
//         });
//         zmones = JSON.parse(zmones);
//         let html = `<html><body><table>`;
//         for (const zmogus of zmones) {
//             html += `<tr><td>`
//             html += zmogus.vardas;
//             html += `</td>`;
//             html += `<td>`;
//             html += zmogus.pavarde;
//             html += `</td>`;
//             html += `<td>`;
//             html += zmogus.alga;
//             html += `</td></tr>`;
//         }
//         html += `</table></body></html>`;
//         res.send(`<html><body><h1>${html}</h1></body></html>`);
//     } catch (err) {
//         res.status(500).end(`<html><body><h1>Ivyko klaida: ${err.message}</h1></body></html>`);
//     }

// });
 
app.listen(SERVER_PORT);
console.log(`Server started on port: ${SERVER_PORT}`);