var express = require('express');
var router = express.Router();
var dateTime = require('date-time');
var { Board } = require('../models');

/* GET users listing. */
router.get(['/', '/:id'], async (req, res, next) => {

    let list;

    try {

        if (req.params.id) {
            if (req.params.id === 'write') res.render('board-write');
            list = await Board.findOne({
                where: {
                    id: req.params.id,
                   
                },
                raw: true
            });

            res.json(list);
            
        } else {
            list = await Board.findAll({
                order: [["id", "desc"]],
                raw: true
            });

            const lists = await list.map(v => { 
                v.createdAt = dateTime({ date: v.createdAt });
                return v;
            });
            res.render('board-list', { lists });
    
        }
    


    } catch(err) {
        next(err);
    }


    /*for (let v of lists) {
        v.createdAt = dateTime({ date: v.createdAt });
    }*/
    //res.json(lists);
   
});

router.get('/delete/:id', async (req, res) => {
    const data = await Board.destroy({
        where: {
            id: req.params.id,
        }
    });

    res.redirect('/board');
});

router.post('/wr', async (req, res, next) => {
    const data = await Board.create({
        title: req.body.title,
        comment: req.body.comment,
        writer: req.body.writer
    });

    res.redirect("/board");
});

router.put('/update', (req, res) => {
    res.send('yeah');
});

module.exports = router;
