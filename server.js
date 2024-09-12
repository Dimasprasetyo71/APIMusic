import Hapi from '@hapi/hapi';
import { nanoid } from 'nanoid';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
    });

    server.route([
        {
            method: 'POST',
            path: '/albums',
            handler: async (request, h) => {
                const { name, year } = request.payload;
                if (!name || !year) {
                    return h.response({
                        status: 'fail',
                        message: 'Gagal menambahkan album. Data tidak lengkap.',
                    }).code(400);
                }
                const id = `album-${nanoid(16)}`;
                await pool.query('INSERT INTO albums (id, name, year) VALUES($1, $2, $3)', [id, name, year]);
                return h.response({
                    status: 'success',
                    data: { albumId: id },
                }).code(201);
            },
        },
        {
            method: 'GET',
            path: '/albums/{id}',
            handler: async (request, h) => {
                const { id } = request.params;
                const result = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);
                if (result.rowCount === 0) {
                    return h.response({
                        status: 'fail',
                        message: 'Album tidak ditemukan.',
                    }).code(404);
                }
                const album = result.rows[0];
                return {
                    status: 'success',
                    data: { album },
                };
            },
        },
        {
            method: 'PUT',
            path: '/albums/{id}',
            handler: async (request, h) => {
                const { id } = request.params;
                const { name, year } = request.payload;
                if (!name || !year) {
                    return h.response({
                        status: 'fail',
                        message: 'Gagal memperbarui album. Data tidak lengkap.',
                    }).code(400);
                }
                const result = await pool.query('UPDATE albums SET name = $1, year = $2 WHERE id = $3', [name, year, id]);
                if (result.rowCount === 0) {
                    return h.response({
                        status: 'fail',
                        message: 'Gagal memperbarui album. Id tidak ditemukan.',
                    }).code(404);
                }
                return { status: 'success', message: 'Album berhasil diperbarui.' };
            },
        },
        {
            method: 'POST',
            path: '/songs',
            handler: async (request, h) => {
                const { title, year, performer, genre, duration, albumId } = request.payload;
                if (!title || !year || !performer || !genre) {
                    return h.response({
                        status: 'fail',
                        message: 'Gagal menambahkan lagu. Data tidak lengkap.',
                    }).code(400);
                }
                const id = `song-${nanoid(16)}`;
                await pool.query('INSERT INTO songs (id, title, year, performer, genre, duration, albumId) VALUES($1, $2, $3, $4, $5, $6, $7)', [id, title, year, performer, genre, duration, albumId]);
                return h.response({
                    status: 'success',
                    data: { songId: id },
                }).code(201);
            },
        },
        {
            method: 'GET',
            path: '/songs',
            handler: async (request, h) => {
                const { title, performer } = request.query;
                let query = 'SELECT id, title, performer FROM songs WHERE 1=1';
                const values = [];
                if (title) {
                    query += ' AND title ILIKE $' + (values.length + 1);
                    values.push(`%${title}%`);
                }
                if (performer) {
                    query += ' AND performer ILIKE $' + (values.length + 1);
                    values.push(`%${performer}%`);
                }
                const result = await pool.query(query, values);
                return {
                    status: 'success',
                    data: { songs: result.rows },
                };
            },
        },
        {
            method: 'GET',
            path: '/songs/{id}',
            handler: async (request, h) => {
                const { id } = request.params;
                const result = await pool.query('SELECT * FROM songs WHERE id = $1', [id]);
                if (result.rowCount === 0) {
                    return h.response({
                        status: 'fail',
                        message: 'Lagu tidak ditemukan.',
                    }).code(404);
                }
                const song = result.rows[0];
                return {
                    status: 'success',
                    data: { song },
                };
            },
        },
        {
            method: 'PUT',
            path: '/songs/{id}',
            handler: async (request, h) => {
                const { id } = request.params;
                const { title, year, performer, genre, duration, albumId } = request.payload;
                if (!title || !year || !performer || !genre) {
                    return h.response({
                        status: 'fail',
                        message: 'Gagal memperbarui lagu. Data tidak lengkap.',
                    }).code(400);
                }
                const result = await pool.query('UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, albumId = $6 WHERE id = $7', [title, year, performer, genre, duration, albumId, id]);
                if (result.rowCount === 0) {
                    return h.response({
                        status: 'fail',
                        message: 'Gagal memperbarui lagu. Id tidak ditemukan.',
                    }).code(404);
                }
                return { status: 'success', message: 'Lagu berhasil diperbarui.' };
            },
        },
        {
            method: 'DELETE',
            path: '/songs/{id}',
            handler: async (request, h) => {
                const { id } = request.params;
                const result = await pool.query('DELETE FROM songs WHERE id = $1', [id]);
                if (result.rowCount === 0) {
                    return h.response({
                        status: 'fail',
                        message: 'Gagal menghapus lagu. Id tidak ditemukan.',
                    }).code(404);
                }
                return { status: 'success', message: 'Lagu berhasil dihapus.' };
            },
        },

    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();