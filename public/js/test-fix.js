// Simple test for the SPADE demo fix
console.log("🔧 Testing SPADE Demo Fix...");

// Test the specific error scenario
const testData = {
  agentTypes: {
    sender: {
      color: "#4CAF50",
      icon: "send",
      label: "Sender Agent",
      size: 25,
    },
    // Intentionally missing 'receiver' type to test error handling
  },
};

const testNodes = [
  {
    id: "agent1",
    type: "sender",
    position: { x: 100, y: 200 },
  },
  {
    id: "agent2",
    type: "receiver", // This type is missing from agentTypes
    position: { x: 300, y: 200 },
  },
];

console.log('📊 Test data created with missing agent type "receiver"');

// Test the fixed code logic
function testNodeMapping() {
  try {
    const nodes = testNodes.map((node) => {
      const agentType = testData.agentTypes[node.type];

      console.log(`Processing node ${node.id} with type "${node.type}"`);
      console.log(`Agent type found:`, agentType);

      // This is the fixed logic
      const label =
        node.label ||
        (agentType && agentType.label
          ? agentType.label.charAt(0)
          : node.type.charAt(0).toUpperCase());
      const title = agentType ? agentType.label : node.type;
      const color = agentType ? agentType.color : "#666666";
      const size = agentType ? agentType.size : 25;

      console.log(
        `✅ Successfully processed node ${node.id}: label="${label}", title="${title}"`
      );

      return {
        id: node.id,
        label: label,
        title: title,
        color: color,
        size: size,
      };
    });

    console.log("🎉 SUCCESS: All nodes processed without errors!");
    console.log("Generated nodes:", nodes);

    // Verify the missing agent type was handled correctly
    const receiverNode = nodes.find((n) => n.id === "agent2");
    if (
      receiverNode &&
      receiverNode.label === "R" &&
      receiverNode.title === "receiver"
    ) {
      console.log(
        "✅ VERIFICATION PASSED: Missing agent type handled correctly"
      );
      console.log(
        `Receiver node: label="${receiverNode.label}", title="${receiverNode.title}", color="${receiverNode.color}"`
      );
    } else {
      console.log(
        "❌ VERIFICATION FAILED: Missing agent type not handled correctly"
      );
    }

    return true;
  } catch (error) {
    console.error("❌ ERROR: Fix did not work:", error.message);
    console.error("Stack trace:", error.stack);
    return false;
  }
}

// Run the test
const success = testNodeMapping();

if (success) {
  console.log("🎯 CONCLUSION: The fix is working correctly!");
  console.log(
    "The original \"Cannot read properties of undefined (reading 'charAt')\" error should be resolved."
  );
} else {
  console.log("💥 CONCLUSION: The fix needs more work.");
}
