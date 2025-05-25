from spade import agent
from spade.message import Message
from spade.behaviour import CyclicBehaviour, OneShotBehaviour
import asyncio

class CoordinatorAgent(agent.Agent):
    class CoordinateBehaviour(OneShotBehaviour):
        async def run(self):
            workers = ['worker1@localhost', 'worker2@localhost']
            for worker in workers:
                msg = Message(to=worker)
                msg.set_metadata('task', 'process_data')
                await self.send(msg)
                print(f'Task sent to {worker}')

    async def setup(self):
        self.add_behaviour(self.CoordinateBehaviour())

class WorkerAgent(agent.Agent):
    class WorkBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                task = msg.metadata.get('task')
                print(f'{self.jid} received task: {task}')
                # Simulate processing
                await asyncio.sleep(2)
                print(f'{self.jid} completed task')

    async def setup(self):
        self.add_behaviour(self.WorkBehaviour())
