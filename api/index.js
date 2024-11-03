import e from "express";
import Database from "better-sqlite3";

const app = e();
const db = new Database('/db/database.db');

app.use(e.json());

app.get('/profile/:id', (req, res) => {
    const profile = db.prepare(`SELECT * FROM profiles WHERE tid = ?`).get(req.params['id']);
    res.json(profile);
});

app.post('/profile/reg', (req, res) => {
    db.prepare(`INSERT INTO profiles (tid, username) VALUES (${req.body.tid}, '${req.body.username}')`).run();
    res.json({status: 'ok'});
})

app.patch('/profile/state', (req, res) => {
    db.prepare(`UPDATE profiles SET state = ${req.body.state} WHERE tid = ?`).run(req.body.tid);
    res.json({status: 'ok'});
});

app.get(`/check`, (req, res) => {
    res.json({health: 'ok'});
});

app.listen(7777, () => {
    console.log('ЗАЛУПА ХУЙ ПИЗДА ВАГИНА');
});