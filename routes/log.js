import express from 'express'
import LogService from '../services/log-service.js'

const router = express.Router()

// Get Methods

router.get('/all', async (req, res) => {
	await LogService.findAll()
		.then(logs => {
			res.render('list', { items: logs, itemType:'Log' })
		})
		.catch(console.log)
})