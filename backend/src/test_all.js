import { classifyTextWithRules } from "./services/classifier.service.js";
import { notifyProposalDecision, notifyEventReminder, notifyFeedbackPrompt, notifyUrgentFeedbackAlert } from "./services/notification.service.js";
import { runAiPatternAnalysis, updateActionEffectiveness } from "./services/aiInsight.service.js";

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

    // 1. Classifier Test (Multilingual + Sentiment)
    console.log("--- 1. Testing Feedback Classifier & Multilingual Support ---");
    const mockThemes = [
        { _id: "theme1", name: "High impact felt", category: "positive", keywords: ["impact", "loved", "अच्छा"] },
        { _id: "theme2", name: "Timing/logistics", category: "negative", keywords: ["heat", "earlier", "खराब"] }
    ];
    
    const textEn = "Loved seeing the impact. Start earlier to beat the heat.";
    const resultsEn = classifyTextWithRules(textEn, mockThemes);
    assert(Array.isArray(resultsEn) && resultsEn.length === 2, "Classifier identifies 2 themes in English text");

    const textHi = "आयोजन अच्छा था लेकिन समय खराब था";
    const resultsHi = classifyTextWithRules(textHi, mockThemes);
    assert(Array.isArray(resultsHi) && resultsHi.length === 2, "Classifier identifies 2 themes in Hindi text");

    // 2. Urgent Concern Alert Notification Test
    console.log("\n--- 2. Testing Urgent Concern Alert & Notifications ---");
    const alertRes = await notifyUrgentFeedbackAlert({
        adminEmail: "admin@sevasahayog.org",
        activityTitle: "Tree Plantation",
        volunteerName: "Priya",
        overallRating: 1,
        comments: "Unsafe environment, emergency support needed!"
    });
    assert(typeof alertRes === "object" && alertRes !== null, "notifyUrgentFeedbackAlert executes safely without throwing");

    const res1 = await notifyProposalDecision({ spocEmail: "spoc@test.com", proposalTitle: "Plantation", decision: "approved" });
    assert(typeof res1 === "object" && res1 !== null, "notifyProposalDecision executes safely");

    const res2 = await notifyEventReminder({ volunteerEmail: "vol@test.com", activityTitle: "Plantation", activityDate: new Date(), activityLocation: "Mumbai" });
    assert(typeof res2 === "object" && res2 !== null, "notifyEventReminder executes safely");

    const res3 = await notifyFeedbackPrompt({ volunteerEmail: "vol@test.com", activityTitle: "Plantation", activityId: "act123" });
    assert(typeof res3 === "object" && res3 !== null, "notifyFeedbackPrompt executes safely");

    // 3. AI Intelligence & Pattern Analysis Test
    console.log("\n--- 3. Testing AI Intelligence & Recommendation Engine ---");
    assert(typeof runAiPatternAnalysis === "function", "runAiPatternAnalysis function exported properly");
    assert(typeof updateActionEffectiveness === "function", "updateActionEffectiveness learning function exported properly");

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
