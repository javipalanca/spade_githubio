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
            msg = await self.receive(timeout=5)
            if msg and msg.get_metadata('command') == 'start_broadcast':
                print("Starting broadcast...")
                for receiver in ['receiver1@localhost', 'receiver2@localhost']:
                    msg = Message(to=receiver)
                    msg.set_metadata('data', f'Broadcast data to {receiver}')
                    await self.send(msg)
            await asyncio.sleep(3)

    async def setup(self):
        self.add_behaviour(self.BroadcastBehaviour())

class ReceiverAgent(agent.Agent):
    class ReceiveBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                data = msg.get_metadata('data')
                print(f"Receiver {self.jid} received: {data} from {msg.sender}")
                
                # Forward task to worker
                worker_jid = 'worker1@localhost' if 'receiver1' in str(self.jid) else 'worker2@localhost'
                task_msg = Message(to=worker_jid)
                task_msg.set_metadata('task', f'Process data: {data}')
                await self.send(task_msg)
                print(f"Task forwarded to {worker_jid}")
            await asyncio.sleep(1)

    async def setup(self):
        self.add_behaviour(self.ReceiveBehaviour())

class WorkerAgent(agent.Agent):
    class WorkBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                task = msg.get_metadata('task')
                print(f"Worker {self.jid} processing: {task}")
                # Simulate work processing
                await asyncio.sleep(2)
                print(f"Worker {self.jid} Email sent")
            await asyncio.sleep(1)

    async def setup(self):
        self.add_behaviour(self.WorkBehaviour())

async def main():
    # Create all agents according to the demo configuration
    coordinator = NetworkCoordinator('coordinator@localhost', 'password')
    sender = SenderAgent('sender@localhost', 'password')
    receiver1 = ReceiverAgent('receiver1@localhost', 'password')
    receiver2 = ReceiverAgent('receiver2@localhost', 'password')
    worker1 = WorkerAgent('worker1@localhost', 'password')
    worker2 = WorkerAgent('worker2@localhost', 'password')
    
    # Start all agents
    await coordinator.start()
    await sender.start()
    await receiver1.start()
    await receiver2.start()
    await worker1.start()
    await worker2.start()
    
    print("Network demo started - all agents are running")
    
    # Keep the agents running for a while
    await asyncio.sleep(15)
    
    # Stop all agents
    await coordinator.stop()
    await sender.stop()
    await receiver1.stop()
    await receiver2.stop()
    await worker1.stop()
    await worker2.stop()
    
    print("Network demo stopped")
if __name__ == '__main__':
    asyncio.run(main())
