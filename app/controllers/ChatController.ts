import type { HttpContext } from '@adonisjs/core/http'
import OpenAI from 'openai'
export default class ChatController {
  private openai = new OpenAI({
    apiKey: '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',
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
        stream: true,
      })
      response.header('Content-Type', 'text/event-stream')
      response.header('Cache-Control', 'no-cache')
      response.header('Connection', 'keep-alive')
      
      for await (const chunk of chatResponse) {
        const text = chunk.choices[0]?.delta?.content || ''
        response.response.write(text) // 🚀 Đúng chuẩn AdonisJS v6
      }

      response.response.end()
    } catch (error) {
      response.internalServerError({ error: error.message })
    }
  }
}
