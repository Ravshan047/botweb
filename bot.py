from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import (
    Message,
    ReplyKeyboardMarkup,
    KeyboardButton,
    WebAppInfo
)

import asyncio

TOKEN = "8689561735:AAERo1jgH6zrKXh3IgSyFxO_7x-mPxHpVbM"

bot = Bot(token=TOKEN)
dp = Dispatcher()

web_app = WebAppInfo(
    url="https://botweb-two.vercel.app/"
)

keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [
            KeyboardButton(
                text="🍔 Menuni ochish",
                web_app=web_app
            )
        ]
    ],
    resize_keyboard=True
)

@dp.message(CommandStart())
async def start(message: Message):

    await message.answer(
        "🍔 FastFood botga xush kelibsiz!",
        reply_markup=keyboard
    )

@dp.message()
async def get_data(message: types.Message):

    if message.web_app_data:
        try:
            import json
            data = json.loads(message.web_app_data.data)
            items = data.get('items', [])
            total = data.get('total', 0)
            address = data.get('address', 'Manzil kiritilmagan')
            order_text = "✅ Buyurtma:\n\n"
            for item in items:
                order_text += f"- {item['name']}: {item['price']} so'm\n"
            order_text += f"\nJami: {total} so'm\nManzil: {address}"
            await message.answer(order_text)
        except json.JSONDecodeError:
            await message.answer(
                f"✅ Buyurtma:\n\n{message.web_app_data.data}"
            )

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())