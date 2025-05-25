import asyncio
from spade import agent
from spade.message import Message
from spade.behaviour import CyclicBehaviour, OneShotBehaviour

class NetworkCoordinator(agent.Agent):
    class InitBehaviour(OneShotBehaviour):
        async def run(self):
            msg = Message(to='sender@localhost')
            msg.set_metadata('command', 'start_broadcast')
            await self.send(msg)

    async def setup(self):
        self.add_behaviour(self.InitBehaviour())

class SenderAgent(agent.Agent):
    class BroadcastBehaviour(CyclicBehaviour):
        async def run(self):
            receivers = ['receiver1@localhost', 'receiver2@localhost']
            for receiver in receivers:
                msg = Message(to=receiver)
                msg.set_metadata('data', f'Broadcast data to {receiver}')
                await self.send(msg)
            await asyncio.sleep(3)

    async def setup(self):
        self.add_behaviour(self.BroadcastBehaviour())

# Network demonstration with multiple interconnected agents
# showcasing complex multi-agent communication patterns
