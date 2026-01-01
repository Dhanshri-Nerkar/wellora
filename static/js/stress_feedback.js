// ==============================
// FEEDBACK FORM HANDLER (FINAL VERSION)
// ==============================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('feedbackForm');
    if (!form) {
        console.error("⚠️ feedbackForm not found in document");
        return;
    }

    const stressType = form.querySelector('input[name="stress_type"]').value;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Helper function to get selected radio value
        const getValue = (name) => {
            const input = form.querySelector(`input[name="${name}"]:checked`);
            return input ? input.value : null;
        };

        let formData = { stress_type: stressType };
        formData.rating = form.querySelector('input[name="rating"]').value;

        // ===============================
        // Work Stress Feedback
        // ===============================
        if (stressType === 'work') {
            formData.sleep_hours = getValue('sleep_hours');
            formData.manage_workload = getValue('manage_workload');
            formData.short_breaks = getValue('short_breaks');
            formData.support_team = getValue('support_team');
            formData.stress_decrease = getValue('stress_decrease');
        }

        // ===============================
        // Academic Stress Feedback
        // ===============================
        else if (stressType === 'academic') {
            formData.sleep_hours = getValue('sleep_hours');
            formData.task_completion = getValue('task_completion');
            formData.academic_confidence = getValue('academic_confidence');
            formData.study_breaks = getValue('study_breaks');
            formData.stress_reduce = getValue('stress_reduce');
        }

        // ===============================
        // Relationship Stress Feedback
        // ===============================
        else if (stressType === 'relationship') {
            formData.sleep_quality = getValue('sleep_quality');
            formData.communication = getValue('communication');
            formData.conflict_avoidance = getValue('conflict_avoidance');
            formData.emotional_support = getValue('emotional_support');
            formData.stress_reduction = getValue('stress_reduction');
        }

        // ===============================
        // Health Stress Feedback
        // ===============================
        

        // ⭐ Add Rating field here (common for all stress types)
formData.rating = form.querySelector('input[name="rating"]').value;

        console.log("📤 Submitting feedback data:", formData);

        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/stress/submit-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (result.success) {
                console.log("✅ Feedback saved:", result.message);
                window.location.href = '/stress/progress';
            } else {
                alert("⚠️ " + result.error);
            }
        } catch (err) {
            console.error("❌ Error submitting feedback:", err);
            alert("Error submitting feedback. Please try again.");
        }

        submitBtn.innerHTML = 'Submit & View Progress';
        submitBtn.disabled = false;
    });
});
