import type { HttpContext } from '@adonisjs/core/http'
import OpenAI from 'openai'
export default class ChatController {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  })
  index(context: HttpContext) {
    return context.view.render('chat')
  }
  async chat({ request , response}: HttpContext) {
    
    const { lastTwoMessages } = request.only(['lastTwoMessages']) // Nhận lịch sử chat từ frontend
    if (!lastTwoMessages || lastTwoMessages.length === 0) {
      return response.badRequest({ error: 'Messages are required' })
    }
    try {
      const chatResponse = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: lastTwoMessages,
      })
      response.header('Content-Type', 'text/event-stream')
      response.header('Cache-Control', 'no-cache')
      response.header('Connection', 'keep-alive')
      
      for await (const chunk of chatResponse) {
        const text = chunk.choices[0]?.delta?.content || ''
        response.response.write(text)
      }

      response.response.end()
    } catch (error) {
      response.internalServerError({ error: error.message })
    }
  }
}
