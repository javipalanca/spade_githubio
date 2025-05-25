from spade import agent
from spade.message import Message
from spade.behaviour import CyclicBehaviour
from spade.template import Template
import asyncio

class PresenceServer(agent.Agent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.buddies = []

    class PresenceMonitor(CyclicBehaviour):
        async def run(self):
            # Monitor presence changes
            contacts = await self.agent.get_contacts()
            for contact in contacts:
                presence = await self.agent.get_contact_presence(contact)
                if presence.show != self.agent.last_presence.get(contact):
                    # Notify all buddies of presence change
                    for buddy in self.agent.buddies:
                        msg = Message(to=buddy)
                        msg.set_metadata('presence_update', f'{contact} is {presence.show}')
                        await self.send(msg)
                    self.agent.last_presence[contact] = presence.show
            await asyncio.sleep(2)

    async def setup(self):
        self.last_presence = {}
        self.add_behaviour(self.PresenceMonitor())

class BuddyAgent(agent.Agent):
    class PresenceHandler(CyclicBehaviour):
        async def run(self):
            msg = await self.receive(timeout=10)
            if msg and 'presence_update' in msg.metadata:
                print(f'{self.jid} received presence update: {msg.metadata["presence_update"]}')

    async def setup(self):
        self.add_behaviour(self.PresenceHandler())
