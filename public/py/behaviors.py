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

    async def setup(self):
        self.add_behaviour(self.CoordinateBehaviour())

class WorkerAgent(agent.Agent):
    class WorkBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                task = msg.get_metadata('task')
                print(f'{self.jid} received task: {task}')

    async def setup(self):
        self.add_behaviour(self.WorkBehaviour())

async def main():
    coordinator = CoordinatorAgent("coordinator@localhost", "password")
    worker1 = WorkerAgent("worker1@localhost", "password")
    worker2 = WorkerAgent("worker2@localhost", "password")
    await coordinator.start()
    await worker1.start()
    await worker2.start()
    await asyncio.sleep(5)  # Allow some time for the agents to run
    await coordinator.stop()
    await worker1.stop()
    await worker2.stop()
if __name__ == "__main__":
    asyncio.run(main())