// Final comprehensive test for the interactive demo improvements
console.log("🧪 FINAL COMPREHENSIVE TEST - Interactive Demo Improvements");

function runFinalTest() {
  console.log("\n=== TESTING TOGGLE BUTTON FUNCTIONALITY ===");

  const toggleBtn = document.getElementById("toggle-code");
  const demoCodeSection = document.getElementById("demo-code-section");

  if (!toggleBtn || !demoCodeSection) {
    console.error("❌ Required elements not found");
    return;
  }

  console.log("✅ Required elements found");

  // Test initial state
  const initialDisplay = demoCodeSection.style.display;
  const initialShow = demoCodeSection.classList.contains("show");
  console.log(`Initial state: display=${initialDisplay}, show=${initialShow}`);

  // Function to test toggle
  function testToggle(testName) {
    return new Promise((resolve) => {
      console.log(`\n--- ${testName} ---`);

      const beforeDisplay = demoCodeSection.style.display;
      const beforeShow = demoCodeSection.classList.contains("show");
      const beforeActive = toggleBtn.classList.contains("active");

      console.log(
        `Before: display=${beforeDisplay}, show=${beforeShow}, active=${beforeActive}`
      );

      // Click the button
      toggleBtn.click();

      // Wait for animation
      setTimeout(() => {
        const afterDisplay = demoCodeSection.style.display;
        const afterShow = demoCodeSection.classList.contains("show");
        const afterActive = toggleBtn.classList.contains("active");

        console.log(
          `After: display=${afterDisplay}, show=${afterShow}, active=${afterActive}`
        );

        // Check if state changed
        const stateChanged =
          beforeShow !== afterShow || beforeActive !== afterActive;
        console.log(
          stateChanged
            ? "✅ State changed successfully"
            : "❌ State did not change"
        );

        resolve(stateChanged);
      }, 400);
    });
  }

  // Test multiple toggles
  async function runToggleTests() {
    console.log("\n🔄 Testing multiple toggles...");

    const results = [];

    for (let i = 1; i <= 4; i++) {
      const result = await testToggle(`Toggle Test ${i}`);
      results.push(result);

      // Wait between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("\n=== TOGGLE TEST RESULTS ===");
    results.forEach((result, index) => {
      console.log(`Test ${index + 1}: ${result ? "✅ PASS" : "❌ FAIL"}`);
    });

    const allPassed = results.every((r) => r);
    console.log(
      `\nOverall: ${allPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}`
    );

    return allPassed;
  }

  // Test syntax highlighting
  function testSyntaxHighlighting() {
    console.log("\n=== TESTING SYNTAX HIGHLIGHTING ===");

    const codeElement = document.getElementById("demo-code-content");
    if (!codeElement) {
      console.error("❌ Code element not found");
      return false;
    }

    console.log("✅ Code element found");

    // Check if Prism is available
    if (typeof window.Prism === "undefined") {
      console.warn("⚠️ Prism.js not available");
      return false;
    }

    console.log("✅ Prism.js available");

    // Check if code has syntax highlighting classes
    const hasLanguageClass = codeElement.className.includes("language-");
    const hasPrismClasses = codeElement.querySelector(".token");

    console.log(`Language class: ${hasLanguageClass ? "✅" : "❌"}`);
    console.log(`Prism tokens: ${hasPrismClasses ? "✅" : "❌"}`);

    return hasLanguageClass;
  }

  // Test animations
  function testAnimations() {
    console.log("\n=== TESTING ANIMATIONS ===");

    const computedStyle = window.getComputedStyle(demoCodeSection);
    const transition = computedStyle.transition;

    console.log(`Transition property: ${transition}`);

    const hasTransition =
      transition.includes("0.3s") || transition.includes("300ms");
    console.log(`Smooth transition: ${hasTransition ? "✅" : "❌"}`);

    return hasTransition;
  }

  // Run all tests
  setTimeout(async () => {
    console.log("\n🚀 Starting comprehensive tests...");

    const toggleResult = await runToggleTests();
    const syntaxResult = testSyntaxHighlighting();
    const animationResult = testAnimations();

    console.log("\n=== FINAL RESULTS ===");
    console.log(`Toggle functionality: ${toggleResult ? "✅" : "❌"}`);
    console.log(`Syntax highlighting: ${syntaxResult ? "✅" : "❌"}`);
    console.log(`Smooth animations: ${animationResult ? "✅" : "❌"}`);

    const allGood = toggleResult && syntaxResult && animationResult;
    console.log(
      `\n🎯 OVERALL STATUS: ${allGood ? "✅ ALL IMPROVEMENTS SUCCESSFUL" : "❌ SOME ISSUES REMAIN"}`
    );

    if (allGood) {
      console.log(
        "\n🎉 Congratulations! All the interactive demo improvements are working perfectly!"
      );
      console.log("✨ Features implemented:");
      console.log("   • Responsive toggle button (works multiple times)");
      console.log("   • Smooth, high-quality animations");
      console.log("   • Enhanced syntax highlighting");
      console.log("   • Improved UX and visual feedback");
    } else {
      console.log("\n⚠️ Some issues may need additional attention.");
    }

    window.FINAL_TEST_COMPLETE = true;
  }, 1000);
}

// Wait for page to be fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runFinalTest);
} else {
  runFinalTest();
}
