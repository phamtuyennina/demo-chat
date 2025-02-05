/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ChatController = () => import('#controllers/ChatController')
router.post('send-chat', [ChatController, 'chat'])
router.get('chat', [ChatController, 'index'])
router.on('/').render('pages/home')
router.post('users', () => {
    return 'Hello world'
})
