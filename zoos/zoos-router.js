const express = require('express');
const knex = require('knex');
const router = express.Router()

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3'
    }
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
    db('zoos')
    .then(zoos => {
        res.status(200).json(zoos)
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db('zoos')
    .where({ id })
    .first()
    .then(zoo => {
        res.status(200).json(zoo)
    })
    .catch(error => {
        res.status(500).json({ message: 'there was an error retrieving the data'})
    })
})


router.post('/', (req, res) => {
    const {name} = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Please provide a name'})
    } else {
        return db('zoos').insert(req.body)
    .then(ids => {
        const id = ids[0];
        db('zoos')
        .where({ id })
        .then(zoo => {
            res.status(201).json(zoo)
        })
    })
    .catch(error => {
        res.status(500).json({ message: 'there was an error adding this to the db'})
    })
}
})

router.delete('/:id', (req, res) => {
    db('zoos')
    .where({ id: req.params.id})
    .del()
    .then(count => {
        if(count > 0) {
            res.status(200).json(count)
        } else {
            res.status(404).json({ message: 'record not found'})
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'there was an error deleting this user'})
    })
})

router.put('/:id', (req, res) => {
    db('zoos')
    .where({ id: req.params.id})
    .update(req.body)
    .then(count => {
        if(count > 0) {
            res.status(200).json(count)
        } else {
            res.status(404).json({ message: 'record not found'})
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'there was an error updating'})
    })
})

module.exports = router;
