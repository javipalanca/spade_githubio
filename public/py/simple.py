import asyncio
import spade
from spade import agent
from spade.message import Message
from spade.behaviour import CyclicBehaviour

class SenderAgent(agent.Agent):
    class SendBehaviour(CyclicBehaviour):
        async def run(self):
            msg = Message(to='receiver@localhost')
            msg.set_metadata('content', 'Hello World!')
            await self.send(msg)
            await asyncio.sleep(1)

    async def setup(self):
        self.add_behaviour(self.SendBehaviour())

class ReceiverAgent(agent.Agent):
    class ReceiveBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                print(f'Received: {msg.metadata["content"]}')

    async def setup(self):
        self.add_behaviour(self.ReceiveBehaviour())

async def main():
    sender = SenderAgent('sender@localhost', 'password')
    receiver = ReceiverAgent('receiver@localhost', 'password')
    await sender.start()
    await receiver.start()

if __name__ == '__main__':
    spade.run(main())
