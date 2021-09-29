const Database = require('../db/config')

module.exports = {
    async create(req, res) {
        const db = await Database()
        const pass = req.body.password
        let roomId = ''
        let isRoom = true

        while(isRoom){
        // gera o numero da sala
            for(var i = 0; i < 6; i++){
                roomId += Math.floor(Math.random() * 10).toString()
            }
        
            // verificar se o numero da sala ja existe
            const roomsExistIds = await db.all(`SELECT id FROM rooms`)
            isRoom = roomsExistIds.some(roomsExitIds => roomsExitIds === roomId)
        }

        if (! isRoom) {
        // adiciona numero da sala no banco de dados
            await db.run(`INSERT INTO rooms (
                id,
                pass
            ) VALUES (
                ${parseInt(roomId)},
                ${pass}
            )`)
        }

        await db.close()
        
        res.redirect(`/room/${roomId}`)

    },

    async open(req, res) {
        const db = await Database()
        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} AND read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} AND read = 1`)

        res.render('room', {roomId: roomId, questions: questions, questionsRead: questionsRead})
    }
}