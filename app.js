export default (express, bodyParser, createReadStream, crypto, http, m, UserSchema) => {
    const app = express();
    const User = m.model('User', UserSchema);

    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':'x-test,Content-Type,Accept, Access-Control-Allow-Headers'
        }; 
    

    app.use((r, res, next) => { r.res.set(CORS); next(); });
    app.use(bodyParser.urlencoded({ extended: true }));
    app.get('/sha1/:input', (req, res) => {
            var hash = crypto.createHash('sha1');
            hash = hash.update(req.params.input);
            hash = hash.digest('hex');
            res.send(hash);
    });
    
    app.get('/login/', (req, res) => res.send('andreipavlevich'))
    app.get('/code/', (req, res) => {
            const path = import.meta.url.substring(7);
            createReadStream(path).pipe(res);
    });

    app.all('/req/', (req, res) => {
        http.get(req.query.addr, (resp) => {
          let contents = '';
          resp.on('data', (chunk) =>
          {
            contents += chunk;
          })
          resp.on('end', () =>  res.send(contents));
        });
    });
    
    app.post('/insert/', async (req, res) => {
        const { URL, login, password } = req.body;
        const newUser = new User({ login, password });
        try {
          await m.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
        } catch (e) {
          res.send(e.codeName);   
        }
        try {
            await newUser.save();
            r.res.status(201).json({'Добавлено: ': login});
        } catch (e) {
            r.res.status(400).json({'Ошибка: ': 'Нет пароля!'});
        }      
        });   
    
    app.all('/*', (req, res) => res.send('andreipavlevich'));
    
    return app;
};
