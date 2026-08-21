import { classifyTextWithRules } from "./services/classifier.service.js";
import { notifyProposalDecision, notifyEventReminder, notifyFeedbackPrompt } from "./services/notification.service.js";
import { checkFeedbackEligibility } from "./services/feedback.service.js";

async function runBackendTests() {
    console.log("=================================================");
    console.log("🚀 RUNNING BACKEND 4 COMPREHENSIVE SUITE TESTS 🚀");
    console.log("=================================================\n");

    let total = 0;
    let passed = 0;

    function assert(condition, name) {
        total++;
        if (condition) {
            console.log(`✅ [PASS] ${name}`);
            passed++;
        } else {
            console.error(`❌ [FAIL] ${name}`);
        }
    }

    // 1. Classifier Test
    console.log("--- 1. Testing Feedback Classifier Service ---");
    const mockThemes = [
        { _id: "theme1", name: "High impact felt", category: "positive", keywords: ["impact", "loved"] },
        { _id: "theme2", name: "Timing/logistics", category: "negative", keywords: ["heat", "earlier"] }
    ];
    const text = "Loved seeing the impact. Start earlier to beat the heat.";
    const results = classifyTextWithRules(text, mockThemes);
    
    assert(Array.isArray(results) && results.length === 2, "Classifier correctly identifies 2 themes from text");
    assert(results[0].themeName === "High impact felt" && results[0].sentiment === "positive", "Matches positive sentiment theme");
    assert(results[1].themeName === "Timing/logistics" && results[1].sentiment === "negative", "Matches negative sentiment theme");

    // 2. Notification Tests
    console.log("\n--- 2. Testing Notification Service Exports ---");
    const res1 = await notifyProposalDecision({ spocEmail: "spoc@test.com", proposalTitle: "Plantation", decision: "approved" });
    assert(typeof res1 === "object" && res1 !== null, "notifyProposalDecision executes safely without throwing");

    const res2 = await notifyEventReminder({ volunteerEmail: "vol@test.com", activityTitle: "Plantation", activityDate: new Date(), activityLocation: "Mumbai" });
    assert(typeof res2 === "object" && res2 !== null, "notifyEventReminder executes safely without throwing");

    const res3 = await notifyFeedbackPrompt({ volunteerEmail: "vol@test.com", activityTitle: "Plantation", activityId: "act123" });
    assert(typeof res3 === "object" && res3 !== null, "notifyFeedbackPrompt executes safely without throwing");

    console.log("\n=================================================");
    console.log(`📊 FINAL TEST RESULT: ${passed}/${total} PASSED`);
    console.log("=================================================\n");

    if (passed === total) process.exit(0);
    else process.exit(1);
}

runBackendTests().catch(err => {
    console.error("Test execution failed:", err);
    process.exit(1);
});
