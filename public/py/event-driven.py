import asyncio
import random
from spade import agent
from spade.message import Message
from spade.behaviour import CyclicBehaviour

class ForwarderAgent(agent.Agent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.responders = ['responder1@localhost', 'responder2@localhost']
        self.current_responder = 0

    class ForwardBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                # Load balance between responders
                responder = self.agent.responders[self.agent.current_responder]
                self.agent.current_responder = (self.agent.current_responder + 1) % len(self.agent.responders)
                
                forward_msg = Message(to=responder)
                forward_msg.set_metadata('request', msg.metadata.get('data'))
                forward_msg.set_metadata('request_id', msg.metadata.get('id', str(random.randint(1000, 9999))))
                await self.send(forward_msg)
                print(f'Forwarded request to {responder}')

    async def setup(self):
        self.add_behaviour(self.ForwardBehaviour())

class ResponderAgent(agent.Agent):
    class ResponseBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                request_data = msg.metadata.get('request')
                request_id = msg.metadata.get('request_id')
                
                # Simulate processing time
                await asyncio.sleep(random.uniform(0.5, 2.0))
                
                # Send response to aggregator
                response_msg = Message(to='aggregator@localhost')
                response_msg.set_metadata('response', f'Processed by {self.jid}: {request_data}')
                response_msg.set_metadata('request_id', request_id)
                response_msg.set_metadata('responder', str(self.jid))
                await self.send(response_msg)
                print(f'{self.jid} processed request {request_id}')

    async def setup(self):
        self.add_behaviour(self.ResponseBehaviour())

class AggregatorAgent(agent.Agent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.responses = []
        self.request_responses = {}

    class AggregationBehaviour(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg:
                response = msg.metadata.get('response')
                request_id = msg.metadata.get('request_id')
                responder = msg.metadata.get('responder')
                
                self.agent.responses.append({
                    'response': response,
                    'request_id': request_id,
                    'responder': responder,
                    'timestamp': asyncio.get_event_loop().time()
                })
                
                print(f'Aggregated response from {responder}: {response}')
                
                # Process aggregated data every 5 responses
                if len(self.agent.responses) >= 5:
                    print(f'Processing batch of {len(self.agent.responses)} responses')
                    # Perform batch processing here
                    self.agent.responses.clear()

    async def setup(self):
        self.add_behaviour(self.AggregationBehaviour())

# Event-driven system with load balancing and response aggregation
# Demonstrates complex multi-agent coordination patterns
