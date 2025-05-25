import asyncio
from datetime import datetime
from spade import agent
from spade.message import Message
from spade.behaviour import CyclicBehaviour, PeriodicBehaviour
from collections import defaultdict

class BrokerAgent(agent.Agent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.subscriptions = defaultdict(list)

    class MessageRouter(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                if msg.metadata.get('action') == 'subscribe':
                    topic = msg.metadata.get('topic')
                    self.agent.subscriptions[topic].append(str(msg.sender))
                elif msg.metadata.get('action') == 'publish':
                    topic = msg.metadata.get('topic')
                    data = msg.metadata.get('data')
                    # Forward to all subscribers of this topic
                    for subscriber in self.agent.subscriptions[topic]:
                        forward_msg = Message(to=subscriber)
                        forward_msg.set_metadata('topic', topic)
                        forward_msg.set_metadata('data', data)
                        await self.send(forward_msg)

    async def setup(self):
        self.add_behaviour(self.MessageRouter())

class PublisherAgent(agent.Agent):
    class PublishBehaviour(PeriodicBehaviour):
        async def run(self):
            topics = ['news', 'weather', 'sports']
            for topic in topics:
                msg = Message(to='broker@localhost')
                msg.set_metadata('action', 'publish')
                msg.set_metadata('topic', topic)
                msg.set_metadata('data', f'Update for {topic} at {datetime.now()}')
                await self.send(msg)

    async def setup(self):
        self.add_behaviour(self.PublishBehaviour(period=5))

class SubscriberAgent(agent.Agent):
    def __init__(self, topics, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.topics = topics

    class SubscribeBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                topic = msg.metadata.get('topic')
                data = msg.metadata.get('data')
                print(f'{self.agent.jid} received {topic}: {data}')

    async def setup(self):
        # Subscribe to topics
        for topic in self.topics:
            sub_msg = Message(to='broker@localhost')
            sub_msg.set_metadata('action', 'subscribe')
            sub_msg.set_metadata('topic', topic)
            await self.send(sub_msg)
        self.add_behaviour(self.SubscribeBehaviour())
