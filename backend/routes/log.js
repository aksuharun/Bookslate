import express from 'express'
import LogService from '../services/log-service.js'

const router = express.Router()

// Get Methods

router.get('/all', async (req, res) => {
	await LogService.findAll()
		.then(logs => {
			res.render('list', { items: logs, itemType: 'Log' })
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ msg: 'Error getting logs' })
		})
})

router.get('/all/json', async (req, res) => {
	await LogService.findAll()
		.then(logs => {
			res.json(logs)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ msg: 'Error getting logs' })
		})
})

// Delete Methods

router.delete('/', async (req, res) => {
	await LogService.del(req.body.id)
		.then(() => {
			res.json({ msg: 'Log deleted' })
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ msg: 'Error getting logs' })
		})
})

export default router