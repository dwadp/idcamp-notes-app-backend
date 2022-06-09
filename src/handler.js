const { nanoid } = require('nanoid')
const notes = require('./notes')

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload

    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = {
        title,
        tags,
        body,
        id,
        createdAt,
        updatedAt,
    }

    notes.push(newNote)

    const isSuccess = notes.filter((note) => note.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        })

        return response.code(201)
    }

    const response = h.response({
        status: 'failed',
        message: 'Catatan gagal ditambahkan',
        data: {
            noteId: id,
        },
    })

    return response.code(500)
}

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
})

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params
    const note = notes.find((item) => item.id === id)

    if (note) {
        return {
            status: 'success',
            data: {
                note,
            },
        }
    }

    return h
        .response({
            status: 'fail',
            message: 'Catatan tidak ditemukan',
        })
        .code(404)
}

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params
    const { title, tags, body } = request.payload

    const index = notes.findIndex((note) => note.id === id)
    const updatedAt = new Date().toISOString()

    if (index < 0) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui catatan. Id tidak ditemukan',
            })
            .code(404)
    }

    notes[index] = {
        ...notes[index],
        title,
        tags,
        body,
        updatedAt,
    }

    return h
        .response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        })
        .code(200)
}

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params
    const index = notes.findIndex((note) => note.id === id)

    if (index < 0) {
        return h
            .response({
                status: 'fail',
                message: 'Catatan gagal dihapus. Id tidak ditemukan',
            })
            .code(404)
    }

    notes.splice(index, 1)

    return h
        .response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        })
        .code(200)
}

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
}
