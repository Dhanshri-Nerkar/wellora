// Stress form page JavaScript
document.addEventListener('DOMContentLoaded', function() {

    // Update stress level value beside slider
    document.getElementById('stress_level').addEventListener('input', function() {
        document.getElementById('stress_value').textContent = this.value;
    });

    // Handle form submission
    document.getElementById('stressForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Store some stress data locally (optional)
        sessionStorage.setItem('stress_level', data.stress_level);
        sessionStorage.setItem('stress_duration', data.stress_duration);
        sessionStorage.setItem('lifestyle', data.lifestyle);
        sessionStorage.setItem('sleep_hours', data.sleep_hours);
        
        // Show loading spinner
        //document.getElementById('loading').classList.remove('hidden');
        
        try {
            // ✅ Corrected URL to match Flask route
           const response = await fetch('/stress/submit', {



                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Redirect to results page if successful
               window.location.href = `/stress/results/${data.stress_type}`;

            } else {
                alert('Error submitting form. Please try again.');
                console.error(result.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert('Error submitting form. Please try again.');
        } finally {
            // Hide loading spinner
            //document.getElementById('loading').classList.add('hidden');
        }
    });
});
